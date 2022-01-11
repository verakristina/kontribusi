const DAILY_CALLS = {
	data : function() {
		return {
			userdata : [],
			dataList : {
				prov_list : [],
				date : ""
			},
			list : {
				called : [],
				not_called : [],
				follow_up : []
			},
			count : {
				called : 0,
				not_called : 0,
				follow_up : 0
			},
			table : {
				table_one : null,
				table_two : null,
				table_three : null
			},
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Daily Calls"); // JUDUL PAGE
	},
	mounted : function(){
		var v = this;
		v.get_session();
		v.printDate();
		
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
				if(v.userdata.sess_role_id){
					v.$root.get_prov(v.getProvCallback);
				}else{
					v.$root.get_prov_by_user(v.userdata.sess_user_id, v.getProvCallback);
				}
			}else{
				v.$root.showError("Gagal mengambil data!");
			}
		},
		getProvCallback : function(resp){
			var v = this;
			v.$set(v.dataList, "prov_list", resp.data);
			v.$nextTick(() => {
				swal.close();
				$(".selectpicker").selectpicker('refresh');
				v.getListCall();
			});
		},
		printDate : function(){
			var v = this;

			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();

			today = dd + '/' + mm + '/' + yyyy;
			v.$set(v.dataList, "date", today);
		},
		getListCall : function(){
			var v = this;
			v.$root.showLoading("Mengambil data..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"services/get_list_call",
				success:function(resp){
					if(resp.code == 200){						

						v.$set(v.list, "called", resp.data.called)
						v.$set(v.list, "not_called", resp.data.not_called)
						v.$set(v.list, "follow_up", resp.data.follow_up)
						v.$set(v, "count", resp.data.count)

						v.$nextTick(() => {
							v.table.table_one = $(".datatable-1").dataTable({
								'ordering' : false
							});
							v.table.table_two = $(".datatable-2").dataTable({
								'ordering' : false
							});
							v.table.table_three = $(".datatable-3").dataTable({
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
		}
	},
	template : `
	<div>
		<div class="card mt-1">
			<div class="card-body">
				<ul class="nav nav-pills nav-pills-warning" role="tablist">
					<li class="nav-item">
						<a class="nav-link active" data-toggle="tab" href="#link3" role="tablist" aria-expanded="false">
							Telah Ditelpon <div class="badge badge-danger">{{ $root.formatNumber(count.called) }}</div>
						</a>
					</li>
				</ul>
				<div class="tab-content tab-space">
					<div class="tab-pane active" id="link3" aria-expanded="false">
						<div class="clearfix">
							<div class="pull-left">
								<h4 class="p-0">{{ dataList.date }}</h4>
							</div>
							<div class="pull-right">
								<a :href="'./report/print_daily_calls_report?date='+dataList.date" target="__Blank" class="btn btn-primary btn-sm" v-if="userdata.sess_role_id == 1">
									<i class="fa fa-print"></i> Cetak Report
								</a>
								<a :href="'./report/print_daily_calls_report?date='+dataList.date+'&id_user='+userdata.sess_user_id" target="__Blank" class="btn btn-primary btn-sm" v-else>
									<i class="fa fa-print"></i> Cetak Report
								</a>
							</div>
							<div class="pull-right">
								<router-link class="btn btn-primary btn-sm" :to="{ path : '/manual-call' }">
									<i class="fa fa-plus"></i>
								</router-link>
							</div>
						</div>
						<table class="table table-bordered table-striped table-hover datatable-3">
							<thead>
								<tr>
									<th class="text-center">No</th>
									<th class="text-center">Nama Dewan</th>
									<th class="text-center">Provinsi</th>
									<th class="text-center">Kab. / Kota</th>
									<th class="text-center">Status</th>
									<th class="text-center">Noteds</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in list.called">
									<td class="text-center">{{ index+1 }}</td>
									<td>{{ item.nama_anggota }}</td>
									<td>{{ item.provinsi }}</td>
									<td>{{ item.kab_kota }}</td>
									<td class="text-center">
										<div class="badge badge-danger" v-if="item.need_follow_up == 1">
											{{ item.status_call }}
										</div>
										<div class="badge badge-warning" v-else-if="item.need_follow_up == 2">
											{{ item.status_call }}
										</div>
										<div class="badge badge-success" v-else>
											{{ item.status_call }}
										</div>
									</td>
									<td class="text-right">{{ item.note }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
}