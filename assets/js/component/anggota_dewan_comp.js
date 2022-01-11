const MASTER_ANGGOTA_DEWAN = {
	data : function() {
		return {
            userdata : [],
            dataList : {
                prov_list : [],
                kab_list : [],
                anggota_dewan : []
            },
            forms : {
                kabupaten : "",
                provinsi : ""
            },
            table : null
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Master Data Anggota Dewan"); // JUDUL PAGE
	},
	mounted : function(){
		var v = this;
        v.get_session();
        v.$nextTick(() => {
            $(".selectpicker").selectpicker({
                'liveSearch' : true
            });
        });
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
                v.searchDewan();
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
        searchDewan : function(){
            var v = this;

            v.$root.showLoading("Mengambil data anggota dewan..");

            if(v.table != null){
                v.table.dataTable().fnDestroy();
            }

            $.ajax({
                type : "GET",
                url : BASE_URL+"services/get_dewan",
                data : v.forms,
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.dataList, "anggota_dewan", resp.data)
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
                    <i class="fa fa-list fa-2x"></i>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
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
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Kabupaten / Kota</label>
                            <select name="kabupaten" id="kabupaten" class="selectpicker mt-2" v-model="forms.kabupaten">
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
                <button class="btn btn-info btn-sm" v-on:click="searchDewan">
                    <i class="fa fa-search"></i>
                </button>
                <div class="clearfix">
                    <div class="pull-right">
                        <router-link class="btn btn-primary btn-sm" :to="{ path : '/add-dewan' }">
                            <i class="fa fa-plus"></i> Add Dewan
                        </router-link>
                    </div>
                </div>
                <table class="table table-bordered table-striped table-hover datatable">
                    <thead>
                        <tr>
                            <th class="text-center" width="50">No</th>
                            <th class="text-center" width="160px">Nama Anggota</th>
                            <th class="text-center "width="150px">Provinsi</th>
                            <th class="text-center "width="150px">Kab. / Kota</th>
                            <th class="text-center" width="50px">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dataList.anggota_dewan">
                            <td class="text-center">{{ index+1 }}</td>
                            <td>{{ item.nama_anggota }}</td>
                            <td>{{ item.provinsi }}</td>
                            <td>{{ item.kab_kota }}</td>
                            <td class="text-right">
                                <router-link class="btn btn-warning btn-sm" :to="{ path : '/edit-anggota/'+item.id }">
                                    <i class="fa fa-edit"></i>
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