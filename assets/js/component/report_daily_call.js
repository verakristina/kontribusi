const REPORT_DAILY_CALL = {
	data : function() {
		return {
            userdata : [],
            dataList : {
                ar_list : []
            },
            forms : {
                id_ar : "",
                start : "",
                end : "",
                type : ""
            },
            list : {
                called : []
            },
            table : null
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Report Daily Call"); // JUDUL PAGE
	},
	mounted : function(){
		var v = this;
        v.get_session();
        $(".selectpicker").selectpicker({
            'liveSearch' : true
        });
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
                v.requestARList();
			}
        },
        requestARList : function(){
            var v = this;
            v.$root.showLoading("Mengambil data..");

            $.ajax({
                type : "GET",
                url : BASE_URL+"api/get_ar_list",
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.dataList, "ar_list", resp.data)
                        v.$nextTick(() => {
                            swal.close();
                            $(".selectpicker").selectpicker('refresh');
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
        handleData : function(data_state){
            var v = this;

            if(v.forms.id_ar == ""){
                v.$root.showError("Pilih Nama AR!");
                return false;
            }else if(v.forms.start == "" || v.forms.end == ""){
                v.$root.showError("Pilih range tanggal!");
                return false;
            }else{

            }

            v.$set(v.forms, "type", data_state)

            if(data_state == "SHOW"){
                v.$root.showLoading("Mengambil data..");
                if(v.table != null){
                    v.table.dataTable().fnDestroy();
                }
                $.ajax({
                    type : "GET",
                    url : BASE_URL+"report/report_daily_call",
                    data : v.forms,
                    success:function(resp){
                        if(resp.code == 200){
                            v.$set(v.list, "called", resp.data);
                            v.$nextTick(() => {
                                v.table = $(".datatable").dataTable({
                                    'ordering' : false
                                });
                                swal.close();
                            })
                        }else{
                            v.$root.showError("Gagal mengambil data!");
                        }
                    },
                    error:function(e){
                        v.$root.showError("Gagal mengambil data!");
                    }
                })
            }else{

                window.open(BASE_URL+"report/print_daily_calls_report?is_mass=true&start="+v.forms.start+"&end="+v.forms.end+"&id_user="+v.forms.id_ar, '__Blank');

            }
        }
	},
    template : `
    <div>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-file-o fa-2x"></i>
                </div>
                <div class="card-title">
                    Report Daily Call
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3 col-sm-12">
                        <div class="form-group">
                            <label>Nama AR</label>
                            <select name="ar" id="ar" class="selectpicker mt-2" v-model="forms.id_ar">
                                <option value="">--SELECT--</option>
                                <template v-for="(item, index) in dataList.ar_list">
                                    <option :value="item.id">{{ item.name }}</option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="form-group">
                            <label>Mulai Tanggal</label>
                            <input type="date" class="form-control" v-model="forms.start">
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="form-group">
                            <label>Sampai Tanggal</label>
                            <input type="date" class="form-control" v-model="forms.end">
                        </div>
                    </div>
                </div>
                <div class="clearfix">
                    <div class="pull-right">
                        <button class="btn btn-primary btn-sm" v-on:click="handleData('SHOW')">
                            <i class="fa fa-eye"></i>
                            TAMPILKAN DATA
                        </button>
                        <button class="btn btn-primary btn-sm" v-on:click="handleData('DOWNLOAD')">
                            <i class="fa fa-download"></i>
                            DOWNLOAD
                        </button>
                    </div>
                </div>
                <table class="table table-bordered table-striped table-hover datatable">
                    <thead>
                        <tr>
                            <th class="text-center">Nama Dewan</th>
                            <th class="text-center" width="220px">Daerah</th>
                            <th class="text-center" width="220px">Status</th>
                            <th class="text-center" width="160px">Tanggal Follow Up</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in list.called">
                            <td>{{ item.nama_anggota }}</td>
                            <td>{{ item.DAERAH }}</td>
                            <td class="text-center">
                                <div class="badge badge-danger" v-if="item.need_follow_up == 1">
                                    {{ item.status_call }}
                                </div>
                                <div class="badge badge-success" v-else-if="item.need_follow_up == 2">
                                    {{ item.status_call }}
                                </div>
                                <div class="badge badge-warning" v-else>
                                    {{ item.status_call }}
                                </div>
                            </td>
                            <td class="text-right">{{ item.FOLLOW_UP_DATE }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
}