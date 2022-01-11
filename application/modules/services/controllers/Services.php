<?php

use PhpOffice\PhpSpreadsheet\Shared\Date;

class Services extends CI_Controller{

    public function getsingledewan(){
		$arr = [];

		$id_user = $this->input->get('id_anggota');

		$cek = $this->db->query("SELECT id, username, id_role FROM ms_user WHERE id = $id_user");


		$arr['status'] = true;
		$arr['code'] = 200;
		$arr['data']['username'] = $cek->result();

		echo setJson($arr);

	}
    public function get_dewan(){

        $arr = [];

        $param = $this->input->get(NULL, TRUE);

        if(array_key_exists("kabupaten", $param) && $param['kabupaten'] != ""){
            $where = "WHERE ms_anggota.id_prov=".$param['provinsi']." AND ms_anggota.id_kab=".$param['kabupaten'];
        }else if(array_key_exists("provinsi", $param) && $param['provinsi'] != ""){
            $where = "WHERE ms_anggota.id_prov=".$param['provinsi'];
        }else if(array_key_exists("id_anggota", $param) && $param['id_anggota'] != ""){
            $where = "WHERE ms_anggota.id=".$param['id_anggota'];
        }else{
            $where = "";
        }

        $getData = $this->db->query("SELECT
                    ms_anggota.*,
                    ms_provinsi.provinsi,
                    ms_kab_kota.kab_kota,
                    IF(ms_anggota.id_kab IS NULL, 'DPRD Prov.', 'DPRD Kab. / Kota') as TINGKATAN
                    -- IF(ms_anggota.id_kab IS NULL, ms_provinsi.provinsi, ms_kab_kota.kab_kota) as DAERAH
                FROM ms_anggota
                INNER JOIN ms_provinsi ON ms_anggota.id_prov = ms_provinsi.id
                LEFT JOIN ms_kab_kota ON ms_anggota.id_kab = ms_kab_kota.id
                $where");
        
        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "FOUND";
        $arr['data'] = $getData->result();

        echo setJson($arr);
    }

    public function edit_anggota(){
        $arr = [];

        $param = $this->input->post(NULL, TRUE);
        unset($param['TINGKATAN']);
        unset($param['DAERAH']);
        $arr_edit = [
			"nama_anggota" => $param['nama_anggota'],
			"jabatan" => $param['jabatan'],
			"no_telp" => $param['no_telp'],
			"email" => $param['email'],
			"thp" => $param['thp']
		];
        

        $this->db->where('id', $param['id'])
                ->update('ms_anggota', $arr_edit);

        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "DONE";
        
        echo setJson($arr);
    }

    public function get_list_call(){
        $arr = [];
        $arr['data'] = [];

        $date = date('Y-m-d');
        $month = date('m');

        if($this->session->userdata('sess_role_id')){
            $id_ar = $this->session->userdata('sess_user_id');

            $getNotCalled = $this->db->query("SELECT
                                            tb_daily_call.*,                                           
                                        ms_anggota.nama_anggota,
                                        ms_status_call.status_call, 
                                        ms_status_call.need_follow_up,                                  
                                        ( 
                                            SELECT ms_anggota.nama_anggota FROM ms_anggota INNER JOIN tb_daily_call ON ms_anggota.id = tb_daily_call.id WHERE tb_daily_call.id_anggota=ms_anggota.nama_anggota
                                            
                                        ) AS NAMA_ANGGOTA,
                                        (
                                            SELECT 
                                                ms_provinsi.provinsi
                                            FROM
                                            ms_anggota
                                            INNER JOIN ms_provinsi ON ms_anggota.id_prov = ms_provinsi.id
                                            WHERE id_anggota=tb_daily_call.id_anggota
                                            GROUP BY tb_daily_call.id_anggota
                                        ) AS PROVINSI,
                                        (
                                            SELECT 
                                                ms_kab_kota.kab_kota
                                            FROM
                                            ms_anggota
                                            INNER JOIN ms_kab_kota ON ms_anggota.id_kab = ms_kab_kota.id
                                            WHERE id_anggota=tb_daily_call.id_anggota
                                            GROUP BY tb_daily_call.id_anggota                    
                                        ) AS KOTA
                                        FROM
                                            tb_daily_call 
                                        INNER JOIN ms_anggota ON tb_daily_call.id_anggota = ms_anggota.id
                                        INNER JOIN ms_status_call ON tb_daily_call.status_call = ms_status_call.id
                                        WHERE tb_daily_call.id
                                        -- AND tb_daily_call.follow_up_on = '$date'
                                            ");
            $getCalled = $this->db->query("SELECT
                                        tb_daily_call.*,                                           
                                        ms_anggota.nama_anggota,
                                        ms_status_call.status_call, 
                                        ms_status_call.need_follow_up,
                                        ms_provinsi.provinsi,
                                        ms_kab_kota.kab_kota
                                        -- ms_kab_kota.kab_kota
                                        FROM
                                            tb_daily_call 
                                        INNER JOIN ms_anggota ON tb_daily_call.id_anggota = ms_anggota.id
                                        INNER JOIN ms_status_call ON tb_daily_call.status_call = ms_status_call.id
                                        INNER JOIN ms_provinsi ON ms_anggota.id_prov = ms_provinsi.id                                        
			                            LEFT JOIN ms_kab_kota ON ms_anggota.id_kab = ms_kab_kota.id
                                        WHERE tb_daily_call.id 
                                        ORDER BY tb_daily_call.id_anggota DESC");
            $follow_up_today = $this->db->query("SELECT
                                        ms_anggota.id,
                                        ms_anggota.nama_anggota,
                                        tb_daily_call.note,
                                    ms_status_call.status_call,
                                    IF (
                                        ms_anggota.id_kab IS NULL,
                                        CONCAT(
                                            'DPRD Prov.',
                                            ' ',
                                            ms_provinsi.provinsi
                                        ),
                                        CONCAT(
                                            'DPRD',
                                            ' ',
                                            ms_kab_kota.kab_kota
                                        )
                                    ) AS DAERAH,
                                    ms_status_call.need_follow_up,
                                    ms_status_call.status_call,
                                    DATE_FORMAT(tb_daily_call.follow_up_on, '%d %b %Y') as FOLLOW_UP_DATE,
                                    tb_daily_call.note AS NOTED,
                                    tb_daily_call.id as CALL_ID
                                    FROM
                                        ms_anggota
                                    INNER JOIN ms_provinsi ON ms_anggota.id_prov = ms_provinsi.id
                                    LEFT JOIN ms_kab_kota ON ms_anggota.id_kab = ms_kab_kota.id
                                    INNER JOIN tb_mapping_prov_ar ON ms_anggota.id_prov = tb_mapping_prov_ar.id_prov
                                    LEFT JOIN tb_daily_call ON ms_anggota.id = tb_daily_call.id_anggota
                                    INNER JOIN ms_status_call ON tb_daily_call.status_call = ms_status_call.id
                                    AND MONTH (created_at) = $month
                                    LEFT JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota
                                        WHERE
                                            tb_mapping_prov_ar.id_user = $id_ar
                                        AND tb_daily_call.follow_up_on = '$date'
                                        AND tb_daily_call.is_done = 0
                                        GROUP BY ms_anggota.id
                                        ORDER BY tb_kontribusi.dpp DESC");
            
            $arr['data']['called'] = $getCalled->result();
            $arr['data']['not_called'] = $getNotCalled->result();
            $arr['data']['follow_up'] = $follow_up_today->result();

            $arr['data']['count'] = [];
            $arr['data']['count']['called'] = $getCalled->num_rows();
            $arr['data']['count']['not_called'] = $getNotCalled->num_rows();
            $arr['data']['count']['follow_up'] = $follow_up_today->num_rows();
        }

        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "FOUND";

        echo setJson($arr);
    }

    public function get_detail_bayar_dewan(){
        $arr = [];
        $arr['data'] = [];
        $year = date('Y');
        $month = date('m');

        $id_anggota = $this->input->get('id_anggota');

        //KONTRIBUSI
        $getKontribusiDone = $this->db->query("SELECT
                                ms_bulan.bulan
                            FROM
                                tb_kontribusi
                            INNER JOIN ms_bulan ON tb_kontribusi.id_bulan = ms_bulan.id
                            WHERE nama_anggota=$id_anggota");
        $getKontribusiNot = $this->db->query("SELECT
                                ms_bulan.bulan
                            FROM
                                ms_bulan
                            WHERE
                                id NOT IN(SELECT id_bulan FROM tb_kontribusi WHERE nama_anggota=$id_anggota)");

        $besar_setoran = $this->db->query("SELECT thp, dpp, dpd, dpc FROM tb_kontribusi WHERE nama_anggota=$id_anggota");
        $arr['data']['kontribusi'] = [];
        $arr['data']['kontribusi']['count'] = [];
        $arr['data']['kontribusi']['count']['paid'] = $getKontribusiDone->num_rows();
        $arr['data']['kontribusi']['count']['not_paid'] = $getKontribusiNot->num_rows();

        $arr['data']['kontribusi']['detail'] = [];
        $arr['data']['kontribusi']['detail']['paid'] = $getKontribusiDone->result();
        $arr['data']['kontribusi']['detail']['not_paid'] = $getKontribusiNot->result();

        $arr['data']['kontribusi']['besar_setoran'] = $besar_setoran->row();
        
        //PARTISIPASI
        $check = $this->db->query("SELECT * FROM ms_anggota WHERE id=$id_anggota")->row();
        if($check->id_kab == null){
            $total_danpar = $this->db->query("SELECT dprd_prov as TARGET FROM tb_parameter_dana WHERE tahun='$year'");
        }else{
            $total_danpar = $this->db->query("SELECT dprd_kab_kota as TARGET FROM tb_parameter_dana WHERE tahun='$year'");
        }

        $getPartisipasi = $this->db->query("SELECT SUM(dana_partisipasi) as TOTAL_BAYAR FROM tb_partisipasi WHERE nama_anggota=$id_anggota AND tahun='$year'");

        $target = $total_danpar->row()->TARGET;
        $total_bayar = $getPartisipasi->row()->TOTAL_BAYAR;
        $kurang = $target-$total_bayar;

        $arr['data']['partisipasi'] = [];
        $arr['data']['partisipasi']['target'] = $target;
        $arr['data']['partisipasi']['terbayar'] = $total_bayar;
        $arr['data']['partisipasi']['kurang'] = $kurang;

        $date = date('Y-m-d');
        $arr['data']['date_next'] = date('Y-m-d', strtotime($date." +1 day"));

        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "FOUND";

        echo setJson($arr);

    }

    public function save_daily_call(){
        $arr = [];

        $param = $this->input->post(NULL, TRUE);
        $param['created_at'] = date('Y-m-d H:i:s');
        unset($param['provinsi']);
        unset($param['kabupaten']);
        $this->db->insert('tb_daily_call', $param);

        if(array_key_exists("call_id", $param)){
            $this->db->where('id', $param['call_id'])
                    ->update('tb_daily_call', [
                        'is_done' => 1
                    ]);
        }
        
        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "SUCCESS";

        echo setJson($arr);
    }

    public function dashboard_data(){
        $arr = [];
        
        $date= date('Y');
        $year =(null !== $this->input->get('tahun'))?$this->input->get('tahun'):$date;
        
        $danaKontribusi = $this->db->query("SELECT
                            SUM(dpp) AS DPP,
                            SUM(dpd) AS DPD,
                            SUM(dpc) AS DPC,
                            SUM(dpp + dpd + dpc) AS TOTAL
                        FROM   
                            tb_kontribusi
                        WHERE
                            tahun=$year");

        $danaPartisipasi = $this->db->query("SELECT
                            SUM(dana_partisipasi) AS TOTAL
                        FROM
                            tb_partisipasi
                        WHERE
                            tahun=$year");
        
        $kontribusi_ten = $this->db->query("SELECT
                            ms_provinsi.provinsi as PROVINSI,
                            (SELECT SUM(dpp+dpd+dpc) FROM tb_kontribusi WHERE tahun=$year AND id_prov=ms_provinsi.id) as TOTAL
                        FROM
                            `tb_kontribusi`
                        RIGHT JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
                        GROUP BY tb_kontribusi.id_prov
                        ORDER BY TOTAL DESC
                        LIMIT 0, 10");
        
        $partisipasi_ten = $this->db->query("SELECT
                            ms_provinsi.provinsi AS PROVINSI,
                            (
                                SELECT
                                    SUM(dana_partisipasi)
                                FROM
                                    tb_partisipasi
                                WHERE
                                    tahun = $year
                                AND id_prov = ms_provinsi.id
                            ) AS TOTAL
                        FROM
                            `tb_partisipasi`
                        RIGHT JOIN ms_provinsi ON tb_partisipasi.id_prov = ms_provinsi.id
                        GROUP BY
                            tb_partisipasi.id_prov
                        ORDER BY
                            TOTAL DESC
                        LIMIT 0,
                        10");
        
        $persen_kontribusi = $this->db->query("SELECT
                            ms_provinsi.provinsi,
                            ms_provinsi.singkatan,
                            (
                                SELECT
                                    COUNT(*)
                                FROM
                                    tb_kontribusi
                                WHERE
                                    id_prov = ms_provinsi.id
                                AND tahun = $year
                                AND id_kab IS NULL
                            ) AS TRX_PROV,
                            (
                                SELECT
                                    COUNT(*) * 12
                                FROM
                                    ms_anggota
                                WHERE
                                    id_prov = ms_provinsi.id
                                AND id_kab IS NULL
                            ) AS ETA_TRX_PROV,
                            (
                                SELECT
                                    COUNT(*)
                                FROM
                                    tb_kontribusi
                                WHERE
                                    id_prov = ms_provinsi.id
                                AND tahun = $year
                                AND id_kab IS NOT NULL
                            ) AS TRX_KOTA,
                            (
                                SELECT
                                    COUNT(*) * 12
                                FROM
                                    ms_anggota
                                WHERE
                                    id_prov = ms_provinsi.id
                                AND id_kab IS NOT NULL
                            ) AS ETA_TRX_KOTA,
                            (
                                (
                                    SELECT
                                        COUNT(*)
                                    FROM
                                        tb_kontribusi
                                    WHERE
                                        id_prov = ms_provinsi.id
                                    AND tahun = $year
                                    AND id_kab IS NULL
                                ) / (
                                    SELECT
                                        COUNT(*) * 12
                                    FROM
                                        ms_anggota
                                    WHERE
                                        id_prov = ms_provinsi.id
                                    AND id_kab IS NULL
                                )
                            ) * 100 AS PERSEN_PROV,
                            (
                                (
                                    SELECT
                                        COUNT(*)
                                    FROM
                                        tb_kontribusi
                                    WHERE
                                        id_prov = ms_provinsi.id
                                    AND tahun = $year
                                    AND id_kab IS NOT NULL
                                ) / (
                                    SELECT
                                        COUNT(*) * 12
                                    FROM
                                        ms_anggota
                                    WHERE
                                        id_prov = ms_provinsi.id
                                    AND id_kab IS NOT NULL
                                )
                            ) * 100 AS PERSEN_KOTA,
                            (
                                SELECT
                                    COUNT(*)
                                FROM
                                    ms_anggota
                                WHERE
                                    id_prov = ms_provinsi.id
                                AND id_kab IS NULL
                            ) as ANGGOTA_PROV,
                        (
                                SELECT
                                    COUNT(*)
                                FROM
                                    ms_anggota
                                WHERE
                                    id_prov = ms_provinsi.id
                                AND id_kab IS NOT NULL
                            ) as ANGGOTA_KOTA
                        FROM
                            ms_provinsi
                        ORDER BY
                            (PERSEN_PROV + PERSEN_KOTA) DESC
                        LIMIT 0,
                        10");
            
    $persen_partisipasi = $this->db->query("SELECT
                        ms_provinsi.provinsi,
                        ms_provinsi.singkatan,
                        (
                    
                            IF (
                                (
                                    SELECT
                                        SUM(dana_partisipasi)
                                    FROM
                                        tb_partisipasi
                                    WHERE
                                        id_prov = ms_provinsi.id
                                    AND tahun = $year
                                    AND id_kab IS NULL
                                ) IS NULL,
                                0,
                                (
                                    SELECT
                                        SUM(dana_partisipasi)
                                    FROM
                                        tb_partisipasi
                                    WHERE
                                        id_prov = ms_provinsi.id
                                    AND tahun = $year
                                    AND id_kab IS NULL
                                ) / (
                                    (
                                        SELECT
                                            dprd_prov
                                        FROM
                                            tb_parameter_dana
                                        WHERE
                                            tahun = $year
                                    ) * (
                                        SELECT
                                            COUNT(*)
                                        FROM
                                            ms_anggota
                                        WHERE
                                            id_prov = ms_provinsi.id
                                        AND id_kab IS NULL
                                    )
                                )
                            ) * 100
                        ) AS PERSEN_PROV,
                    
                    IF (
                        (
                            SELECT
                                SUM(dana_partisipasi)
                            FROM
                                tb_partisipasi
                            WHERE
                                id_prov = ms_provinsi.id
                            AND tahun = $year
                            AND id_kab IS NOT NULL
                        ) IS NULL,
                        0,
                        (
                            (
                                SELECT
                                    SUM(dana_partisipasi)
                                FROM
                                    tb_partisipasi
                                WHERE
                                    id_prov = ms_provinsi.id
                                AND tahun = $year
                                AND id_kab IS NOT NULL
                            ) / (
                                (
                                    SELECT
                                        dprd_kab_kota
                                    FROM
                                        tb_parameter_dana
                                    WHERE
                                        tahun = $year
                                ) * (
                                    SELECT
                                        COUNT(*)
                                    FROM
                                        ms_anggota
                                    WHERE
                                        id_prov = ms_provinsi.id
                                    AND id_kab IS NOT NULL
                                )
                            )
                        ) * 100
                    ) AS PERSEN_KOTA,
                    (
                        SELECT
                            COUNT(*)
                        FROM
                            ms_anggota
                        WHERE
                            id_prov = ms_provinsi.id
                        AND id_kab IS NULL
                    ) JML_ANGGOTA_PROV,
                    (
                        SELECT
                            COUNT(*)
                        FROM
                            ms_anggota
                        WHERE
                            id_prov = ms_provinsi.id
                        AND id_kab IS NOT NULL
                    ) JML_ANGGOTA_KOTA
                    FROM
                        ms_provinsi
                    ORDER BY
                        (PERSEN_PROV + PERSEN_KOTA) DESC
                    LIMIT 0, 10");
        
        $arr['data'] = [];
        $arr['data']['kontribusi'] = $danaKontribusi->result();
        $arr['data']['partisipasi'] = $danaPartisipasi->result();

        $arr['data']['top_ten'] = [];
        $arr['data']['top_ten']['kontribusi'] = $kontribusi_ten->result();
        $arr['data']['top_ten']['partisipasi'] = $partisipasi_ten->result();

        $arr['data']['persen'] = [];
        $arr['data']['persen']['kontribusi'] = $persen_kontribusi->result();
        $arr['data']['persen']['partisipasi'] = $persen_partisipasi->result();

        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "FOUND";

        echo setJson($arr);
    }

    public function get_detail_last_call(){
        $arr = [];

        $call_id = $this->input->get('call_id');
        $last_call_info = $this->db->query("SELECT
                                        ms_anggota.id,
                                        ms_anggota.nama_anggota,
                                    IF (
                                        ms_anggota.id_kab IS NULL,
                                        CONCAT(
                                            'DPRD Prov.',
                                            ' ',
                                            ms_provinsi.provinsi
                                        ),
                                        CONCAT(
                                            'DPRD',
                                            ' ',
                                            ms_kab_kota.kab_kota
                                        )
                                    ) AS DAERAH,
                                    ms_status_call.need_follow_up,
                                    ms_status_call.status_call,
                                    DATE_FORMAT(tb_daily_call.follow_up_on, '%d %b %Y') as FOLLOW_UP_DATE,
                                    DATE_FORMAT(tb_daily_call.created_at, '%d %b %Y %H:%i:%s') as CALL_DATE,
                                    tb_daily_call.note,
                                    tb_daily_call.id as CALL_ID
                                    FROM
                                        ms_anggota
                                    INNER JOIN ms_provinsi ON ms_anggota.id_prov = ms_provinsi.id
                                    LEFT JOIN ms_kab_kota ON ms_anggota.id_kab = ms_kab_kota.id
                                    INNER JOIN tb_mapping_prov_ar ON ms_anggota.id_prov = tb_mapping_prov_ar.id_prov
                                    LEFT JOIN tb_daily_call ON ms_anggota.id = tb_daily_call.id_anggota
                                    INNER JOIN ms_status_call ON tb_daily_call.status_call = ms_status_call.id
                                    LEFT JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota
                                        WHERE
                                        tb_daily_call.id = $call_id
                                        GROUP BY ms_anggota.id
                                        ORDER BY tb_kontribusi.dpp DESC");
            
            $arr['status'] = true;
            $arr['code'] = 200;
            $arr['message'] = "FOUND";
            $arr['data'] = $last_call_info->result();

            echo setJson($arr);
    }

    public function get_called_by_date($month, $date, $id_ar = null){

        if($id_ar == null){
            $where = "WHERE
                tb_daily_call.id IS NOT NULL
                AND DATE(tb_daily_call.created_at)='$date'";
        }else{
            $where = "WHERE
                    tb_mapping_prov_ar.id_user = $id_ar
                AND tb_daily_call.id IS NOT NULL
                AND DATE(tb_daily_call.created_at)='$date'";
        }

        $getData = $this->db->query("SELECT
                        ms_anggota.id,
                        ms_anggota.nama_anggota,
                    IF (
                        ms_anggota.id_kab IS NULL,
                        CONCAT(
                            'DPRD Prov.',
                            ' ',
                            ms_provinsi.provinsi
                        ),
                        CONCAT(
                            'DPRD',
                            ' ',
                            ms_kab_kota.kab_kota
                        )
                    ) AS DAERAH,
                    ms_status_call.need_follow_up,
                    ms_status_call.status_call,
                    DATE_FORMAT(tb_daily_call.follow_up_on, '%d %b %Y') as FOLLOW_UP_DATE,
                    tb_daily_call.note
                    FROM
                        ms_anggota
                    INNER JOIN ms_provinsi ON ms_anggota.id_prov = ms_provinsi.id
                    LEFT JOIN ms_kab_kota ON ms_anggota.id_kab = ms_kab_kota.id
                    INNER JOIN tb_mapping_prov_ar ON ms_anggota.id_prov = tb_mapping_prov_ar.id_prov
                    LEFT JOIN tb_daily_call ON ms_anggota.id = tb_daily_call.id_anggota
                    INNER JOIN ms_status_call ON tb_daily_call.status_call = ms_status_call.id
                    AND MONTH (created_at) = $month
                    LEFT JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota
                    $where
                    GROUP BY
                        tb_daily_call.id
                    ORDER BY
                        tb_kontribusi.dpp DESC");
        return $getData;
    }

    public function get_parameter_dana(){
        $arr = [];
        
        $getData = $this->db->query("SELECT *
        -- DATE_FORMAT(tb_parameter_dana.tanggal_setor, '%d %b %Y') as TGL_SETOR,
        -- DATE_FORMAT(tb_parameter_dana.sampai_tanggal, '%d %b %Y') as SAMPAI_TGL
        FROM tb_parameter_dana ORDER BY tanggal_setor");

        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "FOUND";
        $arr['data'] = $getData->result();

        echo setJson($arr);
    }

    public function save_param_dana(){
        $arr = [];

        $param = $this->input->post(NULL, TRUE);
        
		$tanggal_setor = $this->input->post('tanggal_setor');

        if($param['id'] != ""){
            $id = $param['id'];
            unset($param['id']);

            $this->db->where('id', $id)
                    ->update('tb_parameter_dana', $param);
        }else{
            unset($param['id']);

            $cek = $this->db->query("SELECT id FROM tb_parameter_dana WHERE tahun=".$param['tahun']);
            if($cek->num_rows() == 1){
                $this->db->where('tahun', $param['tahun'])
                    ->update('tb_parameter_dana', $param);
            }else{
                $this->db->insert('tb_parameter_dana', $param,[
                    "tanggal_setor" => $tanggal_setor
                ]);
            }
        }

        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "SUCCESS";

        echo setJson($arr);
    }

    public function not_updated_list(){
        $arr = [];

        $getData = $this->db->query("SELECT
                ms_bulan.bulan,
                ms_provinsi.provinsi,
                ms_kab_kota.kab_kota,
                ms_anggota.nama_anggota,
                tb_kontribusi.dpp,
                tb_kontribusi.dpd,
                tb_kontribusi.dpc,
                tb_bukti_setor_kontribusi.tanggal_setor,
                tb_bukti_setor_kontribusi.bukti_setor,
                tb_kontribusi.unique_identifier
            FROM
                tb_kontribusi
            INNER JOIN ms_anggota ON tb_kontribusi.nama_anggota = ms_anggota.id
            INNER JOIN ms_provinsi ON ms_provinsi.id = tb_kontribusi.id_prov
            LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
            INNER JOIN ms_bulan ON tb_kontribusi.id_bulan = ms_bulan.id
            LEFT JOIN tb_bukti_setor_kontribusi ON tb_kontribusi.unique_identifier = tb_bukti_setor_kontribusi.unique_identifier
            WHERE
                nominal IS NULL
            AND bukti_setor IS NOT NULL
            AND tb_bukti_setor_kontribusi.id IS NOT NULL");
        
        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "FOUND";
        $arr['data'] = $getData->result();

        echo setJson($arr);
    }

    public function save_update_bukti_setor(){
        $arr = [];

        $param = $this->input->post(NULL, TRUE);

        $update = $this->db->where('unique_identifier', $param['unique_identifier'])
                        ->update('tb_bukti_setor_kontribusi', [
                            "tanggal_setor" => $param['tanggal_setor'],
                            "nominal" => $param['nominal']
                        ]);
        $arr['status'] = true;
        $arr['code'] = 200;
        $arr['message'] = "SUCCESS";

        echo setJson($arr);
    }
}

?>