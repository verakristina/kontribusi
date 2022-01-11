const LIST_PARTISIPASI = {
	data : function() {
		return {
            userdata : [],
			list_partisipasi : [],
			parameter_dana : [],
            total_all : 0,
			forms : {
                tahun : 0,
                provinsi : ""
			},
			OUTPROV : "",
			OUTKOTA : "",
			dataList : {
                prov_list : [],
                kab_list : [],
                curr_year : 0
			},
			files : [],
		}
	},
	created : function(){
        const v = this;
		store.commit("changeNavTitle", "List Partisipasi");
	},
	mounted : function(){
		var v = this;
		v.get_date_info();
		v.$nextTick(() => {
			$(".table__scroll").perfectScrollbar();
		}) 
	},
	computed : {
		years () {
            const year = new Date().getFullYear()
            return Array.from({length: 5}, (value, index) => year - index)
        },
	},
	methods : {
		get_date_info : function(){
            var v = this;
            v.$root.showLoading("Mengambil data..");
            v.$root.get_date_info(v.getDateInfoCallback);
		},
		getDateInfoCallback : function(resp){
			var v = this;
			if(resp.code == 200){
				v.$set(v.dataList, "month_list", resp.data.month_list);
				v.$set(v.dataList, "curr_year", resp.data.curr_year);
				v.$set(v.forms, "tahun", resp.data.curr_year);
				v.getProv();
				v.$nextTick(() => {
					$(".selectpicker").selectpicker('refresh');
				});
			}
		},
        getProv : function(){
            var v = this;

			v.$root.get_prov(v.getProvCallback);
		},
		getProvCallback : function(resp){
			var v = this;
			v.$set(v.dataList, "prov_list", resp.data);
			v.$nextTick(() => {
				v.getData();
				swal.close();
				$(".selectpicker").selectpicker('refresh');
			});
		},
        getKab : function(){
            var v = this;
			v.$root.get_kab(v.forms.provinsi, v.getKabCallback);
		},
		getKabCallback : function(resp){
			var v = this;
			
			v.$set(v.dataList, "kab_list", resp);
			v.$nextTick(() => {
				$(".selectpicker").selectpicker('refresh');
			});
		},
		getData : function(){
			var v = this;
			v.$root.showLoading("Mengambil data..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/get_partisipasi_data",
				data : {
					id_prov: v.forms.provinsi,
					id_tahun: v.forms.tahun
				},
				success:function(resp){
					if(resp.code == 200){
						v.$set(v, "list_partisipasi", resp.data.list_partisipasi);
						v.$set(v, "parameter_dana", resp.data.parameter_dana);

						var dana_akumulasi = _.sumBy(resp.data, function(o){
							if (o.dana_akumulasi == null) {
								return 0;
							}else{
								return parseInt(o.dana_akumulasi);
							}
						});
						// console.log(dana_akumulasi);

						var OUTPROV = _.sumBy(resp.data, function(o){
							if(o.OUTPROV == null){
								return 0;
							}else{
								return parseInt(o.OUTPROV);
							}
						});
						var total_all = parseInt(OUTPROV);
						v.$set(v, "dana_akumulasi", dana_akumulasi);
						v.$set(v, "OUTPROV", OUTPROV);
						v.$set(v, "total_all", total_all);
                        console.log(total_all);
						

						// var jumlah = _.subtract(v.PROV - v.dana_akumulasi);
                        // v.$set(v, "PROV", jumlah)
                        // console.log(jumlah);

						v.$nextTick(() => {
							$(".datatable").dataTable();
							swal.close();
						});
					}else{
						v.$root.showError("Gagal mengambil data..");
					}
				}
			})
		},
		openModal : function(){
			var v = this;

			$("#modal-upload").modal('show');

			v.$nextTick(() => {
				v.$root.dropifyInit();
			});
		},
		getFile: function() {
			var v = this;
			console.log(v.$refs.file.files[0]);
			v.$set(v, "files", v.$refs.file.files[0]);
		},
		submitForm : function(){
			var v = this;

			if(v.files.length != 0){
				v.$root.showLoading("Mengupload data..");

				var f_data = new FormData();
				f_data.append('file', v.files);

				$.ajax({
					type : "POST",
					method : "POST",
					url : BASE_URL+"file_handler/upload_excel",
					data : f_data,
					enctype: "multipart/form-data",
					cache: false,
					contentType: false,
					processData: false,
					success: function(resp) {
						if(resp.status == "ERROR"){
							v.$root.showError("Gagal! Error : "+resp.message);
						}else{
							v.$root.showSuccess("Upload selesai");
						}
						$("#modal-upload").modal('hide');
					},
					error:function(e){
						v.$root.showError("Gagal!");
						$("#modal-upload").modal('hide');
					}
				})
			}else{
				v.$root.showError("Pilih file!");
			}
		}
	},
    template: `
	<div>
		<div class="card">
			<div class="card-header card-header-icon card-header-warning">
				<div class="card-icon">
					<i class="fa fa-list fa-2x"></i>
				</div>
			</div>
			<div class="card-body">
				<div class="clearfix">
					<div class="pull-left">
						<div class="row">
							<div class="col-md-5">
								<div class="form-group">
									<label>Tahun</label>
									<select name="tahun" id="tahun" class="selectpicker" v-model="forms.tahun">
										<option value="">SELECT</option>
										<template v-for="year in years">
											<option v-bind:value="year">
												{{ year }}
											</option>
										</template>
									</select>
								</div>
							</div>
							<div class="col-md-5">
								<div class="form-group">
									<label>Provinsi</label>
									<select name="provinsi" id="provinsi" class="selectpicker" v-model="forms.provinsi"">
										<option value="">SELECT</option>
										<template v-for="(it, ind) in dataList.prov_list">
											<option v-bind:value="it.id">
												{{ it.provinsi }}
											</option>
										</template>
									</select>
								</div>
							</div>
						</div>
						<button class="btn btn-info btn-sm" v-on:click="getData">
							<i class="fa fa-search"></i>
						</button>
					</div><br><br><br><br>
					<div class="pull-right">
						<!-- <button class="btn btn-success btn-sm" v-on:click="openModal()">
							<i class="fa fa-upload"></i>
							UPLOAD FILE
						</button> -->
						<!-- <router-link class="btn btn-primary btn-sm" :to="{path : '/detail-partisipasi/'+item.id}">
							<i class="fa fa-book"></i>  Detail
						</router-link> -->
						<!-- <router-link class="btn btn-primary btn-sm" :to="{path : '/input-partisipasi'}">
							<i class="fa fa-plus"></i> Input Partisipasi
						</router-link> -->
					</div>
				</div>
				<div class="table__scroll" :style='{"position" : "relative", "min-height" : "200px","max-height" : "700px", "overflow" : "scroll"}'>
					<table class="table table-bordered table-striped table-hover datatable" :style='{"width" : "1000px", "font-size" : "12px"}'>
						<thead>
							<tr>
								<th class="text-center">#</th>
								<th class="text-center" width="150px">Provinsi</th>
								<th class="text-center" width="150px">Kab. / Kota</th>
								<!-- <th class="text-center" width="150px">Tanggal Setor</th> -->
								<th class="text-center" width="150px">Jumlah Setor</th>
								<th class="text-center" width="150px">Outstanding</th>
                                <th class="text-center" width="250px">Nama Anggota</th>
							</tr>
                        </thead>
						<tbody>
							<tr v-for="(item, index) in list_partisipasi">
								<td>
                                <router-link class="btn btn-link btn-sm" style="color: #4FA125" :to="{path : '/detail-partisipasi/'+item.id}">
										<i class="fa fa-book"></i>
									</router-link>
								</td>
								<td>{{ item.provinsi }}
                                </td>
                                <td>{{ item.kab_kota }} </td>
                                <!--<td class="text-center">{{ item.TGL_SETOR }} </td>-->
								<td class="text-right">{{ $root.formatNumber(item.dana_akumulasi) }}</td>
								<td class="text-right">{{ $root.formatNumber(item.parameter-item.dana_akumulasi) }}</td>
                                <td>{{ item.nama_anggota }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="modal fade" id="modal-upload">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Upload File Partisipasi</h4>
					</div>
					<div class="modal-body">
						<input type="file" ref="file" class="dropify" data-allowed-file-extensions="xls xlsx" v-on:change="getFile">
						<button class="btn btn-success btn-sm" v-on:click="submitForm">
							UPLOAD
						</button>
					</div>
				</div>
			</div>
		</div>
    </div>
    `
}