const PENERIMAAN_PERBULAN = {
	data : function() {
		return {
            userdata : [],
            forms : {
				bulan : "",
                tahun : "",
                provinsi : "",
                kabupaten : "",
                type : ""
			},
            dpp : "",
            dpd : "",
            dpc : "",
            total_all : "",
			dataList : {
                month_list : [],
                prov_list : [],
                kab_list : [],
                curr_month : 0,
                curr_year : 0
            },
            reportList : [],
            table : null
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Report Penerimaan Perbulan"); // JUDUL PAGE
	},
	mounted : function(){
		var v = this;
		v.get_session();
    },
    computed : {
		years () {
			var year = new Date().getFullYear()
			year = year + 5;
            return Array.from({length: 10}, (value, index) => year - index)
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
				v.$set(v.dataList, "curr_month", resp.data.curr_month);
				v.$set(v.dataList, "curr_year", resp.data.curr_year);
				v.$set(v.forms, "bulan", resp.data.curr_month);
				v.$set(v.forms, "tahun", resp.data.curr_year);
				
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
			v.$root.get_kab(v.forms.provinsi, v.getKabCallback);
		},
		getKabCallback : function(resp){
			var v = this;
			
			v.$set(v.dataList, "kab_list", resp);
			v.$nextTick(() => {
				$(".selectpicker").selectpicker('refresh');
			});
        },
        handleData : function(data_state){
            var v = this;

            if(v.forms.bulan == "" || v.forms.tahun == ""){
                v.$root.showError("Pilih Bulan & Tahun!");
                return false;
            }else{

            }

            v.$set(v.forms, "type", data_state);

            if(data_state == "SHOW"){
                v.$root.showLoading("Mengambil data..");

                if(v.table != null){
                    v.table.dataTable().fnDestroy();
                }

                $.ajax({
                    type : "GET",
                    url : BASE_URL+"report/report_perbulan",
                    data : v.forms,
                    success:function(resp){
                        if(resp.code == 200){
                            v.$set(v, "reportList", resp.data);

                            var dpp = _.sumBy(resp.data, function(o){
                                return parseInt(o.dpp)
                            });
                            var dpd = _.sumBy(resp.data, function(o){
                                return parseInt(o.dpd)
                            });
                            var dpc = _.sumBy(resp.data, function(o){
                                return parseInt(o.dpc)
                                
                            });
                            var total_all = parseInt(dpp)+parseInt(dpd)+parseInt(dpc);

                            v.$set(v, "dpp", dpp);
                            v.$set(v, "dpd", dpd);
                            v.$set(v, "dpc", dpc);                            
                            v.$set(v, "total_all", total_all);

                            v.$nextTick(() => {
                                v.table = $(".datatable").dataTable({
                                    'ordering' : false
                                });
                                swal.close();
                            });
                        }else{
                            v.$root.showError("Gagal mengambil data!");
                        }
                    },
                    error:function(e){
                        v.$root.showError("Gagal mengambil data!");
                    }
                })
            }else{
                v.$root.showLoading("Mendownload file..");
                $.ajax({
                    type: "POST",
                    url : BASE_URL+"report/report_perbulan",
                    data: v.forms,
                    xhrFields: {
                        responseType: "blob"
                    },
                    statusCode: {
                        500: function() {
                            v.$root.showError("Error Occured! Please Contact Developer");
                        }
                    },
                    success: function(data, textStatus, request) {
                        if (data != null || data != undefined) {
                            var filename = "";
                            var disposition = request.getResponseHeader("Content-Disposition");
                            if (disposition && disposition.indexOf("attachment") !== -1) {
                                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                                var matches = filenameRegex.exec(disposition);
                                if (matches != null && matches[1]) {
                                    filename = matches[1].replace(/['"]/g, "");
                                }
                            }
    
                            var downloadLink = window.document.createElement("a");
                            var contentTypeHeader = request.getResponseHeader("Content-Type");
                            downloadLink.href = window.URL.createObjectURL(
                                new Blob([data], { type: "application/vnd.ms-excel" })
                            );
                            downloadLink.download = filename;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
    
                            v.$root.showSuccess("Downloading..");
                        } else {
                            v.$root.showError("Error Occured! Please Contact Developer");
                        }
                    }
                });
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
                
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Bulan</label>
                            <select name="tahun" id="tahun" class="selectpicker" v-model="forms.bulan">
                                <option value="">SELECT</option>
                                <template v-for="(item, index) in dataList.month_list">
                                    <option v-bind:value="item.id">
                                        {{ item.bulan }}
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
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Provinsi</label>
                            <select name="provinsi" id="provinsi" class="selectpicker" v-model="forms.provinsi" v-on:change="getKab">
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
                            <select name="kabupaten" id="kabupaten" class="selectpicker" v-model="forms.kabupaten">
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
                <div class="clearfix">
                    <div class="pull-right">
                        <button class="btn btn-primary btn-sm" v-on:click="handleData('SHOW')">
                            <i class="fa fa-eye"></i> TAMPILKAN DATA
                        </button>
                        <button class="btn btn-primary btn-sm" v-on:click="handleData('DOWNLOAD')">
                            <i class="fa fa-download"></i> DOWNLOAD EXCEL
                        </button>
                    </div>
                </div>

                <table class="table table-bordered table-striped table-hover datatable">
                    <thead>
                        <tr>
                            <th class="text-center">No</th>
                            <th class="text-center">Nama Anggota</th>
                            <th class="text-center" width="140px">DPP</th>
                            <th class="text-center" width="140px">DPD</th>
                            <th class="text-center" width="140px">DPC</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in reportList">
                            <td class="text-center">{{ index+1 }}</td>
                            <td>{{ item.nama_anggota }}</td>
                            <td class="text-right">{{ $root.formatNumber(item.dpp) }}</td>
                            <td class="text-right">{{ $root.formatNumber(item.dpd) }}</td>
                            <td class="text-right">{{ $root.formatNumber(item.dpc) }}</td>
                        </tr>
                    </tbody>
                    <tr>
                        <td colspan="2" class="text-center"><b>SUB TOTAL</b></td>
                        <td class="text-right">{{ $root.formatNumber(dpp) }}</td>
                        <td class="text-right">{{ $root.formatNumber(dpd) }}</td>
                        <td class="text-right">{{ $root.formatNumber(dpc) }}</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="text-center"><b>TOTAL PENERIMAAN</b></td>
                        <td colspan="3" class="text-center">{{ $root.formatNumber(total_all) }}</td>
                    </td>
                </table>
            </div>
        </div>
    </div>
    `
}
