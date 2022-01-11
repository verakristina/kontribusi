const MANUAL_CALL = {
	data : function() {
		return {
            userdata : [],
            dataList : {
                prov_list : [],
                kab_list : [],
                anggota_list : []
            },
            forms : {
                provinsi : "",
                kabupaten : "",
                status_call : "",
                follow_up : "",
				follow_up_on : null,
				note : null
            },
            id_anggota : "",
            state : {
				showDate : false,
				dateNext : "",
				isFollowUp :false,
				call_id : ""
			},
            lci : {},
            status_call : [],
			follow_up : [],
			anggota_dewan : {},
			kontribusi : null,
			partisipasi : null,
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Manual Call"); // JUDUL PAGE
	},
	mounted : function(){
		var v = this;
        v.get_session();
        v.getStatusCall();
        v.getFollsUp();
        v.$nextTick(() => {
			$(".selectpicker").selectpicker({
				liveSearch : true
			});
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
            v.$root.get_kab(v.forms.provinsi, v.getKabCallback);
            v.$nextTick(() => {
                v.getAnggota();
            })
		},
		getKabCallback : function(resp){
			var v = this;
			
			v.$set(v.dataList, "kab_list", resp);
			v.$nextTick(() => {
				$(".selectpicker").selectpicker('refresh');
			});
        },
        getAnggota : function(){
            var v = this;

            $.ajax({
                type : "GET",
                url : BASE_URL+"api/get_anggota",
                data : {
                    provinsi : v.forms.provinsi,
                    kabupaten : v.forms.kabupaten
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v.dataList, "anggota_list", resp.data);

                        v.$nextTick(() => {
                            $(".selectpicker").selectpicker('refresh');
                        })
                    }else{
                        v.$root.showError("Gagal mengambil data!");    
                    }
                },
                error:function(e){
                    v.$root.showError("Gagal mengambil data!");
                }
            })
        },
        getInfoDewan : function(){
			var v = this;

			v.$root.showLoading("Mengambil data anggota dewan..");

            $.ajax({
                type : "GET",
                url : BASE_URL+"services/get_dewan",
                data : {
                    id_anggota : v.id_anggota
                },
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v, "anggota_dewan", resp.data[0])
                    }else{
                        v.$root.showError("Gagal mengambil data!");
					}
					v.getDetailPayment();
                },
                error:function(){
                    v.$root.showError("Gagal mengambil data!");
                }
            })
		},
		getDetailPayment : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"services/get_detail_bayar_dewan",
				data : {
					id_anggota : v.id_anggota
				},
				success:function(resp){
					if(resp.code == 200){
						v.$set(v, "kontribusi", resp.data.kontribusi);
						v.$set(v, "partisipasi", resp.data.partisipasi);
						v.$set(v.state, "dateNext", resp.data.date_next);
						v.$nextTick(() => {
							swal.close();
						});
					}else{
						swal.close();
					}

					if(v.state.isFollowUp){
						v.getDetailLastCall();
					}
				},
				error:function(e){
					v.$root.showSuccess("Berhasil mengambil data!");
				}
			})
		},
		getStatusCall : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/get_status_call",
				success:function(resp){
					if(resp.code == 200){
						v.$set(v, "status_call", resp.data);
						v.$nextTick(() => {
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
		getFollsUp : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/get_follow_up",
				success:function(resp){
					if(resp.code == 200){
						v.$set(v, "follow_up", resp.data);
						v.$nextTick(() => {
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
		checkIndex : function(){
			var v = this;
			var id = v.forms.status_call;

			var obj = _.find(v.status_call, function(o){
				return o.id == id;
			});

			if(obj.need_follow_up == 2 || obj.need_follow_up == 1){
				v.$set(v.state, "showDate", true);
				if(obj.need_follow_up == 1){
					v.$set(v.forms, "follow_up_on", v.state.dateNext);
				}
			}else{
				v.$set(v.state, "showDate", false);
				if(obj.need_follow_up == 1){
					v.$set(v.forms, "follow_up_on", "");
				}
			}
		},
		saveForm : function(){
			var v = this;

            if(v.id_anggota == ""){
				v.$root.showError("Pilih anggota yang ditelpon!");
				return false;
			}

			if(v.forms.status_call == null){
				v.$root.showError("Pilih status panggilan!");
				return false;
			}

			v.$root.showLoading("Menyimpan..");
			v.$set(v.forms, "id_anggota", v.id_anggota);
			v.$set(v.forms, "created_by", v.userdata.sess_user_id)

			if(v.state.isFollowUp){
				v.$set(v.forms, "call_id", v.state.call_id);
			}

			$.ajax({
				type : "POST",
				url : BASE_URL+"services/save_daily_call",
				data : v.forms,
				success:function(resp){
					if(resp.code == 200){
						v.$root.showSuccess("Berhasil disimpan!");
						window.location=BASE_URL+"daily-calls"
					}else{
						v.$root.showError("Gagal menyimpan!");
					}
				},
				error:function(e){
					v.$root.showError("Gagal menyimpan!");
				}
			})
		},
	},
    template : `
    <div>
	<router-link class="btn btn-danger" :to="{ path : '/daily-calls' }">
            <i class="fa fa-arrow-left"></i> Kembali
    </router-link>
        <div class="card">
            <div class="card-header card-header-icon card-header-warning">
                <div class="card-icon">
                    <i class="fa fa-phone fa-2x"></i>
                </div>
                <div class="card-title">
                    Manual Call
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
                            <select name="kabupaten" id="kabupaten" class="selectpicker mt-2" v-model="forms.kabupaten" v-on:change="getAnggota">
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.kab_list">
                                    <option v-bind:value="it.id">
                                        {{ it.kab_kota }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Nama Anggota</label>
                            <select name="kabupaten" id="kabupaten" class="selectpicker mt-2" v-model="id_anggota" v-on:change="getInfoDewan">
                                <option value="">SELECT</option>
                                <template v-for="(it, ind) in dataList.anggota_list">
                                    <option v-bind:value="it.id">
                                        {{ it.nama_anggota }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
			<div class="card-header card-header-icon card-header-warning">
				<div class="card-icon">
					<i class="fa fa-user fa-2x"></i>
				</div>
				<div class="card-title">
					Detail Anggota Dewan
				</div>
			</div>
			<div class="card-body">
				<div class="row">
					<div class="col-md-6 col-lg-6">
						<div class="form-group">
							<label>Nama</label>
							<input type="text" class="form-control" v-model="anggota_dewan.nama_anggota">
						</div>
					</div>
					<div class="col-md-6 col-lg-6">
						<div class="form-group">
							<label>Jabatan</label>
							<input type="text" class="form-control" v-model="anggota_dewan.jabatan">
						</div>
					</div>
				</div><br>
				<div class="row">
					<div class="col-md-3 col-lg-3">
						<div class="form-group">
							<label>No. Telp</label>
							<input type="text" class="form-control" v-model="anggota_dewan.no_telp">
						</div>
					</div>
					<div class="col-md-3 col-lg-3">
						<div class="form-group">
							<label>Take Home Pay</label>
							<input type="nuber" min="0" step="1"class="form-control" v-model="anggota_dewan.thp">
						</div>
					</div>
					<div class="form-group">
					<label>Follow Up</label>
					<select class="selectpicker mt-2" v-model="forms.follow_up">
						<option value="">SELECT</option>
						<template v-for="(item, index) in follow_up">
							<option :value="item.id">{{ item.follow_up }}</option>
						</template>
					</select>
				</div>
				</div>
				<div class="row">
					<div class="col-md-3 col-lg-3">
						<div class="form-group">
							<label>Status Panggilan</label>
							<select class="selectpicker mt-2" v-model="forms.status_call" v-on:change="checkIndex">
								<option value="">SELECT</option>
								<template v-for="(item, index) in status_call">
									<option :value="item.id">{{ item.status_call }}</option>
								</template>
							</select>
						</div>
					</div>
					<div class="col-md-3 col-lg-3" v-if="state.showDate">
						<div class="form-group" style="margin-top: 22px;">
							<label>Tanggal Follow Up</label>
							<input type="date" class="form-control" v-model="forms.follow_up_on">
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6 col-lg-6">
						<div class="form-group">
							<label>Catatan Panggilan</label>
							<textarea cols="30" rows="10" class="form-control" v-model="forms.note"></textarea>
						</div>
					</div>
				</div>
				<button class="btn btn-primary btn-sm" v-on:click="saveForm">
					SIMPAN
				</button>
			</div>
		</div>
    </div>
    `
}