const ADD_DEWAN = {
	data : function() {
		return {
            user_id : "",
            forms : {
                tahun : "",
                provinsi : "",
                kabupaten : "",
                nama_anggota : "",
                jabatan : "",
                no_telp : "",
                email : "",
                thp : ""
            },
            detail : {
                anggota : {},
                list_prov : [],
                list_nama : []
            },
            dataList : {
                month_list : [],
                prov_list : [],
                kab_list : [],
                curr_month : 0,
                curr_year : 0
            },
		}
	},
	created : function(){
        const v = this;
		store.commit("changeNavTitle", "Add Dewan");
        v.$set(v, "user_id", v.$route.params.id);
	},
	mounted : function(){
		var v = this;
        v.get_session();
		v.$nextTick(() => {
            $(".selectpicker").selectpicker({
                liveSearch : true
            });
		}) 
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
				v.getProv();
			}
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
                    $(".selectpicker").selectpicker('refresh');
                });
            });
        },
        save_form : function(){
            var v = this;

            if(v.forms.nama_anggota == ""){
                v.$root.showError("Nama belum di isi!");
                return true;
            }
            if(v.forms.jabatan == ""){
                v.$root.showError("Jabatan belum di isi!");
                return true;
            }

            if(v.forms.no_telp == ""){
                v.$root.showError("No. Telp belum di isi!");
                return true;
            }

            if(v.forms.email == ""){
                v.$root.showError("Email belum di isi!");
                return true;
            }

            var f_data = new FormData();

            f_data.append('provinsi', v.forms.provinsi);
            f_data.append('kabupaten', v.forms.kabupaten);
            f_data.append('nama_anggota', v.forms.nama_anggota);
            f_data.append('jabatan', v.forms.jabatan);
            f_data.append('no_telp', v.forms.no_telp);
            f_data.append('email', v.forms.email);
            f_data.append('thp', v.forms.thp);

                       
            $.ajax({
                type : "POST",
                url : BASE_URL+"api/add_dewan",
                data : f_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType : 'json',
                success:function(resp){
                    if(resp.code == 200){
                        v.$root.showSuccess("Berhasil membuat Anggota!");
                        window.location=BASE_URL+"anggota-dewan";
                    }else{
                        v.$root.showError("Gagal menyimpan data!");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal menyimpan data!");
                }
            })
        },
	},
    template: `
	<div>
        <router-link class="btn btn-danger" :to="{path : '/anggota-dewan'}">
            <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
		<div class="card">
			<div class="card-header card-header-icon card-header-warning">
				<div class="card-icon">
					<i class="fa fa-user"></i>
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
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Nama Anggota Dewan</label><br>
                            <input type = "text" class="form-control" v-model="forms.nama_anggota">
                        </div>
                    </div>
                </div><br><br>
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Jabatan</label>
                            <input type="text" class="form-control" v-model="forms.jabatan">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>No. Telpon</label>
                            <input type="number" class="form-control" v-model="forms.no_telp">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="text" class="form-control" v-model="forms.email">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>THP</label>
                            <input type="number" class="form-control" v-model="forms.thp">
                        </div>
                    </div>
                    <div class="col-md-3"></div>
                </div>
            <br>
            <button class="btn btn-primary btn-sm" v-on:click="save_form">
                SAVE
            </button>
		</div>
    </div>
    `
}

