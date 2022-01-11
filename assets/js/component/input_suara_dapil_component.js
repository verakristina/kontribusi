const INPUT_SUARA_DAPIL = {
	data : function() {
		return {
			form : {
				id_pemilihan : "",
				id_dapil : "",
				id_partai : "",
				id_prov : ""
			},
			dataList : {
				pemilihan : [],
				dapilList : [],
				calegList : [],
				kotaList : []
			},
			votes : {
				voteList : [],
				suara_dapil : 0
			},
			state : {
				showProv : false,
				showCity : false,
				showDapil : false
			}
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Input Total Suara Dapil");
	},
	mounted : function(){
		var v = this;

		v.getPemilihan();
		v.handlePaste();
		v.getPartai();

		/* PASTE OPT */
	},
	methods : {
		getPemilihan : function(){
			var v = this;
			v.$root.showLoading("Mohon tunggu..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getPemilihan",
				success:function(resp){
					v.$set(v.dataList, "pemilihan", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
						swal.close();
					})
				}
			});
		},
		getDapilList : function(){
			var v = this;
			v.$set(v.dataList, "dapilList", []);

			var chosen = _.find(v.dataList.pemilihan, function(o){
				return o.id == v.form.id_pemilihan	
			});

			if(chosen.tipe_pemilihan == "DPR RI"){
				v.$set(v.state, "showDapil", true);
				v.$set(v.state, "showProv", false);
				v.$set(v.state, "showCity", false);
				v.getDapilDPR();
			}else if(chosen.tipe_pemilihan == "DPRD I"){
				v.$set(v.state, "showProv", true);
				v.$set(v.state, "showDapil", true);
				if(v.form.id_prov != ""){
					v.getDapilProv();
				}else{
					v.getProv();
				}
			}else if(chosen.tipe_pemilihan == "DPRD II"){
				alert("WAIT, NGAMBIL PROV., KAB., KOTA DULU");
			}else{
				alert("OH, DPD YA? WAIT");
			}
		},
		getProv : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getProv",
				success:function(resp){
					v.$set(v.dataList, "provinsi", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					});
				}
			})
		},
		getDapilProv : function(){
			var v = this;

			v.$root.showLoading("Mengambil data DAPIL");
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getDapil",
				data : {
					id_pemilihan : v.form.id_pemilihan,
					id_prov : v.form.id_prov
				},
				success:function(resp){
					v.$set(v.dataList, "dapilList", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					})
					swal.close();
				},
				error:function(){
					swal.close();
				}
			})
		},
		getDapilDPR : function(){
			var v = this;
			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getDapil",
				data : {
					id_pemilihan : v.form.id_pemilihan
				},
				success:function(resp){
					v.$set(v.dataList, "dapilList", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					})
				},
				error:function(){
				}
			});
		},
		handlePaste : function(item){
			var ve = this;
			ve.$nextTick(() => {
				$('input').on('paste', function(e){
					var $this = $(this);
					$.each(e.originalEvent.clipboardData.items, function(i, v){
						if (v.type === 'text/plain'){
							v.getAsString(function(text){
								var x = $this.closest('td').index(),
									y = $this.closest('tr').index(),
									obj = {};
								text = text.trim('\r\n');
								$.each(text.split('\r\n'), function(i2, v2){
									$.each(v2.split('\t'), function(i3, v3){
										var row = y+i2, col = x+i3;
										
										obj['cell-'+row+'-'+col] = v3;
										var l = $this.closest('tbody').find('tr:eq('+row+') td:eq('+col+') input').data('index-top');
										var m = $this.closest('tbody').find('tr:eq('+row+') td:eq('+col+') input').data('index-bot');
										ve.$nextTick(() => {
											ve.$set(ve.votes.voteList[l].votes[m], "votes", v3);
											//ve.votes.voteList.votes[index].votes = v3;
										});
									});
								});
								//$('#json').text(JSON.stringify(obj));
							});
						}
					});
					return false;
				});
			});
		},
		getPartai : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/getPartai",
				success:function(resp){
					v.$set(v.dataList, "partai", resp.data);
					v.$nextTick(() => {
						$(".selectpicker").selectpicker("refresh");
					});
				},
				error:function(e){
					v.$root.showError("Gagal mengambil data!");
				}
			})
		},
		changePartai : function(){
			var v = this;
			v.$set(v.form, "id_partai", "");
			v.$nextTick(() => {
				$(".selectpicker").selectpicker("refresh");
			})
		},
		getDapilVotes : function(){
			var v = this;

			v.$root.showLoading("Mohon tunggu..");

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/get_dapil_votes",
				data : {
					id_dapil : v.form.id_dapil
				},
				success:function(resp){
					v.$set(v.votes, "voteList", resp.data.list);
					v.$set(v.votes, "suara_dapil", resp.data.suara_dapil);
					swal.close();
				},
				error:function(e){
					v.$root.showError("Gagal mengambil data!");
				}
			})
		},
		saveVotes : function(){
			var v = this;

			v.$root.showLoading("Menyimpan data..");

			$.ajax({
				type : "POST",
				url  : BASE_URL+"api/save_votes_dapil",
				data : {
					voteList : v.votes.voteList
				},
				success:function(resp){
					v.$root.showSuccess("Data berhasil disimpan!");
				},
				error:function(e){
					v.$root.showError("Data gagal disimpan!");
				}
			})
		},
		recountVotes : function(){
			var v = this;

			var total = _.sumBy(v.votes.voteList, function(o){
				return parseInt(o.total_suara)
			});
			//console.log(total);

			v.$set(v.votes, "suara_dapil", total)
		}
	},
	template : `
	<div class="card">
		<div class="card-header card-header-icon card-header-warning">
			<div class="card-icon">
				<i class="material-icons">list</i>
			</div>
			<h4 class="card-title">Rekapitulasi Suara</h4>
		</div>
		<div class="card-body">
			<div class="row">
				<div class="col-md-3 col-sm-6 col-12">
					<div class="form-group">
						<label>Jenis Pemilihan</label>
						<select class="selectpicker form-control" v-model="form.id_pemilihan" v-on:change="getDapilList">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.pemilihan">
								<option v-bind:value="item.id">{{ item.tipe_pemilihan }}</option>
							</template>
						</select>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 col-12" v-if="state.showProv">
					<div class="form-group">
						<label>Provinsi</label>
						<select class="selectpicker form-control" v-model="form.id_prov" v-on:change="getDapilList">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.provinsi">
								<option v-bind:value="item.id">{{ item.provinsi }}</option>
							</template>
						</select>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 col-12" v-if="state.showDapil">
					<div class="form-group">
						<label>Dapil</label>
						<select class="selectpicker form-control" v-model="form.id_dapil" v-on:change="getDapilVotes">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.dapilList">
								<option v-bind:value="item.id">{{ item.nama_dapil }}</option>
							</template>
						</select>
					</div>
				</div>
			</div>
			<hr/>
	
			<div class="row">
				<div class="col-md-3">
					<div class="card" v-if="votes.voteList.length != 0">
						<div class="card-body">
							<div class="form-group">
								<label>Total Suara Dapil</label>
								<input type="number" min="0" step="1" class="form-control" v-model="votes.suara_dapil" disabled/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<table class="w-75 table table-bordered table-striped table-hover" v-if="votes.voteList.length != 0">
				<thead>
					<tr>
						<th class="text-center">Nama Partai</th>
						<th class="text-center">Total Suara</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in votes.voteList">
						<td>
							{{ item.nama_partai }}
						</td>
						<td width="240px">
							<input type="number" class="form-control" min="0" step="1" v-model="item.total_suara" v-on:change="recountVotes" />
						</td>
					</tr>
				</tbody>
			</table>
			<button class="btn btn-primary" v-if="votes.voteList.length != 0" v-on:click="saveVotes">
				SIMPAN
			</button>
		</div>
	</div>
	`
}