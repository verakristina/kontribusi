<?php
ob_start();
class Report extends CI_Controller{

    public function print_daily_calls_report(){
        $this->load->library('fpdf/fpdf');

        //DATA GATHERING
        $id_user = (null !== $this->input->get('id_user'))?$this->input->get('id_user'):null;
        $where = "";

        if($id_user != null){
            $where .= "WHERE tb_daily_call.created_by=".$id_user;

            $name = $this->db->query("SELECT name FROM ms_user WHERE id=$id_user")->row()->name;
        }else{
            $name = "-";
        }

        if(null !== $this->input->get('is_mass')){
            $start = $this->input->get('start');
            $end = $this->input->get('end');
            $where .= " AND DATE(tb_daily_call.created_at) BETWEEN '$start' AND '$end' ";

            $date_print = date_format(date_create($start), "d M Y")." - ".date_format(date_create($end), "d M Y");
        }else{
            $date = (null !== $this->input->get('date'))?$this->input->get('date'):null;

            $date_print = $date;

            $date = str_replace("/", "-", $date);
            $date = date_format(date_create($date), "Y-m-d");
            if($id_user != null){
                $where .= " AND DATE(tb_daily_call.created_at) = '$date' ";
            }else{
                $where .= " WHERE DATE(tb_daily_call.created_at) = '$date' ";
            }
        }

        $getCalled = $this->db->query("SELECT
                                        ms_anggota.id,
                                        ms_anggota.nama_anggota,
                                        ms_provinsi.singkatan,
                                        ms_kab_kota.kab_kota,
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
                                    LEFT JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota
                                    $where
                                    GROUP BY
                                        tb_daily_call.id
                                    ORDER BY
                                        tb_kontribusi.dpp DESC");

        $pdf = new FPDF('L', 'mm', 'A4');
        $pdf->AddPage();
        $pdf->SetAutoPageBreak(false, 2);
        $pdf->SetMargins(2, 1, 2);
        $pdf->SetFont('Arial','B',14);
        $pdf->Cell(0,0,'Collection Daily Report', 0,0,'C');
        $pdf->Ln(13);

        $pdf->SetFont('Arial','',11);
        $pdf->SetX(5);
        $pdf->Cell(0,1,"Tanggal", 0, 0);
        $pdf->SetX(25);
        $pdf->Cell(0,1," : ", 0, 0);
        $pdf->SetX(30);
        $pdf->Cell(0,1,$date_print, 0, 0);
        $pdf->Ln(5);

        $pdf->SetX(5);
        $pdf->Cell(0,1,"AR", 0, 0);
        $pdf->SetX(25);
        $pdf->Cell(0,1," : ", 0, 0);
        $pdf->SetX(30);
        $pdf->Cell(0,1,$name, 0, 0);
        $pdf->Ln(8);
        
        //TABLE
        $pdf->SetFillColor(253, 187, 64);
        $pdf->SetFont('Arial','B',11);
        $pdf->Cell(8, 7, "No", 1, 0, 'C', 1);
        $pdf->Cell(40, 7, "Provinsi", 1, 0, 'C', 1);
        $pdf->Cell(40, 7, "Kab. / Kota", 1, 0, 'C', 1);
        $pdf->Cell(75, 7, "Nama Dewan", 1, 0, 'C', 1);
        $pdf->Cell(45, 7, "Status Panggilan", 1, 0, 'C', 1);
        $pdf->Cell(85, 7, "Catatan", 1, 0, 'C', 1);
        $pdf->Ln();

        $a = 1;
        foreach($getCalled->result() as $get){
            $pdf->SetFont('Arial','',9);
            $pdf->Cell(8, 20, $a, 1, 0, 'L');
            $pdf->Cell(40, 20, $get->singkatan, 1, 0, 'L');
            $pdf->Cell(40, 20, $get->kab_kota, 1, 0, 'L');
            $pdf->Cell(75, 20, $get->nama_anggota, 1, 0, 'L');
            $pdf->Cell(45, 20, $get->status_call, 1, 0, 'L');
            $x = $pdf->GetX();
            $y = $pdf->GetY();
            $pdf->Rect($x, $y, 85, 20);
            $pdf->SetXY($x, $y+1);
            $pdf->MultiCell(85, 3, $get->note);
            $yn = $pdf->GetY();
            $pdf->Cell(0, 20-($yn-$y), "");
            $pdf->Ln();
            $a++;
        }
        $pdf->Output();

    }

    public function report_perbulan(){
        $arr = [];

        if($_SERVER['REQUEST_METHOD'] == "POST"){
            $param = $this->input->post(NULL, TRUE);
        }else{
            $param = $this->input->get(NULL, TRUE);
        }
        $bulan = $param['bulan'];
        $tahun = $param['tahun'];
        $where = "";
        if($param['kabupaten'] != ""){
            $where .= " AND ms_anggota.id_kab=".$param['kabupaten'];
        }else if($param['provinsi'] != ""){
            $where .= " AND ms_anggota.id_prov=".$param['provinsi'];
        }else{

        }
        
        
        $getData = $this->db->query("SELECT
                tb_kontribusi.*,
                ms_anggota.nama_anggota,
                ms_provinsi.provinsi,
                ms_kab_kota.kab_kota,
                tb_kontribusi.id_bulan,
                tb_kontribusi.tanggal_verifikasi,
                nominal,
                tb_kontribusi.tanggal_setor,
                tb_bukti_setor_kontribusi.unique_identifier AS UNI_ID,
        
                ( 
                    SELECT ms_anggota.nama_anggota FROM ms_anggota INNER JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota WHERE tb_kontribusi.unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
                    GROUP BY tb_bukti_setor_kontribusi.unique_identifier 
                ) AS NAMA_ANGGOTA,
                
                (
                    SELECT COUNT(*) FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
                ) AS JUMLAH_KONTRIBUSI,
                -- (
                --     SELECT SUM(dpp+dpd+dpc) FROM tb_kontribusi WHERE id_bulan = $bulan and tahun= $tahun and unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
                -- ) AS TOTAL_PENERIMAAN,
                (
                    SELECT SUM(dpp) FROM tb_kontribusi WHERE id_bulan = $bulan and tahun= $tahun 
                ) AS TOTAL_DPP,
                (
                    SELECT  SUM(dpd) FROM tb_kontribusi WHERE id_bulan = $bulan and tahun= $tahun 
                )AS TOTAL_DPD,
                (
                    SELECT SUM(dpc) FROM tb_kontribusi WHERE id_bulan = $bulan and tahun= $tahun
                )AS TOTAL_DPC
                

            FROM
                tb_bukti_setor_kontribusi
            INNER JOIN tb_kontribusi ON tb_bukti_setor_kontribusi.unique_identifier = tb_kontribusi.unique_identifier
            INNER JOIN ms_anggota ON tb_kontribusi.nama_anggota = ms_anggota.id
            INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
            LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
            WHERE
                MONTH (
                    tb_bukti_setor_kontribusi.tanggal_setor
                ) IN (".$param['bulan'].")
            AND YEAR(tb_bukti_setor_kontribusi.tanggal_setor) = ".$param['tahun']."
            AND (SELECT tanggal_verifikasi FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier GROUP BY unique_identifier) IS NOT NULL
            $where 
            GROUP BY
            tb_kontribusi.nama_anggota
            ORDER BY
            tb_bukti_setor_kontribusi.tanggal_setor ASC,UNI_ID ASC");
        
        if($param['type'] == "DOWNLOAD"){

            $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
            $spreadsheet = $reader->load(FCPATH . "assets/template/report_perbulan.xlsx");
            $spreadsheet->getProperties()->setCreated($spreadsheet->getProperties()->getModified());

            $spreadsheet->setActiveSheetIndexByName('REPORT');
            $last = 0;
            $arr_cell = [];
            foreach($getData->result() as $key => $get){

                // $date_n = date_format(date_create($get->tanggal_setor), "d M Y");
                
                $spreadsheet->getActiveSheet()->setCellValue("A".($key+2), ($key+1));
                $spreadsheet->getActiveSheet()->setCellValue("B".($key+2), $get->nama_anggota);
                $spreadsheet->getActiveSheet()->setCellValue("C".($key+2), $get->provinsi);
                $spreadsheet->getActiveSheet()->setCellValue("D".($key+2), $get->kab_kota);
                $spreadsheet->getActiveSheet()->setCellValue("E".($key+2), $get->id_bulan);
                $spreadsheet->getActiveSheet()->setCellValue("F".($key+2), $get->dpp);
                $spreadsheet->getActiveSheet()->setCellValue("G".($key+2), $get->dpd);
                $spreadsheet->getActiveSheet()->setCellValue("H".($key+2), $get->dpc);
                $spreadsheet->getActiveSheet()->setCellValue('I'.($key+2), '=SUM(F'.($key+2).':H'.($key+2).')');
                $last = $key+2;       
                
            }
            $spreadsheet->getActiveSheet()->setCellValue('F'.($last+1), '=SUM(F2:F'.$last.')');
            $spreadsheet->getActiveSheet()->setCellValue('G'.($last+1), '=SUM(G2:G'.$last.')');
            $spreadsheet->getActiveSheet()->setCellValue('H'.($last+1), '=SUM(H2:H'.$last.')');
            $spreadsheet->getActiveSheet()->setCellValue('I'.($last+1), '=SUM(I2:I'.$last.')');

            $spreadsheet->getActiveSheet()->setCellValue('A'.($last+1), 'TOTAL');
            $spreadsheet->getActiveSheet()->mergeCells("A".($last+1).":E".($last+1));
            $spreadsheet->getActiveSheet()->getStyle('A'.($last+1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);

            $spreadsheet->getActiveSheet()->getStyle("F2:F".($last+1))->getNumberFormat()
                    ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);
            $spreadsheet->getActiveSheet()->getStyle("F2:G".($last+1))->getNumberFormat()
                    ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);
            $spreadsheet->getActiveSheet()->getStyle("F2:H".($last+1))->getNumberFormat()
                    ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);
            $spreadsheet->getActiveSheet()->getStyle("F2:I".($last+1))->getNumberFormat()
            ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);
            
            // $spreadsheet->getActiveSheet()->getColumnDimension('Q')->setVisible(false);
            $spreadsheet->getActiveSheet()->getColumnDimension('E')->setVisible(false);

            // SHEET REKAP
            // $spreadsheet->setActiveSheetIndexByName('REKAP');
            // $last = 0;
            // foreach($getData->result() as $row => $get){
            //     $spreadsheet->getActiveSheet()->setCellValue("A".($row+2), ($row+1));
            //     $spreadsheet->getActiveSheet()->setCellValue("B".($row+2), $get->TGL_SETOR);
            //     $spreadsheet->getActiveSheet()->setCellValue("C".($row+2), $get->nominal);
            //     $spreadsheet->getActiveSheet()->setCellValue("D".($row+2), $get->JUMLAH_KONTRIBUSI);
            //     $last = $row+2;
            // }
            // $spreadsheet->getActiveSheet()->setCellValue("A".($last+1), "TOTAL");
            // $spreadsheet->getActiveSheet()->setCellValue("C".($last+1), '=SUM(C2:C'.$last.')');
            // $spreadsheet->getActiveSheet()->setCellValue("D".($last+1), '=SUM(D2:D'.$last.')');

            // $spreadsheet->getActiveSheet()->getStyle("A".($last+1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
            // $spreadsheet->getActiveSheet()->getStyle("C2:C".($last+1))->getNumberFormat()
            //         ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);
            //         $spreadsheet->setActiveSheetIndexByName('REPORT');
            $styleArray = [ 
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => [
                        'argb' => 'fed57e',
                    ],
                    'endColor' => [
                        'argb' => 'fed57e',
                    ],
                ],
            ];
            $spreadsheet->getActiveSheet()->getStyle("I1:I".($last+1))->applyFromArray($styleArray);
            $spreadsheet->getActiveSheet()->getStyle("A".($last+1).":I".($last+1))->applyFromArray($styleArray);
            \PhpOffice\PhpSpreadsheet\Shared\File::setUseUploadTempDirectory(true);
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

