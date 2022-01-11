<?php

class Login extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->model('Login_model');
    }

    public function index()
    {
        if ($this->session->userdata('is_login') == true) {
            redirect('/');
        }
        $data['title_page'] = "Template Apps";
        $this->load->view('index_material');
    }

    public function proses_login()
    {
        date_default_timezone_set("Asia/Jakarta");

        $user = $this->input->post('idUser');
        $pass = $this->input->post('pin');

        $user = $this->db->where('tb_user.employee_id', $user)
            ->select('tb_user.id as id,
					tb_user.bussiness_title,
					tb_user.employee_id, tb_user.employee_name,
					tb_user.email, tb_user.name, tb_user.gender, tb_user.employee_type,
					tb_role.role_name, tb_user.department, tb_user.role,
					tb_user.supervisor, tb_user.line_manager, tb_user.is_supervisor,
					tb_user.is_line_manager,
					tb_department.department_name as department_name,
					supervisor.employee_name as supervisor_name,
					tb_user.password, tb_role.is_teknisi, tb_user.pic_path,
					line_manager.employee_name as line_manager_name')
            ->join('tb_department', 'tb_department.id = tb_user.department', 'left')
            ->join('tb_user as supervisor', 'supervisor.id = tb_user.supervisor', 'left')
            ->join('tb_user as line_manager', 'line_manager.id = tb_user.line_manager', 'left')
            ->join('tb_role', 'tb_role.id = tb_user.role', 'left')
            ->get('tb_user')->row();

        if ($user == null) {
            echo toJson($user);
            return;
        }

        if (password_verify($pass, $user->password)) {
            $this->session->set_userdata([
                'is_login' => true,
                'id_user' => $user->id,
                'employee_id' => $user->employee_id,
                'employee_name' => $user->employee_name,
                'email' => $user->email,
                'department_name' => $user->department_name,
                'supervisor_name' => $user->supervisor_name,
                'line_manager_name' => $user->line_manager_name,
                'department' => $user->department,
                'bussiness_title' => $user->bussiness_title,
                'supervisor' => $user->supervisor,
                'line_manager' => $user->line_manager,
                'employee_type' => $user->employee_type,
                'role' => $user->role,
                'pic_path' => $user->pic_path,
                'role_name' => $user->role_name,
                'gender' => $user->gender,
            ]);

            if ($this->input->get('from') != null) {
                unset($user->password);

                echo toJson([
                    'user' => $user,
                    'week' => $this->get_week(false),
                    'year' => $this->get_year(false),
                    'date' => date('d F Y'),
                ]);
            } else {
                unset($user->password);
                echo toJson($user);
            }
        } else {
            echo toJson([
                'status' => 'failed',
                'message' => 'User or Password Credential is not matched our database record',
            ]);
            return;
        }
    }

    public function get_week($json = true)
    {
        $data['current_week'] = date('W');
        $data['last_week'] = date(
            'W',
            strtotime(date('Y') . '-12-31')
        );

        $data['current_day'] = date(
            'l',
            strtotime(date('Y-m-d'))
        );

        $data['current_day_number'] = date(
            'N',
            strtotime(date('Y-m-d'))
        );

        if ($data['last_week'] == "01") {
            $data['last_week'] = date(
                'W',
                strtotime('2019-12-28')
            );
        }

        $data['remaining_week'] =
            $data['last_week'] - $data['current_week'];

        if ($json) {
            echo jsonResponse($data);
        } else {
            return $data;
        }
    }

    public function get_year($json = true)
    {
        $year = [date('Y') - 0];

        if ($json) {
            echo jsonResponse($year);
        } else {
            return $year;
        }
    }

    public function get_session()
    {
        header('Content-Type: application/json');
        echo toJson([
            'session' => $this->session->userdata(),
            'url' => base_url(),
            'year' => $this->get_year(false),
            'week' => $this->get_week(false),
        ]);
    }

    public function logout()
    {
        $this->session->sess_destroy();
        echo toJson([
            "status" => 'sukses',
        ]);
    }

    public function cek_user_data(){
        $arr = array();
        $sess_arr = array();
        $username = $this->input->post('email');
        $password = $this->input->post('password');

        $cek_auth = $this->Login_model->cek_user($username, $password);

        if($cek_auth->num_rows() == 1){

            $getAppSetup = $this->db->query("SELECT * FROM apps_setup");
            $gets = $getAppSetup->row();

            $user_row = $cek_auth->row();

            $sess_arr['sess_user_id']       = $user_row->id;
            $sess_arr['sess_name']          = $user_row->name;
            $sess_arr['sess_username']      = $user_row->username;
            $sess_arr['sess_role_id']       = $user_row->id_role;
            $sess_arr['sess_role_name']     = $user_row->role;
            $sess_arr['sess_id_country']    = $user_row->id_country_code;
            $sess_arr['sess_id_plant']      = $user_row->id_plant_code;
            $sess_arr['sess_id_sbu']        = $user_row->id_sbu;

            $sess_arr['sess_country_code']  = $gets->current_country_c;
            $sess_arr['sess_plant_code']    = $gets->current_plant_c;

            $this->session->set_userdata($sess_arr);

            $arr['status'] = "SUCCESS";
            $arr['message'] = "NO_ERROR_200";
            $arr['redirect_to'] = $user_row->link;

        }else{
            $arr['status'] = "ERROR";
            $arr['message'] = "User not found or inactivated by admin!";
            $arr['redirect_to'] = "login";
        }

        echo json_encode($arr);
    }
}
