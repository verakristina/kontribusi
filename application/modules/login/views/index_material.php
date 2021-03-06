<html lang="en" class="perfect-scrollbar-on">
<head>
  <meta charset="utf-8" />
  <link rel="apple-touch-icon" sizes="76x76" href="<?php echo base_url('assets/img/unilever.png') ?>">
  <link rel="icon" type="image/png" href="<?php echo base_url('assets/img/unilever.png') ?>">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>Aplikasi Monitoring Kontribusi Dewan</title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link rel="stylesheet" type="text/css" href="<?php echo base_url() ?>assets/css/iconfont/material-icons.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css">
  <!-- CSS Files -->
  <link href="assets/css/material-dashboard.css?v=2.1.0" rel="stylesheet" />
  <!-- CSS Just for demo purpose, don't include it in your project -->
  <link href="assets/css/styles.css" rel="stylesheet" />
  <style>
    .cover{
      position: fixed;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 999;
    }
  </style>
</head>

<body class="off-canvas-sidebar">
  <div class="wrapper wrapper-full-page">
    <div class="page-header login-page header-filter" filter-color="black" style="background-image: url('assets/img/bg-img.jpeg'); background-size: cover; background-position: bottom center;">
      <!--   you can change the color of the filter page using: data-color="blue | purple | green | orange | red | rose " -->
      <div class="container" id="login-apps">

        <div class="row">

          <div class="col-lg-4 col-md-6 col-sm-8 ml-auto mr-auto">
            <form class="form" method="" action="">
              <div class="card card-login" style="">
                <div class="card-header text-center" style="background: #FFFFFF; margin-bottom: 0">
                  Aplikasi Monitoring Kontribusi Dewan<br>
                  PARTAI HANURA
                </div>
                <div class="card-body" style="margin-top: -20px;">
                  <span class="bmd-form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="material-icons">account_circle</i>
                        </span>
                      </div>
                      <input v-model="user.email" type="text" class="form-control login-page" placeholder="Username">
                    </div>
                  </span>
                  <span class="bmd-form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="material-icons">lock_outline</i>
                        </span>
                      </div>
                      <input v-model="user.password" type="password" @keyup.enter="login()" class="form-control login-page" placeholder="Password">
                    </div>
                  </span>
                </div>
                <div class="card-footer justify-content-center">
                  <a href="#pablo" @click="login()" class="btn btn-warning">LOG IN</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer class="footer">
      </footer>
    </div>
  </div>
  <style>
    
  </style>
  <!--   Core JS Files   -->
  <script src="assets/js/core/jquery.min.js"></script>
  <script src="assets/js/core/popper.min.js"></script>
  <script src="assets/js/core/bootstrap-material-design.min.js"></script>
  <script src="assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>
  <script src="assets/js/loadingoverlay.min.js"></script>
  <!--  Notifications Plugin    -->
  <script src="assets/js/plugins/bootstrap-notify.js"></script>
  <!-- Control Center for Material Dashboard: parallax effects, scripts for the example pages etc -->
  <script src="assets/js/material-dashboard.js?v=2.1.0" type="text/javascript"></script>
  <!-- Material Dashboard DEMO methods, don't include it in your project! -->
  <script>const BASE_URL = "<?php echo base_url() ?>"</script>
  <script>const VUE_BASE_PATH = "<?php echo getBasePath(base_url()) ?>"</script>
  <script src="assets/demo/demo.js"></script>
  <script src="assets/js/vue.min.js"></script>
  <script src="assets/js/vue-router.min.js"></script>
  <script src="assets/js/vuex.min.js"></script>
  <script>
    const vm = new Vue({
      el: '#login-apps',
      data: {
        id : "",
        pin: "",
        line: [],
        selected_line : "",
        selected_machine: "",
        machine: [],
        chart_data: "",
        user : {
          email : "",
          password : ""
        }
      },
      methods: {
        randomNumber: function(range){
          return Math.floor(Math.random() * parseInt(range)) + 1
        },
        get_line: function () {
          var v = this;
          $.get(BASE_URL + "login/get_line", function( data ) {
            v.$set(v, "line", data.line)
          });
        },
        get_machine: function () {
          var v = this;
          return $.get(BASE_URL + `/api/get_machine/${this.selected_line}`, function( data ) {
            v.$set(v, "machine", data.mesin)
          });
        },
        login: function () {
          var v = this;
          
          $.ajax({
            type : "POST",
            url  : BASE_URL+"login/cek_user_data",
            data : v.user,
            dataType : "json",
            success:function(resp){
              if(resp['status'] == "SUCCESS"){
                var link = resp['redirect_to'];
                link = link.substring(1);
                window.location = BASE_URL + link;
              }else{
                alert(resp['message']);
                v.$set(v.user, "password", "");
              }
            },
            error:function(e){
              alert("Something wrong!");
              console.log(e);
            }
          })
        }
      },
      created: function(){
      },
      mounted: function() {
        setTimeout(function(){ 
          $(".cover").remove();
          $.LoadingOverlay("hide");
        }, 2000);
      },
      beforeCreate: function () {
        $.LoadingOverlay("show", {
          'background' : 'white',
          'image' : BASE_URL + 'assets/img/zara-maintenance2.png',
          'imageAnimation'  : "1.5s fadein"
        });
      }

    })
  </script>
  <script>
    $(document).ready(function() {
      $().ready(function() {
        $sidebar = $('.sidebar');

        $sidebar_img_container = $sidebar.find('.sidebar-background');

        $full_page = $('.full-page');

        $sidebar_responsive = $('body > .navbar-collapse');

        window_width = $(window).width();

        fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();

        if (window_width > 767 && fixed_plugin_open == 'Dashboard') {
          if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
            $('.fixed-plugin .dropdown').addClass('open');
          }

        }

        $('.fixed-plugin a').click(function(event) {
          // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
          if ($(this).hasClass('switch-trigger')) {
            if (event.stopPropagation) {
              event.stopPropagation();
            } else if (window.event) {
              window.event.cancelBubble = true;
            }
          }
        });

        $('.fixed-plugin .active-color span').click(function() {
          $full_page_background = $('.full-page-background');

          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('color');

          if ($sidebar.length != 0) {
            $sidebar.attr('data-color', new_color);
          }

          if ($full_page.length != 0) {
            $full_page.attr('filter-color', new_color);
          }

          if ($sidebar_responsive.length != 0) {
            $sidebar_responsive.attr('data-color', new_color);
          }
        });

        $('.fixed-plugin .background-color .badge').click(function() {
          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('background-color');

          if ($sidebar.length != 0) {
            $sidebar.attr('data-background-color', new_color);
          }
        });

        $('.fixed-plugin .img-holder').click(function() {
          $full_page_background = $('.full-page-background');

          $(this).parent('li').siblings().removeClass('active');
          $(this).parent('li').addClass('active');


          var new_image = $(this).find("img").attr('src');

          if ($sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            $sidebar_img_container.fadeOut('fast', function() {
              $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
              $sidebar_img_container.fadeIn('fast');
            });
          }

          if ($full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

            $full_page_background.fadeOut('fast', function() {
              $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
              $full_page_background.fadeIn('fast');
            });
          }

          if ($('.switch-sidebar-image input:checked').length == 0) {
            var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

            $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
            $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
          }

          if ($sidebar_responsive.length != 0) {
            $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
          }
        });

        $('.switch-sidebar-image input').change(function() {
          $full_page_background = $('.full-page-background');

          $input = $(this);

          if ($input.is(':checked')) {
            if ($sidebar_img_container.length != 0) {
              $sidebar_img_container.fadeIn('fast');
              $sidebar.attr('data-image', '#');
            }

            if ($full_page_background.length != 0) {
              $full_page_background.fadeIn('fast');
              $full_page.attr('data-image', '#');
            }

            background_image = true;
          } else {
            if ($sidebar_img_container.length != 0) {
              $sidebar.removeAttr('data-image');
              $sidebar_img_container.fadeOut('fast');
            }

            if ($full_page_background.length != 0) {
              $full_page.removeAttr('data-image', '#');
              $full_page_background.fadeOut('fast');
            }

            background_image = false;
          }
        });

        $('.switch-sidebar-mini input').change(function() {
          $body = $('body');

          $input = $(this);

          if (md.misc.sidebar_mini_active == true) {
            $('body').removeClass('sidebar-mini');
            md.misc.sidebar_mini_active = false;

            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

          } else {

            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar('destroy');

            setTimeout(function() {
              $('body').addClass('sidebar-mini');

              md.misc.sidebar_mini_active = true;
            }, 300);
          }

          // we simulate the window Resize so the charts will get updated in realtime.
          var simulateWindowResize = setInterval(function() {
            window.dispatchEvent(new Event('resize'));
          }, 180);

          // we stop the simulation of Window Resize after the animations are completed
          setTimeout(function() {
            clearInterval(simulateWindowResize);
          }, 1000);

        });
      });
    });
  </script>
  <script>
    $(document).ready(function() {
      md.checkFullPageBackgroundImage();
      setTimeout(function() {
        // after 1000 ms we add the class animated to the login/register card
        $('.card').removeClass('card-hidden');
      }, 700);
    });
  </script>


</body>
</html>