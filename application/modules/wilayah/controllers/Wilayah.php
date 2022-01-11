<?php 

class Wilayah extends CI_Controller{

	public function data_proses(){
		$arr = [];
		$type = $this->input->post('type');
		$nama_daerah = $this->input->post('nama_daerah');
		$id_dapil = $this->input->post('id_dapil');

		$cek = $this->db->query("SELECT * FROM detail_dapil WHERE id_dapil=$id_dapil AND nama_daerah='$nama_daerah'");

		if($cek->num_rows() == 1){
			$arr['status'] = "exist";
		}else{
			if($type == "add"){
				$insert = $this->db->insert('detail_dapil', [
											"id_dapil" => $id_dapil,
											"nama_daerah" => $nama_daerah
										]);
			}else{
				$id = $this->input->post('id');

				$update = $this->db->where('id', $id)
									->update('detail_dapil', [
											"nama_daerah" => $nama_daerah
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
							->delete('detail_dapil');

		if($this->db->affected_rows() > 0){
			$arr['status'] = "success";
		}else{
			$arr['status'] = "failed";
		}

		echo setJson($arr);

	}

}

 ?>