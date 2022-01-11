const DASHBOARD_INFO = {
	data : function() {
		return {
			top_ten_dapil : {
				dpr_ri : [],
				dprd_i : [],
				dprd_ii : []
			},
			top_ten_caleg : {
				dpr_ri : [],
				dprd_i : [],
				dprd_ii : []
			}
		}
	},
	methods : {
		getTopTenDapil : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/get_top_dapil",
				success:function(resp){
					v.$set(v.top_ten_dapil, "dpr_ri", resp.data.dpr_ri);
					v.$set(v.top_ten_dapil, "dprd_i", resp.data.dprd_i);
					v.$set(v.top_ten_dapil, "dprd_ii", resp.data.dprd_ii);
				},
				error:function(e){

				}
			})
		}

		getTopTenCaleg : function(){
			var v = this;

			$.ajax({
				type : "GET",
				url : BASE_URL+"api/get_top_caleg",
				success:function(resp){
					v.$set(v.top_ten_caleg, "dpr_ri", resp.data.dpr_ri);
					v.$set(v.top_ten_caleg, "dprd_i", resp.data.dprd_i);
					v.$set(v.top_ten_caleg, "dprd_ii", resp.data.dprd_ii);
				},
				error:function(e){

				}
			})
		}
	},
	created : function(){

	},
	mounted : function(){

	},
	template : ``
}