const LIST_KONTRIBUSI = {
	data : function() {
		return {
            userdata : [],
			list_kontribusi : [],
			forms : {
				bulan : "",
                tahun : "",
                provinsi : "",
                kabupaten : "",
			},
			dataList : {
                month_list : [],
                prov_list : [],
                kab_list : [],
                curr_month : 0,
                curr_year : 0
			},
			table : null,
			files : [],
		}
	},
	created : function(){
        const v = this;
		store.commit("changeNavTitle", "List Kontribusi");
	},
	mounted : function(){
		var v = this;
		v.get_session();
		v.$nextTick(() => {
			$(".table__scroll").perfectScrollbar();
		}) 
	},
	computed : {
		years () {
			var year = new Date().getFullYear()
			year = year + 5;
            return Array.from({length: 10}, (value, index) => year - index)
        },
	},
	methods : {
		get_session : function(){
			var v = this;

			v.$root.get_session(v.getSessionCallback);
		},
		getSessionCallback : function(resp){
			var v = this;
			if(resp.code == 200){
				v.$set(v, "userdata", resp.data);
				v.get_date_info();
			}
		},
		get_date_info : function(){
            var v = this;
            v.$root.showLoading("Mengambil data..");
            v.$root.get_date_info(v.getDateInfoCallback);
		},
		getDateInfoCallback : function(resp){
			var v = this;
			if(resp.code == 200){
				v.$set(v.dataList, "month_list", resp.data.month_list);
				v.$set(v.dataList, "curr_month", resp.data.curr_month);
				v.$set(v.dataList, "curr_year", resp.data.curr_year);
				v.$set(v.forms, "bulan", resp.data.curr_month);
				v.$set(v.forms, "tahun", resp.data.curr_year);
				if(v.userdata.sess_role_id == 1){
					v.$root.get_prov(v.getProvCallback);
				}else{
					v.$root.get_prov_by_user(v.userdata.sess_user_id, v.getProvCallback);
				}
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
			if(v.table){
				v.table.dataTable().fnDestroy();
			}
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/get_kontribusi_data",
				data : v.forms,
				success:function(resp){
					if(resp.code == 200){
						v.$set(v, "list_kontribusi", resp.data);
						v.$nextTick(() => {
							v.table = $(".datatable").dataTable();
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
							<div class="col-md-3">
								<div class="form-group">
									<label>Bulan</label>
									<select name="bulan" id="bulan" class="selectpicker" v-model="forms.bulan">
										<option value="">SELECT</option>
										<template v-for="(it, ind) in dataList.month_list">
											<option v-bind:value="it.id">
												{{ it.bulan }}
											</option>
										</template>
									</select>
								</div>
							</div>
							<div class="col-md-3">
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
							<div class="col-md-3">
								<div class="form-group">
									<label>Provinsi</label>
									<select name="provinsi" id="provinsi" class="selectpicker" v-model="forms.provinsi" v-on:change="getKab">
										<option value="">SELECT</option>
										<template v-for="(it, ind) in dataList.prov_list">
											<option v-bind:value="it.id">
												{{ it.provinsi }}
											</option>
										</template>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Kabupaten / Kota</label>
									<select name="kabupaten" id="kabupaten" class="selectpicker" v-model="forms.kabupaten">
										<option value="">SELECT</option>
										<template v-for="(it, ind) in dataList.kab_list">
											<option v-bind:value="it.id">
												{{ it.kab_kota }}
											</option>
										</template>
									</select>
								</div>
							</div>
						</div>
						<button class="btn btn-info btn-sm" v-on:click="getData">
							<i class="fa fa-search"></i>
						</button>
					</div>
					<div class="pull-right">
						<!-- <router-link class="btn btn-primary btn-sm" :to="{path : '/input-kontribusi'}">
							<i class="fa fa-plus"></i> Input Kontribusi
						</router-link>
						<router-link class="btn btn-primary btn-sm" :to="{path : '/input-kontribusi-by-nama'}">
							<i class="fa fa-plus"></i> Input Kontribusi By Nama
						</router-link> -->
						<router-link class="btn btn-primary btn-sm" :to="{path : '/kontribusi-single-file'}">
							<i class="fa fa-plus"></i> Input Kontribusi 1 Bukti Setor
						</router-link>
						<router-link class="btn btn-primary btn-sm" :to="{path : '/select-bukti-setor'}">
							<i class="fa fa-plus"></i> UPLOAD / EDIT BUKTI SETOR
						</router-link>
					</div>
				</div>
				<div class="table__scroll" :style='{"position" : "relative", "min-height" : "200px","max-height" : "600px", "overflow" : "scroll"}'>
					<table class="table table-bordered table-striped table-hover datatable" :style='{"width" : "1200px", "font-size" : "12px"}'>
						<thead>
							<tr>
								<th class="text-center">#</th>
								<th class="text-center">Bulan</th>
								<th class="text-center">Tahun</th>
								<th class="text-center">Daerah</th>
								<th class="text-center">Nama Anggota</th>
								<th class="text-center">Status</th>
								<th class="text-center">THP</th>
								<th class="text-center">DPP</th>
								<th class="text-center">DPD</th>
								<th class="text-center">DPC</th>
								<th class="text-center">Tanggal Setor</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in list_kontribusi">
								<td>
									<router-link 
										class="btn btn-link btn-sm" 
										style="color: #efd103" 
										:to="{path : '/edit-kontribusi/'+item.id}"
										v-if="userdata.sess_role_id != 4"
									>
										<i class="fa fa-edit"></i>
									</router-link>

									<!-- <router-link 
										class="btn btn-link btn-sm" 
										style="color: #13c90a" 
										:to="{path : '/verify/'+item.id}"
										v-if="userdata.sess_role_id != 3 && item.BUKTI_SETOR != 0"
									>
										<i class="fa fa-check"></i>
									</router-link> -->
								</td>
								<td>{{ item.bulan }}</td>
								<td>{{ item.tahun }}</td>
								<td>
									<span v-if="item.id_kab == null">
										{{ item.provinsi }}
									</span>
									<span v-else>
										{{ item.kab_kota }}
									</span>
								</td>
								<td>{{ item.NAMA_ANGGOTA }}</td>
								<td class="text-center">
									<template v-if="item.BUKTI_SETOR != 0 && item.status == 1">
										<div class="badge badge-warning">
											MENUNGGU VERIFIKASI
										</div>
									</template>
									<template v-else-if="item.status == 2">			
										<div class="badge badge-success">
											TERVERIFIKASI
										</div>
									</template>
									<template v-else>
										<div class="badge badge-danger">
											BELUM ADA BUKTI SETOR
										</div>
									</template>
								</td>
								<td class="text-right">{{ $root.formatNumber(item.thp) }}</td>
								<td class="text-right">{{ $root.formatNumber(item.dpp) }}</td>
								<td class="text-right">{{ $root.formatNumber(item.dpd) }}</td>
								<td class="text-right">{{ $root.formatNumber(item.dpc) }}</td>
								<td class="text-center" width="150px">{{ item.SETOR }}</td>
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
						<h4 class="modal-title">Upload File Kontribusi</h4>
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