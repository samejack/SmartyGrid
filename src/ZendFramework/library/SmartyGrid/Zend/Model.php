<?php

/**
 * 整合 Zend Framework 提供 SmartyGrid WebService
 */
class SmartyGrid_Zend_Model
{
    /**
     * @var Zend_Db_Adapter_Abstract
     */
    private $_db;
    
    /**
     * @var Zend_Log
     */
    private $_logger;
    
    public function __construct(Zend_Db_Adapter_Abstract &$db = null)
    {
        if (!is_null($db)) {
            $this->_db = $db;
        } else {
            $this->_db = Zend_Db_Table_Abstract::getDefaultAdapter();
        }
    }
    
    /**
     * 利用 SQL 取得 SmartyGrid 結構資料，包含內容與資料總筆數
     * 
     * @param array $allowColumns 可以操作存取的欄位
     * @param string $sqlQuery SQL Query 可使用 JOIN 語法
     * @param CI_Input $input
     * @throws Exception
     * @return array 包含資料與總筆數
     */
    public function getGridDataBySqlQuery(array $allowColumns, $sqlQuery, Zend_Controller_Request_Abstract &$input)
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
        $size = intval($input->getParam('size'));
        $offset = intval($input->getParam('offset'));
        $search = $input->getParam('search');
        $equals = $input->getParam('equals');
        $sorts = $input->getParam('sorts');
        $columns = $input->getParam('columns');

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

        $rows = $this->_db->query(
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
        )->fetchAll();

        $count = $this->_db->query(
            sprintf(
                'SELECT COUNT(*) AS count FROM (%s) AS t %s',
                $sqlQuery,
                $whereSql
            ),
            $queryPrepare
        )->fetchAll();

        return array(
                'code' => 0,
                'message' => 'success',
                'data' => array(
                    'list' => $rows,
                    'total' => $count[0]['count']
                )
            );
    }
    
    /**
     * 取得每一張資料表的 SmartyGrid 結構資料，包含內容與資料總筆數
     * 
     * @param array $allowColumns 可以操作存取的欄位
     * @param string $table 資料表名稱(可以使用 View)
     * @param Zend_Controller_Request_Abstract $input
     * @throws Exception
     * @return array 包含資料與總筆數
     */
    public function getGridDataByTable(array $allowColumns, $table, Zend_Controller_Request_Abstract &$input)
    {
        // make query
        $select = &$this->makeDbQuery($allowColumns, $table, $input);

        // query and log
        $rows = $this->_db->query($select)->fetchAll();

        // make count query
        $select = &$this->makeCountDbQuery($table, $input);
        
        // query and log
        $count = $this->_db->query($select)->fetchAll();

        return array(
                'code' => 0,
                'message' => 'success',
                'data' => array(
                    'list' => $rows,
                    'total' => $count[0]['count']
                )
            );
    }

    /**
     * 產生 CI 的 DB Query 物件
     * 
     * @param array $allowColumns 允許操作的欄位名稱
     * @param string $table 處理的 table 或 view
     * @param Zend_Controller_Request_Abstract $input HTTP 輸入資料
     * @return CI_DB_active_record
     */
    public function makeDbQuery(array $allowColumns, $table, Zend_Controller_Request_Abstract &$input)
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
        $size = intval($input->getParam('size'));
        $offset = intval($input->getParam('offset'));
        $search = $input->getParam('search');
        $equals = $input->getParam('equals');
        $sorts = $input->getParam('sorts');
        $columns = $input->getParam('columns');

        // 新增過濾欄位
        if (!is_null($columns) && is_array($columns)) {
            // keyword search
            $columnFilter = array();
            foreach ($columns as &$column) {
                if (in_array($column, $allowColumns)) {
                    array_push($columnFilter, $column);
                }
            }
            if (count($columnFilter) > 0) {
                $select = $this->_db->select()->from($table, $columnFilter);
            } else {
                $select = $this->_db->select()->from($table, $allowColumns);
            }
        } else {
            // make query
            $select = $this->_db->select()->from($table, $allowColumns);
        }

        // fix page
        if (is_null($size) || $size === 0) {
            $size = 20;
        }
        if (is_null($offset)) {
            $offset = 0;
        }

        // limit condition
        $select->limit($size, $offset);

        // 新增搜尋條件
        if (!is_null($search) && is_array($search)) {
            // keyword search
            foreach ($search as $column => &$condition) {
                $select->orWhere($column . ' LIKE ?', '%' . $condition . '%');
            }
        }

        // 新增比對條件
        if (!is_null($equals) && is_array($equals)) {
            // keyword equal
            foreach ($equals as $column => &$condition) {
                $select->orWhere($column . ' = ?', $condition);
            }
        }

        // 新增排序條件
        $orders = null;
        if (!is_null($sorts) && is_array($sorts)) {
            foreach ($sorts as $column => $sortStyle) {
                $sortStyle = strtoupper($sortStyle);
                if (in_array($sortStyle, array('ASC', 'DESC'))) {
                    $select->order(($column . ' ' . $sortStyle));
                }
            }
        }
        try {
            $select->query();

        } catch (Exception $e) {
            print_r($select);exit();
        }
        return $select;
    }

    /**
     * 產生 CI 的計算總數 DB Query 物件，只會用到 search 和 equals
     * 
     * @param string $table 處理的 table 或 view
     * @param Zend_Controller_Request_Abstract $input HTTP 輸入資料
     * @return CI_DB_active_record
     */
    public function makeCountDbQuery($table, Zend_Controller_Request_Abstract &$input)
    {
        // 從 request 取參數
        $search = $input->getParam('search');
        $equals = $input->getParam('equals');

        // make query
        $select = $this->_db->select()->from($table, 'COUNT(*) AS count');

        // 新增搜尋條件
        if (!is_null($search) && is_array($search)) {
            // keyword search
            foreach ($search as $column => &$condition) {
                $select->orWhere($column . ' LIKE ?', '%' . $condition . '%');
            }
        }

        // 新增比對條件
        if (!is_null($equals) && is_array($equals)) {
            // keyword equal
            foreach ($equals as $column => &$condition) {
                $select->orWhere($column . ' = ?', $condition);
            }
        }

        return $select;
    }
}
