const NOT_UPDATED_PAGE = {
	data : function() {
		return {
            userdata : [],
            listData : {
                not_update : []
            },
            activeIndex : 0,
            table : null
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "BELUM UPDATE"); // JUDUL PAGE
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
				v.getNotUpdateList();
			}
        },
        getNotUpdateList : function(){
            var v = this;

            v.$root.showLoading("Mengambil data..");

            if(v.table != null){
                v.table.dataTable().fnDestroy();
            }
            $.ajax({
                type : "GET",
                url : BASE_URL+"services/not_updated_list",
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.listData, "not_update", resp.data);
                        v.$nextTick(() => {
                            v.table = $(".datatable").dataTable({
                                pageLength : 20
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
        },
        setActive : function(index){
            var v = this;

            v.$set(v, "activeIndex", index);

            v.$nextTick(() => {
                $("#modal-form").modal('show');
            });
        },
        saveForm : function(){
            var v = this;

            v.$root.showLoading("Menyimpan..");

            $.ajax({
                type : "POST",
                url : BASE_URL+"services/save_update_bukti_setor",
                data : {
                    tanggal_setor : v.listData.not_update[v.activeIndex].tanggal_setor,
                    nominal : v.listData.not_update[v.activeIndex].nominal,
                    unique_identifier : v.listData.not_update[v.activeIndex].unique_identifier,
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$nextTick(() => {
                            swal.close();
                            $("#modal-form").modal('hide');
                            v.getNotUpdateList();
                        })
                    }else{
                        v.$root.showError("Gagal mengambil data!");
                    }
                },
                error:function(e){
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
                    <i class="fa fa-times fa-2x"></i>
                </div>
                <div class="card-title">
                    Belum Update
                </div>
            </div>
            <div class="card-body">
                <table class="table table-bordered table-striped table-hover datatable">
                    <thead>
                        <tr>
                            <th class="text-center">Bulan</th>
                            <th class="text-center">Provinsi</th>
                            <th class="text-center">Kab. / Kota</th>
                            <th class="text-center">Nama Anggota</th>
                            <th class="text-center">DPP</th>
                            <th class="text-center">DPD</th>
                            <th class="text-center">DPC</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in listData.not_update">
                            <td>{{ item.bulan }}</td>
                            <td>{{ item.provinsi }}</td>
                            <td>{{ item.kab_kota }}</td>
                            <td>{{ item.nama_anggota }}</td>
                            <td class="text-right">
                                {{ $root.formatNumber(item.dpp) }}
                            </td>
                            <td class="text-right">
                                {{ $root.formatNumber(item.dpd) }}
                            </td>
                            <td class="text-right">
                                {{ $root.formatNumber(item.dpc) }}
                            </td>
                            <td class="text-right">
                                <button class="btn btn-info btn-sm" v-on:click="setActive(index)">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal fade" id="modal-form">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img :src="listData.not_update[activeIndex].bukti_setor" class="img-fluid">
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Tanggal Setor</label>
                                    <input type="date" class="form-control" v-model="listData.not_update[activeIndex].tanggal_setor">
                                </div>
                                <div class="form-group">
                                    <label>Nominal</label>
                                    <input type="number" class="form-control" min="0" v-model="listData.not_update[activeIndex].nominal">
                                </div>
                                <button class="btn btn-primary btn-sm" v-on:click="saveForm()">SIMPAN</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}