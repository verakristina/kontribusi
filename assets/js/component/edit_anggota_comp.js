const EDIT_ANGGOTA = {
	data : function() {
		return {
            userdata : [],
            anggota_dewan : [],
            id_anggota : ""
		}
	},
	created : function(){
		const v = this;
        store.commit("changeNavTitle", "Edit Anggota Dewan"); // JUDUL PAGE
        v.$set(v, "id_anggota", v.$route.params.id)
	},
	mounted : function(){
		var v = this;
		v.get_session();
	},
	methods : {
		get_session : function(){
			var v = this;
            v.$root.showLoading("Mengambil data..");
			v.$root.get_session(v.getSessionCallback);
		},
		getSessionCallback : function(resp){
			var v = this;
			if(resp.code == 200){
                v.$set(v, "userdata", resp.data);
                swal.close();
				v.searchDewan();
			}
        },
        searchDewan : function(){
            var v = this;

            v.$root.showLoading("Mengambil data anggota dewan..");

            $.ajax({
                type : "GET",
                url : BASE_URL+"services/get_dewan",
                data : {
                    id_anggota : v.id_anggota
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v, "anggota_dewan", resp.data[0])
                        v.$nextTick(() => {
                            swal.close();
                        });
                    }else{
                        v.$root.showError("Gagal mengambil data!");
                    }
                },
                error:function(){
                    v.$root.showError("Gagal mengambil data!");
                }
            })
        },
        saveForm : function(){
            var v = this;

            v.$root.showLoading("Menyimpan..")
            $.ajax({
                type : "POST",
                url : BASE_URL+"services/edit_anggota",
                data : v.anggota_dewan,
                success:function(resp){
                    if(resp.code == 200){
                        v.$root.showSuccess("Data berhasil disimpan!");
                        window.location=BASE_URL+"anggota-dewan";
                    }else{
                        v.$root.showError("Gagal menyimpan data!");
                    }
                },
                error:function(){

                }
            })
        }
	},
    template : `
    <div>
        <router-link class="btn btn-danger" :to="{path : '/anggota-dewan'}">
            <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-edit fa-2x"></i>
                </div>
                <div class="card-title">
                    Edit Anggota Dewan
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <div class="form-group">
                            <label>Nama</label>
                            <input type="text" class="form-control" v-model="anggota_dewan.nama_anggota">
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <div class="form-group">
                            <label>Jabatan</label>
                            <input type="text" class="form-control" v-model="anggota_dewan.jabatan">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3 col-lg-3">
                        <div class="form-group">
                            <label>No. Telp</label>
                            <input type="text" class="form-control" v-model="anggota_dewan.no_telp">
                        </div>
                    </div>
                    <div class="col-md-3 col-lg-3">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="text" class="form-control" v-model="anggota_dewan.email">
                        </div>
                    </div>
                    <div class="col-md-3 col-lg-3">
                        <div class="form-group">
                            <label>Take Home Pay</label>
                            <input type="nuber" min="0" step="1"class="form-control" v-model="anggota_dewan.thp">
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" v-on:click="saveForm">
                    SIMPAN
                </button>
            </div>
        </div>
    </div>
    `
}