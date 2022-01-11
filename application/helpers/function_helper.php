<?php if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}
if (! function_exists('isLogin')) {
    function isLogin($mode = null)
    {
        $CI = &get_instance();

        if ($CI->session->userdata('is_login') == false) {
            redirect('/');
        }
    }
}
if (! function_exists('generateMysqlINQuery')) {
    function generateMysqlINQuery($string_array)
    {
        return "IN ('" . implode("', '", json_decode($string_array)) . "') ";
    }
}
if (! function_exists('getBasePath')) {
    function getBasePath($string_array)
    {
        return parse_url($string_array)['path'];
    }
}
if (! function_exists('getLastWeekOfYear')) {
    function getLastWeekOfYear($year)
    {
        $date = new DateTime();
        return date('W', strtotime(date(
            'Y-m-d',
            strtotime($date->setISODate($year, 1, "1")
                  ->format('Y-m-d') . "-1day")
        )));
    }
}
if (! function_exists('renderHTML')) {
    function renderHTML($view = "", $data = [])
    {
        $CI = &get_instance();
        $CI->load->view('layout/header', $data);
        $CI->load->view($view, $data);
        $CI->load->view('layout/footer', $data);
    }
}

if (! function_exists('renderHTMLMaterial')) {
    function renderHTMLMaterial($view = "", $data = [])
    {
        $CI = &get_instance();
        $CI->load->view('layout/material/header', $data);
        $CI->load->view('layout/material/sidebar', $data);
        $CI->load->view('layout/material/navbar', $data);
        $CI->load->view($view, $data);
        $CI->load->view('layout/material/footer', $data);
    }
}

if (! function_exists('post')) {
    function post($name = "")
    {
        $CI = &get_instance();
        if ($name == '') {
            return $CI->input->post();
        } else {
            return $CI->input->post($name);
        }
    }
}

if (! function_exists('get')) {
    function get($name = "")
    {
        $CI = &get_instance();
        if ($name == '') {
            return $CI->input->get();
        } else {
            return $CI->input->get($name);
        }
    }
}

if (! function_exists('send_email')) {
    function send_email($email = "", $subject = "Testing Approval", $body = "")
    {
        $data = [
              'key' => 'digi_pm_key_2019_aldlajfa',
              'email' => $email,
              'subject' => $subject,
              'body' => $body,
          ];

        // DIGI PM
        // $url = 'https://script.google.com/macros/s/AKfycbxsGQ8kTOpJo4WB2qaok_SVtvf9AfYurJDica13QesN2pfECEE/exec';
        //MERU SYSTEM
        $url = 'https://script.google.com/macros/s/AKfycbyyIwrUDM2SuzSwMs9LCBWV8rrMZvPFBo-rCn0W8Dl8kf9hqAM/exec';
  
        # Form our options
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: multipart/form-data"));
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $result = curl_exec($ch);
        $error = curl_error($ch);
  
        return json_decode($result);
    }
}

if (! function_exists('setDinas')) {
    function setDinas($dinas)
    {
        switch ($dinas) {
              case 1:
                  return "Dinas Malam";
                  break;

              case 2:
                  return "Dinas Pagi";
                  break;

              case 3:
                  return "Dinas Siang";
                  break;
              
              default:
                  return null;
                  break;
          }
    }
}

if (! function_exists('renderView')) {
    function renderView($view = "", $data = [])
    {
        $CI = &get_instance();
        $CI->load->view('layout/header', $data);
        $CI->load->view('layout/header_dashboard', $data);
        $CI->load->view($view, $data);
        $CI->load->view('layout/footer_dashboard', $data);
        $CI->load->view('layout/footer', $data);
    }
}

