<?php

class Api extends CI_Controller{

	function __Construct(){
		parent::__Construct();

		$this->load->model('Api_model');
	}

	public function index(){
		echo "index";
	}

	public function getMenuList(){
		$arr = array();
		$role_id = $this->session->userdata('sess_role_id');

		$menu = $this->Api_model->getMenu($role_id);
		$sub_menu = $this->Api_model->getSubMenu($role_id);

		$arr['menu'] = $menu->result();
		$arr['sub_menu'] = $sub_menu->result();

		echo toJson($arr);

	}

	public function getYearList(){
		echo toJson(getYearList());
	}	

	public function getWeekList(){
		echo getWeekList();
	}

	public function getPemilihan(){
		$arr = [];
		$getData = $this->db->query("SELECT * FROM m_type_pemilihan ORDER BY tipe_pemilihan ASC");
		$arr['data'] = $getData->result();
		echo setJson($arr);
	}

	public function getDapil(){
		$arr = [];
		$id_pemilihan = (null !== $this->input->get('id_pemilihan'))?$this->input->get('id_pemilihan'):null;

		if($id_pemilihan != null){
			if($id_pemilihan == 1){
				$getData = $this->db->query("SELECT 
					m_dapil.*, 
					m_type_pemilihan.tipe_pemilihan 
					FROM 
					m_dapil 
					INNER JOIN m_type_pemilihan ON m_dapil.id_pemilihan = m_type_pemilihan.id
					WHERE 
					id_pemilihan=$id_pemilihan
					ORDER BY 
					nama_dapil ASC");
			}else if($id_pemilihan == 2){
				$id_prov = $this->input->get('id_prov');

				$getData = $this->db->query("SELECT 
									m_dapil.*, 
									m_type_pemilihan.tipe_pemilihan 
									FROM 
									m_dapil 
									INNER JOIN m_type_pemilihan ON m_dapil.id_pemilihan = m_type_pemilihan.id
									WHERE 
									id_pemilihan=$id_pemilihan
									AND 
									id_prov = $id_prov
									ORDER BY 
									nama_dapil ASC");
			}else if($id_pemilihan == 3){
				$id_prov = $this->input->get('id_prov');
				$id_kab = $this->input->get('id_kab');

				$getData = $this->db->query("SELECT 
									m_dapil.*, 
									m_type_pemilihan.tipe_pemilihan 
									FROM 
									m_dapil 
									INNER JOIN m_type_pemilihan ON m_dapil.id_pemilihan = m_type_pemilihan.id
									WHERE 
									id_pemilihan=$id_pemilihan
									AND 
									id_prov = $id_prov
									AND 
									id_kota = $id_kab
									ORDER BY 
									nama_dapil ASC");
			}else{

			}
		}else{
			$getData = $this->db->query("SELECT 
					m_dapil.*, 
					m_type_pemilihan.tipe_pemilihan 
					FROM 
					m_dapil 
					INNER JOIN m_type_pemilihan ON m_dapil.id_pemilihan = m_type_pemilihan.id
					ORDER BY 
					nama_dapil ASC");
		}

		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function getKotaList(){
		$arr = [];
		$id_dapil = (null !== $this->input->get('id_dapil'))?$this->input->get('id_dapil'):null;

		if($id_dapil != null){
			$getData = $this->db->query("SELECT 
					detail_dapil.*, 
					m_dapil.nama_dapil, 
					m_type_pemilihan.tipe_pemilihan
			FROM detail_dapil
			INNER JOIN m_dapil ON detail_dapil.id_dapil = m_dapil.id
			INNER JOIN m_type_pemilihan ON m_dapil.id_pemilihan = m_type_pemilihan.id
			WHERE detail_dapil.id_dapil = $id_dapil
			ORDER BY 
			nama_daerah ASC
			");
		}else{
			$getData = $this->db->query("SELECT 
					detail_dapil.*, 
					m_dapil.nama_dapil, 
					m_type_pemilihan.tipe_pemilihan
			FROM detail_dapil
			INNER JOIN m_dapil ON detail_dapil.id_dapil = m_dapil.id
			INNER JOIN m_type_pemilihan ON m_dapil.id_pemilihan = m_type_pemilihan.id
			ORDER BY 
			nama_daerah ASC
			");
		}

		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function getCalegList(){
		$arr = [];

		$id_dapil = (null !== $this->input->get('id_dapil'))?$this->input->get('id_dapil'):null;
		$id_partai = (null !== $this->input->get('id_partai'))?$this->input->get('id_partai'):null;

		if($id_dapil != null){
			$getData = $this->db->query("SELECT 
					tb_calon_list.*, 
					m_dapil.nama_dapil, 
					m_type_pemilihan.tipe_pemilihan
			FROM tb_calon_list
			INNER JOIN m_dapil ON tb_calon_list.id_dapil = m_dapil.id
			INNER JOIN m_type_pemilihan ON m_dapil.id_pemilihan = m_type_pemilihan.id
			WHERE tb_calon_list.id_dapil = $id_dapil
			AND tb_calon_list.id_partai = $id_partai
			");
		}else{
			$getData = $this->db->query("SELECT 
					tb_calon_list.*, 
					m_dapil.nama_dapil, 
					m_type_pemilihan.tipe_pemilihan
			FROM tb_calon_list
			INNER JOIN m_dapil ON tb_calon_list.id_dapil = m_dapil.id
			INNER JOIN m_type_pemilihan ON m_dapil.id_pemilihan = m_type_pemilihan.id
			");
		}

		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function getProv(){
		$arr = [];
		$getData = $this->db->query("SELECT * FROM ms_provinsi");
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function getKabKota(){
		$arr = [];

		$id_prov = (null !== $this->input->get('id_prov'))?$this->input->get('id_prov'):null;
	}

	public function getPartai(){

		$arr = [];

		$getData = $this->db->query("SELECT * FROM ms_party ORDER BY no_urut ASC");
		$arr['data'] = $getData->result();

		echo setJson($arr);

	}

	public function get_dapil_votes(){
		$arr = [];

		$id_dapil = $this->input->get("id_dapil");

		$partai = $this->db->query("SELECT * FROM ms_party ORDER BY no_urut ASC");

		$partai_list = [];
		foreach($partai->result() as $par){
			array_push($partai_list, [
				"id_dapil" => $id_dapil,
				"id_partai" => $par->id,
				"nama_partai" => $par->nama_partai,
				"total_suara" => (int)0
			]);
		}

		$getVotes = $this->db->query("SELECT * FROM tb_dapil_votes WHERE id_dapil=$id_dapil");
		if($getVotes->num_rows() > 0){
			foreach($getVotes->result() as $v){
				if(null !== $v->id_partai){
					$key = array_search($v->id_partai, array_column($partai_list, "id_partai"));

					if(null !== $key){
						$partai_list[$key]['total_suara'] = (int)$v->total_suara;
					}

				}else{
					continue;
				}
			}
		}

		$getTotal = $this->db->query("SELECT SUM(total_suara) as SUARA_DAPIL FROM tb_dapil_votes WHERE id_dapil=$id_dapil")->row();

		$arr['status'] = "success";
		$arr['code'] = 200;
		$arr['data']['id_dapil'] = $id_dapil;
		$arr['data']['list'] = $partai_list;
		$arr['data']['suara_dapil'] = $getTotal->SUARA_DAPIL;

		echo setJson($arr);

	}

	public function save_votes_dapil(){
		$arr = [];
		$voteList = $this->input->post('voteList');

		foreach($voteList as $vl){

			$id_dapil = $vl['id_dapil'];
			$id_partai = $vl['id_partai'];
			$total_suara = $vl['total_suara'];

			$cek = $this->db->query("SELECT id FROM tb_dapil_votes WHERE id_dapil=$id_dapil AND id_partai=$id_partai");

			if($cek->num_rows() == 1){
				$this->db->where('id_dapil', $id_dapil)
							->where('id_partai', $id_partai)
							->update('tb_dapil_votes', [
								"total_suara" => $total_suara
							]);
			}else{
				$this->db->insert('tb_dapil_votes', [
					"id_dapil" => $id_dapil,
					"id_partai" => $id_partai,
					"total_suara" => $total_suara
				]);
			}
		}

		if($this->db->affected_rows() > 0){
			$arr['status'] = "success";
		}else{
			$arr['status'] = "failed";
		}

		echo setJson($arr);

	}

	public function getKokab(){
		$id_prov = $this->input->get('id_prov');

		$getData = $this->db->query("SELECT * FROM ms_kab_kota WHERE id_prov=$id_prov ORDER BY kab_kota ASC");

		echo setJson($getData->result());
	}

	public function getKokabPartisipasi()
	{
		$arr = [];
		$id_prov = $this->input->get('id_prov');

		$getData = $this->db->query("SELECT * FROM ms_kab_kota WHERE id_prov = $id_prov");
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_date_info(){
		$arr = [];

		$get_month = $this->db->query("SELECT * FROM ms_bulan");
		$curr_mont = date('m');
		$curr_year = date('Y');
		if ($curr_mont < 10) {
			$curr_mont = substr($curr_mont, 1);
		}

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['data']['month_list'] = $get_month->result();
		$arr['data']['curr_month'] = $curr_mont;
		$arr['data']['curr_year'] = $curr_year;

		echo setJson($arr);

	}

	public function cekbulantahun(){
		$arr = [];

		$id_anggota = $this->input->get('id_anggota');
		$where = " WHERE nama_anggota = $id_anggota";

		$cek = $this->db->query("SELECT id, tahun FROM tb_partisipasi $where");


		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['data']['cek'] = $cek->result();

		echo setJson($arr);

	}

	public function getsingledatausername(){
		$arr = [];

		$id_user = $this->input->get('user_id');

		$cek = $this->db->query("SELECT id, username, id_role FROM ms_user WHERE id = $id_user");


		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['data']['username'] = $cek->result();

		echo setJson($arr);

	}

	public function getdatausername(){
		$arr = [];

		$id_role = $this->input->get('id_role');

		$cek = $this->db->query("SELECT * FROM ms_user WHERE id_role = $id_role");


		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['data']['username'] = $cek->result();

		echo setJson($arr);

	}

	public function save_kontribusi(){
		$arr = [];
		
		$param = $this->input->post(NULL, TRUE);
		$this->db->trans_start();
		$arr_id = [];
		$a = 0;

		foreach($param['list_dana'] as $get){
			$data = [];
			if($get['isNew'] == "true"){
				if($param['kabupaten'] != ""){
					$this->db->insert('ms_anggota', [
						"id_prov" => $param['provinsi'],
						"id_kab" => $param['kabupaten'],
						"nama_anggota" => $get['nama']
					]);
				}else{
					$this->db->insert('ms_anggota', [
						"id_prov" => $param['provinsi'],
						"id_kab" => null,
						"nama_anggota" => $get['nama']
					]);
				}

				$nama_anggota = $this->db->insert_id();
			}else{
				$nama_anggota = $get['nama'];
			}

			$data = [
				'id_bulan' => $param['bulan'],
				'tahun' => $param['tahun'],
				'id_prov' => $param['provinsi'],
				'nama_anggota' => $nama_anggota,
				'thp' => $get['thp'],
				'dpp' => $get['dpp'],
				'dpd' => $get['dpd'],
				'dpc' => $get['dpc'],
				'tanggal_setor' => $get['tanggal_setor'],
				'bank' => $get['bank'],
				'status' => 1
			];

			if($param['kabupaten'] != ""){
				$data['id_kab'] = $param['kabupaten'];
			}

			$this->db->insert('tb_kontribusi', $data);

			if($get['hasFile'] == 'true'){
				array_push($arr_id, $this->db->insert_id());
			}
			$a++;
		}
		$arr_img = [];
		$c_file = count($_FILES['files']['name']);
		
		for($i=0;$i<$c_file;$i++){
			if(!empty($_FILES['files']['name'][$i])){
				$_FILES['file']['name'] = $_FILES['files']['name'][$i];
				$_FILES['file']['type'] = $_FILES['files']['type'][$i];
				$_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
				$_FILES['file']['error'] = $_FILES['files']['error'][$i];
				$_FILES['file']['size'] = $_FILES['files']['size'][$i];

				$config['upload_path'] = './assets/upload/bukti_setor';
				$config['allowed_types'] = 'jpg|png|jpeg|pdf';
				$config['max_size'] = 0;

				$this->load->library('upload', $config);
				$this->upload->initialize($config);

				if (!$this->upload->do_upload('file')) {
					$arr['status'] = false;
					$arr['code'] = 400;
					$arr['message'] = $this->upload->display_errors();
				} else {
                    $media = $this->upload->data();
                    $arr_img['bukti_setor'] = substr($config['upload_path'], 1)."/".$media['file_name'];
					$arr_img['id_kontribusi'] = $arr_id[$i];
				
					$this->db->insert('tb_bukti_setor_kontribusi', $arr_img);
				}
			}
		}

		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "Success";

		echo setJson($arr);
	}

	public function get_kontribusi_data(){
		$arr = [];
		
		$bulan = (null !== $this->input->get('bulan'))?$this->input->get('bulan'):null;
		$tahun = (null !== $this->input->get('tahun'))?$this->input->get('tahun'):null;
		if($bulan == null){
			$where = "WHERE tahun=$tahun";
		}else{
			$where = "WHERE id_bulan=$bulan AND tahun=$tahun";
		}

		$id_prov = (null !== $this->input->get('provinsi') || "" !== $this->input->get('provinsi'))?$this->input->get('provinsi'):null;
		$id_kab = (null !== $this->input->get('kabupaten') || "" !== $this->input->get('kabupaten'))?$this->input->get('kabupaten'):null;

		if($id_prov != null){
			$where .= " AND tb_kontribusi.id_prov=$id_prov";
		}

		if($id_kab != null){
			$where .= " AND tb_kontribusi.id_kab=$id_kab";
		}

		$getData = $this->db->query(
			"SELECT
			tb_kontribusi.*,
			ms_provinsi.provinsi,
			ms_kab_kota.kab_kota,
			ms_bulan.bulan,
			ms_anggota.nama_anggota AS NAMA_ANGGOTA,
			(SELECT COUNT(*) FROM tb_bukti_setor_kontribusi WHERE unique_identifier=tb_kontribusi.unique_identifier) as BUKTI_SETOR,
			(SELECT GROUP_CONCAT(DISTINCT DATE_FORMAT(tanggal_setor, '%d %b %Y' ) SEPARATOR ', ') FROM tb_bukti_setor_kontribusi WHERE unique_identifier=tb_kontribusi.unique_identifier) AS SETOR
		FROM
			tb_kontribusi
			INNER JOIN ms_anggota ON tb_kontribusi.nama_anggota = ms_anggota.id
			INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
			LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
			INNER JOIN ms_bulan ON tb_kontribusi.id_bulan = ms_bulan.id
			$where"
		);

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function save_kontribusi_by_name(){
		$arr = [];

		$param = $this->input->post(NULL, TRUE);
		$this->db->trans_start();
		$arr_id = [];
		$a = 0;

	foreach($param['list_dana'] as $get){
		$data = [];
		if($get['isNew'] == "true"){
			if($param['kabupaten'] != ""){
				$this->db->insert('ms_anggota', [
					"id_prov" => $param['provinsi'],
					"id_kab" => $param['kabupaten'],
					"nama_anggota" => $get['nama']
				]);
			}else{
				$this->db->insert('ms_anggota', [
					"id_prov" => $param['provinsi'],
					"id_kab" => null,
					"nama_anggota" => $get['nama']
				]);
			}

			$nama_anggota = $this->db->insert_id();
		}else{
			$nama_anggota = $param['forms']['nama'];
		}

			$data = [
				'id_bulan' => $param['bulan'],
				'tahun' => $param['tahun'],
				'id_prov' => $param['provinsi'],
				'nama_anggota' => $nama_anggota,
				'thp' => $get['thp'],
				'dpp' => $get['dpp'],
				'dpd' => $get['dpd'],
				'dpc' => $get['dpc'],
				'tanggal_setor' => $get['tanggal_setor'],
				'bank' => $get['bank'],
				'status' => 1
			];

			if($param['kabupaten'] != ""){
				$data['id_kab'] = $param['kabupaten'];
			}
			$this->db->insert('tb_kontribusi', $data);

			if($get['hasFile'] == 'true'){
				array_push($arr_id, $this->db->insert_id());
			}
			$a++;		
		}

		$arr_img = [];
		$c_file = count($_FILES['files']['name']);

		for($i=0;$i<$c_file;$i++){
			if(!empty($_FILES['files']['name'][$i])){
				$_FILES['file']['name'] = $_FILES['files']['name'][$i];
				$_FILES['file']['type'] = $_FILES['files']['type'][$i];
				$_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
				$_FILES['file']['error'] = $_FILES['files']['error'][$i];
				$_FILES['file']['size'] = $_FILES['files']['size'][$i];

				$config['upload_path'] = './assets/upload/bukti_setor';
				$config['allowed_types'] = 'jpg|png|jpeg|pdf';
				$config['max_size'] = 0;

				$this->load->library('upload', $config);
				$this->upload->initialize($config);

				if (!$this->upload->do_upload('file')) {
					$arr['status'] = false;
					$arr['code'] = 400;
					$arr['message'] = $this->upload->display_errors();
				} else {
					$media = $this->upload->data();
					$arr_img['bukti_setor'] = substr($config['upload_path'], 1)."/".$media['file_name'];
					$arr_img['id_kontribusi'] = $arr_id[$i];

					$this->db->insert('tb_bukti_setor_kontribusi', $arr_img);
				}
			}
		}
		$this->db->trans_complete();


		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "Success";

		echo setJson($arr);
	}

	public function save_kontribusi_by_name_dev(){
		$arr = [];
		
		$param = $this->input->post(NULL, TRUE);
		$this->db->trans_start();
		$arr_id = [];
		$a = 0;

		if($param['isNew'] == "true"){
            if($param['kabupaten'] != ""){
                $this->db->insert('ms_anggota', [
                    "id_prov" => $param['provinsi'],
                    "id_kab" => $param['kabupaten'],
                    "nama_anggota" => $param['nama']
                ]);
            }else{
                $nama_anggota = $param['nama'];
                $this->db->insert('ms_anggota', [
                    "id_prov" => $param['provinsi'],
                    "id_kab" => null,
                    "nama_anggota" => $param['nama']
                ]);
            }
            $nama_anggota = $this->db->insert_id();
        }else{
            $nama_anggota = $param['nama'];
        }

        foreach($param['list_dana'] as $get){
            $data = [];

            $data = [
                'id_prov' => $param['provinsi'],
                'tahun' => $param['tahun'],
                'id_bulan' => $get['bulan'],
				'nama_anggota' => $nama_anggota,
				'thp' => $get['thp'],
				'dpp' => $get['dpp'],
				'dpd' => $get['dpd'],
				'dpc' => $get['dpc'],
                'tanggal_setor' => $get['tanggal_setor'],
				'bank' => $get['bank'],
				'status' => 1
            ];

            if($param['kabupaten'] != ""){
                $data['id_kab'] = $param['kabupaten'];
            }

            $this->db->insert('tb_kontribusi', $data);

            if($get['hasFile'] == 'true'){
                array_push($arr_id, $this->db->insert_id());
            }
            $a++;
        }

		$arr_img = [];
        $c_file = count($_FILES);
		
        if($c_file != 0){
            for($i=0;$i<$c_file;$i++){
                if(!empty($_FILES['files']['name'][$i])){
                    $_FILES['file']['name'] = $_FILES['files']['name'][$i];
                    $_FILES['file']['type'] = $_FILES['files']['type'][$i];
                    $_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
                    $_FILES['file']['error'] = $_FILES['files']['error'][$i];
                    $_FILES['file']['size'] = $_FILES['files']['size'][$i];
    
                    $config['upload_path'] = './assets/upload/bukti_setor';
                    $config['allowed_types'] = 'jpg|png|jpeg|pdf';
                    $config['max_size'] = 0;
    
                    $this->load->library('upload', $config);
                    $this->upload->initialize($config);
    
                    if (!$this->upload->do_upload('file')) {
                        $arr['status'] = false;
                        $arr['code'] = 400;
                        $arr['message'] = $this->upload->display_errors();
                    } else {
						$media = $this->upload->data();
						$arr_img['bukti_setor'] = substr($config['upload_path'], 1)."/".$media['file_name'];
						$arr_img['id_kontribusi'] = $arr_id[$i];
	
						$this->db->insert('tb_bukti_setor_kontribusi', $arr_img);
                    }
				}
			}
		}
		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "Success";

		echo setJson($arr);
	}

	public function save_partisipasi(){
		$arr = [];
		
		$param = $this->input->post(NULL, TRUE);
		$this->db->trans_start();
		$arr_id = [];
		$a = 0;

		if($param['isNew'] == "true"){
            if($param['kabupaten'] != ""){
                $this->db->insert('ms_anggota', [
                    "id_prov" => $param['provinsi'],
                    "id_kab" => $param['kabupaten'],
                    "nama_anggota" => $param['nama']
                ]);
            }else{
                $nama_anggota = $param['nama'];
                $this->db->insert('ms_anggota', [
                    "id_prov" => $param['provinsi'],
                    "id_kab" => null,
                    "nama_anggota" => $param['nama']
                ]);
            }
            $nama_anggota = $this->db->insert_id();
        }else{
            $nama_anggota = $param['nama'];
        }

        foreach($param['list_dana'] as $get){
            $data = [];

            $data = [
                'id_prov' => $param['provinsi'],
                'tahun' => $param['tahun'],
				'nama_anggota' => $nama_anggota,
				'dana_partisipasi' => $get['jumlah'],
                'tanggal_setor' => $get['tanggal_setor'],
                'bank' => $get['bank']
            ];

            if($param['kabupaten'] != ""){
                $data['id_kab'] = $param['kabupaten'];
            }

            $this->db->insert('tb_partisipasi', $data);

            if($get['hasFile'] == 'true'){
                array_push($arr_id, $this->db->insert_id());
            }
            $a++;
        }

		$arr_img = [];
        $c_file = count($_FILES);
		
        if($c_file != 0){
            for($i=0;$i<$c_file;$i++){
                if(!empty($_FILES['files']['name'][$i])){
                    $_FILES['file']['name'] = $_FILES['files']['name'][$i];
                    $_FILES['file']['type'] = $_FILES['files']['type'][$i];
                    $_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
                    $_FILES['file']['error'] = $_FILES['files']['error'][$i];
                    $_FILES['file']['size'] = $_FILES['files']['size'][$i];
    
                    $config['upload_path'] = './assets/upload/bukti_setor';
                    $config['allowed_types'] = 'jpg|png|jpeg|pdf';
                    $config['max_size'] = 0;
    
                    $this->load->library('upload', $config);
                    $this->upload->initialize($config);
    
                    if (!$this->upload->do_upload('file')) {
                        $arr['status'] = false;
                        $arr['code'] = 400;
                        $arr['message'] = $this->upload->display_errors();
                    } else {
						$media = $this->upload->data();
						$arr_img['bukti_setor'] = substr($config['upload_path'], 1)."/".$media['file_name'];
						$arr_img['id_partisipasi'] = $arr_id[$i];
	
						$this->db->insert('tb_bukti_setor_partisipasi', $arr_img);
                    }
				}
			}
		}
		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "Success";

		echo setJson($arr);
	}

	public function get_partisipasi_data(){
		$arr = [];
		$id_param = $this->input->get('id_param'); 
		// $id_prov = (null !== $this->input->get('id_prov') || "" !== $this->input->get('id_prov'))?$this->input->get('id_prov'):null;
		$id_prov = $this->input->get('id_prov'); 
		if($id_prov != 0){
			$where = " WHERE anggota.id_prov=$id_prov";
		}else{
			$where = "";
		}

		$id_tahun = $this->input->get('id_tahun'); 

		$getData = $this->db->query(
			"SELECT
			anggota.*,
			SUM( IF ( YEAR ( tb_partisipasi.tanggal_setor ) = $id_tahun, tb_partisipasi.dana_partisipasi, 0 ) ) AS dana_akumulasi,
			SUM( tb_partisipasi.dana_partisipasi ) AS TOTAL,
			ms_provinsi.provinsi,
			ms_kab_kota.kab_kota,
			tb_parameter_dana.dprd_prov, 
			tb_parameter_dana.dprd_kab_kota, 
			DATE_FORMAT(tb_partisipasi.tanggal_setor, '%d %b %Y') as TGL_SETOR,
			 if( anggota.id_kab IS NULL, dprd_prov, dprd_kab_kota)* lama_periode AS parameter
			
		FROM
			ms_anggota AS anggota 
			INNER JOIN ms_provinsi ON anggota.id_prov = ms_provinsi.id
			LEFT JOIN ms_kab_kota ON anggota.id_kab = ms_kab_kota.id
			LEFT JOIN tb_partisipasi ON anggota.id = tb_partisipasi.nama_anggota
			JOIN tb_parameter_dana ON YEAR(tb_parameter_dana.tanggal_setor)<= $id_tahun AND YEAR(sampai_tanggal)>= $id_tahun
			-- INNER JOIN tb_parameter_dana ON anggota.id_param = tb_parameter_dana.id
			$where
		GROUP BY
			anggota.id 
			ORDER BY dana_akumulasi DESC, provinsi ASC, kab_kota ASC
			"
		);
		// foreach($getData['list_dana'] as $get){
        //     $data = [];

        //     $data = [
        //         'id_param' => $getData['dprd_prov'],
		// 		'id_param' => $getData['dprd_kab_kota'],
        //     ];
		// 	if($getData['param'] != ""){
        //         $data['id_param'] = $getData['param'];
        //     }
        // }
		

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data']['list_partisipasi'] = $getData->result();

		echo setJson($arr);
	}

	public function get_individual_data_partisipasi(){
		$arr = [];
		$id_partisipasi = $this->input->get('nama_anggota');
		$where = " WHERE ms_anggota.id=$id_partisipasi";

		$getData = $this->db->query(
			"SELECT
			ms_anggota.*,
			ms_anggota.nama_anggota as NAMA_ANGGOTA,
			ms_provinsi.provinsi,
			ms_kab_kota.kab_kota,
			tb_partisipasi.id as id_partisipasi,
			tb_partisipasi.tahun,
			tb_partisipasi.tanggal_setor,
			tb_partisipasi.dana_partisipasi
		FROM
			ms_anggota
			INNER JOIN ms_provinsi ON ms_anggota.id_prov = ms_provinsi.id
			LEFT JOIN ms_kab_kota ON ms_anggota.id_kab = ms_kab_kota.id
			LEFT JOIN tb_partisipasi ON ms_anggota.id = tb_partisipasi.nama_anggota 
			$where"
		);
		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}
	
	public function get_individual_edit_data_partisipasi(){
		$arr = [];
		$id_partisipasi = $this->input->get('id_partisipasi');
		$where = " WHERE tb_partisipasi.id=$id_partisipasi";

		$getData = $this->db->query(
			"SELECT	
			tb_partisipasi.*,
			ms_provinsi.provinsi,
			ms_kab_kota.kab_kota,
			ms_anggota.nama_anggota AS NAMA_ANGGOTA
		FROM
			tb_partisipasi
			INNER JOIN ms_anggota ON tb_partisipasi.nama_anggota = ms_anggota.id
			INNER JOIN ms_provinsi ON tb_partisipasi.id_prov = ms_provinsi.id
			LEFT JOIN ms_kab_kota ON tb_partisipasi.id_kab = ms_kab_kota.id
			$where"
		);

		$getIdAnggota = $this->db->query(
			"SELECT	
			nama_anggota,tanggal_setor
		FROM
			tb_partisipasi
			$where"
		);

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();
		$arr['data']['id'] = $getIdAnggota->row();

		echo setJson($arr);
	}

	public function setMasterAnggota(){
		$arr = [];
		$getData = $this->db->query("SELECT DISTINCT
							id_prov,
							id_kab,
							nama_anggota
						FROM
							tb_kontribusi");

		foreach($getData->result() as $get){

			if($get->id_kab == null){
				$cek = $this->db->query("SELECT id FROM ms_anggota WHERE id_prov=$get->id_prov AND nama_anggota='$get->nama_anggota'");
			}else{
				$cek = $this->db->query("SELECT id FROM ms_anggota WHERE id_prov=$get->id_prov AND id_kab=$get->id_kab AND nama_anggota='$get->nama_anggota'");
			}

			if($cek->num_rows() != 1){
				$this->db->trans_start();
				$this->db->insert('ms_anggota', [
					"id_prov" => $get->id_prov,
					"id_kab" => $get->id_kab,
					"nama_anggota" => $get->nama_anggota
				]);

				$id = $this->db->insert_id();

				if($get->id_kab == null){
					$this->db->where('id_prov', $get->id_prov)
							->where('nama_anggota', $get->nama_anggota)
							->update('tb_kontribusi', [
								'nama_anggota' => $id
							]);
				}else{
					$this->db->where('id_prov', $get->id_prov)
							->where('id_kab', $get->id_kab)
							->where('nama_anggota', $get->nama_anggota)
							->update('tb_kontribusi', [
								'nama_anggota' => $id
							]);
				}
				$this->db->trans_complete();
			}else{
				continue;
			}

		}

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "PROCESS_DONE";

		echo setJson($arr);

	}

	public function get_anggota_list(){
		$arr = [];
		
		$prov = (null !== $this->input->get('prov'))?$this->input->get('prov'):null;
		$kab = (null !== $this->input->get('kab'))?$this->input->get('kab'):null;

		if($kab == null){
			$getData = $this->db->query("SELECT * FROM ms_anggota WHERE id_prov=$prov AND id_kab IS NULL");
		}else{
			$getData = $this->db->query("SELECT * FROM ms_anggota WHERE id_prov=$prov AND id_kab=$kab");
		}

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "DATA_FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_anggota_list_partisipasi(){
		$arr = [];

		// $id_prov = $this->input->get('id_prov');
		// $id_kab = $this->input->get('id_kab');
		$id_anggota = $this->input->get('id_anggota');
		
		$where = " WHERE id = $id_anggota";

		$getData = $this->db->query("SELECT * FROM ms_anggota $where");

		// if($id_kab == null){
		// 	$getData = $this->db->query("SELECT * FROM ms_anggota WHERE id_prov=$id_prov AND id_kab IS NULL");
		// }else{
		// 	$getData = $this->db->query("SELECT * FROM ms_anggota WHERE id_prov=$id_prov AND id_kab=$id_kab");
		// }

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "DATA_FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_individual_data(){
		$arr = [];
		$id_kontribusi = $this->input->get('id_kontribusi');
		$where = " WHERE tb_kontribusi.id=$id_kontribusi";

		$getData = $this->db->query(
			"SELECT tb_kontribusi.*, ms_provinsi.provinsi, ms_kab_kota.kab_kota, ms_bulan.bulan,
			DATE_FORMAT(tb_kontribusi.tanggal_setor, '%d %M %Y') as SETOR,
			ms_anggota.nama_anggota as NAMA_ANGGOTA
			FROM tb_kontribusi
			INNER JOIN ms_anggota ON tb_kontribusi.nama_anggota = ms_anggota.id
			INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
			LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
			INNER JOIN ms_bulan ON tb_kontribusi.id_bulan = ms_bulan.id
			$where"
		);

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_verifikasi_data(){
		$arr = [];
		$arr['data'] = [];
		$id_kontribusi = $this->input->get('id_kontribusi');
		$where = " WHERE tb_kontribusi.id=$id_kontribusi";

		$getData = $this->db->query(
			"SELECT tb_kontribusi.*, ms_provinsi.provinsi, ms_kab_kota.kab_kota, ms_bulan.bulan,
			DATE_FORMAT(tb_kontribusi.tanggal_setor, '%d %M %Y') as SETOR,
			ms_anggota.nama_anggota as NAMA_ANGGOTA
			FROM tb_kontribusi
			INNER JOIN ms_anggota ON tb_kontribusi.nama_anggota = ms_anggota.id
			INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
			LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
			INNER JOIN ms_bulan ON tb_kontribusi.id_bulan = ms_bulan.id
			$where"
		);

		$getFile = $this->db->query("SELECT * FROM tb_bukti_setor_kontribusi WHERE id_kontribusi=$id_kontribusi");
		$arr['data']['detail'] = $getData->result();
		$arr['data']['file'] = $getFile->result();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";

		echo setJson($arr);
	}

	public function update_kontribusi(){
		$arr = [];
		$data = $this->input->post(NULL, TRUE);

		$id_kontribusi = $data['id'];

		unset($data['provinsi']);
		unset($data['kab_kota']);
		unset($data['bulan']);
		unset($data['SETOR']);
		unset($data['NAMA_ANGGOTA']);
		unset($data['id']);

		if(!empty($_FILES['files']['name'])){

			$config['upload_path'] = './assets/upload/bukti_setor';
			$config['allowed_types'] = 'jpg|png|jpeg|pdf';
			$config['max_size'] = 0;

			$this->load->library('upload', $config);
			$this->upload->initialize($config);

			if (!$this->upload->do_upload('files')) {
				$arr['status'] = false;
				$arr['code'] = 400;
				$arr['message'] = $this->upload->display_errors();
			} else {
				unset($data['files']);
				$media = $this->upload->data();
				$filename = $config['upload_path']."/".$media['file_name'];
			}
		}else{
			$filename = null;
		}

		$this->db->where('id', $id_kontribusi)
				->update('tb_kontribusi', $data);
		
		$cek = $this->db->query("SELECT id FROM tb_bukti_setor_kontribusi WHERE id_kontribusi=$id_kontribusi");
		if($cek->num_rows() >= 1){
			if($filename == null){
				$arrIns = [
					'id_kontribusi' => $id_kontribusi,
					'tanggal_verifikasi' => null
				];
			}else{
				$arrIns = [
					'id_kontribusi' => $id_kontribusi,
					'bukti_setor' => $filename,
					'tanggal_verifikasi' => null
				];
			}
			$this->db
				->where('id_kontribusi', $id_kontribusi)
				->update('tb_bukti_setor_kontribusi', $arrIns);
		}else{
			if($filename == null){
				$arrIns = [
					'id_kontribusi' => $id_kontribusi
				];
			}else{
				$arrIns = [
					'id_kontribusi' => $id_kontribusi,
					'bukti_setor' => $filename
				];
			}
			$this->db->insert('tb_bukti_setor_kontribusi', $arrIns);
		}
		
		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);

	}

	public function update_partisipasi(){
		$arr = [];
		$data = $this->input->post(NULL, TRUE);

		$id_partisipasi = $data['id'];

		unset($data['provinsi']);
		unset($data['kab_kota']);
		unset($data['bulan']);
		unset($data['SETOR']);
		unset($data['NAMA_ANGGOTA']);
		unset($data['id']);

		$this->db->where('id', $id_partisipasi)
				->update('tb_partisipasi', $data);
		$this->db->trans_complete();
		
		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);

	}

	public function get_bank_list(){

		$arr = [];

		$getData = $this->db->query("SELECT * FROM bank_master");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);

	}

	public function get_all_user(){
		$arr = [];

		$getData = $this->db->query("SELECT ms_user.*, ms_role.role FROM ms_user INNER JOIN ms_role ON ms_user.id_role = ms_role.id");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_user_detail(){
		$arr = [];
		$id_user = $this->input->get('id_user');

		$temp_data = [];
		$cek = $this->db->query("SELECT id_role FROM ms_user WHERE id=$id_user");
		if($cek->num_rows() == 1){
			$cek = $cek->row();
			$getData = $this->db->query("SELECT * FROM ms_user WHERE id=$id_user");
			$temp_data['user'] = $getData->result();

			if($cek->id_role == 3){
				$assign = [];
				$getAssign = $this->db->query("SELECT id_prov FROM tb_mapping_prov_ar WHERE id_user=$id_user")->result_array();
				foreach($getAssign as $r){
					$assign[] = $r['id_prov'];
				}
				$temp_data['prov_assign'] = $assign;
			}

			$arr['status'] = true;
			$arr['code'] = 200;
			$arr['message'] = "USER_FOUND";
			$arr['data'] = $temp_data;
		}else{
			$arr['status'] = false;
			$arr['code'] = 400;
			$arr['message'] = "USER_NOT_FOUND";
		}

		echo setJson($arr);
	}

	public function get_role(){
		$arr = [];

		$getData = $this->db->query("SELECT * FROM ms_role");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function edit_user(){
		$arr = [];

		$data = $this->input->post(NULL, TRUE);
		$arr_edit = [
			"username" => $data['username'],
			"name" => $data['name'],
			"id_role" => $data['id_role']
		];
		$this->db->trans_start();
		$this->db->where('id', $data['id'])
				->update('ms_user', $arr_edit);

		if($data['id_role'] == 3){
			$this->db->where('id_user', $data['id'])
					->delete('tb_mapping_prov_ar');
			
			$exp = explode(",", $data['prov_list']);
			foreach($exp as $get){
				$this->db->insert('tb_mapping_prov_ar', [
					"id_user" => $data['id'],
					"id_prov" => $get
				]);
			}
		}
		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);
	}

	public function add_user(){
		$arr = [];

		$data = $this->input->post(NULL, TRUE);
		$arr_edit = [
			"username" => $data['username'],
			"name" => $data['name'],
			"id_role" => $data['id_role'],
			"password" => $data['password']
		];
		$this->db->trans_start();
		$this->db->insert('ms_user', $arr_edit);
		$id = $this->db->insert_id();

		if($data['id_role'] != 1){
			$exp = explode(",", $data['prov_list']);
			foreach($exp as $get){
				$this->db->insert('tb_mapping_prov_ar', [
					"id_user" => $id,
					"id_prov" => $get
				]);
			}
		}
		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);
	}
	public function add_dewan(){
		$arr = [];

		$data = $this->input->post(NULL, TRUE);
		$arr_edit = [
			"id_prov" => $data['provinsi'],
			"id_kab" => $data['kabupaten'],
			"nama_anggota" => $data['nama_anggota'],
			"jabatan" => $data['jabatan'],
			"no_telp" => $data['no_telp'],
			"email" => $data['email'],
			"thp" => $data['thp']
		];
		$this->db->trans_start();
		$this->db->insert('ms_anggota', $arr_edit);
		$id = $this->db->insert_id();
		if($data['kabupaten'] != ""){
			$data['id_prov'] = $data['provinsi'];
			$data['id_kab'] = $data['kabupaten'];
		}
		
		
		
		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);
	}

	public function get_session(){
		$arr = [];
		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $this->session->userdata();

		echo setJson($arr);
	}

	public function get_prov_by_user(){
		$arr = [];
		$id = $this->input->get('id_user');

		$getData = $this->db->query("SELECT ms_provinsi.* FROM ms_provinsi
								INNER JOIN tb_mapping_prov_ar ON ms_provinsi.id = tb_mapping_prov_ar.id_prov
								WHERE tb_mapping_prov_ar.id_user = $id");
		
		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}
	
	public function save_kontribusi_single_file(){
		$arr = [];
		
		$param = $this->input->post(NULL, TRUE);
		$this->db->trans_start();
		$arr_id = [];
		$a = 0;

		if($param['hasFile'] == 'true'){
			if(!empty($_FILES['file']['name'])){
				$_FILES['file']['name'] = $_FILES['file']['name'];
				$_FILES['file']['type'] = $_FILES['file']['type'];
				$_FILES['file']['tmp_name'] = $_FILES['file']['tmp_name'];
				$_FILES['file']['error'] = $_FILES['file']['error'];
				$_FILES['file']['size'] = $_FILES['file']['size'];

				$config['upload_path'] = './assets/upload/bukti_setor';
				$config['allowed_types'] = 'jpg|png|jpeg|pdf';
				$config['max_size'] = 0;

				$this->load->library('upload', $config);
				$this->upload->initialize($config);

				if (!$this->upload->do_upload('file')) {
					$arr['status'] = false;
					$arr['code'] = 400;
					$arr['message'] = $this->upload->display_errors();
				} else {
                    $media = $this->upload->data();
                    $filename = substr($config['upload_path'], 1)."/".$media['file_name'];
				}
			}
		}else{
			$filename = null;
		}

		if($param['isNew'] == "true"){
			if($param['kabupaten'] != ""){
				$this->db->insert('ms_anggota', [
					"id_prov" => $param['provinsi'],
					"id_kab" => $param['kabupaten'],
					"nama_anggota" => $param['nama']
				]);
			}else{
				$this->db->insert('ms_anggota', [
					"id_prov" => $param['provinsi'],
					"id_kab" => null,
					"nama_anggota" => $param['nama']
				]);
			}

			$nama_anggota = $this->db->insert_id();
		}else{
			$nama_anggota = $param['nama'];
		}

		foreach($param['list_dana'] as $get){
			$data = [];

			$data = [
				'id_prov' => $param['provinsi'],
				'tahun' => $param['tahun'],
				'id_bulan' => $get['bulan'],
				'nama_anggota' => $nama_anggota,
				'thp' => $get['thp'],
				'dpp' => $get['dpp'],
				'dpd' => $get['dpd'],
				'dpc' => $get['dpc'],
				'tanggal_setor' => $param['tanggal_setor'],
				'bank' => $param['bank'],
				'status' => 1
			];

			if($param['kabupaten'] != ""){
				$data['id_kab'] = $param['kabupaten'];
			}

			$this->db->insert('tb_kontribusi', $data);
			$id = $this->db->insert_id();

			if($filename != null){
				$this->db->insert('tb_bukti_setor_kontribusi', [
					'id_kontribusi' => $id,
					'bukti_setor' => $filename
				]);
			}
			$a++;
		}
		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "Success";

		echo setJson($arr);
	}

	public function multiple_kontribusi(){
		$arr = [];
		
		$param = $this->input->post(NULL, TRUE);
		$identifier = $this->getRandIdentifier();
		$this->db->trans_start();
		$arr_id = [];
		$a = 0;

		$list_dana = $param['list_dana'];
		$list_dana = json_decode($list_dana, TRUE);

		if($param['hasFile'] == 'true'){

			$countFile = count($_FILES['files']['name']);
			$arr_filename = [];
			for($i = 0; $i < $countFile; $i++){
				$_FILES['file']['name'] = $_FILES['files']['name'][$i];
				$_FILES['file']['type'] = $_FILES['files']['type'][$i];
				$_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
				$_FILES['file']['error'] = $_FILES['files']['error'][$i];
				$_FILES['file']['size'] = $_FILES['files']['size'][$i];

				$config['upload_path'] = './assets/upload/bukti_setor';
				$config['allowed_types'] = 'jpg|png|jpeg|pdf';
				$config['max_size'] = 0;

				$this->load->library('upload', $config);
				$this->upload->initialize($config);

				if (!$this->upload->do_upload('file')) {
					$arr['status'] = false;
					$arr['code'] = 400;
					$arr['message'] = $this->upload->display_errors();
				} else {
					$media = $this->upload->data();
					$this->db->insert('tb_bukti_setor_kontribusi', [
						'bukti_setor' => substr($config['upload_path'], 1)."/".$media['file_name'],
						'nominal' => $param['nominal'][$i],
						'tanggal_setor' => $param['tanggal_setor'][$i],
						'unique_identifier' => $identifier
					]);
				}
			}
		}else{
			$filename = null;
		}

		foreach($list_dana as $get){
			$data = [];

			if($get['isNew'] == "true"){
				if($param['kabupaten'] != ""){
					$this->db->insert('ms_anggota', [
						"id_prov" => $param['provinsi'],
						"id_kab" => $param['kabupaten'],
						"nama_anggota" => $get['nama']
					]);
				}else{
					$this->db->insert('ms_anggota', [
						"id_prov" => $param['provinsi'],
						"id_kab" => null,
						"nama_anggota" => $get['nama']
					]);
				}
	
				$nama_anggota = $this->db->insert_id();
			}else{
				$nama_anggota = $get['nama'];
			}

			foreach($get['bulan'] as $bulan){
				$data = [
					'id_prov' => $param['provinsi'],
					'tahun' => $param['tahun'],
					'id_bulan' => $bulan,
					'nama_anggota' => $nama_anggota,
					'thp' => $get['thp'],
					'dpp' => $get['dpp'],
					'dpd' => $get['dpd'],
					'dpc' => $get['dpc'],
					// 'tanggal_setor' => $param['tanggal_setor'],
					'bank' => $param['bank'],
					'status' => 1,
					'unique_identifier' => $identifier
				];
	
				if($param['kabupaten'] != ""){
					$data['id_kab'] = $param['kabupaten'];
				}
	
				$this->db->insert('tb_kontribusi', $data);
				$id = $this->db->insert_id();
				
				$this->db->insert('tb_detail_kontribusi', [
					'id_kontribusi' => $id,
					'unique_identifier' => $identifier
				]);
			}
			$a++;
		}
		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "Success";

		echo setJson($arr);
	}

	public function save_verifikasi_kontribusi(){
		$arr = [];
		$this->db->trans_start();
		$id = $this->input->post('id');
		$unique_id = $this->input->post('unique_id');
		$tanggal_verifikasi = $this->input->post('tanggal_verifikasi');
		if(!empty($_FILES['verifikasi'])){
			$c = count($_FILES['verifikasi']['name']);

			for ($i=0; $i < $c ; $i++) { 
				$_FILES['file']['name'] = $_FILES['verifikasi']['name'][$i];
				$_FILES['file']['type'] = $_FILES['verifikasi']['type'][$i];
				$_FILES['file']['tmp_name'] = $_FILES['verifikasi']['tmp_name'][$i];
				$_FILES['file']['error'] = $_FILES['verifikasi']['error'][$i];
				$_FILES['file']['size'] = $_FILES['verifikasi']['size'][$i];

				$config['upload_path'] = './assets/upload/verifikasi';
				$config['allowed_types'] = 'jpg|png|jpeg|pdf';
				$config['max_size'] = 0;

				$this->load->library('upload', $config);
				$this->upload->initialize($config);

				if (!$this->upload->do_upload('file')) {
					$arr['status'] = false;
					$arr['code'] = 400;
					$arr['message'] = $this->upload->display_errors();
				} else {
					$media = $this->upload->data();
					$filename = substr($config['upload_path'], 1)."/".$media['file_name'];
					$this->db->where('id', $id[$i])
							->update('tb_bukti_setor_kontribusi', [
								"verifikasi" => $filename,
								"tanggal_verifikasi" => $tanggal_verifikasi
							]);
				}
			}
		}

		$this->db->where('unique_identifier', $unique_id)
				->update('tb_kontribusi', [
					"tanggal_verifikasi" => $tanggal_verifikasi,
					"status" => 2
				]);

		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);
	}

	public function getRandIdentifier(){
        $date = date('dmyHis');
        $rand = rand(100, 99999);
        $mili = round(microtime(true)*1000);

		return $date.$mili.$rand;
	}

	public function get_verif_kontribusi_list(){
		$arr = [];

		$param = $this->input->get(NULL, TRUE);

		$getData = $this->db->query("SELECT
			id,
			unique_identifier,
			SUM(nominal) AS JUMLAH_SETOR,
			(
				SELECT
					ms_provinsi.provinsi
				FROM
					tb_kontribusi
				INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
				WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
				GROUP BY tb_bukti_setor_kontribusi.unique_identifier
			) as PROVINSI,
			(
				SELECT
					IF(id_kab IS NOT NULL, ms_kab_kota.kab_kota, null)
				FROM
					tb_kontribusi
				LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
				WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
				GROUP BY tb_bukti_setor_kontribusi.unique_identifier
			) as KAB_KOTA,
			( SELECT ms_anggota.nama_anggota FROM ms_anggota INNER JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota WHERE tb_kontribusi.unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
				GROUP BY tb_bukti_setor_kontribusi.unique_identifier ) as NAMA_ANGGOTA,
			GROUP_CONCAT(DATE_FORMAT(tb_bukti_setor_kontribusi.tanggal_setor, '%d %b %Y')) as TGL_SETOR
		FROM
			tb_bukti_setor_kontribusi
		WHERE
			MONTH (tanggal_setor) = ".$param['bulan']."
		AND YEAR (tanggal_setor) = ".$param['tahun']."
		AND (SELECT COUNT(id) FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier) > 0
		AND ((SELECT tanggal_verifikasi FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier GROUP BY unique_identifier) IS NULL
		OR (SELECT tanggal_verifikasi FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier GROUP BY unique_identifier) = '0000-00-00')
		GROUP BY
			unique_identifier
		ORDER BY tanggal_setor ASC");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_verified_kontribusi_list(){
		$arr = [];

		$param = $this->input->get(NULL, TRUE);

		$getData = $this->db->query("SELECT
			id,
			unique_identifier,
			SUM(nominal) AS JUMLAH_SETOR,
			(
				SELECT
					ms_provinsi.provinsi
				FROM
					tb_kontribusi
				INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
				WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
				GROUP BY tb_bukti_setor_kontribusi.unique_identifier
			) as PROVINSI,
			(
				SELECT
					IF(id_kab IS NOT NULL, ms_kab_kota.kab_kota, null)
				FROM
					tb_kontribusi
				LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
				WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
				GROUP BY tb_bukti_setor_kontribusi.unique_identifier
			) as KAB_KOTA,
			( SELECT ms_anggota.nama_anggota FROM ms_anggota INNER JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota WHERE tb_kontribusi.unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
				GROUP BY tb_bukti_setor_kontribusi.unique_identifier ) as NAMA_ANGGOTA,
			(SELECT (DATE_FORMAT(tb_kontribusi.tanggal_verifikasi, '%d %b %Y')) FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier GROUP BY unique_identifier) AS TGL_VERIF
		FROM
			tb_bukti_setor_kontribusi
		WHERE
			MONTH (tanggal_setor) = ".$param['bulan']."
		AND YEAR (tanggal_setor) = ".$param['tahun']."
		AND (SELECT tanggal_verifikasi FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier GROUP BY unique_identifier) IS NOT NULL
		AND (SELECT COUNT(id) FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier) > 0
		AND (SELECT tanggal_verifikasi FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier GROUP BY unique_identifier) != '0000-00-00'

		GROUP BY
			unique_identifier
		ORDER BY tanggal_setor ASC");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_verif_kontribusi(){
		$arr = [];
		$arr['data'] = [];

		$param = $this->input->get(NULL, TRUE);

		$getFile = $this->db->query("SELECT 
							*, 
							DATE_FORMAT(tanggal_setor, '%d %M %Y') as SETOR
						FROM 
						tb_bukti_setor_kontribusi 
						WHERE 
						unique_identifier='".$param['unique_id']."'");
		$arr['data']['file_list'] = $getFile->result();

		$getData = $this->db->query(
			"SELECT tb_kontribusi.*,dpp,dpd,dpc, ms_provinsi.provinsi, ms_kab_kota.kab_kota, ms_bulan.bulan,
			ms_anggota.nama_anggota as NAMA_ANGGOTA
			FROM tb_kontribusi
			INNER JOIN ms_anggota ON tb_kontribusi.nama_anggota = ms_anggota.id
			INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
			LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
			INNER JOIN ms_bulan ON tb_kontribusi.id_bulan = ms_bulan.id
			WHERE unique_identifier='".$param['unique_id']."'");
		$arr['data']['data_list'] = $getData->result();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "DATA FOUND";

		echo setJson($arr);
	}

	// new
	public function get_verif_kontribusi_tanggal(){
		$arr = [];
		$arr['data'] = [];

		$param = $this->input->get(NULL, TRUE);

		$getFile = $this->db->query("SELECT 
							*, 
							DATE_FORMAT(tanggal_verifikasi, '%d %M %Y') as TANGGAL
						FROM 
						tb_kontribusi 
						WHERE 
						unique_identifier='".$param['unique_id']."'");
		$getTgl = $this->db->query("SELECT 
						tanggal_verifikasi
					FROM 
					tb_kontribusi 
					WHERE 
					unique_identifier='".$param['unique_id']."'")->row();
		
		$arr['data']['file_list'] = $getFile->result();
		
		$getData = $this->db->query(
			"SELECT * FROM tb_kontribusi WHERE unique_identifier='".$param['unique_id']."'");
		$arr['data']['data_list'] = $getData->result();
		$arr['data']['tanggal_verifikasi'] = $getTgl->tanggal_verifikasi;
		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "DATA FOUND";

		echo setJson($arr);

	}

	public function save_bukti_setor(){
		$arr = [];
		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "DONE";
		$param = $this->input->post(NULL, TRUE);

		$this->db->trans_start();
		$this->db->query("DELETE FROM tb_detail_kontribusi WHERE id_kontribusi IN(".$param['list_id'].")");
		$identifier = $this->getRandIdentifier();
		$countFile = count($_FILES['files']['name']);
		for($i = 0; $i < $countFile; $i++){
			$_FILES['file']['name'] = $_FILES['files']['name'][$i];
			$_FILES['file']['type'] = $_FILES['files']['type'][$i];
			$_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
			$_FILES['file']['error'] = $_FILES['files']['error'][$i];
			$_FILES['file']['size'] = $_FILES['files']['size'][$i];

			$config['upload_path'] = './assets/upload/bukti_setor';
			$config['allowed_types'] = 'jpg|png|jpeg|pdf';
			$config['max_size'] = 0;

			$this->load->library('upload', $config);
			$this->upload->initialize($config);

			if (!$this->upload->do_upload('file')) {
				$arr['status'] = false;
				$arr['code'] = 400;
				$arr['message'] = $this->upload->display_errors();
			} else {
				$media = $this->upload->data();
				$this->db->insert('tb_bukti_setor_kontribusi', [
					'bukti_setor' => substr($config['upload_path'], 1)."/".$media['file_name'],
					'nominal' => $param['nominal'][$i],
					'tanggal_setor' => $param['tanggal_setor'][$i],
					'unique_identifier' => $identifier
				]);
			}
		}

		$obj = explode(",", $param['list_id']);
		foreach($obj as $o){
			$this->db->insert('tb_detail_kontribusi', [
				"unique_identifier" => $identifier,
				"id_kontribusi" => $o,
				"created_at" => date('Y-m-d H:i:s')
			]);
		}

		$this->db->query("UPDATE tb_kontribusi SET unique_identifier='$identifier' WHERE id IN(".$param['list_id'].")");
		$this->db->trans_complete();

		echo setJson($arr);
	}

	public function get_status_call(){
		$arr = [];

		$getData = $this->db->query("SELECT * FROM ms_status_call");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}
	public function get_follow_up(){
		$arr = [];

		$getData = $this->db->query("SELECT * FROM ms_follow_up");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function save_status_call(){
		$arr = [];

		$param = $this->input->post(NULL, TRUE);

		if($param['id'] == ""){
			$this->db->insert('ms_status_call', [
				"status_call" => $param['status_call'],
				"need_follow_up" => $param['follow_up']
			]);
		}else{
			$this->db
				->where('id', $param['id'])
				->update('ms_status_call', [
					"status_call" => $param['status_call'],
					"need_follow_up" => $param['follow_up']
				]);
		}

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);
	}

	public function delete_status_call(){
		$arr = [];

		$param = $this->input->get(NULL, TRUE);

		$this->db->where('id', $param['id'])
				->delete('ms_status_call');

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);
		
	}

	public function get_ar_list(){
		$arr = [];

		$getData = $this->db->query("SELECT id, name FROM ms_user WHERE id_role=3");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_verif_partisipasi_list(){
		$arr = [];

		$param = $this->input->get(NULL, TRUE);

		$getData = $this->db->query("SELECT
							tb_partisipasi.id,
							ms_anggota.nama_anggota,
							dana_partisipasi,
							ms_provinsi.provinsi,
							ms_kab_kota.kab_kota,
							DATE_FORMAT(
									tb_partisipasi.tanggal_setor,
									'%d %b %Y'
								) AS TGL_SETOR
						FROM
							tb_partisipasi
						INNER JOIN tb_bukti_setor_partisipasi ON tb_bukti_setor_partisipasi.id_partisipasi = tb_partisipasi.id
						INNER JOIN ms_anggota ON tb_partisipasi.nama_anggota = ms_anggota.id
						INNER JOIN ms_provinsi ON ms_provinsi.id = tb_partisipasi.id_prov
						LEFT JOIN ms_kab_kota ON ms_kab_kota.id = tb_partisipasi.id_kab
						WHERE
							MONTH (
								tb_partisipasi.tanggal_setor) = ".$param['bulan']."
						AND YEAR (tb_partisipasi.tanggal_setor) = ".$param['tahun']."
						AND ((tb_partisipasi.tanggal_verifikasi) IS NULL
						OR (tb_partisipasi.tanggal_verifikasi) = '0000-00-00')
						ORDER BY
							tb_partisipasi.tanggal_setor ASC");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_verified_partisipasi_list(){
		$arr = [];

		$param = $this->input->get(NULL, TRUE);

		$getData = $this->db->query("SELECT
							tb_partisipasi.id,
							ms_anggota.nama_anggota,
							dana_partisipasi,
							ms_provinsi.provinsi,
							ms_kab_kota.kab_kota,
							DATE_FORMAT(
									tb_partisipasi.tanggal_verifikasi,
									'%d %b %Y'
								) AS TGL_VERIF
						FROM
							tb_partisipasi
						INNER JOIN tb_bukti_setor_partisipasi ON tb_bukti_setor_partisipasi.id_partisipasi = tb_partisipasi.id
						INNER JOIN ms_anggota ON tb_partisipasi.nama_anggota = ms_anggota.id
						INNER JOIN ms_provinsi ON ms_provinsi.id = tb_partisipasi.id_prov
						LEFT JOIN ms_kab_kota ON ms_kab_kota.id = tb_partisipasi.id_kab
						WHERE
							MONTH (tb_partisipasi.tanggal_setor) = ".$param['bulan']."
						AND YEAR (tb_partisipasi.tanggal_setor) = ".$param['tahun']."
						AND ((tb_partisipasi.tanggal_verifikasi) IS NULL
						OR (tb_partisipasi.tanggal_verifikasi) != '0000-00-00')
						ORDER BY
							tb_partisipasi.tanggal_setor ASC");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}

	public function get_verif_partisipasi(){
		$arr = [];
		$arr['data'] = [];

		$param = $this->input->get(NULL, TRUE);

		$getFile = $this->db->query("SELECT 
							*, 
							tb_bukti_setor_partisipasi.id as ID_PARTISIPASI,
							DATE_FORMAT(tb_partisipasi.tanggal_setor, '%d %M %Y') as SETOR
						FROM 
						tb_partisipasi
						INNER JOIN tb_bukti_setor_partisipasi ON tb_partisipasi.id = tb_bukti_setor_partisipasi.id_partisipasi
						WHERE 
						tb_partisipasi.id='".$param['unique_id']."'");
		$arr['data']['file_list'] = $getFile->result();

		$getData = $this->db->query("SELECT
							tb_partisipasi.id,
							ms_anggota.nama_anggota,
							dana_partisipasi,
							ms_provinsi.provinsi,
							ms_kab_kota.kab_kota,
							DATE_FORMAT(
									tb_partisipasi.tanggal_setor,
									'%d %b %Y'
								) AS TGL_SETOR
						FROM
							tb_partisipasi
						INNER JOIN tb_bukti_setor_partisipasi ON tb_bukti_setor_partisipasi.id_partisipasi = tb_partisipasi.id
						INNER JOIN ms_anggota ON tb_partisipasi.nama_anggota = ms_anggota.id
						INNER JOIN ms_provinsi ON ms_provinsi.id = tb_partisipasi.id_prov
						LEFT JOIN ms_kab_kota ON ms_kab_kota.id = tb_partisipasi.id_kab
						WHERE
							tb_partisipasi.id=".$param['unique_id']."
						ORDER BY
							tb_partisipasi.tanggal_setor ASC");
		$arr['data']['detail'] = $getData->result();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "DATA FOUND";

		echo setJson($arr);
	}

	// new
	public function get_verif_partisipasi_tanggal(){
		$arr = [];
		$arr['data'] = [];

		$param = $this->input->get(NULL, TRUE);

		$getFile = $this->db->query("SELECT 
							*, 
							DATE_FORMAT(tanggal_verifikasi, '%d %M %Y') as TANGGAL
						FROM 
						tb_partisipasi 
						WHERE 
						id='".$param['unique_id']."'");
		$getTgl = $this->db->query("SELECT 
						tanggal_verifikasi
					FROM 
					tb_partisipasi 
					WHERE 
					id='".$param['unique_id']."'")->row();
		
		$arr['data']['file_list'] = $getFile->result();
		
		$getData = $this->db->query(
			"SELECT * FROM tb_partisipasi WHERE id='".$param['unique_id']."'");
		$arr['data']['data_list'] = $getData->result();
		$arr['data']['tanggal_verifikasi'] = $getTgl->tanggal_verifikasi;
		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "DATA FOUND";

		echo setJson($arr);

	}

	public function save_verifikasi_partisipasi(){
		$arr = [];
		$this->db->trans_start();
		$id = $this->input->post('id');
		$unique_id = $this->input->post('unique_id');
		$tanggal_verifikasi = $this->input->post('tanggal_verifikasi');

		if(!empty($_FILES['verifikasi'])){
			$c = count($_FILES['verifikasi']['name']);

			for ($i=0; $i < $c ; $i++) { 
				$_FILES['file']['name'] = $_FILES['verifikasi']['name'][$i];
				$_FILES['file']['type'] = $_FILES['verifikasi']['type'][$i];
				$_FILES['file']['tmp_name'] = $_FILES['verifikasi']['tmp_name'][$i];
				$_FILES['file']['error'] = $_FILES['verifikasi']['error'][$i];
				$_FILES['file']['size'] = $_FILES['verifikasi']['size'][$i];

				$config['upload_path'] = './assets/upload/partisipasi';
				$config['allowed_types'] = 'jpg|png|jpeg|pdf';
				$config['max_size'] = 0;

				$this->load->library('upload', $config);
				$this->upload->initialize($config);

				if (!$this->upload->do_upload('file')) {
					$arr['status'] = false;
					$arr['code'] = 400;
					$arr['message'] = $this->upload->display_errors();
				} else {
					$media = $this->upload->data();
					$filename = substr($config['upload_path'], 1)."/".$media['file_name'];
					$this->db->where('id', $id[$i])
							->update('tb_bukti_setor_partisipasi', [
								"verifikasi" => $filename,
								"tanggal_verifikasi" => $tanggal_verifikasi
							]);
				}
			}
		}

		$this->db->where('id', $unique_id)
				->update('tb_partisipasi', [
					"tanggal_verifikasi" => $tanggal_verifikasi,
					"status" => 2
				]);

		$this->db->trans_complete();

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "SUCCESS";

		echo setJson($arr);
	}

	public function get_anggota(){
		$arr = [];

		$param = $this->input->get(NULL, TRUE);

		if($param['kabupaten'] != ""){
			$where = "WHERE id_kab=".$param['kabupaten'];
		}else{
			$where = "WHERE id_prov=".$param['provinsi'];
		}

		$getData = $this->db->query("SELECT * FROM ms_anggota $where");

		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['message'] = "FOUND";
		$arr['data'] = $getData->result();

		echo setJson($arr);
	}
}

?>