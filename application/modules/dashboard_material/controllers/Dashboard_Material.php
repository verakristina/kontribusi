<?php

class Dashboard_material extends CI_Controller
{
    public function __Construct()
    {
        parent::__Construct();
    }

    public function index()
    {
        $data['title_page'] = "HOME";
        $data['back_url'] = base_url("/");
        renderHTMLMaterial('dashboard_material/index', $data);
    }
}
