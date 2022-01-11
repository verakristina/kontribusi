<?php

class Lph extends CI_Controller{

	public function getDateList(){
		$arr = array();
		$arr['dateList'] = array();
		$year = (null === $this->input->get('year'))?date('Y'):$this->input->get('year');
		$week = (null === $this->input->get('week'))?date('W'):$this->input->get('week');

		if($week < 10){
			$week = str_replace("0", "", $week);
		}

		$dl = getDateList($week, $year, "D, d-m-Y");

		$arr['week'] = $week;
		$arr['year'] = $year;

		foreach($dl as $g){
			$arr['dateList'][$g] = array(
				"DM" => array(),
				"DP" => array(),
				"DS" => array()
			);
		}

		echo toJson($arr);

	}

	public function dataList(){
		$arr  = array();
		$arr_ex = array();
		$year = $this->input->get('year');
		$week = $this->input->get('week');
		$sbu  = $this->input->get('sbu');
		$line = $this->input->get('line');

		$shiftList = getShiftList();
		$dl = getDateList($week, $year);

		$arr_ex['product'] = "";
		$arr_ex['dateList'] = array();

		foreach($dl as $get){
			foreach($shiftList->result() as $sh){
				$arr_ex['dateList'][$get][$sh->shift]['target'] = 0;
				$arr_ex['dateList'][$get][$sh->shift]['actual'] = 0;
			}
		}

		$arr['for_list'] = $arr_ex;

		echo toJson($arr);
	}

}

?>