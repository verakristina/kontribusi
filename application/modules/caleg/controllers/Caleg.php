<?php 

class Caleg extends CI_Controller{

	function __Construct(){
		parent::__Construct();
	}

	public function index(){
		
	}

	public function data_proses(){
		$arr = [];
		$type = $this->input->post('type');
		$nama_calon = $this->input->post('nama_calon');
		$id_dapil = $this->input->post('id_dapil');
		$id_pemilihan = $this->input->post('id_pemilihan');
		$id_partai = $this->input->post('id_partai');

		$cek = $this->db->query("SELECT * FROM tb_calon_list WHERE id_dapil=$id_dapil AND nama_calon='".$this->db->escape_str($nama_calon)."'");

		if($cek->num_rows() == 1){
			$arr['status'] = "exist";
		}else{

			if($type == "add"){
				$insert = $this->db->insert('tb_calon_list', [
											"id_pemilihan" => $id_pemilihan,
											"id_dapil" => $id_dapil,
											"id_partai" => $id_partai,
											"nama_calon" => $this->db->escape_str($nama_calon)
										]);
			}else{
				$id = $this->input->post('id');
				$update = $this->db->where('id', $id)
										->update('tb_calon_list', [
											"nama_calon" => $this->db->escape_str($nama_calon)
										]);
			}

			if($this->db->affected_rows() > 0){
				$arr['status'] = "success";
			}else{
				$arr['status'] = "failed";
			}
		}

		echo setJson($arr);

	}

	public function deleteData(){
		$arr = [];
		$id = $this->input->post('id');

		$delete = $this->db->where('id', $id)
							->delete('tb_calon_list');

		if($this->db->affected_rows() > 0){
			$arr['status'] = "success";
		}else{
			$arr['status'] = "failed";
		}

		echo setJson($arr);
	}


	public function getVotes(){
		$arr = [];
		$arr['status'] = "success";
		$arr['data'] = [];
		$arr['data']['total_votes'] = 0;
		$arr['data']['voteList'] = [];

		$data = array();
		$id_pemilihan = $this->input->get('id_pemilihan');
		$id_dapil = $this->input->get('id_dapil');
		$id_partai = $this->input->get('id_partai');

		$getWilayah = $this->db->query("SELECT * FROM detail_dapil WHERE id_dapil=$id_dapil");
		$getCaleg = $this->db->query("SELECT * FROM tb_calon_list WHERE id_dapil=$id_dapil AND id_partai=$id_partai");
		if($getCaleg->num_rows() > 0){
			$arr['data']['kotaList'] = $getWilayah->result();

			$arrWil = [];
			foreach($getWilayah->result() as $wil){
				array_push($arrWil, [
					"id_wilayah" => $wil->id,
					"votes" => 0
				]);
			}

			foreach($getCaleg->result() as $caleg){
				array_push($data, [
					"id_caleg" => $caleg->id,
					"id_pemilihan" => $caleg->id_pemilihan,
					"id_dapil" => $caleg->id_dapil,
					"id_partai" => $caleg->id_partai,
					"nama_calon" => $caleg->nama_calon,
					"votes" => $arrWil
				]);
			}

			$getTotalVote = $this->db->query("SELECT * FROM tb_party_votes WHERE id_pemilihan=$id_pemilihan AND id_dapil=$id_dapil AND id_partai=$id_partai")->row();

			if(@$getTotalVote->total_suara == null){
				$arr['data']['total_votes'] = 0;
			}else{
				$arr['data']['total_votes'] = $getTotalVote->total_suara;
			}

			$getSuaraCaleg = $this->db->query("SELECT 
												* 
											FROM 
												tb_votes 
											WHERE 
												id_pemilihan=$id_pemilihan 
											AND id_dapil=$id_dapil
											AND id_caleg IN(SELECT id FROM tb_calon_list WHERE id_dapil=$id_dapil AND id_partai=$id_partai)");
			$sumCaleg = $this->db->query("SELECT 
												SUM(suara) as total_suara_caleg
											FROM 
												tb_votes 
											WHERE 
												id_pemilihan=$id_pemilihan 
											AND id_dapil=$id_dapil
											AND id_caleg IN(SELECT id FROM tb_calon_list WHERE id_dapil=$id_dapil AND id_partai=$id_partai)")->row();
			/*echo "<pre>".json_encode($getSuaraCaleg->result(), JSON_PRETTY_PRINT)."</pre>";
			die();*/

			foreach($getSuaraCaleg->result() as $get){
				$id_caleg = $get->id_caleg;
				$id_wilayah = $get->id_wilayah;

				$searchBasic = array_search($id_caleg, array_column($data, "id_caleg"));
				if(null !== $searchBasic){
					$getVote = array_search($id_wilayah, array_column($data[$searchBasic]['votes'], "id_wilayah"));
					if(null !== $getVote){
						$data[$searchBasic]['votes'][$getVote]['votes'] = $get->suara;
					}
				}else{
					continue;
				}
			}

			$arr['data']['caleg_votes'] = $sumCaleg->total_suara_caleg;
			$arr['data']['voteList'] = $data;
		}else{

		}

		echo setJson($arr);
		//echo "<pre>".json_encode($arr, JSON_PRETTY_PRINT)."</pre>";

	}

	public function save_votes(){
		$total = $this->input->post('total_votes');
		$voteList = $this->input->post('voteList');

		foreach($voteList as $vl){
			$arr = [];
			$id_caleg = $vl['id_caleg'];
			$id_pemilihan = $vl['id_pemilihan'];
			$id_dapil = $vl['id_dapil'];
			$id_partai = $vl['id_partai'];

			$arr['id_caleg'] = $id_caleg;
			$arr['id_pemilihan'] = $id_pemilihan;
			$arr['id_dapil'] = $id_dapil;

			foreach($vl['votes'] as $v){
				$id_wilayah = $v['id_wilayah'];
				$votes = $v['votes'];
				$votes = str_replace(",", "", $votes);
				$votes = str_replace(".", "", $votes);
				$arr['id_wilayah'] = $id_wilayah;
				$arr['suara'] = $votes;

				$cek = $this->db->query("
					SELECT *
					FROM tb_votes
					WHERE 
						id_wilayah = $id_wilayah AND
						id_caleg = $id_caleg
					");

				if($cek->num_rows() == 1){
					$this->db->where('id_caleg', $id_caleg)
								->where('id_wilayah', $id_wilayah)
								->update('tb_votes', [
									"suara" => $votes
								]);
				}else{
					$this->db->insert('tb_votes', $arr);
				}
			}

			$cekTotal = $this->db->query("SELECT * FROM tb_party_votes WHERE id_pemilihan=$id_pemilihan AND id_dapil=$id_dapil AND id_partai = $id_partai");
			if($cekTotal->num_rows() == 1){
				$this->db->where('id_pemilihan', $id_pemilihan)
						->where('id_dapil', $id_dapil)
						->where('id_partai', $id_partai)
						->update('tb_party_votes', [
							"total_suara" => $total
						]);
			}else{
				$this->db->insert('tb_party_votes', [
							"id_pemilihan" => $id_pemilihan,
							"id_dapil" => $id_dapil,
							"id_partai" => $id_partai,
							"total_suara" => $total
						]);
			}
		}
	}

}

 ?>