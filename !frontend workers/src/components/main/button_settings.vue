<template>
  <!--<v-tooltip bottom>
    <v-btn icon @click.stop.prevent="showDialogSettings = true" slot="activator">
      <v-icon medium class="grey--text text--darken-2">mdi-settings-outline</v-icon>
    </v-btn>
    <span>Настройки</span>
  </v-tooltip>-->
  <v-menu :close-on-content-click="false" max-height="700px" left offset-y v-model="isOpen">
    <v-tooltip bottom slot="activator">
      <v-btn icon slot="activator">
        <v-icon class="grey--text text--darken-2" >mdi-settings-outline</v-icon>
      </v-btn>
      <span>Настройки</span>
    </v-tooltip>
    <v-card>
      <v-card-text> 
            <table>
              <tr>
                <td class="pa-2">
                  <v-switch style="height: 30px;" :label="isColor ? 'Цвет' : 'Тема'" v-model="isColor"></v-switch>
                </td>
                <td class="pl-4">
                  <el-color-picker v-if="isColor" color-format="hex" v-model="colorApp"></el-color-picker>
                  <v-menu v-else offset-y :max-width="270" :close-on-content-click="false" v-model="settings.colorMenuOpen">
                    <v-btn :color="themeApp" dark slot="activator"></v-btn>
                    <v-card>
                      <v-container fluid grid-list-lg text-xs-center>
                        <v-tooltip v-for="theme in themeList" :key="theme" top>
                          <v-chip slot="activator" :selected="themeApp===theme" :class="[theme==='default' ? 'grey lighten-4' : theme,theme==='default' ? 'black--text' : theme+'--text']" @click="setTheme(theme)" outline>
                            <v-icon v-if="themeApp===theme">check_circle</v-icon>
                            <v-icon v-else>cancel</v-icon>
                          </v-chip>
                          <span>{{theme}}</span>
                        </v-tooltip>                      
                      </v-container>
                    </v-card>
                  </v-menu>
                </td>
              </tr>
              <tr>
                <td class="pa-2" v-localize="{i: 'locationListRequests'}"></td>
                <td class="pl-4">
                  <v-btn-toggle v-model="viewApp">
                    <v-btn v-for="item in viewList" :key="item.type" :value="item.type" large>
                      <v-tooltip top>
                        <v-icon slot="activator" large>{{item.icon}}</v-icon>
                        <span>{{item.name}}</span>
                      </v-tooltip>
                    </v-btn>
                  </v-btn-toggle>
                </td>
              </tr>
            </table>
      </v-card-text> 
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: 'vd-button-settings',
  data(){
    return {
      isOpen:false,
      isColor:false,
      settings:{
        colorMenuOpen:false
      },
    }
  },
  computed: {
    colorApp: {
      get(){ return this.$store.state.worker_data.workerData.color },
      set(value) {
        this.$store.commit("SET_COLOR", value)
        this.setWorkerSetting("color", value)
      }
    },
    themeApp: {
      get(){ return this.$store.state.worker_data.workerData.theme },
      set(value) {        
        this.$store.commit("SET_THEME", value)
        this.setWorkerSetting("theme", value)
      }
    },
    viewApp: {
      get(){ return this.$store.state.worker_data.workerData.tiketsview },
      set(value) {
        this.$store.commit("SET_TIKETS_SHOW_VIEW", value)
        this.setWorkerSetting("tiketsview", value)
      }
    },
    showDialogSettings:{
      get(){ return this.$store.state.settings.showDialogSettings },
      set(value){ this.$store.commit('SET_DIALOG_SETTINGS', value) }
    },
    ...mapState({
      workerData: state => state.worker_data.workerData,
      themeList: state => state.settings.themeList,
      viewList: state => state.tikets.viewList,
    })   
  },
  methods:{
    setTheme(value) {
      this.$store.commit("SET_THEME", value);
      this.setWorkerSetting("theme", value);
    },
    setWorkerSetting(key, value) {
      this.$http.post(`/setWorkerSettings`, {login: this.workerData.login,key: key,value: value});
    }
  }
}
</script>

<style>

</style>
