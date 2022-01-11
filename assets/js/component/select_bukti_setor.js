const SELECT_BUKTI_SETOR = {
	data : function() {
		return {
            userdata : [],
            dataList : {
                prov_list: [],
                kab_list : []
            },
            list_kontribusi : [],
            forms : {
                provinsi : "",
                kabupaten : "",
                tahun : [],
                kontribusi_list : [],
                files : []
            },
            temp_file : {
                file : null,
                nominal : 0,
                tanggal_setor : ""
            },
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Upload / Edit Bukti Setor"); // JUDUL PAGE
	},
	mounted : function(){
        var v = this;
        v.get_session();
        v.addFileRow();
        v.$nextTick(() => {
            $(".selectpicker").selectpicker({
                'liveSearch' : true
            })
        });
    },
    computed : {
        years () {
            const year = new Date().getFullYear()
            return Array.from({length: 5}, (value, index) => year - index)
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
				if(v.userdata.sess_role_id == 1){
					v.$root.get_prov(v.getProvCallback);
				}else{
					v.$root.get_prov_by_user(v.userdata.sess_user_id, v.getProvCallback);
				}
			}
        },
        getProvCallback : function(resp){
			var v = this;
			v.$set(v.dataList, "prov_list", resp.data);
			v.$nextTick(() => {
				swal.close();
				$(".selectpicker").selectpicker('refresh');
			});
        },
        searchData : function(){
            var v = this;

            $("#modal-data").modal('show');
            v.$nextTick(() => {
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
        getList : function(){
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
                            if(v.table != []){
                                v.table = $(".datatable").dataTable();
                            }else{
                                v.$set(v, "table", $(".datatable").dataTable());
                            }
							swal.close();
						});
					}else{
						v.$root.showError("Gagal mengambil data..");
					}
				}
			})
        },
        moveData : function(item, index){
            var v = this;

            var obj = v.forms.kontribusi_list;
            obj.push(item);
            obj = JSON.stringify(obj);
            v.$set(v.forms, "kontribusi_list", JSON.parse(obj));

            v.list_kontribusi.splice(index, 1);
        },
        removeData : function(index){
            var v = this;

            v.forms.kontribusi_list.splice(index, 1);
        },
        addFileRow : function(){
            var v = this;

            var obj = JSON.stringify(v.temp_file);
            v.forms.files.push(JSON.parse(obj));
            v.$nextTick(() => {
                v.$root.dropifyInit();
            });
        },
        removeFile : function(index){
            var v = this;
            v.forms.files.splice(index, 1);
        },
        saveData : function(){
            var v = this;

            var f_data = new FormData();

            var c_fil = 0;
            var c_nom = 0;
            var c_tan = 0;
            _.forEach(v.forms.files, function(value, key){
                if(value.file != null){
                    f_data.append("files[]", value.file);
                }else{
                    c_fil++;
                }

                if(value.nominal != 0 || value.nominal != ""){
                    f_data.append("nominal[]", value.nominal);
                }else{
                    c_nom++;
                }

                if(value.tanggal_setor != ""){
                    f_data.append('tanggal_setor[]', value.tanggal_setor);
                }else{
                    c_tan++;
                }
            });

            if(v.forms.kontribusi_list.length == 0){
                v.$root.showError("Pilih minimal 1 data kontribusi!")
            }

            if(c_fil != 0){
                v.$root.showError("File bukti setor tidak boleh kosong!");
                return false;
            }

            if(c_nom != 0){
                v.$root.showError("Nominal bukti setor tidak boleh kosong!");
                return false;
            }

            if(c_tan != 0){
                v.$root.showError("Tanggal setor tidak boleh kosong!");
                return false;
            }

            var list_id = _.map(v.forms.kontribusi_list, "id");
            f_data.append('list_id', list_id);
            v.$root.showLoading("Menyimpan data..");
            $.ajax({
                type : "POST",
                url : BASE_URL+"api/save_bukti_setor",
                data : f_data,
                enctype : 'multipart/form-data',
                cache: false,
                contentType: false,
                processData: false,
                dataType : 'json',
                success:function(resp){
                    if(resp.code == 200){
                        swal.close();
                        window.location=BASE_URL+"list-kontribusi";
                    }else{
                        v.$root.showError("Gagal menyimpan data!");    
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal!");
                }
            })

        },
        getFile: function(index) {
            var v = this;
            v.$set(v.forms.files[index], "file", v.$refs.file[index].files[0]);
            v.$set(v.forms, "hasFile", true);
        },
	},
    template : `
    <div>
        <router-link class="btn btn-danger" :to="{path : '/list-kontribusi'}">
            <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-upload fa-2x"></i>
                </div>
                <div class="card-title">
                    Upload / Edit Bukti Setor
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3 col-lg-3">
                        <button class="btn btn-success btn-block" v-on:click="searchData">
                            <i class="fa fa-check"></i> PILIH DATA KONTRIBUSI
                        </button>
                    </div>
                </div>
                <table class="table table-bordered table-striped table-hover" :style='{"font-size" : "12px"}'>
                    <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th class="text-center">Bulan</th>
                            <th class="text-center">Tahun</th>
                            <th class="text-center">Daerah</th>
                            <th class="text-center">Nama Anggota</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in forms.kontribusi_list">
                            <td class="text-center" width="30px">
                                <button class="btn btn-danger" v-on:click="removeData(index)">
                                    <i class="fa fa-times"></i>
                                </button>									
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
                        </tr>
                    </tbody>
                </table>
                <hr>
                <div class="row">
                    <template v-for="(item, index) in forms.files">
                        <div class="col-md-3 border p-1">
                            <i class="fa fa-times pull-right" style="color: #f90000" v-on:click="removeFile(index)">
                            </i>
                            <input type="file" ref="file" class="dropify" data-allowed-file-extensions="jpg png jpeg" v-on:change="getFile(index)">
                            <br>
                            <div class="form-group">
                                <label>Nominal</label>
                                <input type="number" class="form-control" min="0" max="999999999" step="1" v-model="item.nominal">
                            </div>
                            <div class="form-group">
                                <label>Tanggal Setor</label>
                                <input type="date" class="form-control" v-model="item.tanggal_setor">
                            </div>
                        </div>
                    </template>
                </div>
                <button class="btn btn-success btn-sm" v-on:click="addFileRow">
                    <i class="fa fa-plus"></i>
                    Tambahkan file lain
                </button>
                <hr>
                <button class="btn btn-primary" v-on:click="saveData">
                    SIMPAN
                </button>
            </div>
        </div>
        <div class="modal fade" id="modal-data">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">&times;</button>
                        <div class="modal-title">
                            Ambil Data Kontribusi
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Tahun</label>
                                    <select class="selectpicker mt-2" v-model="forms.tahun">
                                        <option value="">--SELECT--</option>
                                        <template v-for="year in years">
                                            <option v-bind:value="year">
                                                {{ year }}
                                            </option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Provinsi</label>
                                    <select class="selectpicker mt-2" v-model="forms.provinsi" v-on:change="getKab">
                                        <option value="">--SELECT--</option>
                                        <template v-for="(item, index) in dataList.prov_list">
                                            <option v-bind:value="item.id">
                                                {{ item.provinsi }}
                                            </option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Kab. / Kota</label>
                                    <select class="selectpicker mt-2" v-model="forms.kabupaten">
                                        <option value="">--SELECT--</option>
                                        <template v-for="(it, ind) in dataList.kab_list">
                                            <option v-bind:value="it.id">
                                                {{ it.kab_kota }}
                                            </option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-info btn-sm" v-on:click="getList">
                            <i class="fa fa-search"></i>
                        </button>
                        <table class="table table-bordered table-striped table-hover datatable" :style='{"font-size" : "12px"}'>
                            <thead>
                                <tr>
                                    <th class="text-center">#</th>
                                    <th class="text-center">Bulan</th>
                                    <th class="text-center">Tahun</th>
                                    <th class="text-center">Daerah</th>
                                    <th class="text-center">Nama Anggota</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in list_kontribusi">
                                    <td>
                                        <button class="btn btn-success btn-block" v-on:click="moveData(item, index)">
                                            <i class="fa fa-check"></i>
                                        </button>									
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