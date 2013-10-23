<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * SmartyGrid 用來與前端 jQuery Plugin 整合，產生 Web Service 回傳資料
 *
 * @author sj
 * @link https://github.com/smajeack/SmartyGrid
 * @copyright Copyright 2013 SJ
 * @version 1.0
 * @license Apache License Version 2.0 (https://github.com/samejack/SmartyGrid/blob/master/LICENSE)
 * @package \SmartyGrid
 */
class SmartyGrid
{

    /**
     * @var CI_DB_active_record
     */
    private $_db = null;

    /**
     * SmartyGrid Constructor
     * 
     * @param CI_DB_active_record $db [optional] call by reference
     */
    public function __construct(CI_DB_active_record &$db = null)
    {
        if (is_null($db)) {
            $ci =& get_instance();
            $this->_db = &$ci->db;
        } else {
            $this->_db = $db;
        }
    }

    /**
     * Set CI CI_DB_active_record
     * 
     * @param CI_DB_active_record $db
     */
    public function setDb(CI_DB_active_record &$db = null)
    {
        $this->_db = $db;
    }

    /**
     * Get CI CI_DB_active_record
     * 
     * @return CI_DB_active_record
     */
    public function getDb()
    {
        return $this->_db;
    }

    /**
     * 利用 SQL 取得 SmartyGrid 結構資料，包含內容與資料總筆數
     * 
     * @param array $allowColumns 可以操作存取的欄位
     * @param string $sqlQuery SQL Query 可使用 JOIN 與法
     * @param CI_Input $input
     * @throws Exception
     * @return array 包含資料與總筆數
     */
    public function getGridDataBySqlQuery(array $allowColumns, $sqlQuery, CI_Input &$input)
    {
        // check column
        foreach ($allowColumns as &$column) {
            if ($column === '*') {
                return array(
                    'code' => 1,
                    'message' => 'SmartyGrid: Configure can\'t use * column set.'
                );
            }
        }

        // 從 request 取參數
        $size = intval($input->get_post('size'));
        $offset = intval($input->get_post('offset'));
        $search = $input->get_post('search');
        $equals = $input->get_post('equals');
        $sorts = $input->get_post('sorts');
        $columns = $input->get_post('columns');

        $queryPrepare = array();
        
        // 新增過濾欄位
        $columnSql = '*';
        $columns = array();
        if (!is_null($columns) && is_array($columns)) {
            // keyword search
            foreach ($columns as &$column) {
                if (in_array($column, $allowColumns)) {
                    array_push($columns, $column);
                }
            }
        }
        if (count($columns) > 0) {
            $columnSql = implode(', ', $columns);
        }

        // fix page
        if (is_null($size) || $size === 0) {
            $size = 20;
        }
        if (is_null($offset)) {
            $offset = 0;
        }

        // Where condition
        $whereSql = '';
        // 新增搜尋條件
        $whereConditions = array();
        if (!is_null($search) && is_array($search)) {
            // keyword search
            foreach ($search as $column => &$keyword) {
                if (in_array($column, $allowColumns)) {
                    array_push($whereConditions, $column . ' LIKE ?');
                    array_push($queryPrepare, '%' . $keyword . '%');
                }
            }
        }
        // 新增比對條件
        if (!is_null($equals) && is_array($equals)) {
            // keyword equal
            foreach ($equals as $column => &$condition) {
                if (in_array($column, $allowColumns)) {
                    array_push($whereConditions, $column . ' = ?');
                    array_push($queryPrepare, $keyword);
                }
            }
        }
        // fix where sql
        if (count($whereConditions) > 0) {
            $whereSql = 'WHERE ' . implode(' OR ', $whereConditions);
        }

        // 新增排序條件
        $orderSql = '';
        $orderConditions = array();
        if (!is_null($sorts) && is_array($sorts)) {
            foreach ($sorts as $column => $sortStyle) {
                $sortStyle = strtoupper($sortStyle);
                if (in_array($sortStyle, array('ASC', 'DESC')) && in_array($column, $allowColumns)) {
                    array_push($orderConditions, $column . ' ' . $sortStyle);
                }
            }
        }
        // fix order sql
        if (count($orderConditions) > 0) {
            $orderSql = 'ORDER BY ' . implode(', ', $orderConditions);
        }

        $rows = $this->getDb()->query(
            sprintf(
                'SELECT %s FROM (%s) AS t %s %s LIMIT %d OFFSET %d',
                $columnSql,
                $sqlQuery,
                $whereSql,
                $orderSql,
                $size,
                $offset
            ),
            $queryPrepare
        )->result();
        log_message('debug', 'SmartyGrid->query: ' . $this->_db->last_query());

        $count = $this->getDb()->query(
            sprintf(
                'SELECT COUNT(*) AS count FROM (%s) AS t %s',
                $sqlQuery,
                $whereSql
            ),
            $queryPrepare
        )->result();
        log_message('debug', 'SmartyGrid->query: ' . $this->_db->last_query());
        
        return array(
                'code' => 0,
                'message' => 'success',
                'data' => array(
                    'list' => $rows,
                    'total' => $count[0]->count
                )
            );
    }
    
    /**
     * 取得每一張資料表的 SmartyGrid 結構資料，包含內容與資料總筆數
     * 
     * @param array $allowColumns 可以操作存取的欄位
     * @param string $table 資料表名稱(可以使用 View)
     * @param CI_Input $input
     * @throws Exception
     * @return array 包含資料與總筆數
     */
    public function getGridDataByTable(array $allowColumns, $table, CI_Input &$input)
    {
        // make query
        $query = &$this->makeDbQuery($allowColumns, $table, $input);

        // query and log
        $rows = $query->get()->result();
        log_message('debug', 'SmartyGrid->query: ' . $this->_db->last_query());

        // make count query
        $query = &$this->makeCountDbQuery($table, $input);
        
        // query and log
        $count = $query->get()->result();
        log_message('debug', 'SmartyGrid->query: ' . $this->_db->last_query());

        return array(
                'code' => 0,
                'message' => 'success',
                'data' => array(
                    'list' => $rows,
                    'total' => $count[0]->count
                )
            );
    }

    /**
     * 產生 CI 的 DB Query 物件
     * 
     * @param array $allowColumns 允許操作的欄位名稱
     * @param string $table 處理的 table 或 view
     * @param CI_Input $input HTTP 輸入資料
     * @return CI_DB_active_record
     */
    public function makeDbQuery(array $allowColumns, $table, CI_Input &$input)
    {
        // check column
        foreach ($allowColumns as &$column) {
            if ($column === '*') {
                return array(
                    'code' => 1,
                    'message' => 'SmartyGrid: Configure can\'t use * column set.'
                );
            }
        }

        // 從 request 取參數
        $size = intval($input->get_post('size'));
        $offset = intval($input->get_post('offset'));
        $search = $input->get_post('search');
        $equals = $input->get_post('equals');
        $sorts = $input->get_post('sorts');
        $columns = $input->get_post('columns');

        // 新增過濾欄位
        if (!is_null($columns) && is_array($columns)) {
            // keyword search
            $columnFilter = array();
            foreach ($columns as &$column) {
                if (in_array($column, $allowColumns)) {
                    array_push($columnFilter, $column);
                }
            }
            $query = $this->_db->select($columnFilter)->from($table);
        } else {
            // make query
            $query = $this->_db->select($allowColumns)->from($table);
        }

        
        // fix page
        if (is_null($size) || $size === 0) {
            $size = 20;
        }
        if (is_null($offset)) {
            $offset = 0;
        }

        // limit condition
        $query->limit($size, $offset);

        // 新增搜尋條件
        if (!is_null($search) && is_array($search)) {
            // keyword search
            foreach ($search as $column => &$condition) {
                $query->or_like($column, $condition);
            }
        }

        // 新增比對條件
        if (!is_null($equals) && is_array($equals)) {
            // keyword equal
            foreach ($equals as $column => &$condition) {
                $query->or_where($column, $condition);
            }
        }

        // 新增排序條件
        $orders = null;
        if (!is_null($sorts) && is_array($sorts)) {
            foreach ($sorts as $column => $sortStyle) {
                $sortStyle = strtoupper($sortStyle);
                if (in_array($sortStyle, array('ASC', 'DESC'))) {
                    $query->order_by($column, $sortStyle);
                }
            }
        }

        return $query;
    }

    /**
     * 產生 CI 的計算總數 DB Query 物件，只會用到 search 和 equals
     * 
     * @param string $table 處理的 table 或 view
     * @param CI_Input $input HTTP 輸入資料
     * @return CI_DB_active_record
     */
    public function makeCountDbQuery($table, CI_Input &$input)
    {
        // 從 request 取參數
        $search = $input->get_post('search');
        $equals = $input->get_post('equals');

        // make query
        $query = $this->_db->select(array('COUNT(*) AS count'))->from($table);

        // 新增搜尋條件
        if (!is_null($search) && is_array($search)) {
            // keyword search
            foreach ($search as $column => &$condition) {
                $query->or_like($column, $condition);
            }
        }

        // 新增比對條件
        if (!is_null($equals) && is_array($equals)) {
            // keyword equal
            foreach ($equals as $column => &$condition) {
                $query->or_where($column, $condition);
            }
        }

        return $query;
    }
}
