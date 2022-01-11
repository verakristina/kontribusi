<?php

class Api_model extends CI_Model{

	public function getMenu($role_id){
		$getMenu = $this->db->query("SELECT
						ms_menu.* 
					FROM
						tb_mapping_menu
						INNER JOIN ms_menu ON tb_mapping_menu.id_menu = ms_menu.id
						WHERE tb_mapping_menu.id_role=$role_id
						ORDER BY menu_order ASC");

		return $getMenu;

	}

	public function getSubMenu($role_id){
		$getSubMenu = $this->db->query("SELECT
								ms_sub_menu.*
							FROM
								tb_mapping_sub_menu
							INNER JOIN ms_sub_menu ON tb_mapping_sub_menu.id_sub_menu = ms_sub_menu.id
							WHERE
								tb_mapping_sub_menu.id_role = $role_id
							GROUP BY
								ms_sub_menu.id
							ORDER BY sub_menu_order ASC");
		return $getSubMenu;
	}

}

?>