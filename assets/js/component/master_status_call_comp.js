const MASTER_STATUS_CALL = {
	data : function() {
		return {
            userdata : [],
            dataList : {
                statusCall : []
            },
            forms : {
                id : null,
                status_call : "",
                follow_up : ""
            },
            state : {
                error : {
                    isShow : false,
                    message : ""
                },
                modal_title : "Tambah Status Call"
            },
            table : null
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Master Data Status Call"); // JUDUL PAGE
	},
	mounted : function(){
		var v = this;
		v.get_session();
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
                v.getData();
			}
        },
        getData : function(){
            var v = this;
            v.$root.showLoading("Mengambil data..");

            if(v.table != null){
                console.log("HERE");
                v.table.dataTable().fnDestroy();
            }

            $.get(BASE_URL+"api/get_status_call", function(resp){
                if(resp.code == 200){
                    v.$set(v.dataList, "statusCall", resp.data);
                    v.$nextTick(() => {
                        v.$set(v, "table", $(".datatable").dataTable());
                        //v.table = $(".datatable").dataTable();
                        swal.close();
                    });
                }else{
                    v.$root.showError("Gagal mengambil data!");
                }
            }); 
        },
        showModal : function(item){
            var v = this;
            var obj = item;
            if(item != null){
                v.$set(v.forms, "status_call", obj.status_call)
                v.$set(v.forms, "id", obj.id)

                v.$set(v.forms, "follow_up", 0)
            }else{
                v.$set(v.forms, "status_call", "")
                v.$set(v.forms, "id", "")
                v.$set(v.forms, "follow_up", 0)
            }

            v.$set(v.state, "modal_title", "Tambah Status Call");
            v.$nextTick(() => {
                $("#modal-form").modal('show');
            });
        },
        saveForm : function(){
            var v = this;
            v.$root.showLoading("Menyimpan data..");
            if(v.forms.status_call == ""){
                v.$root.showError("Status call tidak boleh kosong!");
                return false;
            }

            $.ajax({
                type : "POST",
                url : BASE_URL+"api/save_status_call",
                data : {
                    id : v.forms.id,
                    status_call : v.forms.status_call,
                    follow_up : v.forms.follow_up
                },
                success:function(resp){
                    if(resp.code == 200){
                        $("#modal-form").modal('hide');
                        swal.close();
                        v.getData();
                    }else{
                        v.$root.showError("Gagal menyimpan data!");
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal menyimpan data!");
                }
            })
        },
        deleteItem : function(id){
            var v = this;
            v.$root.showConfirmation("", "Apakah anda yakin akan menghapus data ini?", function(){
                v.procDelete(id);
            });
        },
        procDelete : function(id){
            var v = this;
            v.$root.showLoading("Menghapus data..");
            $.get(BASE_URL+"api/delete_status_call", { id : id }, function(resp){
                if(resp.code == 200){
                    v.getData();
                }else{
                    v.$root.showError("Gagal manghapus data!");
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
                <div class="card-title">
                    Master Data Status Call
                </div>
            </div>
            <div class="card-body">
                <div class="clearfix">
                    <div class="pull-right">
                        <button class="btn btn-primary btn-sm" v-on:click="showModal(null)">
                            <i class="fa fa-plus"></i> Tambah Status Call
                        </button>
                    </div>
                </div>
                <table class="table table-bordered table-striped table-hover datatable">
                    <thead>
                        <tr>
                            <th class="text-center">Status Call</th>
                            <th class="text-center" width="200px">Tipe Follow Up</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dataList.statusCall">
                            <td>{{ item.status_call }}</td>
                            <td class="text-center">
                                <div class="badge badge-success" v-if="item.need_follow_up == 1">Follow Up Hari Berikutnya</div>
                                <div class="badge badge-warning" v-if="item.need_follow_up == 2">Follow Up Sesuai Perjanjian</div>
                                <div v-else></div>
                            </td>
                            <td class="text-right">
                                <button class="btn btn-warning btn-sm" v-on:click="showModal(item)">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" v-on:click="deleteItem(item.id)">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal fade" id="modal-form">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">&times;</button>
                        <div class="modal-title">
                            {{ state.modal_title }}
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Status Call</label>
                            <input type="text" class="form-control" v-model="forms.status_call">
                        </div>
                        <div class="form-check form-check-radio my-2">
                            <label class="form-check-label">
                                <input class="form-check-input" type="radio" value="1" v-model="forms.follow_up">
                                Follow up hari berikutnya
                                <span class="form-check-sign">
                                    <span class="check"></span>
                                </span>
                            </label>
                        </div>
                        <div class="form-check form-check-radio my-2">
                            <label class="form-check-label">
                                <input class="form-check-input" type="radio" value="2" v-model="forms.follow_up">
                                Follow up sesuai perjanjian
                                <span class="form-check-sign">
                                    <span class="check"></span>
                                </span>
                            </label>
                        </div>
                        <button class="btn btn-primary btn-sm" v-on:click="saveForm">
                            SIMPAN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}