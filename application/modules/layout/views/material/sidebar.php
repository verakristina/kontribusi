<div class="sidebar" data-color="azure" data-background-color="red" data-image="assets/img/sidebar-1.jpg" >
  <div class="logo" :style="{'background-color' : background}">
    <img style="display: inline;margin-left: 10px;" width="50" height="50" src="<?php echo base_url('assets/img/image_placeholder.jpg') ?>"/>
    <a class="simple-text logo-normal" style="font-size: 16px; display:inline; margin: 11px;">Penerimaan Dana <br>
  <a class="simple-text logo-normal" style="font-size: 15px; display:inline; margin: 80px;">Anggota Dewan 
  </a>
  </div>
  <div class="sidebar-wrapper custom" :style="{'background-color' : background}">
    <div class="user">
      <div class="photo">
        <img src="<?php echo base_url() ?>assets/img/default-avatar.png" alt="">
      </div>
      <div class="user-info">
        <a data-toggle="collapse" href="#collapseExample" class="username">
          <span>
            <?php echo $this->session->userdata('sess_name') ?>
            <b class="caret"></b>
          </span>
        </a>
        <div class="collapse" id="collapseExample">
          <ul class="nav">
            <router-link tag="li" class="nav-item" :to="{path: 'profile-user?mode=view'}">
              <a class="nav-link">
                <span class="sidebar-mini"> MP </span>
                <span class="sidebar-normal"> My Profile </span>
              </a>
            </router-link>
            <router-link tag="li" class="nav-item" :to="{path: 'profile-user?mode=update'}">
              <a class="nav-link">
                <span class="sidebar-mini"> EP </span>
                <span class="sidebar-normal"> Edit Profile </span>
              </a>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
    <ul class="nav">
       <template v-for="(item, index) in menu">
        <template v-if="item.link != '#'">
          <router-link active-class="active" tag="li" class="nav-item" :to="{path: item.link}">
            <a class="nav-link">
              <i class="material-icons">dashboard</i>
              <p>{{ item.menu }}</p>
            </a>
          </router-link>
        </template>
        <template v-else>
          <li class="nav-item ">
            <a class="nav-link" data-toggle="collapse" :href="'#menu_' + item.id" aria-expanded="true">
              <i class="material-icons">dashboard</i>
              <p> {{ item.menu }}<b class="caret"></b>
              </p>
            </a>
            <div class="collapse" :id="'menu_' + item.id" style="">
              <ul class="nav sidebar-menu">
 
                <template v-for="(sub_item, index_sub) in sub_menu">
                    <template v-if="item.id == sub_item.id_menu">
                      <router-link
                        active-class="active"
                        tag="li" class="nav-item"
                        :to="{path: sub_item.sub_menu_link}">
                        <a class="nav-link"  style="font-size: 12px;">
                          <span class="sidebar-mini">
                            <i class="material-icons">fiber_manual_record</i>
                          </span>
                          <span class="sidebar-normal"> {{ sub_item.sub_menu }}</span>
                        </a>
                      </router-link>
                    </template>
                </template>
 
              </ul>
            </div>
          </li>
        </template>
      </template>
      <li class="nav-item">
        <a class="nav-link" @click="logout" href="#">
          <i class="material-icons">dashboard</i>
          <p>LOGOUT</p>
        </a>
      </li>
    </ul>
  </div>
</div>