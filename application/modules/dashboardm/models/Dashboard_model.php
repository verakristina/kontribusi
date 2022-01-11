<?php

class Dashboard_model extends CI_Model{

	public function getMenu($idAkses){
		$data = $this->db->query("
			SELECT
				ref_menu.*
			FROM
				ref_akses
			INNER JOIN ref_role_menu ON ref_akses.akses_id = ref_role_menu.`status`
			INNER JOIN ref_menu ON ref_role_menu.menu_id = ref_menu.id
			WHERE ref_akses.akses_id = $idAkses");

		return $data;
	}

}

?>