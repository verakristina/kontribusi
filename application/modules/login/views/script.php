<link rel="stylesheet" href="<?php echo base_url('assets/css/jsKeyboard.css') ?>">
<script>
	$(document).ready(function($) {

		$.get(BASE_URL + 'login/get_line', function(data) {
			$('.line.custom-field').find('option').remove()
			$('.line.custom-field').append(`
			<option data-image=''>--SELECT LINE--</option>`);
			$.each(data.line, function(index, el) {
				$('.line.custom-field').append(
					`<option data-image=${data.path + el.image_url || 'test'} 
					value=${el.id}>${el.nama_line}</option>`)
			});
		 });
		
	});

	function getMesin(e) {
		var selected = e.options[e.options.selectedIndex];
		$("body").css({"background-image": `url(${selected.dataset.image})`});

		$.get(BASE_URL + 'login/get_machine/' + selected.value, function(data) {
			$('.mesin.custom-field').find('option').remove()
			$.each(data, function(index, el) {
				$('.mesin.custom-field').append(
					`<option data-image=${data.path + el.image_url || 'test'} 
					value=${el.id}>${el.nama_mesin}</option>`)
			});
		 });
	}

	function sigin(){
		var idUser = $('.idUser').val();
		var pin = $('.pin').val();
		var mesin = $('.mesin').val();
		if(mesin == "" || mesin == "Mesin" || idUser == "" || pin == ""){
			if(idUser == ""){ $('.idUser').focus(); }
			else if(pin == ""){ $('.pin').focus(); }
			else if(mesin == ""){ $('.mesin').focus(); }
			$('#responseLogin').html('<div class="alert alert-danger" style="padding-top:15px;"><i class="fa fa-warning"></i> NO FIELD EMPTY!</div>')
			$('#responseLogin').fadeIn(200).delay(2500).fadeOut(200);
		}else{
			$.ajax({
				type : "GET",
				url  : BASE_URL+"login/proses_login",
				data : {
					'idUser' 	: idUser,
					'pin'  		: pin,
					'mesin'  	: mesin
				},
				success:function(data){
					if(data == null){
						$('#responseLogin').html('<div class="alert alert-danger" style="padding-top:15px;"><h6 style="font-size:12px;"><i class="fa fa-warning"></i> ACCOUNT NOT EXIST!</h6></div>')
						$('#responseLogin').fadeIn(200).delay(2500).fadeOut(200);
					}else{
						window.location = BASE_URL + 'dashboard_material';
					}
				}
			});
		}
	}

	$(document).keypress(function(e) {
	    if(e.which == 13) {
	        sigin();
	    }
	});

	$(function () {
	 jsKeyboard.init("virtualKeyboard");

	 //first input focus
	 var $firstInput = $(':input').first().focus();
	 jsKeyboard.currentElement = $firstInput;
	 jsKeyboard.currentElementCursorPosition = 0;
	});

</script>