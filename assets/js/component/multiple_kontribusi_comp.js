const MULTIPLE_KONTRIBUSI = {
	data : function() {
		return {
            userdata : [],
            forms : {
                tahun : "",
                provinsi : "",
                kabupaten : "",
                files : [],
                hasFile : false,
                tanggal_setor : "",
                bank : "",
                list_dana : [],
            },
            dataList : {
                month_list : [],
                prov_list : [],
                kab_list : [],
                anggota_list: [],
                bank_list : [],
                curr_month : 0,
                curr_year : 0
            },
            temp_file : {
                file : null,
                nominal : 0,
                tanggal_setor : ""
            },
            temp_obj : {
                thp : "",
                dpp : "",
                dpd : "",
                dpc : "",
                isNew : false,
                nama : "",
                bulan : []
            }
		}
	},
	created : function(){
        const v = this;
		store.commit("changeNavTitle", "Input Kontribusi");
	},
	mounted : function(){
		var v = this;
        v.get_session();
		v.$nextTick(() => {
            $(".selectpicker").selectpicker({
                liveSearch : true
            });
            v.$root.dropifyInit();
			$(".table__scroll").perfectScrollbar();
		}) 
    },
    computed : {
        years () {
            const year = new Date().getFullYear()
            return Array.from({length: 5}, (value, index) => year - index)
        },
        setDisable : function(){
            var v = this;

            if(v.forms.bulan == "" || v.forms.tahun == "" || v.forms.provinsi == ""){
                return true;
            }else if(v.forms.list_dana.length == 0){
                return true;
            }else{
                return false;
            }
        }
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
            $.ajax({
                type : 'GET',
                url : BASE_URL+"api/get_date_info",
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.dataList, "month_list", resp.data.month_list);
                        v.$set(v.dataList, "curr_month", resp.data.curr_month);
                        v.$set(v.dataList, "curr_year", resp.data.curr_year);
                        v.$set(v.forms, "bulan", resp.data.curr_month);
                        v.$set(v.forms, "tahun", resp.data.curr_year);
                        if(v.userdata.sess_role_id == 1){
                            v.getProv();
                        }else{
                            v.$root.get_prov_by_user(v.userdata.sess_user_id, v.getProvCallback);
                        }
                        v.getBank();
                        v.$nextTick(() => {
                            $(".selectpicker").selectpicker('refresh');
                        });
                    }
                },
                error:function(e){

                }
            })
        },
        getProv : function(){
            var v = this;

			v.$root.get_prov(v.getProvCallback);
		},
		getProvCallback : function(resp){
			var v = this;
			v.$set(v.dataList, "prov_list", resp.data);
			v.$nextTick(() => {
				swal.close();
				$(".selectpicker").selectpicker('refresh');
			});
		},
        getKab : function(){
            var v = this;

            $.get(BASE_URL+"api/getKokab", { id_prov : v.forms.provinsi }, function(resp){
                v.$set(v.dataList, "kab_list", resp);
                v.$nextTick(() => {
                    v.getAnggota();
                    $(".selectpicker").selectpicker('refresh');
                });
            });
        },
        getBank : function(){
            var v = this;
            $.get(BASE_URL+"api/get_bank_list", function(resp){
                console.log(resp.data[0]);
                v.$set(v.dataList, "bank_list", resp.data);
                v.$nextTick(() => {
                    swal.close();
                    $(".selectpicker").selectpicker('refresh');
                });
            });
        },
        getFile: function(index) {
            var v = this;
            v.$set(v.forms.files[index], "file", v.$refs.file[index].files[0]);
            v.$set(v.forms, "hasFile", true);
        },
        add_row : function(){
            var v = this;

            var obj = JSON.stringify(v.temp_obj);
            v.forms.list_dana.push(JSON.parse(obj));
            v.$nextTick(() => {
                $(".selectpicker").selectpicker();
            });
        },
        save_form : function(){
            var v = this;

            var check_nama = _.findIndex(v.forms.list_dana, function(o){
                return o.nama == "";
            });
            var c = 0;
            _.forEach(_.map(v.forms.list_dana, 'bulan'), function(value, key){
                if(value.length == 0){
                    c++;
                }
            });

            // if(v.countSelectedFile() == 0){
            //     v.$root.showError("Anda belum mengunggah bukti setor!");
            //     return true;
            // }

            // if(v.forms.tanggal_setor == ""){
            //     v.$root.showError("Pilih tanggal setor!");
            //     return true;
            // }

            if(check_nama != -1){
                v.$root.showError("Pilih nama anggota!");
                return true;
            }

            if(c != 0){
                v.$root.showError("Bulan tidak boleh kosong!");
                return true;
            }

            
            var f_data = new FormData();

            f_data.append('provinsi', v.forms.provinsi);
            f_data.append('kabupaten', v.forms.kabupaten);
            f_data.append('tahun', v.forms.tahun);
            f_data.append('isNew', v.forms.isNew);
            
            f_data.append('hasFile', v.forms.hasFile);
            f_data.append('bank', v.forms.bank);
            var c_nom = 0;
            var c_tan = 0;
            if(v.countSelectedFile() != 0){
                f_data.append('hasFile', true);
                _.forEach(v.forms.files, function(value, key){
                    if(value.file != null){
                        f_data.append("files[]", value.file);
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
                if(c_nom != 0){
                    v.$root.showError("Nominal bukti setor tidak boleh kosong!");
                    v.$nextTick(() => {
                        $("#modal-file").modal('show');
                    });
                    return false;
                }
    
                if(c_tan != 0){
                    v.$root.showError("Tanggal setor tidak boleh kosong!");
                    v.$nextTick(() => {
                        $("#modal-file").modal('show');
                    });
                    return false;
                }
            }else{
                f_data.append('hasFile', false);
            }

            v.$root.showLoading("Menyimpan data..");

            var stringified = JSON.stringify(v.forms.list_dana);
            f_data.append('list_dana', stringified);
            
            $.ajax({
                type : "POST",
                url : BASE_URL+"api/multiple_kontribusi",
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
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal!");
                }
            })
        },
        remove_row : function(index){
            var v = this;

            v.forms.list_dana.splice(index, 1);
        },
        getAnggota : function(){
            var v = this;
            v.$set(v.forms, "list_dana", [])
            $.ajax({
                type : "GET",
                url : BASE_URL+"api/get_anggota_list",
                data : {
                    prov : v.forms.provinsi,
                    kab : v.forms.kabupaten
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.dataList, "anggota_list", resp.data);
                    }
                    v.$nextTick(() => {
                        $(".selectpicker").selectpicker('refresh');
                    });
                    v.add_row();
                },
                error:function(e){

                }
            })
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
        showModal : function(){
            var v = this;

            $("#modal-file").modal('show');
            if(v.forms.files.length == 0){
                v.addFileRow();
            }
        },
        countSelectedFile : function(){
            var v = this;
            if(v.forms.files.length == 0){
                return 0;
            }else{
                var count = _.filter(v.forms.files, function(o){
                    return o.file != null
                });
                return count.length;
            }
        }
	},
    template: `
	<div>
        <router-link class="btn btn-danger" :to="{path : '/list-kontribusi'}">
            <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
		<div class="card">
			<div class="card-header card-header-icon card-header-warning">
				<div class="card-icon">
					<i class="fa fa-list fa-2x"></i>
				</div>
				<div class="card-title">
					Input Kontribusi
				</div>
			</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Provinsi</label>
                            <select name="provinsi" id="provinsi" class="selectpicker mt-2" v-model="forms.provinsi" v-on:change="getKab">
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.prov_list">
                                    <option v-bind:value="it.id">
                                        {{ it.provinsi }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Kabupaten / Kota</label>
                            <select name="kabupaten" id="kabupaten" class="selectpicker mt-2" v-model="forms.kabupaten" v-on:change="getAnggota">
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.kab_list">
                                    <option v-bind:value="it.id">
                                        {{ it.kab_kota }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Tahun</label>
                            <select name="tahun" id="tahun" class="selectpicker mt-2" v-model="forms.tahun">
                                <option value="">SELECT</option>
                                <template v-for="year in years">
                                    <option v-bind:value="year">
                                        {{ year }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Bukti Setor</label><br>
                            <button class="btn btn-info btn-sm" v-on:click="showModal">
                                PILIH FILE
                            </button>
                            {{ countSelectedFile() }} Dipilih
                        </div>
                    </div>
                    <!-- <div class="col-md-4">
                        <div class="form-group">
                            <label>Tanggal Setor DPP</label>
                            <input type="date" class="form-control" v-model="forms.tanggal_setor">
                        </div>
                    </div> -->
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Bank</label>
                            <select name="bank" id="bank" class="selectpicker mt-1" v-model="forms.bank">
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.bank_list">
                                    <option v-bind:value="it.id">
                                        {{ it.bank_name }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>
                <hr>
                <label class="text-dark">DATA KONTRIBUSI</label>
                <template v-for="(item, index) in forms.list_dana">
                    <div class="card my-2" style="border: 1px solid #c4c4c4">
                        <div class="card-body p-2">
                            <div class="pull-right">
                                <button class="btn btn-link" v-on:click="remove_row(index)">
                                    <i class="fa fa-times" style="color: #f90000"></i>
                                </button>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Nama Anggota</label><br>
                                        <select id="" class="selectpicker mt-2" v-model="item.nama">
                                            <option value="">--SELECT--</option>
                                            <template v-for="(i, key) in dataList.anggota_list">
                                                <option :value="i.id">{{ i.nama_anggota }}</option>
                                            </template>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>THP</label>
                                        <input type="number" class="form-control" v-model="item.thp">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>DPP</label>
                                        <input type="number" class="form-control" v-model="item.dpp">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>DPD</label>
                                        <input type="number" class="form-control" v-model="item.dpd">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>DPC</label>
                                        <input type="number" class="form-control" v-model="item.dpc">
                                    </div>
                                </div>
                            </div>
                            <label class="text-dark">Setoran Bulan</label>
                            <div class="row">
                                <template v-for="(i_m, in_m) in dataList.month_list">
                                    <div class="col-md-4">
                                        <div class="form-check">
                                            <label class="form-check-label">
                                                <input class="form-check-input" type="checkbox" :value="i_m.id" v-model="item.bulan">
                                                {{ i_m.bulan }}
                                                <span class="form-check-sign">
                                                    <span class="check"></span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
            <br>
            <button class="btn btn-success btn-sm" v-on:click="add_row" v-if="forms.provinsi != ''">
                <i class="fa fa-plus"></i>
                Tambahkan Anggota Lain
            </button>
            <hr>
            <button class="btn btn-primary btn-md" v-on:click="save_form" v-bind:disabled="setDisable">
                SAVE
            </button>
		</div>
        <div class="modal fade" id="modal-file">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">
                            Upload File
                        </h4>
                    </div>
                    <div class="modal-body">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

