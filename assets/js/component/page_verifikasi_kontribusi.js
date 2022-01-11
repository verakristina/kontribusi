const PAGE_VERIF_KONTRIBUSI = {
	data : function() {
		return {
            userdata : [],
            dataList : {
                month_list: [],
                verification_list : [],
                curr_month: "",
                curr_year: ""
            },
            param : {
                uri : {
                    month : 0,
                    year : 0
                }
            },
            table : null,
            forms : {}
		}
	},
	created : function(){
		const v = this;
        store.commit("changeNavTitle", "Verifikasi Dana Kontribusi"); // JUDUL PAGE
        if(v.$route.query.month != null){
            v.$set(v.param.uri, "month", v.$route.query.month);
        }else{
            v.$set(v.param.uri, "month", 0);
        }

        if(v.$route.query.year != null){
            v.$set(v.param.uri, "year", v.$route.query.year);
        }else{
            v.$set(v.param.uri, "year", 0);
        }
	},
	mounted : function(){
        var v = this;
        v.get_session();
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
				v.get_date_info();
			}
        },
        get_date_info : function(){
            var v = this;
            v.$root.showLoading("Mengambil data..");
            v.$root.get_date_info(v.getDateInfoCallback);
		},
		getDateInfoCallback : function(resp){
			var v = this;
			if(resp.code == 200){
                v.$set(v.dataList, "month_list", resp.data.month_list);
                
                if(v.param.uri.month != 0){
                    v.$set(v.dataList, "curr_month", v.param.uri.month);
                    v.$set(v.forms, "bulan", v.param.uri.month);
                }else{
                    v.$set(v.dataList, "curr_month", resp.data.curr_month);
                    v.$set(v.forms, "bulan", resp.data.curr_month);
                }

                if(v.param.uri.year != 0){
                    v.$set(v.dataList, "curr_year", v.param.uri.year);
                    v.$set(v.forms, "tahun", v.param.uri.year);
                }else{
                    v.$set(v.dataList, "curr_year", resp.data.curr_year);
                    v.$set(v.forms, "tahun", resp.data.curr_year);
                }

				v.$nextTick(() => {
                    $(".selectpicker").selectpicker('refresh');
                    swal.close();
                    if(v.userdata.sess_role_id == 1){
                        v.$root.get_prov(v.getProvCallback);
                    }else{
                        v.$root.get_prov_by_user(v.userdata.sess_user_id, v.getProvCallback);
                    }
				});
			}
        },
        getProvCallback : function(resp){
			var v = this;
			v.$set(v.dataList, "prov_list", resp.data);
			v.$nextTick(() => {
				v.getVerifikasiList();
				swal.close();
				$(".selectpicker").selectpicker('refresh');
			});
		},
        getVerifikasiList : function(){
            var v = this;
            v.$root.showLoading("Mengambil data verifikasi..")
            if(v.table){
                v.table.dataTable().fnDestroy();
            }
            $.ajax({
                type: "GET",
                url : BASE_URL+"api/get_verif_kontribusi_list",
                data : {
                    bulan : v.forms.bulan,
                    tahun : v.forms.tahun
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.dataList, "verification_list", resp.data);
                        v.$nextTick(() => {
                            v.table = $(".datatable").dataTable();
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
        }
	},
    template : `
    <div>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-check fa-2x"></i>
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
                </div>
                <button class="btn btn-sm btn-info" v-on:click="getVerifikasiList">
                    <i class="fa fa-search"></i>
                </button>
                <table class="table table-bordered table-striped table-hover datatable">
                    <thead>
                        <tr>
                            <th class="text-center"  width = "50px">No</th>
                            <th class="text-center" width="150px">Tanggal Setor</th>
                            <th class="text-center">Nama Anggota</th>
                            <th class="text-center" width= "200px">Provinsi</th>
                            <th class="text-center">Kab. / Kota</th>
                            <th class="text-center" width="100px">Jumlah Setor</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dataList.verification_list">
                            <td class="text-center">{{ index+1 }}</td>
                            <td class="text-center">{{ item.TGL_SETOR }}</td>
                            <td>{{ item.NAMA_ANGGOTA }}</td>
                            <td class="text-left">{{ item.PROVINSI }}</td>
                            <td class="text-left">{{ item.KAB_KOTA }}</td>
                            <td class="text-center">{{ $root.formatNumber(item.JUMLAH_SETOR) }}</td>
                            <td class="text-center">
                                <router-link class="btn btn-success btn-sm" :to="{ path: '/verify/'+item.unique_identifier+'?month='+forms.bulan+'&year='+forms.tahun }">
                                    <i class="fa fa-check"></i>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
}