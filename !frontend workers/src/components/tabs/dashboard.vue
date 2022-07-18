<template>
  <div class="dashboard-main h-100 grey3 lighten-4">
    <v-container fluid grid-list-xl>

      <!--<v-divider></v-divider>-->
      <v-flex d-inline-flex xs1>
        <v-subheader class="h-100">Заявки</v-subheader>
      </v-flex>
      <v-flex d-inline-flex>
        <v-chip small outline color="green" style="width:100px">
          <v-icon left>mdi-check-circle-outline</v-icon>
          <div right style="width:40px" class="align-center">{{data.done}}</div>
        </v-chip>
        <v-chip small outline color="red" style="width:100px">
          <v-icon left>mdi-close-circle-outline</v-icon>
          <div right style="width:40px" class="align-center">{{data.denied}}</div>
        </v-chip>
        <v-chip small color="red white--text" style="width:100px">
          <v-icon left>mdi-lightbulb-on-outline</v-icon>
          <div right style="width:40px" class="align-center">3</div>
        </v-chip>
        <v-chip small outline color="blue" style="width:100px">
          <v-icon left>mdi-lightbulb-on-outline</v-icon>
          <div right style="width:40px" class="align-center">{{data.fulfilling}}</div>
        </v-chip>
        <v-chip small outline right color="orange" style="width:100px">
          <v-icon left>mdi-alarm</v-icon>
          <div right style="width:40px" class="align-center">0</div>
        </v-chip>
      </v-flex>
      
      <!--<v-divider></v-divider>
      <el-row type="flex" :gutter="20" class="pa-2">
        <el-col :span="2">
          <v-subheader class="h-100">Заявки</v-subheader>
        </el-col>
        <el-col :span="3">
          <v-card class="elevation-1">            
            <table class="w-100">
              <tr>
                <td class="align-center pa-2" style="width:48px">
                  <v-icon x-large class="green--text mdi-48px">mdi-check-circle-outline</v-icon>
                </td>
                <td class="align-center pa-2">
                  <div class="green--text h-100 headline">{{data.done}}</div>
                </td>
              </tr>
            </table>
          </v-card>
        </el-col>
        <el-col :span="3">
          <v-card>
            <table class="w-100">
              <tr>
                <td class="align-center pa-2" style="width:68px">
                  <v-icon x-large class="red--text mdi-48px">mdi-close-circle-outline</v-icon>
                </td>
                <td class="align-center pa-2">
                  <div class="red--text h-100 headline">{{data.denied}}</div>
                </td>
              </tr>
            </table>
          </v-card>
        </el-col>
        <el-col :span="3">
          <v-card dark class="red">
            <table class="w-100">
              <tr>
                <td class="align-center pa-2" style="width:48px">
                  <v-icon x-large class="mdi-48px">mdi-lightbulb-on-outline</v-icon>
                </td>
                <td class="align-center pa-2">
                  <div class="h-100 headline">3</div>
                </td>
              </tr>
            </table>
          </v-card>
        </el-col>
        <el-col :span="3">
          <v-card>
            <table class="w-100">
              <tr>
                <td class="align-center pa-2" style="width:48px">
                  <v-icon x-large class="blue--text mdi-48px">mdi-lightbulb-on-outline</v-icon>
                </td>
                <td class="align-center pa-2">
                  <div class="blue--text h-100 headline">{{data.fulfilling}}</div>
                </td>
              </tr>
            </table>
          </v-card>
        </el-col>
        <el-col :span="3">
           <v-card>
            <table class="w-100">
              <tr>
                <td class="align-center pa-2" style="width:48px">
                  <v-icon x-large class="orange--text mdi-48px">mdi-alarm</v-icon>
                </td>
                <td class="align-center pa-2">
                  <div class="orange--text h-100 headline">0</div>
                </td>
              </tr>
            </table>
          </v-card>
        </el-col>
      </el-row>
      <v-divider></v-divider>-->
    </v-container>
    <v-dialog fullscreen v-model="dialogVisible" transition="scale-transition">
      <component class="" :is="dialogElement" :maximized="dialogVisible" @maximized="openDialog"></component>
    </v-dialog>
    <ul class="dashboard-grid h-100 mx-4" v-sortable>
      <li class="dashboard-component" v-for="item in charts" :key="item.id">
        <component :is="item.id" v-if="item.isVisible" :maximized="dialogVisible" @apply-filter="handlerApplyFilter" @maximized="openDialog"></component>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  export default {
    name: 'dashboard',
    beforeCreate(){
      this.$http.get('/counts?type=tikets-my').then((response) => {
        if(response.data){
          this.$store.dispatch('setCharTiketsMyData',response.data);
        }        
      })
      this.$http.get('/counts?type=tikets-all-workers').then((response) => {
        if(response.data){
          this.$store.dispatch('setCharTiketsAllWorkersData',response.data);
        }        
      })
      this.$http.get('/counts?type=tikets-all-themes').then((response) => {
        if(response.data){
          this.$store.dispatch('setCharTiketsAllThemesData',response.data);
        }
      })
      this.$http.get('/counts?type=tikets-all-deps').then((response) => {
        if(response.data){
          this.$store.dispatch('setCharTiketsAllDepsData',response.data);
        }        
      })
      this.$http.get('/counts?type=tikets-trend-workers-years').then((response) => {
        if(response.data){
          this.$store.dispatch('setCharTiketsTrendWorkersYears',response.data);
        }        
      })
      this.$http.get('/counts?type=tikets-time-execution').then((response) => {
        if(response.data){
          this.$store.dispatch('setCharTiketsExecution',response.data);
        }        
      })
      this.$http.get('/counts?type=tikets-all-senders').then((response) => {
        if(response.data){
          this.$store.dispatch('setCharTiketsAllSendersData',response.data);
        }        
      })
    },
    computed:{
      ...mapState({
        isAdmin: state => state.worker_data.isAdmin,
        theme: state => state.worker_data.workerData.theme,
        isLogged: state => state.worker_data.isLogged,
        color: state => state.worker_data.workerData.color
      }),
      charts(){
        return [
          {text: "Мои заявки", id:'tikets-my-chart',isVisible:true},
          {text: "Заявки всех сотрудников", id:'tikets-all-workers-chart',isVisible:this.isAdmin},
          {text: "По темам", id:'tikets-all-themes-chart',isVisible:this.isAdmin},
          {text: "Тренд поступления заявок", id:'tikets-trend-workers-years',isVisible:this.isAdmin},
          {text: "Тренд поступления заявок", id:'tikets-all-deps-chart',isVisible:this.isAdmin},
          {text: "Тренд поступления заявок", id:'tikets-all-senders-chart',isVisible:this.isAdmin},
          {text: "Тренд поступления заявок", id:'tikets-time-execution',isVisible:this.isAdmin}
        ]
      },
      data(){
        return this.$store.getters.getTiketsCountses
      }
    },
    data(){
      return {
        dialogVisible: false,
        dialogTitle:'',
        dialogElement:'',
        menu:false
      }
    },
    methods:{
      openDialog(item){
        if(this.dialogVisible){
          this.dialogVisible = false
        } else {
          this.dialogVisible = true
        }
        //this.dialogVisible=!this.dialogVisible;
        this.dialogTitle=item.title;
        this.dialogElement=item.name;
      },
      handlerApplyFilter(data){
      }
    }
  }
</script>

<style>
.dashboard-main{
  overflow: auto;
}

.dashboard-component .system-bar{
  cursor:pointer;
}
.dashboard-component{
  width:350px;
}

.dashboard-grid{
  display: flex;
  justify-content: space-around;
  list-style-type: none;
  flex-wrap:wrap
}

.dashboard-chart{
  margin: auto;
}
.highcharts-credits{
  display:none
}
.dashboard__dialog{
  display: grid;
  grid-template-rows: auto 1fr;
}

</style>
