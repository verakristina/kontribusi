const INPUT_SUARA = {
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
				party_id : "",
				total_votes : "",
				caleg_votes : "",
				voteList : []
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
		store.commit("changeNavTitle", "Input Suara Caleg");
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
		getVotes : function(){
			var v = this;
			v.$root.showLoading("Mengambil data..");
			$.ajax({
				type : "GET",
				url : BASE_URL+"caleg/getVotes",
				data : v.form,
				success:function(resp){
					console.log(resp.status);
					if(resp.status == "success"){

						var total = resp.data.total_votes;
						var caleg = resp.data.caleg_votes;
						var party_id = total-caleg;

						v.$set(v.votes, "caleg_votes", caleg);
						v.$set(v.votes, "total_votes", total);
						v.$set(v.votes, "voteList", resp.data.voteList);
						v.$set(v.dataList, "kotaList", resp.data.kotaList);
						v.$set(v.votes, "party_id", party_id);

						swal.close();
					}else{
						swal.close();
					}
				}
			})
		},
		saveVotes : function(){
			var v = this;
			v.$root.showLoading("Menyimpan data..");
			v.$nextTick(() => {
				$.ajax({
					type : "POST",
					url : BASE_URL+"caleg/save_votes",
					data : v.votes,
					success:function(resp){
						if(resp.status == "success"){

						}
						v.$root.showSuccess("Data berhasil disimpan!");
					}
				})
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
						<select class="selectpicker form-control" v-model="form.id_dapil" v-on:change="changePartai">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.dapilList">
								<option v-bind:value="item.id">{{ item.nama_dapil }}</option>
							</template>
						</select>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 col-12">
					<div class="form-group">
						<label>Partai</label>
						<select class="selectpicker form-control" v-model="form.id_partai" v-on:change="getVotes">
							<option value="">--SELECT--</option>
							<template v-for="(item, index) in dataList.partai">
								<option v-bind:value="item.id">{{ item.nama_partai }}</option>
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
								<label>Suara Partai</label>
								<input type="number" min="0" step="1" class="form-control" v-model="votes.total_votes"/>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card" v-if="votes.voteList.length != 0">
						<div class="card-body">
							<div class="form-group">
								<label>Total Suara Caleg</label>
								<input type="number" min="0" step="1" class="form-control" v-model="votes.caleg_votes" disabled/>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card" v-if="votes.voteList.length != 0">
						<div class="card-body">
							<div class="form-group">
								<label>Party ID</label>
								<input type="number" min="0" step="1" class="form-control" v-model="votes.party_id" disabled/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="table__scroll" :style='{"position" : "relative", "min-height" : "10px", "overflow" : "scroll"}'>
				<table class="table table-bordered table-striped table-hover" 
						v-if="votes.voteList.length != 0"
						:style='{"min-width" : "10%", "font-size" : "12px"}'
						>
					<thead>
						<tr>
							<th rowspan="2">NAMA CALON</th>
							<th class="text-center" :colspan="dataList.kotaList.length">
								JUMLAH SUARA
							</th>
						</tr>
						<tr>
							<template v-for="(item, index) in dataList.kotaList">
								<th width="180px">{{ item.nama_daerah }}</th>
							</template>
						</tr>
					</thead>
					<tbody>
						<template v-for="(item, index) in votes.voteList">
							<tr>
								<td>{{ item.nama_calon }}</td>
								<template v-for="(v_item, v_index) in item.votes">
									<td>
										<input 
											type="number" 
											min="0" 
											step="1" 
											class="form-control" 
											:data-index-top="index"
											:data-index-bot="v_index"
											v-model="v_item.votes"
											v-on:paste="handlePaste(v_item)"
											/>
									</td>
								</template>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
			<button class="btn btn-primary" v-if="votes.voteList.length != 0" v-on:click="saveVotes">
				SIMPAN
			</button>
		</div>
	</div>
	`
}