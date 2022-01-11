const PEMILIHAN = {
	data : function() {
		return {
			dataList : [],
			form : {
				type : "add",
				pemilihan : "",
				id : 0
			}
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Master Jenis Pemilihan");
	},
	mounted : function(){
		var v = this;
		v.getData();
	},
	methods : {
		getData : function(){
			var v = this;
			v.$root.showLoading("Mohon tunggu..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"pemilihan/getData",
				success:function(resp){
					if(resp.status == "success"){
						v.$set(v, "dataList", resp.data);
					}
					swal.close();
				}
			})
		},
		simpanPemilihan : function(){
			var v = this;
			v.$root.showLoading("Mohon tunggu..");
			$.ajax({
				type : "POST",
				url : BASE_URL+"pemilihan/data_proses",
				data : v.form,
				success:function(resp){
					if(resp.status == "success"){
						v.$root.showSuccess("Data berhasil disimpan")
						v.getData();
					}else if(resp.status == "exist"){
						v.$root.showError("Data sudah ada!");
					}else{
						v.$root.showError("Gagal menyimpan data!");
					}
					$("#modal-form").modal('hide');
				},
				error:function(e){
					v.$root.showError("Terjadi kesalahan!");
				}
			});
		},
		addData : function(){
			var v = this;
			v.$set(v.form, "type", "add");
			v.$set(v.form, "pemilihan", "");

			$("#modal-form").modal('show');
		},
		editData : function(item){
			var v = this;

			v.$set(v.form, "type", "edit");
			v.$set(v.form, "pemilihan", item.tipe_pemilihan);
			v.$set(v.form, "id", item.id);

			$("#modal-form").modal('show');
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
				url : BASE_URL+"pemilihan/deleteData",
				data : {
					id : v.form.id
				},
				success:function(resp){
					if(resp.status == "success"){
						v.$root.showSuccess("Data berhasil dihapus!");
						v.getData();
					}else{
						v.$root.showError("Data gagal dihapus!");
					}
				},
				error:function(e){
					v.$root.showError("Terjadi kesalahan!");
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
			<h4 class="card-title">MASTER JENIS PEMILIHAN</h4>
		</div>
		<div class="card-body">
			<button class="btn btn-primary btn-sm" v-on:click="addData">
				<i class="fa fa-plus"></i>
				TAMBAH PEMILIHAN
			</button>
			<table class="table table-bordered table-striped table-hover w-50">
				<thead>
					<tr>
						<th width="90px">No</th>
						<th class="text-center">Jenis Pemilihan</th>
						<th class="text-right">*</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in dataList"">
						<td>{{ (index+1) }}</td>
						<td>{{ item.tipe_pemilihan }}</td>
						<td class="text-right">
							<button class="btn btn-sm btn-warning" v-on:click="editData(item)">
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
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label>Nama Pemilihan</label>
							<input type="text" class="form-control" v-model="form.pemilihan"
								@keyup.enter="simpanPemilihan"
								/>
						</div>
						<button class="btn btn-primary" v-on:click="simpanPemilihan">SIMPAN</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
}