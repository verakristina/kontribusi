const ADD_USER = {
	data : function() {
		return {
            user_id : "",
            detail : {
                user : {},
                list_prov : [],
                list_username : []
            },
            dataList : {
                prov_list : [],
                role_list : []
            },
            state : {
                selectAll : false
            }
		}
	},
	created : function(){
		const v = this;
        store.commit("changeNavTitle", "Add User"); // JUDUL PAGE
        v.$set(v, "user_id", v.$route.params.id);
	},
	mounted : function(){
        var v = this;

        v.getRole();
	},
	methods : {
        // getUserDetail : function(){
        //     var v = this;
        //     v.$root.showLoading("Mengambil data");
        //     v.$root.get_user_detail(v.user_id, v.userDetailCallback);
        // },
        // userDetailCallback : function(resp){
        //     var v = this;
        //     if(resp.code == 200){
        //         v.$set(v.detail, "user", resp.data.user[0]);
        //         if(_.has(resp.data, 'prov_assign')){
        //             v.$set(v.detail, "list_prov", resp.data.prov_assign);
        //         }
        //         v.$nextTick(() => {
        //             $(".select2").selectpicker('refresh');
        //         });
        //         swal.close();
        //     }else{
        //         if(resp.message == "USER_NOT_FOUND"){
        //             v.$root.showError("User tidak ditemukan!");
        //         }
        //     }
        // },
        getProv : function(){
            var v = this;

            v.$root.get_prov(v.getProvCallback);
        },
        getProvCallback : function(resp){
            var v = this;
            v.$set(v.dataList, "prov_list", resp.data);
        },
        getRole : function(){
            var v = this;
            v.$root.get_role(v.getRoleCallback);
        },
        getRoleCallback : function(resp){
            var v = this;

            v.$set(v.dataList, "role_list", resp.data);
            v.$nextTick(() => {
                v.getUsername();
                $(".select2").selectpicker();
                v.getProv();
            });
        },
        getUsername : function(){
            var v = this;
            $.ajax({
                type : 'GET',
                url : BASE_URL+"api/getdatausername",
                data : {
                    id_role : v.detail.user.id_role
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.detail, "list_username", resp.data.username);
                    }
                },
                error:function(e){

                }
            })
        },
        saveForm : function(){
            var v = this;

            if(v.detail.user.username == ""){
                v.$root.showError("Username belum di isi!");
                return true;
            }

            let sUsername = v.detail.user.username;

            let nUsername = v.detail.list_username.some(x => x.username == sUsername);

            if (nUsername == true) {
                v.$root.showError("Username telah ada!");
                return true;
            }

            if(v.detail.user.password == ""){
                v.$root.showError("Password belum di isi!");
                return true;
            }

            if(v.detail.user.password_re == ""){
                v.$root.showError("Konfirmasi password belum di isi!");
                return true;
            }

            if(v.detail.user.password != v.detail.user.password_re){
                v.$root.showError("Password tidak sama!");
                return true;
            }

            if(v.detail.user.id_role != 1){
                if ((v.detail.list_prov.length == 0)) {
                    v.$root.showError("Pilih provinsi yang ditugaskan !");
                    return true;
                }
            }

            v.$root.showLoading("Menyimpan data..");
            var f_data = new FormData();

            for(key in v.detail.user){
                if(key == 'username' || key == 'password' || key == 'name' || key == 'id_role'){
                    f_data.append(key, v.detail.user[key]);
                }
            }

            if(v.detail.user.id_role != 1){
                f_data.append('prov_list', v.detail.list_prov)
            }

            $.ajax({
                type : "POST",
                url : BASE_URL+"api/add_user",
                data: f_data,
                cache: false,
                contentType: false,
                processData: false,
                success:function(resp){
                    if(resp.code == 200){
                        v.$root.showSuccess("Berhasil membuat user!");
                        window.location=BASE_URL+"user-management";
                    }else{
                        v.$root.showError("Gagal menyimpan data!");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal menyimpan data!");
                }
            })
        },
        checkAll : function(){
            var v = this;

            if(v.state.selectAll){
                var map_prov = _.map(v.dataList.prov_list, 'id');
                console.log(v.dataList.prov_list);
                console.log(map_prov);
                v.$set(v.detail, "list_prov", map_prov);
            }else{
                v.$set(v.detail, "list_prov", []);
            }
        }
	},
    template: `
    <div>
        <router-link class="btn btn-danger" :to="{path : '/user-management'}">
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
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Nama</label>
                            <input type="text" class="form-control" v-model="detail.user.name">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" class="form-control" v-model="detail.user.username">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" class="form-control" v-model="detail.user.password">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Ketik Ulang Password</label>
                            <input type="password" class="form-control" v-model="detail.user.password_re">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Role</label>
                            <select name="" id="" class="select2" v-model="detail.user.id_role" v-on:change="getUsername">
                                <option value="">--SELECT--</option>
                                <template v-for="(item, index) in dataList.role_list">
                                    <option :value="item.id">{{ item.role }}</option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3"></div>
                </div>
            </div>
        </div>
        <div class="card" v-if="detail.user.id_role != null && detail.user.id_role != 1">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-list"></i>
                </div>
                <div class="card-title">
                    Provinsi Yang Ditugaskan
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-check">
                            <label class="form-check-label">
                                <input class="form-check-input" type="checkbox" v-on:change="checkAll" v-model="state.selectAll">
                                Pilih Semua
                                <span class="form-check-sign">
                                    <span class="check"></span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <template v-for="(item, index) in dataList.prov_list">
                        <div class="col-md-4">
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input class="form-check-input" type="checkbox" :value="item.id" v-model="detail.list_prov">
                                    {{ item.provinsi }}
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
        <div class="card">
            <div class="card-body">
                <button class="btn btn-primary btn-sm" v-on:click="saveForm">
                    SAVE
                </button>
            </div>
        </div>
    </div>
    `
}