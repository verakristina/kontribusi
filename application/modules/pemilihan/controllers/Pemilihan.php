<?php 

class Pemilihan extends CI_Controller{

	public function getData(){
		$arr = [];

		$getData = $this->db->get('m_type_pemilihan');

		$arr['status'] = "success";
		$arr['data'] = $getData->result();

		echo setJson($arr);

	}

	public function data_proses(){
		$arr = [];
		$pemilihan = $this->input->post('pemilihan');
		$type = $this->input->post('type');
		$id = $this->input->post('id');
		$lower = strtolower($pemilihan);

		$cek = $this->db->query("SELECT * FROM m_type_pemilihan WHERE tipe_pemilihan='$lower'");

		if($cek->num_rows() == 1){
			$arr['status'] = "exist";
		}else{
			if($type == "add"){
				$insert = $this->db->insert("m_type_pemilihan", [
									'tipe_pemilihan' => $pemilihan
								]);
			}else if($type == "edit"){
				$update = $this->db
								->where('id', $id)
								->update("m_type_pemilihan", [
									'tipe_pemilihan' => $pemilihan
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
						->delete('m_type_pemilihan');

		if($this->db->affected_rows() > 0){
			$arr['status'] = "success";
		}else{
			$arr['status'] = "failed";
		}

		echo setJson($arr);
	}

}

 ?>