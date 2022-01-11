const router = new VueRouter({
  mode: "history",
  base: VUE_BASE_PATH,
  routes: [
    { path: "/not-found", component: NOTFOUND },
    { path: "/list-kontribusi", component: LIST_KONTRIBUSI },
    { path: "/list-partisipasi", component : LIST_PARTISIPASI},
    { path: "/input-kontribusi", component: INPUT_KONTRIBUSI },
    { path: "/input-partisipasi/:id/:id_prov/:id_kab", component: INPUT_PARTISIPASI },
    { path: "/detail-partisipasi/:id", component: DETAIL_PARTISIPASI },
    { path: "/edit-partisipasi/:id", component: EDIT_PARTISIPASI },
    { path: "/dashboard-ar", component: DASHBOARD_AR},
    { path: "/daily-calls", component: DAILY_CALLS},
    { path: "/ide/kontribusi", component: DANA_KONTRIBUSI},
    { path: "/ide/partisipasi", component: DANA_PARTISIPASI},
    { path: "/input-kontribusi-by-nama", component: INPUT_KONTRIBUSI_BY_NAMA },
    { path: "/edit-kontribusi/:id", component: EDIT_KONTRIBUSI },
    { path: "/ide/kontribusi", component: DANA_KONTRIBUSI },
    { path: "/user-management", component: USER_MANAGEMENT },
    { path: "/edit-user/:id", component: EDIT_USER },
    { path: "/add-dewan", component: ADD_DEWAN},
    { path: "/add-user", component: ADD_USER },
    { path: "/kontribusi-single-file", component: MULTIPLE_KONTRIBUSI },
    { path: "/verify/:id", component: VERIFY_KONTRIBUSI_NEW },
    { path: "/verify-partisipasi/:id", component: VERIFY_PARTISIPASI_NEW },
    { path: "/verifikasi/kontribusi", component: PAGE_VERIF_KONTRIBUSI },
    { path: "/verifikasi/partisipasi", component: PAGE_VERIF_PARTISIPASI },
    { path: "/select-bukti-setor", component: SELECT_BUKTI_SETOR },
    { path: "/status-call", component: MASTER_STATUS_CALL },
    { path: "/anggota-dewan", component: MASTER_ANGGOTA_DEWAN },
    { path: "/edit-anggota/:id", component: EDIT_ANGGOTA },
    { path: "/input-call/:id", component: INPUT_CALL },
    { path: "/dashboard", component: DASHBOARD_ADMIN },
    { path: "/parameter-dana", component: PARAMETER_DANA },
    { path: "/penerimaan-perbulan", component: PENERIMAAN_PERBULAN },
    { path: "/report-daily-call", component: REPORT_DAILY_CALL },
    { path: "/report-uang-masuk", component: REPORT_UANG_MASUK },
    { path: "/report-partisipasi", component: REPORT_PENERIMAAN_PARTISIPASI },
    { path: "/penerimaan-pertingkatan", component: PENERIMAAN_PERTINGKATAN },
    { path: "/manual-call", component: MANUAL_CALL },
    { path: "/verified/kontribusi", component: PAGE_VERIFIED_KONTRIBUSI },
    { path: "/verified/partisipasi", component: PAGE_VERIFIED_PARTISIPASI },
    { path: "/not-updated", component: NOT_UPDATED_PAGE },
    { path: "*", redirect: "/not-found" }
  ]
});

