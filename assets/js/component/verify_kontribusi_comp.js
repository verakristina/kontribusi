const VERIFY_KONTRIBUSI = {
	data : function() {
		return {
            userdata : [],
            id_kontribusi : "",
            detail : [],
            file : [],
            temp_img : ""
		}
	},
	created : function(){
		const v = this;
        store.commit("changeNavTitle", "Verifikasi Kontribusi"); // JUDUL PAGE
        v.$set(v, "id_kontribusi", v.$route.params.id)
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
                v.getDataDetail();
			}else{
                window.location=BASE_URL
            }
        },
        getDataDetail : function(){
            var v = this;
            $.ajax({
                type : "GET",
                url : BASE_URL+"api/get_verifikasi_data",
                data : {
                    id_kontribusi : v.id_kontribusi
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v, "detail", resp.data.detail[0]);
                        v.$set(v, "file", resp.data.file);
                        v.$nextTick(() => {
                            swal.close();
                            v.$root.dropifyInit();
                        });
                    }else{
                        v.$root.showError("Gagal mengambil data");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal mengambil data");
                }
            });
        },
        subStr : function(f_name){
            var v = this;
            f_name = f_name.substr(1);
            return f_name;
        },
        getFile: function(index) {
            var v = this;
            console.log(v.$refs.file[index].files[0]);
			v.$set(v.file[index], "verifikasi", v.$refs.file[index].files[0]);
        },
        saveVerify : function(){
            var v = this;

            var f_data = new FormData();
            var c_file = 0;
            _.forEach(v.file, function(value, key){
                if(value.verifikasi != null){
                    f_data.append("id[]", value.id);
                    f_data.append("verifikasi[]", value.verifikasi);
                    c_file++;
                }
            });
            f_data.append("id_kontribusi", v.detail.id);
            f_data.append("tanggal_verifikasi", v.detail.tanggal_verifikasi);

            if(c_file != v.file.length){
                v.$root.showError("Upload semua file verifikasi!");
                return false;
            }
            v.$root.showLoading("Menyimpan..");
            $.ajax({
                type : "POST",
                method : "POST",
                url : BASE_URL+"api/save_verifikasi_kontribusi",
                data : f_data,
                enctype: "multipart/form-data",
                cache: false,
                contentType: false,
                processData: false,
                success: function(resp) {
                    if(resp.code == 200){
                        v.$root.showSuccess("Berhasil melakukan verifikasi!")
                        window.location=BASE_URL+"list-kontribusi";
                    }else{
                        v.$root.showError("Proses gagal!");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal!");
                }
            })
        },
        viewImg : function(img){
            var v = this;
            v.$set(v, "temp_img", BASE_URL+img);
            v.$nextTick(() => {
                $("#modal-img").modal('show');
            });
        }
	},
    template : `
    <div>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-check fa-2x"></i>
                </div>
                <div class="card-title">
                    Verifikasi Kontribusi
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
                    <div class="col-md-4">
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
                            <input type="date" class="form-control" v-model="detail.tanggal_setor" readonly>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>THP</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="detail.thp" readonly>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>DPP</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="detail.dpp" readonly>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>DPD</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="detail.dpd" readonly>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>DPC</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="detail.dpc" readonly>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="row my-2">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Tanggal Verifikasi</label>
                            <input type="date" class="form-control" v-model="detail.tanggal_verifikasi">
                        </div>
                    </div>
                </div>
                <table class="table">
                    <tr>
                        <th class="text-center">Bukti Setor</th>
                        <th class="text-center">Nominal</th>
                        <th class="text-center">Verifikasi Rekening Koran</th>
                    </tr>
                    <tr v-for="(it, ind) in file">
                        <td width="30%">
                            <img v-bind:src="BASE_URL+subStr(it.bukti_setor)" class="w-75 mx-auto c-pointer" v-on:click="viewImg(it.bukti_setor)">
                        </td>
                        <td>
                            {{ $root.formatNumber(it.nominal) }}
                        </td>
                        <td>
                            <input type="file" 
                                ref="file" 
                                class="dropify" 
                                data-allowed-file-extensions="jpg png jpg jpeg" 
                                v-if="it.verifikasi != null"
                                :data-default-file="BASE_URL+subStr(it.verifikasi)"
                                v-on:change="getFile(ind)"
                            >
                            <input type="file" 
                                ref="file" 
                                class="dropify" 
                                data-allowed-file-extensions="jpg png jpg jpeg" 
                                v-else
                                v-on:change="getFile(ind)"
                            >
                        </td>
                    </tr>
                </table>
                <button class="btn btn-primary" v-on:click="saveVerify">SAVE</button>
            </div>
        </div>
        <div class="modal fade" id="modal-img">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">&times;</button>
                        <div class="modal-title">
                            Bukti Setor
                        </div>
                    </div>
                    <div class="modal-body">
                        <img :src="temp_img" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>        
    `
}