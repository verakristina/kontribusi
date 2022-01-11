<?php

class Dashboard extends CI_Controller{

	function __Construct(){
		parent::__Construct();
		//isLogin();

		$this->load->model('Dashboard_model');
	}

	public function index(){
		//$idAkses = $this->session->userdata('idAkses');

		//$getData = $this->Dashboard_model->getMenu($idAkses);

		//$data['menu_list'] = $getData;
		$data['title_page'] = "HOME";
		$data['back_url'] = base_url("/");
		renderView('dashboard/index', $data);
		/*echo "ASDASD";*/
	}

}

?>