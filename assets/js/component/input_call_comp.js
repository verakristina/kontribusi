const INPUT_CALL = {
	data : function() {
		return {
			userdata : [],
			status_call : [],
			anggota_dewan : {},
			kontribusi : null,
			partisipasi : null,
			id_anggota : null,
			forms : {
				status_call : null,
				follow_up_on : null,
				note : null
			},
			state : {
				showDate : false,
				dateNext : "",
				isFollowUp :false,
				call_id : ""
			},
			lci : {}
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Input Call"); // JUDUL PAGE
		v.$set(v, "id_anggota", v.$route.params.id);
		if(v.$route.query.is_follow_up === 'true'){
			v.$set(v.state, "isFollowUp", true);
			v.$set(v.state, "call_id", v.$route.query.call_id);
		}
	},
	mounted : function(){
		var v = this;
		v.get_session();
		v.getStatusCall();
		v.$nextTick(() => {
			$(".selectpicker").selectpicker();
		});
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
				v.getInfoDewan();
			}
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
					v.$root.showError("Gagal mengambil data!");
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
		getDetailLastCall : function(){
			var v = this;
			v.$root.showLoading("Mengambil data telepon terakhir..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"services/get_detail_last_call",
				data : {
					call_id : v.state.call_id
				},
				success:function(resp){
					if(resp.code == 200){
						v.$set(v, "lci", resp.data[0]);
						v.$nextTick(() => {
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
		}
	},
	template : `
	<div>
		<router-link class="btn btn-danger" :to="{ path : '/daily-calls' }">
			<i class="fa fa-arrow-left"></i> Kembali
		</router-link>
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
				</div>
				<div class="row">
					<div class="col-md-3 col-lg-3">
						<div class="form-group">
							<label>No. Telp</label>
							<input type="text" class="form-control" v-model="anggota_dewan.no_telp">
						</div>
					</div>
					<div class="col-md-3 col-lg-3">
						<div class="form-group">
							<label>Email</label>
							<input type="text" class="form-control" v-model="anggota_dewan.email">
						</div>
					</div>
					<div class="col-md-3 col-lg-3">
						<div class="form-group">
							<label>Take Home Pay</label>
							<input type="nuber" min="0" step="1"class="form-control" v-model="anggota_dewan.thp">
						</div>
					</div>
				</div>
			</div>
		</div>
		<ul class="nav nav-pills nav-pills-warning" role="tablist">
			<li class="nav-item">
				<a class="nav-link active" data-toggle="tab" href="#link1" role="tablist" aria-expanded="true">
					Informasi Dana Kontribusi & Partisipasi
				</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" data-toggle="tab" href="#link3" role="tablist" aria-expanded="false" v-if="state.isFollowUp">
					Informasi Panggilan Sebelumnya
				</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" data-toggle="tab" href="#link2" role="tablist" aria-expanded="false">
					Form Panggilan
				</a>
			</li>
		</ul>
		<div class="tab-content tab-space">
			<div class="tab-pane active" id="link1" aria-expanded="true">
				<div class="row">
					<div class="col-md-6 col-lg-6">
						<div class="card">
							<div class="card-header card-header-icon card-header-warning">
								<div class="card-icon">
									<i class="fa fa-money fa-2x"></i>
								</div>
								<div class="card-title">
									Detail Dana Kontribusi
								</div>
							</div>
							<div class="card-body p-2">
								<div class="row" v-if="kontribusi != null">
									<div class="col-md-6 col-lg-6">
										<div class="card my-1">
											<div class="card-body p-1">
												<label class="text-dark">TERBAYAR</label>
												<h3 class="text-center font-bold m-1">{{ kontribusi.count.paid }} Bulan</h3>
												<table class="table">
													<tr v-for="(item, index) in kontribusi.detail.paid">
														<td>{{ item.bulan }}</td>
													</tr>
												</table>
											</div>
										</div>
									</div>
									<div class="col-md-6 col-lg-6">
										<div class="card my-1">
											<div class="card-body p-1">
												<label class="text-dark">BELUM DIBAYAR</label>
												<h3 class="text-center font-bold m-1">{{ kontribusi.count.not_paid }} Bulan</h3>
												<table class="table">
													<tr v-for="(item, index) in kontribusi.detail.not_paid">
														<td>{{ item.bulan }}</td>
													</tr>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>	
					</div>
					<div class="col-md-6 col-lg-6">
						<div class="card">
							<div class="card-header card-header-icon card-header-warning">
								<div class="card-icon">
									<i class="fa fa-money fa-2x"></i>
								</div>
								<div class="card-title">
									Detail Dana Partisipasi
								</div>
							</div>
							<div class="card-body p-2 pt-3">
								<template v-if="partisipasi != null">
									<div class="clearfix">
										<div class="pull-left align-middle">
											<label class="text-dark" style="margin-top: 12px">TERBAYAR</label>
										</div>
										<div class="pull-right">
											<h3 class="title text-right m-1">
												{{ $root.formatNumber(partisipasi.terbayar) }} / {{ $root.formatNumber(partisipasi.target) }}
											</h3>
										</div>
									</div>
									<div class="clearfix">
										<div class="pull-left align-middle">
											<label class="text-dark" style="margin-top: 12px">KEKURANGAN</label>
										</div>
										<div class="pull-right">
											<h3 class="title text-right m-1">
												{{ $root.formatNumber(partisipasi.kurang) }}
											</h3>
										</div>
									</div>
								<template>
							</div>
						</div>	
					</div>
				</div>
			</div>
			<div class="tab-pane" id="link2" aria-expanded="false">
				<div class="card">
					<div class="card-header card-header-icon card-header-warning">
						<div class="card-icon">
							<i class="fa fa-file fa-2x"></i>
						</div>
						<div class="card-title">
							Form Panggilan
						</div>
					</div>
					<div class="card-body">
						<div class="row">
							<div class="col-md-3 col-lg-3">
								<div class="form-group">
									<label>Status Panggilan</label>
									<select class="selectpicker" v-model="forms.status_call" v-on:change="checkIndex">
										<option value="">--SELECT--</option>
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
			<div class="tab-pane" id="link3" aria-expanded="true" v-if="state.isFollowUp">
				<div class="card">
					<div class="card-header card-header-icon card-header-warning">
						<div class="card-icon">
							<i class="fa fa-history fa-2x"></i>
						</div>
						<div class="card-title">
							Informasi Panggilan Sebelumnya
						</div>
					</div>
					<div class="card-body">
						<div class="row">
							<div class="col-md-4 col-lg-4">
								<label>Status Panggilan</label><br>
								<div class="badge badge-danger" v-if="lci.need_follow_up == 1">
									<h5>{{ lci.status_call }}</h5>
								</div>
								<div class="badge badge-success" v-else-if="lci.need_follow_up == 2">
									<h5>{{ lci.status_call }}</h5>
								</div>
								<div class="badge badge-warning" v-else>
									<h5>{{ lci.status_call }}</h5>
								</div>
								<br>
								<label class="mt-2">Ditelpon Pada</label><br>
								{{ lci.CALL_DATE }}
							</div>
							<div class="col-md-8 col-lg-8">
								<label>Note / Catatan</label><br>
								<p class="justify">{{ lci.note }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
}