if (! function_exists('setCrumbs')) {
    function setCrumbs($tipe)
    {
        if ($tipe == "am_schedule") {
            return "AM SCHEDULE";
        } elseif ($tipe == "am_exe") {
            return "AM ACTIVITY";
        } elseif ($tipe == "pm_schedule") {
            return "PM SCHEDULE";
        } elseif ($tipe == "pm_exe") {
            return "PM EXECUTE";
        } elseif ($tipe == "pm_pr") {
            return "PM REPLACE";
        } elseif ($tipe == "bd") {
            return "PM BREAKDOWN";
        } elseif ($tipe == "imp") {
            return "IMPROVEMENT";
        } elseif ($tipe == "qt_schedule") {
            return "QUALITY SCHEDULE";
        } elseif ($tipe == "qt_breakdown") {
            return "QUALITY BREAKDOWN";
        }
    }
}

if (! function_exists('setTipe')) {
    function setTipe($value='')
    {
        switch ($value) {
            case 'brokenpart':
                return 1;
                break;

            case 'pergantianpart':
                return 2;
                break;

            case 'improvement':
                return 3;
                break;
            
            default:
                return 0;
                break;
        }
    }
}

if (! function_exists('setFrekuensi')) {
    function setFrekuensi($tipe)
    {
        if ($tipe == "am_schedule" || $tipe == "am_exe") {
            return [1, 2, 3, 4];
        } elseif ($tipe == "pm_schedule") {
            return [1, 2, 4, 8, 12, 16, 20, 24, 48, 53];
        } elseif ($tipe == "pm_exe") {
            return [1, 2, 4, 8, 12, 16, 20, 24, 48, 53];
        } elseif ($tipe == "pm_pr") {
            return [];
        } elseif ($tipe == "bd") {
            return [];
        } elseif ($tipe == "imp") {
            return [];
        } elseif ($tipe == "qt_schedule") {
            return [];
        } elseif ($tipe == "qt_breakdown") {
            return [];
        }
    }
}


if (! function_exists('jsonResponse')) {
    function jsonResponse($data)
    {
        header('Content-Type: application/json');
        echo json_encode($data);
    }
}

if (! function_exists('tgl')) {
    function tgl($date)
    {
        $data = $date;
        $day 	= date('d', strtotime($data));
        $hari 	= date('D', strtotime($data));
        $bulan 	= date('m', strtotime($data));
        $year 	= date('Y', strtotime($data));
        $dayList = array(
                'Sun' => 'Minggu','Mon' => 'Senin',
                'Tue' => 'Selasa','Wed' => 'Rabu',
                'Thu' => 'Kamis','Fri' => 'Jumat',
                'Sat' => 'Sabtu'
            );

        switch ($bulan) {
             case 1: $bulan=$dayList[$hari].', '.$day.' '."Januari ".$year;
                 break;
             case 2: $bulan=$dayList[$hari].', '.$day.' '."Februari ".$year;
                 break;
             case 3: $bulan=$dayList[$hari].', '.$day.' '."Maret ".$year;
                 break;
             case 4: $bulan=$dayList[$hari].', '.$day.' '."April ".$year;
                 break;
             case 5: $bulan=$dayList[$hari].', '.$day.' '."Mei ".$year;
                 break;
             case 6: $bulan=$dayList[$hari].', '.$day.' '."Juni ".$year;
                 break;
             case 7: $bulan=$dayList[$hari].', '.$day.' '."Juli ".$year;
                 break;
             case 8: $bulan=$dayList[$hari].', '.$day.' '."Agustus ".$year;
                 break;
             case 9: $bulan=$dayList[$hari].', '.$day.' '."September ".$year;
                 break;
             case 10: $bulan=$dayList[$hari].', '.$day.' '."Oktober ".$year;
                 break;
             case 11: $bulan=$dayList[$hari].', '.$day.' '."November ".$year;
                 break;
             case 12: $bulan=$dayList[$hari].', '.$day.' '."Desember ".$year;
                 break;
             }

        return $bulan;
    }
}

