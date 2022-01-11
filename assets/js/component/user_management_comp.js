const USER_MANAGEMENT = {
	data : function() {
		return {
            dataList : {
                user : []
            }
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "User Management"); // JUDUL PAGE
	},
	mounted : function(){
        var v = this;

        v.getAllUser();
	},
	methods : {
        getAllUser : function(){
            var v = this;
            v.$root.showLoading("Mengambil data..");
            $.ajax({
                type : "GET",
                url : BASE_URL+"api/get_all_user",
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.dataList, "user", resp.data);
                        swal.close();
                        v.$nextTick(() => {
                            $(".datatable").dataTable();
                        });
                    }else{
                        v.$root.showError("Gagal mengambil data!");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal mengambil data!");
                }
            })
        },
        editUser : function(user_id){
            var v = this;

            window.location=BASE_URL+"edit-user/"+user_id;
        }
	},
    template : `
    <div>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-user fa-2x"></i>
                </div>
            </div>
            <div class="card-body">
                <div class="clearfix">
                    <div class="pull-right">
                        <router-link class="btn btn-primary btn-sm" :to="{ path : '/add-user' }">
                            <i class="fa fa-plus"></i> Add User
                        </router-link>
                    </div>
                </div>
                <table class="table table-bordered table-striped table-hover datatable">
                    <thead>
                        <tr>
                            <th class="text-center" width="50px">No</th>
                            <th class="text-center" width="250px">Nama</th>
                            <th class="text-center" width="250px">Username</th>
                            <th class="text-center" width="200px">Role</th>
                            <th class="text-center" width="50px">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dataList.user">
                            <td>{{ index+1 }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.username }}</td>
                            <td>{{ item.role }}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm" v-on:click="editUser(item.id)">
                                    <i class="fa fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
}