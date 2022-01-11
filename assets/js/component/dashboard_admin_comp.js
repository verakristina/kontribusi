const DASHBOARD_ADMIN = {
	data : function() {
		return {
            userdata : [],
            kontribusi : {},
            partisipasi : {},
            total_all : 0,
            top_ten : {},
            persen : {
                kontribusi : [],
                partisipasi : []
            },
            charts : {
                kontribusi : [],
                partisipasi : []
            }
		}
	},
	created : function(){
		const v = this;
		store.commit("changeNavTitle", "Dashboard"); // JUDUL PAGE
	},
	mounted : function(){
		var v = this;
        v.get_session();
        v.getDashboardData();
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
			}
        },
        getDashboardData : function(){
            var v = this;
            v.$root.showLoading("Mengambil data..");
            $.ajax({
                type : "GET",
                url : BASE_URL+"services/dashboard_data",
                success:function(resp){
                    if(resp.code == 200){
                        v.$set(v, "kontribusi", resp.data.kontribusi[0]);
                        v.$set(v, "partisipasi", resp.data.partisipasi[0]);
                        v.$set(v, "top_ten", resp.data.top_ten);

                        v.$set(v.persen, 'kontribusi', resp.data.persen.kontribusi);
                        v.$set(v.persen, 'partisipasi', resp.data.persen.partisipasi);
                        
                        var jumlah = parseInt(v.kontribusi.TOTAL)+parseInt(v.partisipasi.TOTAL);
                        v.$set(v, "total_all", jumlah)

                        v.$nextTick(() => {
                            swal.close();
                        });
                    }
                }
            })
        },
        initChart : function(){
            var v = this;

            var option_one = {
				title : {
					text : "Grafik Setoran Dana Kontribusi per Provinsi",					
                    left : "center",
                    textStyle : {
                        fontSize : 14,
                        fontWeight : 'normal'
                    }
				}
            };
            
            var option_two = {
				title : {
					text : "Grafik Setoran Dana Kontribusi per Provinsi",					
                    left : "center",
                    textStyle : {
                        fontSize : 14,
                        fontWeight : 'normal'
                    }
				}
            };
            
            v.$set(v.charts, "kontribusi", echarts.init(document.getElementById('chart-kontribusi')));
            v.charts.kontribusi.setOption(option_one);

            v.$set(v.charts, "partisipasi", echarts.init(document.getElementById('chart-partisipasi')));
            v.charts.partisipasi.setOption(option_one);
        },
        roundNumb : function(value, precision) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }
	},
    template : `
    <div>
        <div class="row">
            <div class="col-md-4 col-lg-4">
                <div class="card">
                    <div class="card-header card-header-warning">
                        <div class="card-title text-uppercase">
                            Total Penerimaan
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="text-right font-weight-bold m-1">
                            {{ $root.formatNumber(total_all) }}
                        </h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-4">
                <div class="card">
                    <div class="card-header card-header-warning">
                        <div class="card-title text-uppercase">
                            Total Dana Kontribusi
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="text-right font-weight-bold m-1">
                            {{ $root.formatNumber(kontribusi.TOTAL) }}
                        </h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-4">
                <div class="card">
                    <div class="card-header card-header-warning">
                        <div class="card-title text-uppercase">
                            Total Dana Partisipasi
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="text-right font-weight-bold m-1">
                            {{ $root.formatNumber(partisipasi.TOTAL) }}
                        </h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-4">
                <div class="card">
                    <div class="card-header card-header-warning">
                        <div class="card-title text-uppercase">
                            Penerimaan DPP
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="text-right font-weight-bold m-1">
                            {{ $root.formatNumber(kontribusi.DPP) }}
                        </h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-4">
                <div class="card">
                    <div class="card-header card-header-warning">
                        <div class="card-title text-uppercase">
                            Penerimaan DPD
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="text-right font-weight-bold m-1">
                            {{ $root.formatNumber(kontribusi.DPD) }}
                        </h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-4">
                <div class="card">
                    <div class="card-header card-header-warning">
                        <div class="card-title text-uppercase">
                            Penerimaan DPC
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="text-right font-weight-bold m-1">
                            {{ $root.formatNumber(kontribusi.DPC) }}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 col-lg-6">
                <div class="card">
                    <div class="card-header card-header-warning">
                        <div class="card-title text-uppercase">KPI Dana Kontribusi per Provinsi</div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered table-striped table-hover">
                            <thead>
                                <tr>
                                    <th class="text-center" width="20%">Provinsi</th>
                                    <th class="text-center" width="40%">DPRD Provinsi</th>
                                    <th class="text-center" width="40%">DPRD Kab. / Kota</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in persen.kontribusi">
                                    <td>{{ item.singkatan }}</td>
                                    <td class="align-middle">
                                        <div class="clearfix">
                                            <div class="pull-left" style="width: 70%; margin-top: 14px;">
                                                <div class="progress" style="height: 10px !important;">
                                                    <div class="progress-bar progress-bar-danger" :style="{width: item.PERSEN_PROV+'%'}" v-if="item.PERSEN_PROV <= 50"></div>
                                                    <div class="progress-bar progress-bar-warning" :style="{width: item.PERSEN_PROV+'%'}" v-else-if="item.PERSEN_PROV > 50 && item.PERSEN_PROV <= 75"></div>
                                                    <div class="progress-bar progress-bar-success" :style="{width: item.PERSEN_PROV+'%'}" v-else></div>
                                                </div>
                                            </div>
                                            <div class="pull-right text-right" style="width: 30%">
                                                <span style="font-size: 12px">
                                                    {{ roundNumb(item.PERSEN_PROV, 1) }} % <br>{{ item.ANGGOTA_PROV }} orang
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <div class="pull-left" style="width: 70%; margin-top: 14px;">
                                            <div class="progress" style="height: 10px !important;">
                                                <div class="progress-bar progress-bar-danger" :style="{width: item.PERSEN_KOTA+'%'}" v-if="item.PERSEN_KOTA <= 50"></div>
                                                <div class="progress-bar progress-bar-warning" :style="{width: item.PERSEN_KOTA+'%'}" v-else-if="item.PERSEN_KOTA > 50 && item.PERSEN_KOTA <= 75"></div>
                                                <div class="progress-bar progress-bar-success" :style="{width: item.PERSEN_KOTA+'%'}" v-else></div>
                                            </div>
                                        </div>
                                        <div class="pull-right text-right" style="width: 30%">
                                            <span style="font-size: 12px">
                                                {{ roundNumb(item.PERSEN_KOTA, 1) }} % <br>{{ item.ANGGOTA_KOTA }} orang
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-6">
                <div class="card" style="font-size=12px;">
                    <div class="card-header card-header-warning">
                        <div class="card-title text-uppercase">KPI DANA PARTISIPASI PER PROVINSI</div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered table-striped table-hover">
                            <thead>
                                <tr>
                                    <th class="text-center" width="20%">Provinsi</th>
                                    <th class="text-center" width="40%">DPRD Provinsi</th>
                                    <th class="text-center" width="40%">DPRD Kab. / Kota</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in persen.partisipasi">
                                    <td>{{ item.singkatan }}</td>
                                    <td class="align-middle">
                                        <div class="clearfix">
                                            <div class="pull-left" style="width: 70%; margin-top: 14px;">
                                                <div class="progress" style="height: 10px !important;">
                                                    <div class="progress-bar progress-bar-danger" :style="{width: item.PERSEN_PROV+'%'}" v-if="item.PERSEN_PROV <= 50"></div>
                                                    <div class="progress-bar progress-bar-warning" :style="{width: item.PERSEN_PROV+'%'}" v-else-if="item.PERSEN_PROV > 50 && item.PERSEN_PROV <= 75"></div>
                                                    <div class="progress-bar progress-bar-success" :style="{width: item.PERSEN_PROV+'%'}" v-else></div>
                                                </div>
                                            </div>
                                            <div class="pull-right text-right" style="width: 30%">
                                                <span style="font-size: 12px">
                                                    {{ roundNumb(item.PERSEN_PROV, 1) }} % <br>{{ item.ANGGOTA_PROV }} orang
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <div class="pull-left" style="width: 70%; margin-top: 9px;">
                                            <div class="progress" style="height: 10px !important;">
                                                <div class="progress-bar progress-bar-danger" :style="{width: item.PERSEN_KOTA+'%'}" v-if="item.PERSEN_KOTA <= 50"></div>
                                                <div class="progress-bar progress-bar-warning" :style="{width: item.PERSEN_KOTA+'%'}" v-else-if="item.PERSEN_KOTA > 50 && item.PERSEN_KOTA <= 75"></div>
                                                <div class="progress-bar progress-bar-success" :style="{width: item.PERSEN_KOTA+'%'}" v-else></div>
                                            </div>
                                        </div>
                                        <div class="pull-right text-right" style="width: 30%">
                                            <span style="font-size: 12px">
                                                {{ roundNumb(item.PERSEN_KOTA, 1) }} % <br> {{ item.ANGGOTA_KOTA }} orang
                                            </span>
                                        </div>
                                    </td>
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