if (! function_exists('getImage')) {
    function getImage($data)
    {
        $src = "";
        switch ($data) {
                  case "":
                        $src = "kotak.png";
                  break;
                  case "PM":
                        $src = "scn.png";
                  break;
                  case "PMX":
                        $src = "scn_pe.png";
                  break;
            }

        return $src;
    }
}

if (! function_exists('toJson')) {
    function toJson($data)
    {
        header('Content-Type: application/json');
        return json_encode($data);
    }
}

if (! function_exists('getPelaksana')) {
    function getPelaksana($data = [])
    {
        $res = "";

        if ($data == null || count($data) == 0) {
            return  "-";
        }

        for ($i=0; $i < count($data); $i++) {
            $s = generatePelaksana($data[$i]);
            if ($i + 1 == count($data)) {
                $res = $res . "" . $s;
            } else {
                $res = $res . "" . $s . ", ";
            }
        }

        return $res;
    }
}

if (! function_exists('generatePelaksana')) {
    function generatePelaksana($pelaksana)
    {
        $result = "";

        switch ($pelaksana) {
            case "1":
              {
                $result = "Dedy Suryanto";
              }
              break;
            case "2":
              {
                $result = "Dhobby Saputra";
              }
              break;
            case "3":
              {
                $result = "Nanang Fitrianto";
              }
              break;
            case "4":
              {
                $result = "Parto Parto";
              }
              break;
            case "5":
              {
                $result = "Rohman Dwi Muchlisin";
              }
              break;
            case "6":
              {
                $result = "Sriyadi Sriyadi";
              }
              break;
            case "7":
              {
                $result = "Yabidi Abdul Rohman";
              }
              break;
            default:
              {
                $result = "";
              }
          }

        return $result;
    }
}

if (!function_exists('getWeekList')) {
    function getWeekList(){
        header('Content-Type: application/json');
        $arr = array();
        $a = 1;
        while ($a <= 52) {
            array_push($arr, $a);
            $a++;
        }
        return json_encode($arr);
    }
}

if (!function_exists('getLabourTarif')) {
    function getLabourTarif($job_class, $type)
    {
        $CI =& get_instance();
        if ($type == "month") {
            $data = $CI->db->query("SELECT month_tarif FROM ms_man_tarif WHERE job_class='$job_class'")->row()->month_tarif;
        } elseif ($type == "hour") {
            $data = $CI->db->query("SELECT hour_tarif FROM ms_man_tarif WHERE job_class='$job_class'")->row()->hour_tarif;
        } else {
            $data = $CI->db->query("SELECT minute_tarif FROM ms_man_tarif WHERE job_class='$job_class'")->row()->minute_tarif;
        }
        return $data;
    }
}

if (!function_exists('getChar')) {
    function getChar($num)
    {
        $numeric = $num % 26;
        $letter = chr(65 + $numeric);
        $num2 = intval($num / 26);
        if ($num2 > 0) {
            return getChar($num2 - 1) . $letter;
        } else {
            return $letter;
        }
    }
}

if (!function_exists('getYearList')) {
    function getYearList($year = ""){
      $arr = array();
      if($year == ""){
        $year = date("Y");
      }else{
        $year = $year;
      }

      $years = $year+5;

      while($year <= $years){
        array_push($arr, $year);
        $year++;
      }

      return $arr;
    }
}

if(!function_exists('getDateList')){
  function getDateList($week, $year, $format = "d-m-Y") {
    $dto = new DateTime();
    $ret[0] = $dto->setISODate($year, $week)->format($format);
    $s = 1;
    while($s <= 6){
      $ret[$s] = $dto->modify('+1 days')->format($format);
      $s++;
    }
    return $ret;
  }
}

if(!function_exists('getShiftList')){
  function getShiftList(){
    $CI = &get_instance();

    $data = $CI->db->query("SELECT * FROM ms_shift");

    return $data;
  }
}

if(!function_exists('setJson')){
  function setJson($data){
    header('Content-Type: application/json');
    echo json_encode($data);
  }
}