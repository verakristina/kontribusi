const MASTER_DAPIL = {
	data : function() {
		return {
			form : {
				type : "",
				dapil : "",
				id_pemilihan : "",
				id_prov : "",
				id_kab : "",
				nama_pemilihan : "",
				nama_prov : "",
				nam_kab : "",
				id : ""
			},
			state : {
				showProv : false,
				showCity : false
			},
			dataList : {
				pemilihan : [],
				dapilList : [],
				provinsi : [],
				kokab : []
			}
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Master Data Dapil");
	},
	mounted : function(){
		var v = this;

		v.getPemilihan();
	},
	computed : {
		cekIdPemilihan : function(){
			var v = this;

			if(v.form.id_pemilihan == ""){
				return true;
			}else{
				if(v.form.id_pemilihan == 2 && v.form.id_prov == ""){
					return true;
				}else if(v.form.id_pemilihan == 3 && v.form.id_kab == ""){
					return true;
				}else{
					return false;
				}
			}
		}
	},
	methods : {
		createDapil : function(){
			var v = this;
			v.$root.showLoading("Mohon tunggu..");
			$.ajax({
				type : "POST",
				url : BASE_URL+"dapil/data_proses",
				data : v.form,
				success:function(resp){
					if(resp.status == "success"){
						v.$root.showSuccess("Data berhasil disimpan")
						v.getDapilList();
					}else if(resp.status == "exist"){
						v.$root.showError("Data sudah ada!");
					}else{
						v.$root.showError("Gagal menyimpan data!");
					}
					$("#modal-form").modal('hide');
				},
				error:function(){
					v.$root.showError("Gagal menyimpan data!");
				}
			})
		},
		getPemilihan : function(){
			var v = this;
			v.$root.showLoading("Mohon tunggu..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getPemilihan",
				success:function(resp){
					v.$set(v.dataList, "pemilihan", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
						swal.close();
					})
				}
			});
		},
		getDapilList : function(){
			var v = this;
			var chosen = _.find(v.dataList.pemilihan, function(o){
				return o.id == v.form.id_pemilihan	
			});

			if(chosen.tipe_pemilihan == "DPR RI"){
				v.$set(v.state, "showProv", false);
				v.$set(v.state, "showCity", false);
				v.getDapilDPR();
			}else if(chosen.tipe_pemilihan == "DPRD I"){
				v.$set(v.state, "showProv", true);
				if(v.form.id_prov != ""){
					v.getDapilProv();
				}else{
					v.getProv();
				}
			}else{
				v.$set(v.state, "showProv", true);
				if(v.form.id_kab != ""){
					v.getDapilKokab();
				}else if(v.form.id_prov != ""){
					v.getKokab();
				}else{
					v.getProv();
				}
			}
		},
		getProv : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getProv",
				success:function(resp){
					v.$set(v.dataList, "provinsi", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					});
				}
			})
		},
		getDapilProv : function(){
			var v = this;

			v.$root.showLoading("Mengambil data DAPIL");
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getDapil",
				data : {
					id_pemilihan : v.form.id_pemilihan,
					id_prov : v.form.id_prov
				},
				success:function(resp){
					v.$set(v.dataList, "dapilList", resp.data);
					swal.close();
				},
				error:function(){
					swal.close();
				}
			})
		},
		getDapilDPR : function(){
			var v = this;

			v.$set(v.dataList, "dapilList", []);
			v.$root.showLoading("Mengambil data DAPIL");
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getDapil",
				data : {
					id_pemilihan : v.form.id_pemilihan
				},
				success:function(resp){
					v.$set(v.dataList, "dapilList", resp.data);
					swal.close();
				},
				error:function(){
					swal.close();
				}
			});
		},
		showModal : function(state, item = null){
			var v = this;

			v.$set(v.form, "type", state);

			if(state == "add"){
				var jenis = _.find(v.dataList.pemilihan, function(o){
					return o.id == v.form.id_pemilihan
				});

				if(v.form.id_pemilihan == 2){
					var pro = _.find(v.dataList.provinsi, function(o){
						return o.id == v.form.id_prov;
					});
					v.$set(v.form, "nama_prov", pro.provinsi)
				}else if(v.form.id_pemilihan == 3){
					var pro = _.find(v.dataList.provinsi, function(o){
						return o.id == v.form.id_prov;
					});
					var kab = _.find(v.dataList.kokab, function(o){
						return o.id == v.form.id_kab;
					});
					v.$set(v.form, "nama_prov", pro.provinsi)
					v.$set(v.form, "nama_kab", kab.kab_kota)
				}else{

				}

				v.$set(v.form, "nama_pemilihan", jenis.tipe_pemilihan)
			}else if(state == "edit"){
				var jenis = _.find(v.dataList.pemilihan, function(o){
					return o.id == item.id_pemilihan
				});

				if(v.form.id_pemilihan == 2){
					var pro = _.find(v.dataList.provinsi, function(o){
						return o.id == item.id_prov;
					});
					v.$set(v.form, "nama_prov", pro.provinsi)
				}

				v.$set(v.form, "id", item.id);
				v.$set(v.form, "dapil", item.nama_dapil);
				v.$set(v.form, "nama_pemilihan", jenis.tipe_pemilihan)
			}

			$("#modal-form").modal()
		},
		confirmDelete : function(id){
			var v = this;

			v.$set(v.form, "id", id);

			v.$root.showConfirmation("Konfirmasi", 
				"Apakah anda yakin akan menghapus data ini?",
				v.deleteData
			);
		},
		deleteData : function(){
			var v = this;
			v.$root.showLoading("Mohon tunggu..");
			$.ajax({
				type : "POST",
				url : BASE_URL+"dapil/deleteData",
				data : {
					id : v.form.id
				},
				success:function(resp){
					if(resp.status == "success"){
						v.$root.showSuccess("Data berhasil dihapus!");
						v.getDapilList();
					}else{
						v.$root.showError("Data gagal dihapus!");
					}
				},
				error:function(e){
					v.$root.showError("Terjadi kesalahan!");
				}
			})
		},
		getKokab : function(){
			var v = this;
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getKokab",
				data : {
					id_prov : v.form.id_prov
				},
				success:function(resp){
					v.$set(v.state, "showCity", true);
					v.$set(v.dataList, "kokab", resp);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					});
				},
				error:function(e){
					v.$root.showError("Permintaan gagal!");
					console.log(e);
				}
			})
		},
		getDapilKokab : function(){
			var v = this;
			v.$root.showLoading("Mengambil DAPIL Kab. / Kota");
			
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getDapil",
				data : {
					id_pemilihan : v.form.id_pemilihan,
					id_prov : v.form.id_prov,
					id_kab : v.form.id_kab
				},
				success:function(resp){
					v.$set(v.dataList, "dapilList", resp.data);
					swal.close();
				},
				error:function(e){
					v.$root.showError("Gagal mengambil data!");
					console.log(e);
				}
			})
		}
	},
	template : `
	<div class="card">
		<div class="card-header card-header-icon card-header-warning">
			<div class="card-icon">
				<i class="material-icons">list</i>
			</div>
			<h4 class="card-title">MASTER DATA DAPIL</h4>
		</div>
		<div class="card-body">
			<div class="row">
				<div class="col-md-3 col-sm-6 col-12">
					<div class="form-group">
						<label>Jenis Pemilihan</label>
						<select class="selectpicker form-control" v-model="form.id_pemilihan" v-on:change="getDapilList">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.pemilihan">
								<option v-bind:value="item.id">{{ item.tipe_pemilihan }}</option>
							</template>
						</select>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 col-12" v-if="state.showProv">
					<div class="form-group">
						<label>Provinsi</label>
						<select class="selectpicker form-control" v-model="form.id_prov" v-on:change="getDapilList">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.provinsi">
								<option v-bind:value="item.id">{{ item.provinsi }}</option>
							</template>
						</select>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 col-12" v-if="state.showCity">
					<div class="form-group">
						<label>Kab. / Kota</label>
						<select class="selectpicker form-control" v-model="form.id_kab" v-on:change="getDapilList">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.kokab">
								<option v-bind:value="item.id">{{ item.kab_kota }}</option>
							</template>
						</select>
					</div>
				</div>
			</div>
			<button class="btn btn-primary btn-sm float-right" 
					v-bind:disabled="cekIdPemilihan"
					v-on:click="showModal('add')">
				<i class="fa fa-plus"></i>
				TAMBAH DAPIL
			</button>
			<table class="table table-bordered table-striped table-hover">
				<thead>
					<tr>
						<th width="90px">No</th>
						<th class="text-center">Jenis Pemilihan</th>
						<th class="text-center">Nama Dapil</th>
						<th class="text-right">*</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in dataList.dapilList">
						<td>{{ (index+1) }}</td>
						<td>{{ item.tipe_pemilihan }}</td>
						<td>{{ item.nama_dapil }}</td>
						<td class="text-right">
							<button class="btn btn-sm btn-warning" v-on:click="showModal('edit', item)">
								<i class="fa fa-pencil"></i>
							</button>
							<button class="btn btn-sm btn-danger" v-on:click="confirmDelete(item.id)">
								<i class="fa fa-trash"></i>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="modal fade" id="modal-form">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Form Dapil</h4>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label>Jenis Pemilihan</label>
							<input type="text" class="form-control" disabled="true" v-model="form.nama_pemilihan" />
						</div>
						<div class="form-group" v-if="state.showProv">
							<label>Provinsi</label>
							<input type="text" class="form-control" disabled="true" v-model="form.nama_prov" />
						</div>
						<div class="form-group" v-if="state.showCity">
							<label>Kab. / Kota</label>
							<input type="text" class="form-control" disabled="true" v-model="form.nama_kab" />
						</div>
						<div class="form-group">
							<label>Nama Dapil</label>
							<input 
								type="text" 
								class="form-control" 
								v-model="form.dapil"
								@keyup.enter="createDapil"/>
						</div>
						<button class="btn btn-primary" v-on:click="createDapil">SIMPAN</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
}