<template>
  <v-app light v-loading.fullscreen="loading" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-spinner="el-icon-loading" :element-loading-text="loadingLabel" toolbar>

    <vd-layout v-if="isLogged && !loading">
      <vd-sidetoolbar slot="asidetoolbar"></vd-sidetoolbar>
      <vd-navbar slot="toolbar"></vd-navbar>
      <vd-sidebar slot="aside"></vd-sidebar>
      <vd-maintabs slot="main"></vd-maintabs>
      <!--<vd-footer slot="footer"></vd-footer>-->
    </vd-layout>

    <v-container v-if="!isLogged && !loading" class="login" grid-list-md text-xs-center>     
      <v-card raised>
        <v-card-title primary-title>
          <h3 class="headline mb-0" v-localize="{i: 'vdesk'}"></h3>
        </v-card-title>
        <v-card-text>
          <v-form ref="loginForm" v-model="formValid">
            <!-- <v-text-field :class="{'red--text':formAddons.usernameError}" :error-messages="formAddons.usernameErrorMsg" :label="$locale({i: 'username'})" v-model="formAddons.username" prepend-icon="person" @keyup.enter.prevent="handleSubmit"></v-text-field>-->
            <v-text-field outline required :class="{'red--text':formAddons.passwordError}" :rules="passwordRules" :error-messages="formAddons.passwordErrorMsg" :label="$locale({i: 'password'})" v-model="formData.password" prepend-icon="mdi-lock" :append-icon="formAddons.passwordShow ? 'mdi-eye' : 'mdi-eye-off'" :type="formAddons.passwordShow ? 'text' : 'password'" @click:append="formAddons.passwordShow = !formAddons.passwordShow" @keyup.enter.prevent="handleSubmit"></v-text-field>
            <v-checkbox label="Запомнить меня" v-model="formData.saveMe"></v-checkbox>
            <v-checkbox label="123" ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text class="orange--text" @click="handleSubmit" v-localize="{i: 'enter'}"></v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>
<script>
import { mapState } from "vuex"
import moment from 'moment'
export default {
  data() {
    return {
      loadingLabel: "Подождите...",
      formValid:false,
      formData:{
        saveMe:false,
        password: "",
        vDeskSave:null
      },
      passwordRules:[
        v => !!v || 'Поле не должно быть пустым'
      ],
      formAddons: {
        passwordError: false,
        passwordErrorMsg:'',
        passwordShow: false
      }
    };
  },
  computed: {
    ...mapState({
      classifierData: state => state.directorys.classifier,
      themeShades: state => state.settings.thmeeShades,
      minimizedWindows: state => state.settings.minimizedWindows,
      isAdmin: state => state.worker_data.isAdmin,
      isLogged: state => state.worker_data.isLogged,
      sideMenu: state => state.directorys.menu,
      loading: state => state.settings.loading
    })
  },
  created() {
    this.$language = "ru";
  },
  mounted() {
    let vDeskSave = this.getCookie('vDeskSave')
    if(vDeskSave && !this.$store.state.socket.connect){
      this.formData.vDeskSave = vDeskSave
      this.sendLoginData();
    }
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "SOCKET_ERROR") {
        this.$store.dispatch('stopLoading')
        this.$socket.close();
        if(vDeskSave){
          this.$socket.open();
        }
      }
      if (mutation.type === "SOCKET_DISCONNECT") {
        window.open("/", "_self");
        localStorage.clear();
      }
    });
  },
  methods: {
    getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    setCookie(name, value, options) {
      options = options || {};
      let expires = options.expires;
      if (typeof expires == "number" && expires) {
        let d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
      }
      if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
      }
      value = encodeURIComponent(value);
      let updatedCookie = `${name}=${value}`;
      for (let propName in options) {
        updatedCookie += `;${propName}`;
        let propValue = options[propName];
        if (propValue !== true) {
          updatedCookie += `=${propValue}`;
        }
      }
      document.cookie = updatedCookie;
    },
    clearErrorsStatuses(){
      setTimeout(()=>{
        this.formAddons.passwordError=false
        this.formAddons.passwordErrorMsg=''
      },2000)
    },
    sendLoginData(){
      this.$store.dispatch('startLoading')
      this.$http.post('/login', this.formData).then(( {body:data} ) => {
        if (data.status) {
          if(data.vDeskSave && !this.formData.vDeskSave){
            this.setCookie('vDeskSave', data.vDeskSave, {path:'/',expires:moment().add(30, 'days')})
          }
          this.$socket.open();
        } else {
          this.$store.dispatch('stopLoading')
          this.formAddons.passwordError=true
          this.formAddons.passwordErrorMsg=data.msg
          this.clearErrorsStatuses()
        }
      });
    },
    handleSubmit() {
      if (this.$refs.loginForm.validate()) {
        this.sendLoginData();
      }
    }
  }
}
</script>

<style>
.vd-minimized-area{
  position:fixed;
  left:0px;
  bottom:0px;
  display:flex;
}

.badge--overlap::after {
  top: -4px !important;
}
.login {
  position: absolute !important;
  width: 400px !important;
  height: 330px !important;
  top: 50% !important;
  left: 50% !important;
  margin-top: -165px !important;
  margin-left: -200px !important;
}
.btn-settings {
  position: fixed !important;
  margin: 0px;
  min-width: 50px;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  top: 48px;
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
  z-index: 6;
}
.btn-settings > .btn__content {
  padding: 0px;
}
.toolbar-mini  .toolbar__content{
  height:28px !important;
  padding-left:8px !important;
}
.toolbar-mini  .toolbar__content .btn  .btn__content{
  padding: 6px !important;
}
.toolbar-mini  .toolbar__content  .btn,
.toolbar-mini  .toolbar__content .btn  .btn__content,
.toolbar-mini  .toolbar__content .btn--icon  .btn__content{
  height:24px !important;  
}
.toolbar-mini  .toolbar__content .btn--icon  .btn__content,
.toolbar-mini  .toolbar__content .btn  .btn__content  .icon{
  font-size:18px !important;
}
.toolbar-mini  .toolbar__content .btn  .btn__content{
  vertical-align: bottom;
  line-height: 18px;
  font-size:12px !important;
}
.toolbar-mini  .toolbar__content .btn  .btn__content  span{
  font-size:12px !important;
  line-height: 12px;
  
}
.toolbar-mini  .toolbar__content  .btn:not(.btn--icon){  
  margin: 2px !important;
}
.toolbar-mini  .toolbar__content  .btn--icon{
  width:24px !important;
  margin: 5px !important;
}
.toolbar-mini  .toolbar__content  .btn .icon--left{  
  margin-right: 5px !important;
}
[error] > input, [error] > textarea, .el-table[error] {
  color: red;
  border: 1px solid red;
}
[error] > input, [error] > textarea, .el-table[error] {
  color: red;
  border: 1px solid red;
}
.inverted{
  filter: invert(100%);
}
</style>
