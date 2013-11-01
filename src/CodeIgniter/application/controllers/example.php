<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * CodeIgniter Smarty-Grid Controller exmaple 
 * 
 * @author sj
 * @link https://github.com/smajeack/SmartyGrid
 * @copyright Copyright 2013 SJ
 * @version 1.0
 * @license Apache License Version 2.0 (https://github.com/samejack/SmartyGrid/blob/master/LICENSE)
 * @package \SmartyGrid
 */
class Example extends CI_Controller
{

    /**
     * SmartyGrid instance object
     * 
     * @var SmartyGrid
     */
    public $smartygrid;

    public function index()
    {
        $this->load->library('SmartyGrid');

        $data = &$this->smartygrid->getGridDataByTable(
            array('id', 'username', 'realname', 'title', 'email', 'create_time'),
            'example_table',
            $this->input
        );
        
        $this->smartygrid->response($data);
    }
}
