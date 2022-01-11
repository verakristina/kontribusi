const MASTER_CALEG = {
	data : function() {
		return {
			form : {
				type : "",
				id : "",
				id_pemilihan : "",
				id_dapil : "",
				id_prov : "",
				id_partai : "",
				nama_partai : "",
				nama_prov : "",
				nama_dapil : "",
				nama_pemilihan : "",
				nama_calon : "",
			},
			dataList : {
				pemilihan : [],
				dapilList : [],
				calegList : [],
				provinsi : [],
				partai : []
			},
			state : {
				showDapil : false,
				showProv : false,
				showCity : false
			}
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Master Caleg");
	},
	mounted : function(){
		var v = this;

		v.getPemilihan();
		v.getPartai();
	},
	computed : {
		cekIdPemilihan : function(){
			var v = this;

			if(v.form.id_partai == ""){
				return true;
			}else{
				return false;
			}
		}
	},
	methods : {
		createDapil : function(){
			var v = this;
			v.$root.showLoading("Mohon tunggu..");
			$.ajax({
				type : "POST",
				url : BASE_URL+"caleg/data_proses",
				data : v.form,
				success:function(resp){
					if(resp.status == "success"){
						v.$root.showSuccess("Data berhasil disimpan")
						v.getCalegList();
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
			v.$set(v.dataList, "dapilList", []);

			var chosen = _.find(v.dataList.pemilihan, function(o){
				return o.id == v.form.id_pemilihan	
			});

			if(chosen.tipe_pemilihan == "DPR RI"){
				v.$set(v.state, "showDapil", true);
				v.$set(v.state, "showProv", false);
				v.$set(v.state, "showCity", false);
				v.getDapilDPR();
			}else if(chosen.tipe_pemilihan == "DPRD I"){
				v.$set(v.state, "showProv", true);
				v.$set(v.state, "showDapil", true);
				if(v.form.id_prov != ""){
					v.getDapilProv();
				}else{
					v.getProv();
				}
			}else if(chosen.tipe_pemilihan == "DPRD II"){
				alert("WAIT, NGAMBIL PROV., KAB., KOTA DULU");
			}else{
				alert("OH, DPD YA? WAIT");
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
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					})
					swal.close();
				},
				error:function(){
					swal.close();
				}
			})
		},
		getDapilDPR : function(){
			var v = this;
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getDapil",
				data : {
					id_pemilihan : v.form.id_pemilihan
				},
				success:function(resp){
					v.$set(v.dataList, "dapilList", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					})
				},
				error:function(){
				}
			});
		},
		getCalegList : function(){
			var v = this;
			v.$root.showLoading("Mengambil data calon legislatif..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getCalegList",
				data : {
					id_dapil : v.form.id_dapil,
					id_partai : v.form.id_partai
				},
				success:function(resp){
					v.$set(v.dataList, "calegList", resp.data);
					swal.close();
				}
			})
		},
		showModal : function(state, item = null){
			var v = this;

			v.$set(v.form, "type", state);

			if(state == "add"){
				v.$set(v.form, "nama_calon", "");
				var jenis = _.find(v.dataList.pemilihan, function(o){
					return o.id == v.form.id_pemilihan
				});
				var dapil = _.find(v.dataList.dapilList, function(o){
					return o.id == v.form.id_dapil
				});

				var partai = _.find(v.dataList.partai, function(o){
					return o.id == v.form.id_partai
				});

				v.$set(v.form, "nama_pemilihan", jenis.tipe_pemilihan)
				v.$set(v.form, "nama_dapil", dapil.nama_dapil)
				v.$set(v.form, "nama_partai", partai.nama_partai)
			}else if(state == "edit"){
				var jenis = _.find(v.dataList.pemilihan, function(o){
					return o.id == v.form.id_pemilihan
				});
				var dapil = _.find(v.dataList.dapilList, function(o){
					return o.id == v.form.id_dapil
				});

				v.$set(v.form, "id", item.id);
				v.$set(v.form, "nama_calon", item.nama_calon);
				v.$set(v.form, "nama_pemilihan", item.tipe_pemilihan)
				v.$set(v.form, "nama_dapil", item.nama_dapil);
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
				url : BASE_URL+"caleg/deleteData",
				data : {
					id : v.form.id
				},
				success:function(resp){
					if(resp.status == "success"){
						v.$root.showSuccess("Data berhasil dihapus!");
						v.getCalegList();
					}else{
						v.$root.showError("Data gagal dihapus!");
					}
				},
				error:function(e){
					v.$root.showError("Terjadi kesalahan!");
				}
			})
		},
		getPartai : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getPartai",
				success:function(resp){
					v.$set(v.dataList, "partai", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					});
				},
				error:function(e){
					v.$root.showError("Gagal mengambil data!");
				}
			})
		},
		changePartai : function(){
			var v = this;
			v.$set(v.form, "id_partai", "");
			v.$nextTick(() => {
				$(".selectpicker").selectpicker("refresh");
			})
		}
	},
	template : `
	<div class="card">
		<div class="card-header card-header-icon card-header-warning">
			<div class="card-icon">
				<i class="material-icons">list</i>
			</div>
			<h4 class="card-title">MASTER CALEG</h4>
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
				<div class="col-md-3 col-sm-6 col-12" v-if="state.showDapil">
					<div class="form-group">
						<label>Dapil</label>
						<select class="selectpicker form-control" v-model="form.id_dapil" v-on:change="changePartai">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.dapilList">
								<option v-bind:value="item.id">{{ item.nama_dapil }}</option>
							</template>
						</select>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 col-12">
					<div class="form-group">
						<label>Partai</label>
						<select class="selectpicker form-control" v-model="form.id_partai" v-on:change="getCalegList">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.partai">
								<option v-bind:value="item.id">{{ item.nama_partai }}</option>
							</template>
						</select>
					</div>
				</div>
			</div>
			<button class="btn btn-primary btn-sm float-right" 
					v-bind:disabled="cekIdPemilihan"
					v-on:click="showModal('add')">
				<i class="fa fa-plus"></i>
				TAMBAH CALEG
			</button>
			<table class="table table-bordered table-striped table-hover">
				<thead>
					<tr>
						<th width="90px">No</th>
						<th class="text-center">CALEG</th>
						<th class="text-right">*</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in dataList.calegList">
						<td>{{ (index+1) }}</td>
						<td>{{ item.nama_calon }}</td>
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
						<h4 class="modal-title">Form Caleg</h4>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label>Jenis Pemilihan</label>
							<input type="text" class="form-control" disabled="true" v-model="form.nama_pemilihan" />
						</div>
						<div class="form-group">
							<label>Dapil</label>
							<input type="text" class="form-control" disabled="true" v-model="form.nama_dapil" />
						</div>
						<div class="form-group">
							<label>Partai</label>
							<input type="text" class="form-control" disabled="true" v-model="form.nama_partai" />
						</div>
						<div class="form-group">
							<label>Nama Caleg</label>
							<input type="text" class="form-control" v-model="form.nama_calon"
								@keyup.enter="createDapil"
							/>
						</div>
						<button class="btn btn-primary" v-on:click="createDapil">SIMPAN</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
}