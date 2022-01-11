<?php 

class Dapil extends CI_Controller{

	public function data_proses(){
		$arr = [];
		$nama_dapil = $this->input->post('dapil');
		$id_pemilihan = $this->input->post('id_pemilihan');
		$type = $this->input->post('type');

		$cek = $this->db->query("SELECT * FROM m_dapil WHERE nama_dapil='$nama_dapil' AND id_pemilihan=$id_pemilihan");

		if($cek->num_rows() == 1){
			$arr['status'] = "exist";
		}else{
			if($type == "add"){
				$data = [
					"id_pemilihan" => $id_pemilihan,
					"nama_dapil" => $nama_dapil
				];

				if($id_pemilihan == 2){
					$id_prov = $this->input->post('id_prov');
					$data['id_prov'] = $id_prov;
				}else if($id_pemilihan == 3){
					$id_prov = $this->input->post('id_prov');
					$id_kab = $this->input->post('id_kab');
					$data['id_prov'] = $id_prov;
					$data['id_kota'] = $id_kab;
				}else if($id_pemilihan == 1){

				}else{

				}
				$insert = $this->db->insert('m_dapil', $data);
			}else{
				$id = $this->input->post('id');
				$update = $this->db->where('id', $id)
							->update('m_dapil', [
										"nama_dapil" => $nama_dapil
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
							->delete('m_dapil');

		if($this->db->affected_rows() > 0){
			$arr['status'] = "success";
		}else{
			$arr['status'] = "failed";
		}

		echo setJson($arr);

	}

}

 ?>