const VERIFY_PARTISIPASI_NEW = {
	data : function() {
		return {
            userdata : [],
            unique_id : "",
            detail : [],
            file : [],
            temp_img : "",
            tanggal_verifikasi : "",
            param : {
                uri : {
                    month : 0,
                    year : 0,
                    with_save : ""
                }
            }
		}
	},
	created : function(){
		const v = this;
        store.commit("changeNavTitle", "Verifikasi Partisipasi"); // JUDUL PAGE
        v.$set(v, "unique_id", v.$route.params.id)
        v.$set(v, "tanggal_verifikasi", v.$route.params.tanggal_verifikasi)

        v.$set(v.param.uri, "month", v.$route.query.month);
        v.$set(v.param.uri, "year", v.$route.query.year);
        if(v.$route.query.with_save != null){
            v.$set(v.param.uri, "with_save", v.$route.query.with_save);
        }
	},
	mounted : function(){
        var v = this;
		v.get_session();
        v.getDataD();
	},
	methods : {
        getDataD : function(){
            var v = this;
            $.ajax({
                type : "GET",
                url : BASE_URL+"api/get_tanggal",
                data : {
                    unique_id : v.unique_id
                },
                success:function(resp){
                    if(resp.code ==200){
                        v.$set(v, "detail", resp.data.data_list);
                        v.$set(v, "file", resp.data.file_list);
                        v.$set(v, "tanggal_verifikasi", resp.data.tanggal_verifikasi);
                        v.$nextTick(() =>{
                            swal.close();
                            v.$root.dropifyInit();
                        });
                    }else{
                        v.$root.showError("Gagal Mengambil tanggal");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal mengambil tanggal");
                }
            });
        },
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
                if(v.userdata.sess_role_id == 1){
					v.$root.get_prov(v.getProvCallback);
				}else{
					v.$root.get_prov_by_user(v.userdata.sess_user_id, v.getProvCallback);
				}
			}else{
                window.location=BASE_URL
            }
        },
        getProvCallback : function(resp){
			var v = this;
			v.$set(v.dataList, "prov_list", resp.data);
			v.$nextTick(() => {
				v.getDataDetail();
				swal.close();
				$(".selectpicker").selectpicker('refresh');
			});
		},
        getDataDetail : function(){
            var v = this;
            $.ajax({
                type : "GET",
                url : BASE_URL+"api/get_verif_partisipasi",
                data : {
                    unique_id : v.unique_id
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v, "detail", resp.data.detail[0]);
                        v.$set(v, "file", resp.data.file_list);
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
                    f_data.append("id[]", value.ID_PARTISIPASI);
                    f_data.append("verifikasi[]", value.verifikasi);
                    c_file++;
                }
            });
            f_data.append("unique_id", v.unique_id);
            f_data.append("tanggal_verifikasi", v.tanggal_verifikasi);

            if(v.tanggal_verifikasi == ""){
                v.$root.showError("Pilih tanggal verifikasi!");
                return false;
            }

            v.$root.showLoading("Menyimpan..");
            $.ajax({
                type : "POST",
                method : "POST",
                url : BASE_URL+"api/save_verifikasi_partisipasi",
                data : f_data,
                enctype: "multipart/form-data",
                cache: false,
                contentType: false,
                processData: false,
                success: function(resp) {
                    if(resp.code == 200){
                        v.$root.showSuccess("Berhasil melakukan verifikasi!")
                        window.location=BASE_URL+"verifikasi/partisipasi?month="+v.param.uri.month+"&year="+v.param.uri.year;
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
        <router-link v-if="param.uri.with_save == ''" class="btn btn-danger" :to="{path : '/verifikasi/partisipasi?month='+param.uri.month+'&year='+param.uri.year}">
            <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
        <router-link v-else class="btn btn-danger" :to="{path : '/verified/partisipasi?month='+param.uri.month+'&year='+param.uri.year}">
            <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-list fa-2x"></i>
                </div>
                <div class="card-title">
                    Detail Setoran
                </div>
            </div>
            <div class="card-body">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th class="text-center">Nama Anggota</th>
                            <th class="text-center">Provinsi</th>
                            <th class="text-center">Kab. / Kota</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ detail.nama_anggota }}</td>
                            <td>{{ detail.provinsi }}</td>
                            <td>{{ detail.kab_kota }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-check fa-2x"></i>
                </div>
                <div class="card-title">
                    Verifikasi Bukti Setor Dana Partisipasi
                </div>
            </div>
            <div class="card-body">
                <div class="row my-2">
                    <div class="col-md-12">
                        <div class="form-group pull-right">
                            <label>Tanggal Verifikasi</label>
                            <input type="date" class="form-control" v-model="tanggal_verifikasi">
                        </div>
                    </div>
                </div>
                <table class="table">
                    <tr>
                        <th class="text-center">Bukti Setor</th>
                        <th class="text-center">Tanggal Setor, Nominal</th>
                        <th class="text-center">Verifikasi Rekening Koran</th>
                    </tr>
                    <tr v-for="(it, ind) in file">
                        <td width="30%">
                            <img v-bind:src="BASE_URL+subStr(it.bukti_setor)" class="w-75 mx-auto c-pointer" v-on:click="viewImg(it.bukti_setor)">
                        </td>
                        <td>{{ it.SETOR }}<br>{{ $root.formatNumber(it.dana_partisipasi) }}</td>
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
                <button class="btn btn-primary" v-if="param.uri.with_save == ''" v-on:click="saveVerify">SAVE</button>
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