            $name = "REPORT_PENERIMAAN_PERBULAN_".date('M')."_".date('j_M_Y').".xlsx";
            header('Content-Type: application/vnd.ms-excel');
            header("Content-Disposition: attachment;filename=$name");
            $writer->save('php://output');

        }else{
            $arr['status'] = true;
            $arr['code'] = 200;
            $arr['message'] = "FOUND";
            $arr['data'] = $getData->result();

            echo setJson($arr);
        }
    }

    public function report_daily_call(){

        $arr = [];

        if($_SERVER['REQUEST_METHOD'] == "GET"){
            $param = $this->input->get(NULL, TRUE);
        }else{
            $param = $this->input->post(NULL, TRUE);
        }

        if($param['id_ar'] == null){
            $where = "WHERE
                tb_daily_call.id IS NOT NULL
                AND DATE(tb_daily_call.created_at) BETWEEN '".$param['start']."' AND '".$param['end']."'";
        }else{
            $where = "WHERE
                    tb_daily_call.created_by = ".$param['id_ar']."
                AND tb_daily_call.id IS NOT NULL
                AND DATE(tb_daily_call.created_at) BETWEEN '".$param['start']."' AND '".$param['end']."'";
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
                    LEFT JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota
                    $where
                    GROUP BY
                        tb_daily_call.id
                    ORDER BY
                        tb_kontribusi.dpp DESC");
        
        if($param['type'] == "DOWNLOAD"){

        }else{
            $arr['status'] = true;
            $arr['code'] = 200;
            $arr['message'] = "FOUND";
            $arr['data'] = $getData->result();

            echo setJson($arr);
        }
    }

    public function report_uang_masuk(){
        $arr = [];

        if($_SERVER['REQUEST_METHOD'] == "POST"){
            $param = $this->input->post(NULL, TRUE);
        }else{
            $param = $this->input->get(NULL, TRUE);
        }

        $where = "";
        if($param['kabupaten'] != ""){
            $where .= " AND ms_anggota.id_kab=".$param['kabupaten'];
        }else if($param['provinsi'] != ""){
            $where .= " AND ms_anggota.id_prov=".$param['provinsi'];
        }else{

        }

        $getData = $this->db->query("SELECT
                                ms_anggota.nama_anggota,
                                ms_provinsi.provinsi,
                                ms_kab_kota.kab_kota,
                                tb_kontribusi.id_bulan,
                                nominal,
                                tb_kontribusi.tanggal_setor,
                                tb_bukti_setor_kontribusi.unique_identifier AS UNI_ID,
                            (SELECT COUNT(*) FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier) as JUMLAH_KONTRIBUSI,
                            DATE_FORMAT(tb_bukti_setor_kontribusi.tanggal_setor, '%d %b %Y') as TGL_SETOR

                            FROM
                                tb_bukti_setor_kontribusi
                            INNER JOIN tb_kontribusi ON tb_bukti_setor_kontribusi.unique_identifier = tb_kontribusi.unique_identifier
                            INNER JOIN ms_anggota ON tb_kontribusi.nama_anggota = ms_anggota.id
                            INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
                            LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
                            WHERE
                                MONTH (
                                    tb_bukti_setor_kontribusi.tanggal_setor
                                ) IN (".$param['bulan'].")
                            AND YEAR(tb_bukti_setor_kontribusi.tanggal_setor) = ".$param['tahun']."
                            AND (SELECT tanggal_verifikasi FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier GROUP BY unique_identifier) IS NOT NULL
                            $where 
                            GROUP BY
                            tb_kontribusi.nama_anggota
                            ORDER BY
                            tb_bukti_setor_kontribusi.tanggal_setor ASC,UNI_ID ASC");
    
        
        if($param['type'] == "DOWNLOAD"){

            $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
            $spreadsheet = $reader->load(FCPATH . "assets/template/report_uang_masuk_tmp.xlsx");
            $spreadsheet->getProperties()->setCreated($spreadsheet->getProperties()->getModified());

            $spreadsheet->setActiveSheetIndexByName('REPORT');
            $last_uid = "";
            $start = 0;
            $end   = 0;
            $last = "";
            $arr_cell = [];
            foreach($getData->result() as $key => $get){

                $date_n = date_format(date_create($get->tanggal_setor), "d M Y");

                $spreadsheet->getActiveSheet()->setCellValue("A".($key+2), ($key+1));
                $spreadsheet->getActiveSheet()->setCellValue("B".($key+2), $get->nama_anggota);
                $spreadsheet->getActiveSheet()->setCellValue("C".($key+2), $get->provinsi);
                $spreadsheet->getActiveSheet()->setCellValue("D".($key+2), $get->kab_kota);
                $spreadsheet->getActiveSheet()->setCellValue("E".($key+2), $get->id_bulan);
                $spreadsheet->getActiveSheet()->setCellValue("H".($key+2), $get->UNI_ID);

                if($last_uid != $get->UNI_ID){
                    if($end != 0){
                        array_push($arr_cell, [
                            "start" => $start,
                            "end" => $end
                        ]);
                    }
                    $end = 0;
                    $start = $key+2;
                    $spreadsheet->getActiveSheet()->setCellValue("F".($key+2), $get->nominal);
                    $spreadsheet->getActiveSheet()->setCellValue("G".($key+2), $date_n);
                }else{
                    $end = $key+2;
                }
                $last = $key+2;
                $last_uid = $get->UNI_ID;
            }

            foreach($arr_cell as $a){
                $spreadsheet->getActiveSheet()->mergeCells("F".($a['start']).":F".($a['end']));
                $spreadsheet->getActiveSheet()->mergeCells("G".($a['start']).":G".($a['end']));

                $spreadsheet->getActiveSheet()->getStyle("F".($a['start']).":F".($a['end']))->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);
                $spreadsheet->getActiveSheet()->getStyle("G".($a['start']).":G".($a['end']))->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);
            }

            $spreadsheet->getActiveSheet()->getStyle("F2:F".($last+1))->getNumberFormat()
                    ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);

            $spreadsheet->getActiveSheet()->getColumnDimension('H')->setVisible(false);

            //SHEET REKAP
            $spreadsheet->setActiveSheetIndexByName('REKAP');
            $last = 0;
            foreach($getData->result() as $row => $get){
                $spreadsheet->getActiveSheet()->setCellValue("A".($row+2), ($row+1));
                $spreadsheet->getActiveSheet()->setCellValue("B".($row+2), $get->TGL_SETOR);
                $spreadsheet->getActiveSheet()->setCellValue("C".($row+2), $get->nominal);
                $spreadsheet->getActiveSheet()->setCellValue("D".($row+2), $get->JUMLAH_KONTRIBUSI);
                $last = $row+2;
            }
            $spreadsheet->getActiveSheet()->setCellValue("A".($last+1), "TOTAL");
            $spreadsheet->getActiveSheet()->setCellValue("C".($last+1), '=SUM(C2:C'.$last.')');
            $spreadsheet->getActiveSheet()->setCellValue("D".($last+1), '=SUM(D2:D'.$last.')');

            $spreadsheet->getActiveSheet()->getStyle("A".($last+1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
            $spreadsheet->getActiveSheet()->getStyle("C2:C".($last+1))->getNumberFormat()
                    ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);
                    $spreadsheet->setActiveSheetIndexByName('REPORT');
            \PhpOffice\PhpSpreadsheet\Shared\File::setUseUploadTempDirectory(true);
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

            $name = "REPORT_PENERIMAAN_BULAN_".$param['bulan']."_".$param['tahun']."-".date('j_M_Y').".xlsx";
            header('Content-Type: application/vnd.ms-excel');
            header("Content-Disposition: attachment;filename=$name");
            $writer->save('php://output');

        }else{
            $arr['status'] = true;
            $arr['code'] = 200;
            $arr['message'] = "FOUND";
            $arr['data'] = $getData->result();

            echo setJson($arr);
        }
    }

    public function report_partisipasi(){
        $arr = [];

        if($_SERVER['REQUEST_METHOD'] == "POST"){
            $param = $this->input->post(NULL, TRUE);
        }else{
            $param = $this->input->get(NULL, TRUE);
        }

        $where = "";
        if($param['kabupaten'] != ""){
            $where .= " AND ms_anggota.id_kab=".$param['kabupaten'];
        }else if($param['provinsi'] != ""){
            $where .= " AND ms_anggota.id_prov=".$param['provinsi'];
        }else{

        }

        $getData = $this->db->query("SELECT DISTINCT
                            ms_anggota.nama_anggota,
                            ms_provinsi.provinsi,
                            ms_kab_kota.kab_kota,
                            dana_partisipasi,
                            tb_partisipasi.tanggal_setor,
                            DATE_FORMAT(tb_partisipasi.tanggal_setor, '%d %b %Y') as TGL_SETOR
                        FROM
                            tb_bukti_setor_partisipasi
                        INNER JOIN tb_partisipasi ON tb_bukti_setor_partisipasi.id_partisipasi = tb_partisipasi.id
                        INNER JOIN ms_anggota ON tb_partisipasi.nama_anggota = ms_anggota.id
                        INNER JOIN ms_provinsi ON tb_partisipasi.id_prov = ms_provinsi.id
                        LEFT JOIN ms_kab_kota ON tb_partisipasi.id_kab = ms_kab_kota.id
                        WHERE
                            MONTH (
                                tb_partisipasi.tanggal_verifikasi
                            ) IN (".$param['bulan'].")
                        AND YEAR (
                            tb_partisipasi.tanggal_verifikasi
                        ) = ".$param['tahun']."
                        $where
                        ORDER BY
                            tb_partisipasi.tanggal_verifikasi ASC");
        
        if($param['type'] == "DOWNLOAD"){

            $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
            $spreadsheet = $reader->load(FCPATH . "assets/template/report_partisipasi.xlsx");
            $spreadsheet->getProperties()->setCreated($spreadsheet->getProperties()->getModified());

            $spreadsheet->setActiveSheetIndexByName('REPORT');
            $last = 0;
            foreach($getData->result() as $key => $get){

                $date_print = date_format(date_create($get->tanggal_setor), "d M Y");

                $spreadsheet->getActiveSheet()->setCellValue("A".($key+2), ($key+1));
                $spreadsheet->getActiveSheet()->setCellValue("B".($key+2), $get->nama_anggota);
                $spreadsheet->getActiveSheet()->setCellValue("C".($key+2), $get->provinsi);
                $spreadsheet->getActiveSheet()->setCellValue("D".($key+2), $get->kab_kota);
                $spreadsheet->getActiveSheet()->setCellValue("E".($key+2), $get->dana_partisipasi);
                $spreadsheet->getActiveSheet()->setCellValue("F".($key+2), $date_print);
                $last = $key+2;
            }

            $spreadsheet->getActiveSheet()->getStyle("E2:E".($last+1))->getNumberFormat()
                    ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);

            //$spreadsheet->getActiveSheet()->setCellValue("A".($last+2), json_encode($arr_cell));

            \PhpOffice\PhpSpreadsheet\Shared\File::setUseUploadTempDirectory(true);
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

            $name = "REPORT_PENERIMAAN_PARTISIPASI_BULAN_".$param['bulan']."_".$param['tahun']."-".date('j_M_Y').".xlsx";
            header('Content-Type: application/vnd.ms-excel');
            header("Content-Disposition: attachment;filename=$name");
            $writer->save('php://output');

        }else{
            $arr['status'] = true;
            $arr['code'] = 200;
            $arr['message'] = "FOUND";
            $arr['data'] = $getData->result();

            echo setJson($arr);
        }
    }

    public function report_tingkatan(){
        $arr = [];
        
        if($_SERVER['REQUEST_METHOD'] == "POST"){
            $param = $this->input->post(NULL, TRUE);
        }else{
            $param = $this->input->get(NULL, TRUE);
        }
        $bulan = $param['bulan'];
        $tahun = $param['tahun'];

        $where = "";
        $where_to = "";
        if($param['kabupaten'] != ""){
            $where .= " AND ms_anggota.id_kab=".$param['kabupaten'];
            $where_to .= " AND tb_kontribusi.id_kab=".$param['kabupaten'];
        }else if($param['provinsi'] != ""){
            $where .= " AND ms_anggota.id_prov=".$param['provinsi'];
            $where_to .= " AND tb_kontribusi.id_prov=".$param['provinsi'];
        }else{

        }

        if($param['jenis_data'] == "DPP"){
            $select = "dpp";
        }else if($param['jenis_data'] == "DPD"){
            $select = "dpd";
        }else{
            $select = "dpc";
        }

        $getData = $this->db->query("SELECT   
			    ms_anggota.nama_anggota,
                ms_provinsi.provinsi,
                ms_kab_kota.kab_kota,
                tb_kontribusi.id_bulan,
                tb_kontribusi.tanggal_verifikasi,
                nominal,
                tb_kontribusi.tanggal_setor,
                tb_bukti_setor_kontribusi.unique_identifier AS UNI_ID,
                ( 
                    SELECT ms_anggota.nama_anggota FROM ms_anggota INNER JOIN tb_kontribusi ON ms_anggota.id = tb_kontribusi.nama_anggota WHERE tb_kontribusi.unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
                    GROUP BY tb_bukti_setor_kontribusi.unique_identifier 
                ) as NAMA_ANGGOTA,
                (
                    SELECT 
                        ms_provinsi.provinsi
                    FROM
                        tb_kontribusi
                    INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
                    WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
                    GROUP BY tb_bukti_setor_kontribusi.unique_identifier
                ) AS PROVINSI,
                (
                    SELECT 
                        ms_kab_kota.kab_kota
                    FROM
                        tb_kontribusi
                    INNER JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
                    WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier
                    GROUP BY tb_bukti_setor_kontribusi.unique_identifier                    
                ) AS KOTA,
                (
                    SELECT SUM($select) FROM tb_kontribusi WHERE id_bulan=$bulan AND tahun=$tahun AND nama_anggota=ms_anggota.id 
                ) AS BESARAN,            
                (SELECT SUM(BESARAN) FROM tb_kontribusi WHERE id_bulan=$bulan AND tahun=$tahun AND nama_anggota=ms_anggota.id) as TOTAL_PENERIMAAN
                

            FROM
                tb_bukti_setor_kontribusi
            INNER JOIN tb_kontribusi ON tb_bukti_setor_kontribusi.unique_identifier = tb_kontribusi.unique_identifier
            INNER JOIN ms_anggota ON tb_kontribusi.nama_anggota = ms_anggota.id
            INNER JOIN ms_provinsi ON tb_kontribusi.id_prov = ms_provinsi.id
            LEFT JOIN ms_kab_kota ON tb_kontribusi.id_kab = ms_kab_kota.id
            WHERE
                MONTH (
                    tb_bukti_setor_kontribusi.tanggal_setor
                ) IN (".$param['bulan'].")
                AND YEAR(tb_bukti_setor_kontribusi.tanggal_setor) = ".$param['tahun']."
                AND (SELECT tanggal_verifikasi FROM tb_kontribusi WHERE unique_identifier=tb_bukti_setor_kontribusi.unique_identifier GROUP BY unique_identifier) IS NOT NULL
            $where
            GROUP BY
            tb_kontribusi.nama_anggota
            ORDER BY
            tb_bukti_setor_kontribusi.tanggal_setor ASC,UNI_ID ASC");

            if($param['type'] == "DOWNLOAD"){

                $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
                $spreadsheet = $reader->load(FCPATH . "assets/template/report_tingkatan.xlsx");
                $spreadsheet->getProperties()->setCreated($spreadsheet->getProperties()->getModified());
    
                $spreadsheet->setActiveSheetIndexByName('REPORT');
                $last = 0;
                
                foreach($getData->result() as $key => $get){
    
                    $date_print = date_format(date_create($get->tanggal_verifikasi), "d M Y");
    
                    $spreadsheet->getActiveSheet()->setCellValue("A".($key+2), ($key+1));
                    $spreadsheet->getActiveSheet()->setCellValue("B".($key+2), $get->nama_anggota);
                    $spreadsheet->getActiveSheet()->setCellValue("C".($key+2), $get->provinsi);
                    $spreadsheet->getActiveSheet()->setCellValue("D".($key+2), $get->kab_kota);
                    $spreadsheet->getActiveSheet()->setCellValue("E".($key+2), $get->BESARAN);
                    $last = $key+2; 
                    
                }
                $spreadsheet->getActiveSheet()->setCellValue('E'.($last+1), '=SUM(E2:E'.$last.')');
    
                $spreadsheet->getActiveSheet()->setCellValue('A'.($last+1), 'TOTAL PENERIMAAN');
                $spreadsheet->getActiveSheet()->mergeCells("A".($last+1).":D".($last+1));
                $spreadsheet->getActiveSheet()->getStyle('A'.($last+1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
    
                $spreadsheet->getActiveSheet()->getStyle("E2:E".($last+1))->getNumberFormat()
                        ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);
                $spreadsheet->getActiveSheet()->getStyle("E2:E".($last+1))->getNumberFormat()
                        ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2);
    
                \PhpOffice\PhpSpreadsheet\Shared\File::setUseUploadTempDirectory(true);
                $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
    
                $name = "REPORT_PER-TINGKATAN_".$param['jenis_data']."_".date('j_M_Y').".xlsx";
                header('Content-Type: application/vnd.ms-excel');
                header("Content-Disposition: attachment;filename=$name");
                $writer->save('php://output');
    
            }else{
                $arr['status'] = true;
                $arr['code'] = 200;
                $arr['message'] = "FOUND";
                $arr['data'] = $getData->result();
    
                echo setJson($arr);
            }
        }
    }
    
    ?>