router.beforeEach(function(to, from, next) {
  NProgress.start();
  NProgress.done();
  next();
});
const vm = new Vue({
  router,
  store,
  el: "#app_ml",
  data: {
    msg: "Hello World",
    machine: [],
    active_action: null
  },
  computed: {
    background: function() {
      return this.$store.state.theme.sidebar;
    },
    menu_active: function() {
      return this.$store.state.theme.menu_active;
    },
    title: function() {
      return this.$store.state.crumbs;
    },
    name: function() {
      return this.$store.state.data_login.employee_name;
    },
    role_id: function() {
      return this.$store.state.data_login.role;
    },
    menu: function(argument) {
      return this.$store.state.menu;
    },
    sub_menu: function(argument) {
      return this.$store.state.sub_menu;
    }
  },
  methods: {
    get_active_action: function(id_sub_menu, callback) {
      var v = this;

      $.ajax({
        type: "POST",
        url: BASE_URL + "menu/action_sub_menu",
        data: { id_sub_menu: id_sub_menu, role_id: v.role_id },
        success: function(resp) {
          v.$set(v, "active_action", resp);
          callback(resp);
        },
        error: function(e) {
          alert("Something wrong!");
          console.log(e);
        }
      });
    },
    rupiah: function convertToRupiah(angka) {
      if (parseInt(angka) != 0) {
        var angka = angka.toString().replace(".00", "");
        var rupiah = "";
        var angkarev = angka
          .toString()
          .split("")
          .reverse()
          .join("");
        for (var i = 0; i < angkarev.length; i++)
          if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ".";
        return (
          "Rp. " +
          rupiah
            .split("", rupiah.length - 1)
            .reverse()
            .join("") +
          ",00"
        );
      } else {
        return "0";
      }
    },
    getMenu: function() {},
    getPicturePorfile: function() {
      if (this.$store.state.data_login.pic_path != null) {
        return (
          BASE_URL +
          "assets/img/profile_pic/" +
          this.$store.state.data_login.pic_path
        );
      } else {
        return BASE_URL + "assets/img/faces/card-profile1-square.jpg";
      }
    },
    showLoading: function(text) {
      swal({
        title: text,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          swal.showLoading();
        }
      });
    },
    showSuccess: function(text, callback) {
      swal({
        title: text,
        type: "success",
        timer: 2000,
        showConfirmButton: false,
        onClose: function() {
          if (callback != undefined) {
            callback();
          }
        }
      });
    },
    showError: function(text) {
      swal({
        title: text,
        type: "error",
        timer: 2000,
        showConfirmButton: false,
        onClose: function() {}
      });
    },
    showConfirmation: function(title, text, callback) {
      swal({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        dangerMode: true
      }).then(function(isConfirm) {
        if (isConfirm.value == true) {
          callback();
        }
      });
    },
    dropifyInit: function() {
      $(".dropify").dropify();
    },
    logout: function() {
      $.get(BASE_URL + "login/logout", function(data) {
        window.location = BASE_URL + "login";
      });
    },
    goToProfile: function() {
      this.$router.push({ path: "profile-user", query: { mode: "view" } });
    },
    formatNumber : function(par){
      var v = this;

      return new Intl.NumberFormat(['id']).format(par)
    },
    get_prov : function(callback){
      $.get(BASE_URL+"api/getProv", function(resp){
        if(typeof(callback) === 'function'){
          callback(resp);
        }
      });
    },
    get_kab : function(id_prov, callback){
      $.get(BASE_URL+"api/getKokab", { id_prov : id_prov }, function(resp){
        if(typeof(callback) === 'function'){
          callback(resp);
        }
      });
    },
    get_prov_by_user : function(id_user, callback){
      $.get(BASE_URL+"api/get_prov_by_user", { id_user : id_user }, function(resp){
        if(typeof(callback) === 'function'){
          callback(resp);
        }
      });
    },
    get_date_info : function(callback){
      $.get(BASE_URL+"api/get_date_info", function(resp){
        if(typeof(callback) === 'function'){
          callback(resp);
        }
      });
    },
    get_bank_list : function(callback){
      $.get(BASE_URL+"api/get_bank_list", function(resp){
        if(typeof(callback) === 'function'){
          callback(resp);
        }
      })
    },
    get_user_detail : function(user_id, callback){
      $.get(BASE_URL+"api/get_user_detail", {id_user : user_id}, function(resp){
        callback(resp);
      });
    },
    get_role : function(callback){
      var v = this;
      $.get(BASE_URL+"api/get_role", function(resp){
        callback(resp);
      });
    },
    get_session : function(callback){
      var v = this;
      $.get(BASE_URL+"api/get_session", function(resp){
        callback(resp);
      });
    },
  },
  updated: function() {
    $(".sidebar .sidebar-wrapper, .main-panel").scrollTop(0);
  },
  mounted: function() {
    const v = this;
    var is_xs = window.innerWidth < 768;
    if(!is_xs){
      $(".sidebar .sidebar-wrapper, .main-panel").perfectScrollbar("destroy");
      v.$nextTick(() => {
        $(".sidebar .sidebar-wrapper, .main-panel").perfectScrollbar();
      })
    }
  },
  beforeCreate: function() {

  },
  created: function() {
    this.$store.dispatch("setData");
  }
});
