<?php

class Login_model extends CI_Model{

	public function cek_user($username, $password){

		$getData = $this->db->query("SELECT
						ms_user.*,
						ms_role.role,
						ms_menu.link
					FROM
						`ms_user`
						INNER JOIN ms_role ON ms_user.id_role = ms_role.id 
						INNER JOIN ms_menu ON ms_role.default_landing_url = ms_menu.id
					WHERE
						username = '$username' 
						AND password = '$password'");

		return $getData;

	}
}

?>