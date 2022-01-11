const EDIT_USER = {
	data : function() {
		return {
            user_id : "",
            detail : {
                user : {},
                list_prov : [],
                data_username : [],
                list_username : []
            },
            dataList : {
                prov_list : [],
                role_list : []
            }
		}
	},
	created : function(){
		const v = this;
        store.commit("changeNavTitle", "Edit User"); // JUDUL PAGE
        v.$set(v, "user_id", v.$route.params.id);
	},
	mounted : function(){
        var v = this;

        v.getRole();
        v.getSingleUsername();
	},
	methods : {
        getUserDetail : function(){
            var v = this;
            v.$root.showLoading("Mengambil data");
            v.$root.get_user_detail(v.user_id, v.userDetailCallback);
        },
        userDetailCallback : function(resp){
            var v = this;
            if(resp.code == 200){
                v.$set(v.detail, "user", resp.data.user[0]);
                if(_.has(resp.data, 'prov_assign')){
                    v.$set(v.detail, "list_prov", resp.data.prov_assign);
                }
                v.$nextTick(() => {
                    $(".select2").selectpicker('refresh');
                });
                swal.close();
            }else{
                if(resp.message == "USER_NOT_FOUND"){
                    v.$root.showError("User tidak ditemukan!");
                }
            }
        },
        getProv : function(){
            var v = this;

            v.$root.get_prov(v.getProvCallback);
        },
        getProvCallback : function(resp){
            var v = this;
            v.$set(v.dataList, "prov_list", resp.data);
            v.getUserDetail();
        },
        getRole : function(){
            var v = this;

            v.$root.get_role(v.getRoleCallback);
        },
        getRoleCallback : function(resp){
            var v = this;

            v.$set(v.dataList, "role_list", resp.data);
            v.$nextTick(() => {
                $(".select2").selectpicker();
                v.getUsername();
                v.getProv();
            });
        },
        getSingleUsername : function(){
            var v = this;
            $.ajax({
                type : 'GET',
                url : BASE_URL+"api/getsingledatausername",
                data : {
                    user_id : v.$route.params.id
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.detail, "data_username", resp.data.username);
                    }
                },
                error:function(e){

                }
            })
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

            
            // let sUsername = v.detail.user.name;
            // let nUsername = v.detail.data_username[0].username;
            // console.log(sUsername);
            // console.log(nUsername);
            
            // v.detail.list_username.some(x => x.username == sUsername);

            // if (nUsername == sUsername) {
            //     if (n) {
                    
            //     }
            // }

            if(v.detail.user.id_role != 1){
                if ((v.detail.list_prov.length == 0)) {
                    v.$root.showError("Pilih provinsi yang ditugaskan !");
                    return true;
                }
            }


            v.$root.showLoading("Menyimpan data..");
            var f_data = new FormData();

            for(key in v.detail.user){
                if(key == 'id' || key == 'username' || key == 'password' || key == 'name' || key == 'id_role'){
                    f_data.append(key, v.detail.user[key]);
                }
            }
            if(v.detail.user.id_role == 3){
                f_data.append('prov_list', v.detail.list_prov)
            }

            $.ajax({
                type : "POST",
                url : BASE_URL+"api/edit_user",
                data: f_data,
                cache: false,
                contentType: false,
                processData: false,
                success:function(resp){
                    if(resp.code == 200){
                        v.$root.showSuccess("Edit berhasil!");
                        window.location=BASE_URL+"user-management";
                    }else{
                        v.$root.showError("Gagal menyimpan data!");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal menyimpan data!");
                }
            })
        }
	},
    template: `
    <div>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-user"></i>
                </div>
                <div class="card-title">
                    User Detail
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
                        <div class="form-group" style="margin-top: -20px;">
                            <label>Role</label>
                            <select name="" id="" class="select2" v-model="detail.user.id_role"  v-on:change="getUsername">
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
        <div class="card" v-if="detail.user.id_role == 3">
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