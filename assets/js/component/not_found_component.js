const NOTFOUND = {
  data: function() {
    return {
      crumbs: "DATA TIDAK DITEMUKAN",
      title: "DATA TIDAK DITEMUKAN",
      icon: "assignment"
    };
  },
  created: function() {
    store.commit("changeNavTitle", this.crumbs);
  },
  methods: {
    send_email: function(argument) {
      var v = this;

      v.$root.showLoading("Sending Email..");

      var email = prompt("masukan email anda?");
      var subject = prompt("masukan subject?");
      var body = prompt("masukan body?");

      var data_post = {
        email: email,
        subject: subject,
        body: body
      };

      $.post(BASE_URL + `api/send_email`, data_post, function(data) {
        if (data.statusCode == 1) {
          v.$root.showSuccess("Email was sent", null);
        } else {
          v.$root.showError("Error Occured! Please Contact Developer");
        }
      });
    }
  },
  template: `<div class="row">
      	<div class="col-md-12" :style='{"margin-top" : "-30px"}'>
        	<div class="card ">
          		<div class="card-header card-header-info card-header-icon">
            		<div class="card-icon">
              			<i class="material-icons">{{icon}}</i>
            		</div>
            		<h4 class="card-title">{{ title }}</h4>
          		</div>
          		<div class="card-body">
          			<button class="btn btn-info" @click="send_email()">
                      <i class="material-icons">add</i> 
                      TEST SEND EMAIL
                    </button>
          		</div>
          	</div>
        </div>
    </div>`
};
