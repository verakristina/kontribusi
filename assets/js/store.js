Vue.config.devtools = true;

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		theme: {
			header_icon: "#f44336",
			text: "#f44336",
			sidebar: "#12253F",
			menu_active: "#3CACDB"
		},
		is_first_time: true,
		background: "#0000ff94",
		crumbs: "Dashboard",
		base_url: "",
		symbol_path: "",
		year: [],
		menu: [],
		sub_menu: [],
		year_selected: 0,
		day: ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"],
		dinas: ["Dinas Pagi", "Dinas Siang", "Dinas Malam"],
		week: {
			current_day: "",
			current_day_number: "",
			current_week: "",
			last_week: "",
			remaining_week: 0
		},
		data_login: {
			id_login: null,
			employee_name: null,
			status_akses: null,
			role: null,
			role_name: null,
			bussiness_title: null,
			department: null,
			department_name: null,
			email: null,
			employee_id: null,
			employee_type: null,
			gender: null,
			line_manager: null,
			line_manager_name: null,
			supervisor: null,
			supervisor_name: null,
			pic_path: null
		},
		frequensi: [
			{
				freq: 1,
				type: "bulanan"
			},
			{
				freq: 2,
				type: "bulanan"
			},
			{
				freq: 3,
				type: "bulanan"
			},
			{
				freq: 4,
				type: "bulanan"
			},
			{
				freq: 5,
				type: "bulanan"
			},
			{
				freq: 6,
				type: "bulanan"
			},
			{
				freq: 7,
				type: "bulanan"
			},
			{
				freq: 8,
				type: "bulanan"
			},
			{
				freq: 9,
				type: "bulanan"
			},
			{
				freq: 10,
				type: "bulanan"
			},
			{
				freq: 11,
				type: "bulanan"
			},
			{
				freq: 12,
				type: "bulanan"
			},
			{
				freq: 1,
				type: "tahunan"
			},
			{
				freq: 2,
				type: "tahunan"
			},
			{
				freq: 3,
				type: "tahunan"
			},
			{
				freq: 4,
				type: "tahunan"
			},
			{
				freq: 5,
				type: "tahunan"
			}
		]
	},
	mutations: {
		changeNavTitle: function(state, title) {
			state.crumbs = title;
			document.title = title;
		},
		changeIconHeaderColor: function(state, background) {
			state.theme.header_icon = background;
		},
		changeSidebarBackground: function(state, background) {
			state.theme.sidebar = background;
		},
		decreseYear: function(state) {
			state.year_selected = parseInt(state.year_selected) - 1;
		},
		increseYear: function(state) {
			state.year_selected = parseInt(state.year_selected) + 1;
		},
		decreseWeek: function(state) {
			state.week.current_week = parseInt(state.week.current_week) - 1;
		},
		increseWeek: function(state) {
			state.week.current_week = parseInt(state.week.current_week) + 1;
		},
		setFirstTime: function(state) {
			state.is_first_time = false;
		},
		setDataSession: function(state, data) {
			state.base_url = data.url;
			state.menu = data.menu;
			state.sub_menu = data.sub_menu;
			/*state.year = data.year;
			state.year_selected = data.year;
			state.week = data.week;
			data = data.session;
			state.data_login.id_login = data.id_user;
			state.data_login.employee_name = data.employee_name;
			state.data_login.role = data.role;
			state.data_login.role_name = data.role_name;
			state.data_login.bussiness_title = data.bussiness_title;
			state.data_login.department = data.department;
			state.data_login.department_name = data.department_name;
			state.data_login.email = data.email;
			state.data_login.employee_type = data.employee_type;
			state.data_login.employee_name = data.employee_name;
			state.data_login.gender = data.gender;
			state.data_login.line_manager = data.line_manager;
			state.data_login.line_manager_name = data.line_manager_name;
			state.data_login.supervisor = data.supervisor;
			state.data_login.supervisor_name = data.supervisor_name;
			state.data_login.pic_path = data.pic_path;*/
		}
	},
	actions: {
		setData: function(context) {
			$.get(BASE_URL + "api/getMenuList", function(data) {
				context.commit("setDataSession", data);
				context.commit("setFirstTime");
				setTimeout(function() {
					$(".cover").remove();
					$.LoadingOverlay("hide");
				}, 1000);
			});
		},
		decreseYear: function(context) {
			context.commit("decreseYear");
		},
		increseYear: function(context) {
			context.commit("increseYear");
		},
		decreseWeek: function(context) {
			context.commit("decreseWeek");
		},
		increseWeek: function(context) {
			context.commit("increseWeek");
		}
	}
});
