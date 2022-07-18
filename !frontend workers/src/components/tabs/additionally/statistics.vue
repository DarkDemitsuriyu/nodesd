<template>
  <div class="additionally-statistics__main" v-loading="loading">
    
    <div class="additionally-statistics__tree box-card">      
      <el-menu :default-active="selectedNode" @select="handlerSelect">
        <el-menu-item v-if="item.isVisible" v-for="item in list" :key="item.id" :index="item.id">
          <v-icon>account_circle</v-icon>
          <span> {{item.text}}</span>
        </el-menu-item>
      </el-menu>
    </div>

    <v-card class="additionally-statistics__view" style="border-top: 1px solid #dfe6ec; padding:0px;">
      <v-card-title primary-title>
        <component class="" :is="selectedNode" :maximized="dialogVisible" @maximized="openDialog"></component>
      </v-card-title>
    </v-card>

  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "additionally-statistics",
  props:['id'],
  data() {
    return {
      selectedNode:null,
      loading: false,
      dialogVisible:false
    };
  },
  beforeCreate(){
    this.$http.get('/counts?type=tikets-my').then((response) => {
      this.$store.dispatch('setCharTiketsMyData',response.data);
    })
    this.$http.get('/counts?type=tikets-all-workers').then((response) => {
      this.$store.dispatch('setCharTiketsAllWorkersData',response.data);
    })
    this.$http.get('/counts?type=tikets-all-themes').then((response) => {
      this.$store.dispatch('setCharTiketsAllThemesData',response.data);
    })
    this.$http.get('/counts?type=tikets-all-deps').then((response) => {
      this.$store.dispatch('setCharTiketsAllDepsData',response.data);
    })
    this.$http.get('/counts?type=tikets-trend-workers-years').then((response) => {
      this.$store.dispatch('setCharTiketsTrendWorkersYears',response.data);
    })
  },
  computed: {
    ...mapState({
      isAdmin: state => state.worker_data.isAdmin,
      theme: state => state.worker_data.workerData.theme,
      color: state => state.worker_data.workerData.color
    }),
    list(){
      return [
        {text: "Мои заявки", id:'tikets-my-chart',isVisible:true},
        {text: "Заявки всех сотрудников", id:'tikets-all-workers-chart',isVisible:this.isAdmin},
        {text: "По темам", id:'tikets-all-themes-chart',isVisible:this.isAdmin},
        {text: "Тренд поступления заявок", id:'tikets-trend-workers-years',isVisible:this.isAdmin},
        {text: "Тренд поступления заявок", id:'tikets-all-deps-chart',isVisible:this.isAdmin}
      ]
    }
  },
  methods: {
    handlerSelect(id){
      this.selectedNode = id
      /*let worker = this.users.find( el => el.login===id )
      this.selectedData = Object.assign({passgen:false},worker);
      this.type="update"
      this.edit=false*/
    },
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
    handlerAddNewWorker(){
      this.selectedData = {
        jabber:'',
        login:'',
        surname:'',
        name:'',
        patronymic:'',
        email:'',
        cityphone:'',
        internalphone:'',
        passgen:false,
        division:null,
        department:null,
        status:1,
        groups:[],
        topics:[]
      };
      this.type="new"
      this.edit=true
    },
    handlerEditSave(){
      if(this.edit){
        this.$vdesk.sendUpdateNoDialog(this)
        this.selectedData.passgen =false        
        this.edit=false
      } else {
        this.edit=true
      }      
    }
  }
};
</script>

<style>
.additionally-statistics__main {
  display: grid;
  overflow: hidden;
  height: 100%;
  grid-template-columns: 1fr 5fr;
  grid-template-areas: "additionally-statistics__tree additionally-statistics__view";
}
.additionally-statistics__main .el-select{
  width:100%;
}

.additionally-statistics__tree {
  grid-area: additionally-statistics__tree;
  border-right: 1px solid #dfe6ec;
}
.additionally-statistics__view {
  grid-area: additionally-statistics__view;
  overflow: auto;
}
.el-input-group__prepend{
  width:103px;
  text-align:right;
}
</style>
