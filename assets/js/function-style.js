function chechlist(divId){
	var status = $("#"+divId).hasClass("unitactive").toString();
	if(status == 'true') {
		$("#"+divId).removeClass("unitactive");
		$('#ck_'+divId).prop('checked', false);
	} else if(status == 'false') {
		$("#"+divId).addClass("unitactive");
		$('#ck_'+divId).prop('checked', true);
	}
}


function load_view(jenis,url){
	if(jenis == 'Sign Out') {
		window.location.href = url;
	} else {
		$("#load").html('<div class="se-pre-con">');
		$.ajax({
			url 	: url,
			type 	: 'get',
			dataType: 'html',
			success : function(data)
			{
				$("#load").html(data);
			}
		});
	}
}
function disabled(){
	$('#pergantianpart').addClass('disable');
	$('#inspectionpart').addClass('disable');
	$('#improvement').addClass('disable');
	$('#brokenpart').addClass('disable');
	$('#machinefaiure').addClass('disable');
	$('#minggu').attr('disabled', true);
	$('#hari').attr('disabled', true);
	$('#shift').attr('disabled', true);
	$('#deskripsi').attr('disabled', true);
	$('#downtime').attr('disabled', true);
	$('#noewo').attr('disabled', true);
	$('#bdrootcause').attr('disabled', true);
}
function cariPart(data, response){
	var part = $('#'+data).val();
	var unitId = $('#idUnitField').val();
	var subUnitId = $('#idSubUnitField').val();
	$.ajax({
		type : "get",
		url  : baseUrl+"/proses/ajax/cari/data/part",
		data : "part="+part+"&unitId="+unitId+"&subUnitId="+subUnitId,
		success:function(data){
			$('#responsePart').html(data);
		}
	});
}

function show_alert(status,message){
	$('.message').html(message);
	$('.alert-'+status).show(500).delay(500).hide(500);
}
function page_item(data,menu_active){
	$.ajax({
		type : "get",
		url  : baseUrl+"page_waste",
		data : "data="+data+'&menu_active='+menu_active,
		success:function(html){
			$('.response-cari').html(html);
		}
	});
}
function pagination_item(ke,cari,menu_active){
	$.ajax({
		type : "get",
		url  : baseUrl+"pagination_waste",
		data : "cari="+cari+"&data="+ke+'&menu_active='+menu_active,
		success:function(html){
			$('.response-cari').html(html);
		}
	});
}
