const EDIT_KONTRIBUSI = {
	data : function() {
		return {
            id_kontribusi : 0,
            detail : []
		}
	},
	created : function(){
        var v = this;
        v.$set(v, "id_kontribusi", v.$route.params.id);
        store.commit("changeNavTitle", "Edit Kontribusi");
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
                url : BASE_URL+"api/get_individual_data",
                data : {
                    id_kontribusi : v.id_kontribusi
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v, "detail", resp.data[0]);
                        swal.close();
                    }else{
                        v.$root.showError("Gagal mengambil data");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal mengambil data");
                }
            });
        },
        getFile: function() {
			var v = this;
			console.log(v.$refs.file.files[0]);
			v.$set(v.detail, "files", v.$refs.file.files[0]);
        },
        saveForm : function(){
            var v = this
            v.$root.showLoading("Menyimpan..");

            var f_data = new FormData();

            for(key in v.detail){
                f_data.append(key, v.detail[key]);
            }

            $.ajax({
                type : "POST",
                method : "POST",
                url : BASE_URL+"api/update_kontribusi",
                data : f_data,
                enctype: "multipart/form-data",
                cache: false,
                contentType: false,
                processData: false,
                success: function(resp) {
                    if(resp.code != 200){
                        v.$root.showError("Gagal! Error : "+resp.message);
                    }else{
                        v.$root.showSuccess("Proses selesai");
                        window.location=BASE_URL+"list-kontribusi";
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal!");
                }
            })
        }
	},
    template: `
    <div>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-edit fa-2x"></i>
                </div>
                <div class="card-title">
                    Edit Kontribusi
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Nama Anggota</label>
                            <input type="text" class="form-control" v-model="detail.NAMA_ANGGOTA" readonly>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Provinsi</label>
                            <input type="text" class="form-control" v-model="detail.provinsi" readonly>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Kabupaten / Kota</label>
                            <input type="text" class="form-control" v-model="detail.kab_kota" readonly>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Bulan</label>
                            <input type="text" class="form-control" v-model="detail.bulan" readonly>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Tahun</label>
                            <input type="text" class="form-control" v-model="detail.tahun" readonly>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Tanggal Setor</label>
                            <input type="date" class="form-control" v-model="detail.tanggal_setor">
                        </div>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>THP</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="detail.thp">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>DPP</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="detail.dpp">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>DPD</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="detail.dpd">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>DPC</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="detail.dpc">
                        </div>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Bukti Setor</label>
                            <input type="file" ref="file" class="dropify" v-on:change="getFile">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Catatan</label>
                            <textarea class="form-control" name="catatan" id="catatan" cols="30" rows="5" v-model="detail.catatan"></textarea>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" v-on:click="saveForm">SAVE</button>
            </div>
        </div>
    </div>
    `
}