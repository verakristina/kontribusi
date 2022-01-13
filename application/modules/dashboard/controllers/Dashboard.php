<?php

class Dashboard extends CI_Controller
{
    public function __Construct()
    {
        parent::__Construct();
    }

    public function index()
    {
        $data['title_page'] = "HOME";
        $data['back_url'] = base_url("/");
        renderHTMLMaterial('dashboard/index', $data);
    }
    
}
