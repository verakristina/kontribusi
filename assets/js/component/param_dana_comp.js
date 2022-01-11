const PARAMETER_DANA = {
	data : function() {
		return {
            userdata : [],
            dataList : {
                parameter_dana : []
            },
            table : null,
            state : {
                modal_title : ""
            },
            forms : {
                tahun : "",
                tanggal_setor : "",
                sampai_tanggal : "",
                dprd_prov : 0,
                dprd_kab_kota : 0,
                lama_periode : 0,
                id : ""
            }
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Master Data - Parameter Dana Partisipasi"); // JUDUL PAGE
	},
	mounted : function(){
		var v = this;
		v.get_session();
    },
    computed : {
        years () {
			var year = new Date().getFullYear()
			year = year + 4;
            return Array.from({length: 5}, (value, index) => year - index)
        },
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
                swal.close();
                v.get_date_info();
                v.getAllParamDana();
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
				v.$set(v.dataList, "curr_month", resp.data.curr_month);
				v.$set(v.dataList, "curr_year", resp.data.curr_year);
				v.$set(v.forms, "tahun", resp.data.curr_year);
				v.$nextTick(() => {
					$(".selectpicker").selectpicker('refresh');
				});
			}
		},
        getAllParamDana : function(){
            var v = this;

            v.$root.showLoading("Mengambil data..");
            if(v.table != null){
                v.table.dataTable().fnDestroy();
            }

            $.ajax({
                type : "GET",
                url : BASE_URL+"services/get_parameter_dana",
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.dataList, "parameter_dana", resp.data);
                        v.$nextTick(() => {
                            v.table = $(".datatable").dataTable();
                            swal.close();
                        });
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal mengambil data!");
                }
            })
        },
        showModal : function(state, item = null){
            var v = this;

            if(state == "ADD"){
                v.$set(v.state, "modal_title", "Buat Parameter Baru")
            }else{
                v.$set(v.state, "modal_title", "Edit Parameter")

                v.$set(v, "forms", item);
            }

            v.$nextTick(() => {
                $("#modal-param").modal('show');
                $(".selectpicker").selectpicker('refresh');
            });
        },
        saveForm : function(){
            var v = this;

            if(v.forms.tahun == ""){
                v.$root.showError("Tahun tidak boleh kosong!");
                return false;
            }else if(v.forms.tanggal_setor == 0 || v.forms.tanggal_setor == ""){
                v.$root.showError("Tanggal tidak boleh kosong!");
                return false;
            }else if(v.forms.sampai_tanggal == 0 || v.forms.sampai_tanggal == ""){
                v.$root.showError("Tanggal tidak boleh kosong!");
                return false;
            }else if(v.forms.dprd_prov == 0 || v.forms.dprd_prov == ""){
                v.$root.showError("Parameter dana untuk DPRD Provinsi tidak boleh kosong!");
                return false;
            }else if(v.forms.dprd_kab_kota == 0 || v.forms.dprd_kab_kota == ""){
                v.$root.showError("Parameter dana untuk DPRD Kab. / Kota tidak boleh kosong!");
                return false;
            }else{

            }

            v.$root.showLoading("Menyimpan..");
            $.ajax({
                type : "POST",
                url : BASE_URL+"services/save_param_dana",
                data : v.forms,
                success:function(resp){
                    if(resp.code == 200){
                        v.$nextTick(() => {
                            v.$root.showSuccess("Berhasil!");
                            $("#modal-param").modal('hide');
                        });
                        v.getAllParamDana();
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
    template : `
    <div>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-list 2x"></i>
                </div>
            </div>
            <div class="card-body">
                <div class="clearfix">
                    <div class="pull-right">
                        <button class="btn btn-primary btn-sm" v-on:click="showModal('ADD')">
                            <i class="fa fa-plus"></i> Parameter Baru
                        </button>
                    </div>
                </div>
                <table class="table table-bordered table-striped table-hover datatable">
                    <thead>
                        <tr>
                            <th class="text-center" width="50px">No</th>
                            <th class="text-center">Mulai Tanggal</th>
                            <th class="text-center">Sampai Tanggal</th>
                            <th class="text-center" width="150px">Lama Periode</th>
                            <th class="text-center" width="150px">DPRD Provinsi</th>
                            <th class="text-center" width="150px">DPRD Kab / Kota</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dataList.parameter_dana">
                            <td class="text-center">
                                {{ index+1 }}
                            </td>
                            <td class="text-center">
                                {{ item.tanggal_setor }}
                            </td>
                            <td class="text-center">
                                {{ item.sampai_tanggal }}
                            </td>
                            <td class="text-center">
                               {{ item.lama_periode }} tahun
                           </td>
                            <td class="text-right">
                                {{ $root.formatNumber(item.dprd_prov) }}
                            </td>
                            <td class="text-right">
                                {{ $root.formatNumber(item.dprd_kab_kota) }}
                            </td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm" v-on:click="showModal('EDIT', item)">
                                    <i class="fa fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal fade" id="modal-param">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">&times;</button>
                        <div class="modal-title">{{ state.modal_title }}</div>
                    </div>
                    <div class="modal-body">
                        <!--<div class="form-group">
                            <label>Tahun</label><br/>
                            <select name="tahun" id="tahun" class="selectpicker" v-model="forms.tahun">
                                <option value="">SELECT</option>
                                <template v-for="year in years">
                                    <option v-bind:value="year">
                                        {{ year }}
                                    </option>
                                </template>
                            </select>
                        </div>-->
                        <div class="row">
                            <div class="form-group">
                                <div class="col-md-12 col-lg-12">
                                    <label>Dari Tanggal</label><br/>
                                    <input type="date"  class="form-control" name="tanggal_setor" id="tanggal_setor" v-model="forms.tanggal_setor">
                                </div>
                            </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <div class="form-group">
                                <div class="col-md-12 col-lg-12">
                                    <label>Sampai Tanggal</label><br/>
                                    <input type="date"  class="form-control" name="sampai_tanggal" id="sampai_tanggal" v-model="forms.sampai_tanggal">
                                </div>
                            </div>
                        </div>                        
                        <div class="form-group">
                            <label>Lama Periode</label>
                            <input type="number" min="0" step="100000" class="form-control" v-model="forms.lama_periode">
                        </div>
                        <div class="form-group">
                            <label>Partisipasi DPRD Provinsi</label>
                            <input type="number" min="0" step="100000" class="form-control" v-model="forms.dprd_prov">
                        </div>
                        <div class="form-group">
                            <label>Partisipasi DPRD Kabupaten / Kota</label>
                            <input type="number" min="0" step="100000" class="form-control" v-model="forms.dprd_kab_kota">
                        </div>
                        <button class="btn btn-primary" v-on:click="saveForm()">
                            SIMPAN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}