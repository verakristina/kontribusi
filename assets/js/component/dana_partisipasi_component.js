const DANA_PARTISIPASI = {
	data : function() {
		return {
            icon: "assignment"
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "DANA PARTISIPASI"); // JUDUL PAGE
	},
	mounted : function(){

	},
	methods : {

	},
  template: `
  <!-- <div class="row">
      	<div class="col-md-12" :style='{"margin-top" : "-30px"}'>
        	<div class="card ">
          		<div class="card-header card-header-info card-header-icon">
            		<div class="card-icon">
              			<i class="material-icons">{{icon}}</i>
            		</div>
            		<h4 class="card-title">HELLO WORLD</h4>
              		</div>
          		<div class="card-body">
          			<button class="btn btn-info" @click="send_email()">
                      <i class="material-icons">add</i> 
                      TEST SEND EMAIL
                    </button>
          		</div>
          	</div>
        </div>
    </div> -->
    `
}