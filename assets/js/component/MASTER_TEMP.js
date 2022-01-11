const DASHBOARD = {
	data : function() {
		return {
			userdata : []
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", ""); // JUDUL PAGE
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
				v.get_date_info();
			}
		},
	},
	template : ``
}