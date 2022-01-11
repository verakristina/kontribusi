<?php

class Dashboardm extends CI_Controller{

	function __Construct(){
		parent::__Construct();
		isLogin();
		$this->load->model('dashboard_material/Dashboard_model');
	}

	public function index(){
		// $idAkses = $this->session->userdata('idAkses');
		$getData = $this->Dashboard_model->getMenu(2);

		$data['menu_list'] = $getData;
		$data['title_page'] = "HOME";
		$data['back_url'] = base_url("/");
		renderHTMLMaterial('dashboard_material/index', $data);
	}

}

?>