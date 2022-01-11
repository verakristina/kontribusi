const INPUT_KONTRIBUSI = {
	data : function() {
		return {
            userdata : [],
            forms : {
                bulan : "",
                tahun : "",
                provinsi : "",
                kabupaten : "",
                list_dana : [],
            },
            dataList : {
                month_list : [],
                prov_list : [],
                kab_list : [],
                anggota_list : [],
                bank_list : [],
                curr_month : 0,
                curr_year : 0
            },
            temp_obj : {
                nama : "",
                thp : "",
                dpp : "",
                dpd : "",
                dpc : "",
                tanggal_setor : "",
                bank : "",
                isNew : false,
                file : null,
                hasFile : false
            },
            state : {
                show : false
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
            $(".selectpicker, .selectpicker-search").selectpicker({
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
            console.log(v.$refs.file[index].files[0])
            v.$set(v.forms.list_dana[index], "file", v.$refs.file[index].files[0]);
            v.$set(v.forms.list_dana[index], "hasFile", true);
        },
        add_row : function(){
            var v = this;

            var obj = JSON.stringify(v.temp_obj);
            v.forms.list_dana.push(JSON.parse(obj));
            v.$nextTick(() => {
                $(".selectpicker-search").selectpicker({
                    liveSearch : true
                });
                $(".main-panel").scrollTop(200);
            });
        },
        formatRupiah : function(angka, prefix) {
            var v = this;
            var number_string = angka.replace(/[^,\d]/g, "").toString(),
            split = number_string.split(","),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

            if (ribuan) {
                separator = sisa ? "." : "";
                rupiah += separator + ribuan.join(".");
              }
        },
        save_form : function(){
            var v = this;

            var nama_anggota = _.findIndex(v.forms.list_dana, function(o){
                return o.nama == "";
            });

            if(nama_anggota != -1){
                v.$root.showError("Nama tidak boleh kosong!");
                return true;
            } 

            var check_tanggal = _.findIndex(v.forms.list_dana, function(o){
                return o.tanggal_setor == "";
            });
            

            if(check_tanggal != -1){
                v.$root.showError("Tanggal setor tidak boleh kosong!");
                return true;
            }

            var check_bukti = _.findIndex(v.forms.list_dana, function(o){
                return o.file == null;
            });
            

            if(check_bukti != -1){
                v.$root.showError("Bukti setor belum di upload!");
                return true;
            }

            v.$root.showLoading("Menyimpan data..");
            
            var f_data = new FormData();

            f_data.append('bulan', v.forms.bulan);
            f_data.append('tahun', v.forms.tahun);
            f_data.append('provinsi', v.forms.provinsi);
            f_data.append('kabupaten', v.forms.kabupaten);

            $.each(v.forms.list_dana, (key, value) => {
                $.each(v.forms.list_dana[key], (it, ind) => {
                    if(it != 'file'){
                        f_data.append('list_dana['+key+']['+it+']', ind);
                    }
                });
            });
            $.each(v.forms.list_dana, (key, value) => {
                $.each(v.forms.list_dana[key], (it, ind) => {
                    if(it == 'file'){
                        f_data.append('files[]', ind);
                    }
                });
            });

            $.ajax({
                type : "POST",
                methods : "POST",
                url : BASE_URL+"api/save_kontribusi",
                data : f_data,
                enctype : 'multipart/form-data',
                cache: false,
                contentType: false,
                processData: false,
                dataType : 'json',
                success:function(resp){
                    console.log(resp);
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
                    v.add_row();
                },
                error:function(e){

                }
            })
        },

        refresh_dom : function(item, key){
            var v = this;
            item.isNew = key;
            if(key == false){
                v.$nextTick(() => {
                    $(".selectpicker-search").selectpicker({
                        liveSearch : true
                    });
                });
            }else{
                v.$nextTick(() => {
                    $(".selectpicker-search").selectpicker('refresh');
                });
            }
        },

    },
    template: `
	<div>
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
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Bulan</label>
                            <select name="bulan" id="bulan" class="selectpicker" v-model="forms.bulan">
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.month_list">
                                    <option v-bind:value="it.id">
                                        {{ it.bulan }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Tahun</label>
                            <select name="tahun" id="tahun" class="selectpicker" v-model="forms.tahun">
                                <option value="">SELECT</option>
                                <template v-for="year in years">
                                    <option v-bind:value="year">
                                        {{ year }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Provinsi</label>
                            <select name="provinsi" id="provinsi" class="selectpicker" v-model="forms.provinsi" v-on:change="getKab">
                                <option value="">SELECT</option>
                                    <template v-for="(it, ind) in dataList.prov_list">
                                    <option v-bind:value="it.id">
                                        {{ it.provinsi }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Kabupaten / Kota</label>
                            <select name="kabupaten" id="kabupaten" class="selectpicker" v-model="forms.kabupaten" v-on:change="getAnggota">
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.kab_list">
                                    <option v-bind:value="it.id">
                                        {{ it.kab_kota }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="table__scroll" :style='{"position" : "relative", "min-height" : "300px","max-height" : "800px", "overflow" : "scroll"}'>
                <table class="table table-bordered table-striped table-hover" :style='{"width" : "1500px", "font-size" : "12px"}'>
                    <thead>
                        <tr>
                            <th class="text-center">Baru</th>
                            <th class="text-center">Nama</th>
                            <th class="text-center">THP</th>
                            <th class="text-center">DPP (15%)</th>
                            <th class="text-center">DPD (25%)</th>
                            <th class="text-center">DPC (60%)</th>
                            <th class="text-center">Tanggal Setor DPP</th>
                            <th class="text-center">Bukti Setor</th>
                            <th class="text-center">Bank</th>
                            <th class="text-center">*</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in forms.list_dana">
                            <td class="text-center">
                                <input type="checkbox" value="1" v-model="item.isNew" v-on:change="refresh_dom(item, item.isNew)">
                            </td>
                            <td v-show="!item.isNew">
                                <select name="nama" id="nama" class="selectpicker-search" v-model="item.nama">
                                    <option value="">SELECT</option>
                                    <template v-for="(it, ind) in dataList.anggota_list">
                                        <option v-bind:value="it.id">
                                            {{ it.nama_anggota }}
                                        </option>
                                    </template>
                                </select>
                            </td>
                            <td v-show="item.isNew" width="160px">
                                <div class="form-group">
                                    <label>Nama Anggota</label>
                                    <input type="text" class="form-control" v-model="item.nama">
                                </div>
                            </td>
                            <td>
                                <input type="number" step="0" min="0" class="form-control" v-model="item.thp">
                            </td>
                            <td>
                                <input type="number" step="0" min="0" class="form-control" v-model="item.dpp">
                            </td>
                            <td>
                                <input type="number" step="0" min="0" class="form-control" v-model="item.dpd">
                            </td>
                            <td>
                                <input type="number" step="0" min="0" class="form-control" v-model="item.dpc">
                            </td>
                            <td>
                                <input type="date" class="form-control" v-model="item.tanggal_setor">
                            </td>
                            <td>
                            <input type="file" ref="file" class="dropify" v-on:change="getFile(index)">
                            </td>
                            <td>
                            <select name="bank" id="bank" class="selectpicker-search" v-model="item.bank">
                                    <option value="">SELECT</option>
                                    <template v-for="(it, ind) in dataList.bank_list">
                                        <option v-bind:value="it.id">
                                            {{ it.bank_name }}    
                                        </option>
                                    </template>
                                </select>
                            </td>
                            <th width="15px">
                                <button class="btn btn-danger btn-sm" v-on:click="remove_row(index)">
                                    <i class="fa fa-times"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="dataList.anggota_list.length != 0">
                        <td colspan="500px">
                                <button class="btn btn-success btn-sm" v-on:click="add_row()">
                                    <i class="fa fa-plus"></i> Tambah Baris
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
                <button class="btn btn-primary btn-md" v-on:click="save_form" v-bind:disabled="setDisable">
                    SAVE
                </button>
			</div>
		</div>
    </div>
    `
}

