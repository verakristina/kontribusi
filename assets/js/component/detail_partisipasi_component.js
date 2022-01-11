const DETAIL_PARTISIPASI = {
	data : function() {
		return {
			nama_anggota : 0,
			biodata : [],
			detail_list : []
		}
    },
    created : function(){
        var v = this;
        v.$set(v, "nama_anggota", v.$route.params.id);
		store.commit("changeNavTitle", "Detail Partisipasi");
	},
	mounted : function(){
		var v = this;
		v.getDataDetail();
		v.$nextTick(() => {
            v.$root.dropifyInit();
        })
	},
	methods : {
		getDataDetail : function(){
			var v = this;
			v.$root.showLoading("Mengambil data..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/get_individual_data_partisipasi",
				data : {nama_anggota : v.nama_anggota},
				success:function(resp){
					if(resp.code == 200){
						v.$set(v, "biodata", resp.data[0]);
						v.$set(v, "detail_list", resp.data);
                        swal.close();
					}else{
						v.$root.showError("Gagal mengambil data..");
					}
				},
				error:function(e){
                    v.$root.showError("Gagal mengambil data");
                }
			})
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
	<router-link class="btn btn-danger" :to="{ path : '/list-partisipasi' }">
			<i class="fa fa-arrow-left"></i> Kembali
		</router-link>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-book fa-2x"></i>
                </div>
                <div class="card-title">
                    Detail Anggota
                </div>
            </div>
			
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Nama Anggota</label>
							<label class="form-control"> {{biodata.NAMA_ANGGOTA}} </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Provinsi</label>
							<label class="form-control"> {{biodata.provinsi}} </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Kabupaten / Kota</label>
							<label class="form-control"> {{biodata.kab_kota}} </label></div>
                    </div>
                </div>

				<div class="pull-right">
						<!-- <button class="btn btn-success btn-sm" v-on:click="openModal()">
							<i class="fa fa-upload"></i>
							UPLOAD FILE
						</button> -->
						<!-- '/edit-partisipasi/'+item.id_partisipasi -->
						<router-link class="btn btn-primary btn-sm" :to="{path : '/input-partisipasi/'+biodata.id+'/'+biodata.id_prov+'/'+biodata.id_kab}">
							<i class="fa fa-plus"></i> Input Data Partisipasi
						</router-link>
					</div>
            </div>
        </div>

		<div>
		<div class="card">
			<div class="card-header card-header-icon card-header-warning">
				<div class="card-icon">
					<i class="fa fa-list fa-2x"></i>
				</div>
				<div class="card-title">
					Detail Dana
				</div>
			</div>
			<div class="card-body">
				<div class="table__scroll" :style='{"position" : "relative", "min-height" : "200px","max-height" : "700px", "overflow" : "scroll"}'>
					<table class="table table-bordered table-striped table-hover datatable" :style='{"width" : "1000px", "font-size" : "12px"}'>
						<thead>
							<tr>
								<th class="text-center">#</th>
								<th class="text-center">Tahun</th>
								<th class="text-center">Dana</th>
                                <th class="text-center">Tanggal setor</th>
							</tr>
                        </thead>
						<tbody>
							<tr v-for="(item, index) in detail_list">
							<template v-if="item.id_partisipasi != null">
								<td width="20px">
                                <router-link class="btn btn-link btn-sm" style="color: #4FA125" :to="{path : '/edit-partisipasi/'+item.id_partisipasi}">
										<i class="fa fa-edit"></i>
									</router-link>
								</td>
                                <td>
								{{ item.tahun }}
								</td>
								<td> {{ $root.formatNumber(item.dana_partisipasi) }}</td>
                                <td>
								{{ item.tanggal_setor }}
								</td>
								</template>
								<template v-else>
									<td colspan="1000px">
								<marquee>
								<h4> Data Masih Kosong ! </h4>
								</marquee>
							</td>
							</template>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
    </div>

    </div>
    `
}