const INPUT_PARTISIPASI = {
	data : function() {
		return {
            userdata : [],
            errors: [],
            forms : {
                nama : "",
                tahun : "",
                provinsi : "",
                kabupaten : "",
                isNew : false,
                list_dana : [],
                cekbulantahun : []
            },
            dataList : {
                month_list : [],
                prov_list : [],
                kab_list : [],
                anggota_list: [],
                bank_list : [],
                provinsi : 0,
                kabupaten : 0,
                curr_month : 0,
                curr_year : 0
            },
            temp_obj : {
                bulan : "",
                tanggal_setor : "",
                bank : "",
                isNew : false,
                file : null,
                hasFile : false
            }
		}
	},
	created : function(){
        const v = this;
        v.$set(v.dataList, "nama", v.$route.params.id);
        v.$set(v.dataList, "provinsi", v.$route.params.id_prov);
        v.$set(v.dataList, "kabupaten", v.$route.params.id_kab);
        v.$set(v.forms, "nama", v.$route.params.id);
        v.$set(v.forms, "provinsi", v.$route.params.id_prov);
        v.$set(v.forms, "kabupaten", v.$route.params.id_kab);
		store.commit("changeNavTitle", "Input Partisipasi");
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
                v.cekBulanTahun();
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
                        
                        if(v.userdata.sess_id_role == 1){
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
        cekBulanTahun : function(){
            var v = this;
            $.ajax({
                type : 'GET',
                url : BASE_URL+"api/cekbulantahun",
                data : {
                    id_anggota : v.forms.nama
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.forms, "cekbulantahun", resp.data.cek);
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
                v.getKab();
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
            // console.log(v.$refs.file[index].files[0])
            v.$set(v.forms.list_dana[index], "file", v.$refs.file[index].files[0]);
            v.$set(v.forms.list_dana[index], "hasFile", true);
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

            if(v.forms.nama == ""){
                v.$root.showError("Pilih nama anggota!");
                return true;
            }

            // var check_month = _.findIndex(v.forms.list_dana, function(o){
            //     return o.bulan == "";
            // });
            
            // if(check_month != -1){
            //     v.$root.showError("Bulan tidak boleh kosong!");
            //     return true;
            // }

            // let sBulan = '';
            // let sTahun = '';
            // // let nBulan = '';
            // let nTahun = '';
            // sTahun = v.forms.cekbulantahun.some(y => y.tahun == nTahun);
            // nTahun = v.forms.tahun;

            // if (v.forms.cekbulantahun.some(y => y.tahun == nTahun)) {
            //     v.$root.showError("Data tahun " + nTahun + " sudah di input!");
            //     return true;                
            // }

            // if(sBulan && sTahun) {
            //     v.$root.showError("Data bulan " + nBulan + " " + nTahun + " sudah di input!");
            //     return true;
            // }



            // _.forEach(v.forms.list_dana,function(el,index,arr){
            //     nBulan = v.dataList.month_list.find(x => x.id === el.bulan).bulan;
            //     nTahun = v.forms.tahun;

            //     sBulan = v.forms.cekbulantahun.some(x => x.id_bulan == el.bulan);
            //     sTahun = v.forms.cekbulantahun.some(y => y.tahun == nTahun);
            //  });
            
            // if(sBulan && sTahun) {
            //     v.$root.showError("Data bulan " + nBulan + " " + nTahun + " sudah di input!");
            //     return true;
            // }


            var check_tanggal = _.findIndex(v.forms.list_dana, function(o){
                return o.tanggal_setor == "";
            });
            

            if(check_tanggal != -1){
                v.$root.showError("Tanggal setor tidak boleh kosong!");
                return true;
            }

            // var check_bukti = _.findIndex(v.forms.list_dana, function(o){
            //     return o.file == null;
            // });
            

            // if(check_bukti != -1){
            //     v.$root.showError("Bukti setor belum di upload!");
            //     return true;
            // }


            v.$root.showLoading("Menyimpan data..");
            var f_data = new FormData();

            f_data.append('provinsi', v.forms.provinsi);
            f_data.append('kabupaten', v.forms.kabupaten);
            f_data.append('tahun', v.forms.tahun);
            f_data.append('nama', v.forms.nama);
            f_data.append('isNew', v.forms.isNew);
            // f_data.append('isNew', v.form.isNew);
            // console.log(f_data);

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
                url : BASE_URL+"api/save_partisipasi",
                data : f_data,
                enctype : 'multipart/form-data',
                cache: false,
                contentType: false,
                processData: false,
                dataType : 'json',
                success:function(resp){
                    if(resp.code == 200){
                        swal.close();
                        window.location=BASE_URL+"detail-partisipasi/"+v.forms.nama;
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
	},
    template: `
	<div>
		<div class="card">
			<div class="card-header card-header-icon card-header-warning">
				<div class="card-icon">
					<i class="fa fa-list fa-2x"></i>
				</div>
				<div class="card-title">
					Input Partisipasi
				</div>
			</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Provinsi</label>
                            <select name="provinsi" id="provinsi" class="selectpicker mt-2" v-model="forms.provinsi" v-on:change="getKab" disabled>
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
                            <select name="kabupaten" id="kabupaten" class="selectpicker mt-2" v-model="forms.kabupaten" v-on:change="getAnggota"  disabled>
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.kab_list">
                                    <option v-bind:value="it.id">
                                        {{ it.kab_kota }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
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
                    <div class="col-md-3" v-show="!forms.isNew">
                        <div class="form-group">
                            <label>Nama Anggota</label>
                            <select name="nama" id="nama" class="selectpicker mt-2" v-model="forms.nama"  disabled>
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.anggota_list">
                                    <option v-bind:value="it.id">
                                        {{ it.nama_anggota }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3" v-show="forms.isNew">
                        <div class="form-group">
                            <label>Nama Anggota</label>
                            <input type="text" class="form-control" v-model="forms.nama" v-show="forms.isNew">
                        </div>
                    </div>
                   <div class="col-md-3">
                        <div class="form-group">
                            <div class="custom-control custom-checkbox" style="margin-top: 22px">
                                <input type="checkbox" class="custom-control-input" id="customCheck1" v-model="forms.isNew">
                                <label class="custom-control-label" for="customCheck1">Anggota Baru</label>
                            </div>
                        </div>
                    </div>
                </div> 
                <div class="table__scroll" :style='{"position" : "relative", "min-height" : "400px","max-height" : "600px", "overflow" : "scroll"}'>
                <table class="table table-bordered table-striped table-hover" :style='{"width" : "1200px", "font-size" : "12px"}'>
                    <thead>
                        <tr>
                            <!-- <th class="text-center">Bulan</th> -->
                            <th class="text-center">Dana</th>
                            <th class="text-center">Tanggal Setor</th>
                            <th class="text-center">Bukti Setor</th>
                            <th class="text-center">Bank</th>
                            <th class="text-center">*</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in forms.list_dana">
                            <th class="text-center">
                                <input type="number" step="0" min="0" class="form-control" v-model="item.jumlah">
                            </th>
                            <th class="text-center">
                                <input type="date" class="form-control" v-model="item.tanggal_setor">
                            </th>
                            <th class="text-center">
                            <input type="file" ref="file" class="dropify" v-on:change="getFile(index)">
                            </th>
                            <th class="text-center">
                            <select name="bank" id="bank" class="selectpicker" v-model="item.bank">
                                    <option value="">SELECT</option>
                                    <template v-for="(it, ind) in dataList.bank_list">
                                        <option v-bind:value="it.id">
                                            {{ it.bank_name }}
                                        </option>
                                    </template>
                                </select>
                            </th>
                            <th width="15px">
                                <button class="btn btn-danger btn-sm" v-on:click="remove_row(index)">
                                    <i class="fa fa-times"></i>
                                </button>
                            </th>
                        </tr>
                        <tr>
                            <td colspan="9">
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
    `
}

