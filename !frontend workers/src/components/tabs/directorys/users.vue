<template>
  <div class="directorys-users__main pa-2" v-loading="loading">
    <v-card class="directorys-users__tree mr-2 white">
      <vd-standart-tab-tree-toolbar></vd-standart-tab-tree-toolbar>

      <v-list dense>
        <v-list-tile v-for="user in users" :key="'log'+user.login" @click="handlerSelect(user.login)" class="px-0" :color="user.login===selectedNode ? '#409EFF' : user.status===3 ? 'red' : ''">
          <v-list-tile-action>
            <v-icon color="green" v-if="user.status===1">mdi-account-check</v-icon>
            <v-icon color="orange" v-if="user.status===2">mdi-account-clock</v-icon>
            <v-icon color="red" v-if="user.status===3">mdi-account-remove</v-icon>
          </v-list-tile-action>
          
          <v-list-tile-content >
            <span v-if="user.status===1">{{user.surname}} {{user.name}} {{user.patronymic}}</span>
            <span v-if="user.status===2"><i>{{user.surname}} {{user.name}} {{user.patronymic}}</i></span>
            <span v-if="user.status===3"><del>{{user.surname}} {{user.name}} {{user.patronymic}}</del></span>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>

    <v-card v-show="edit || selectedData.login" class="directorys-users__view" style="border-top: 1px solid #dfe6ec; padding:0px;">
      <v-toolbar v-if="selectedData" dense class="directorys-users__toolbar white elevation-0">
        <v-toolbar-title><h3>{{selectedData.label}}</h3></v-toolbar-title>
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="handlerPassGen">
            <v-icon color="blue" >mdi-lock-reset</v-icon>
          </v-btn>
          <span>Сгенерировать новый пароль и отправить его пользователю</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="handlerEditSave">
            <v-icon v-show="!edit" color="orange">mdi-pencil-outline</v-icon>
            <v-icon v-show="edit" color="green">save</v-icon>
          </v-btn>
          <span v-show="!edit">Редактировать</span>
          <span v-show="edit">Сохранить</span>
        </v-tooltip>
        <v-btn v-if="edit" icon @click="handlerEditCancel">
          <v-icon color="red">mdi-cancel</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container v-if="selectedData" grid-list-xl fluid class="pt-0">
        <v-layout row wrap>
          <v-flex xs2><v-text-field label="Фамилия" dense :readonly="!edit" v-model="selectedData.surname"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Имя" :readonly="!edit" v-model="selectedData.name"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="Отчество" :readonly="!edit" v-model="selectedData.patronymic"></v-text-field></v-flex>
          <v-flex xs3><v-autocomplete label="Подразделение" clearable dense :readonly="!edit" :items="listDepartments" item-value="id" item-text="name" v-model="selectedData.department"></v-autocomplete></v-flex>
          <v-flex xs3><v-autocomplete label="Отдел" clearable dense :readonly="!edit" :items="listDivisions" item-value="id" item-text="name" v-model="selectedData.division"></v-autocomplete></v-flex>
          <!--<v-flex xs2><v-text-field label="Логин" :readonly="!edit" v-model="selectedData.login"></v-text-field></v-flex>-->

          <v-flex xs2><v-text-field label="Jabber" :readonly="!edit" v-model="selectedData.jabber"></v-text-field></v-flex>
          <v-flex xs2><v-text-field label="E-Mail" :readonly="!edit" v-model="selectedData.email"></v-text-field></v-flex>
          <v-flex xs2>
           <!-- Статус<br>
            <v-btn-toggle v-model="selectedData.status" mandatory @change="">
              <v-tooltip bottom v-for="status in listWorkersStatus" :key="status.id">
                <v-btn flat slot="activator" :value="status.id">
                  <v-icon color="green" v-if="status.id===1">mdi-account-check</v-icon>
                  <v-icon color="orange" v-if="status.id===2">mdi-account-clock</v-icon>
                  <v-icon color="red" v-if="status.id===3">mdi-account-remove</v-icon>
                </v-btn>
                <span>{{status.name}}</span>
              </v-tooltip>
            </v-btn-toggle>
            <br>
            <span v-if="selectedData.status===2">До {{computedDateFormatted}}</span>-->
            <v-select label="Статус" dense :readonly="!edit" persistent-hint :hint="selectedData.status===2 ? `До ${computedDateFormatted}` : ''" :items="listWorkersStatus" item-value="id" item-text="name" v-model="selectedData.status">
              <template v-slot:append-outer>
                <v-menu :disabled="!edit" v-if="selectedData.status===2" v-model="showDialogTimeout" :close-on-content-click="false" transition="scale-transition" offset-y min-width="500px">
                  <v-icon :disabled="!edit" slot="activator">event</v-icon>
                  <VueCtkDateTimePicker v-model="selectedData.timeout" :minute-interval="10" format="YYYY-MM-DD HH:mm" no-button :min-date="new Date().toISOString().substr(0, 10)" inline no-keyboard/>
                </v-menu>
              </template>
            </v-select>
          </v-flex>
          <v-flex xs3><v-text-field label="Городской номер телефона" :readonly="!edit" v-model="selectedData.cityphone"></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Внутренний номер телефона" :readonly="!edit" v-model="selectedData.internalphone"></v-text-field></v-flex>

          <v-flex xs6><vd-standard-transfer :disabled="!edit" label="Обязанности по заявкам" :titles="['Доступно', 'Назначено']" v-model="selectedData.topics" :data="listTopic"></vd-standard-transfer></v-flex>
          <v-flex xs6><vd-standard-transfer :disabled="!edit" label="Группы" :titles="['Доступно', 'Состоит в']" v-model="selectedData.groups" :data="listGroup"></vd-standard-transfer></v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from 'moment';
export default {
  name: "directorys-users",
  props:['id'],
  data() {
    return {
      transferProps:{
        key: 'id',
        label: 'name'
      },
      date: null,
      showDialogTimeout:false,
      selectedNode:null,
      selectedData: {
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
        timeout:null,
        groups:[],
        topics:[]
      },
      loading: false,
      edit:false,
      type:'new'
    };
  },
  computed: {
    ...mapState({
      users: state => state.directorys.users,
      listWorkers: state => state.settings.lists.workers,
      listWorkersStatus: state => state.settings.lists.statusworkers,
      listDepartments: state => state.settings.lists.department,
      listDivisions: state => state.settings.lists.division,
      workerData: state => state.worker_data.workerData
    }),
    computedDateFormatted(){
      return this.selectedData.timeout ? moment(this.selectedData.timeout).format('DD.MM.YYYY HH:mm') : '' 
    },
    listGroup() {
      let data = this.$store.state.settings.lists.group
      data.forEach(element => element.disabled = !this.edit );
      return data
    },
    listTopic() {
      let data = this.$store.state.settings.lists.topic
      data.forEach(element => element.disabled = !this.edit );
      return data
    }
  },
  methods: {
    handlerSelect(id){
      let worker = this.users.find( el => el.login===id )
      this.selectedData = Object.assign({},worker);
      this.type="update"
      this.edit=false
      this.selectedNode = id
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
        division:null,
        department:null,
        status:1,
        groups:[],
        topics:[]
      };
      this.type="new"
      this.edit=true
      this.selectedNode = null
    },
    handlerEditSave(){
      if(this.edit){
        this.$vdesk.sendUpdate({id:this.id,data:this.selectedData,type:this.type})
        this.edit=false
      } else {
        this.edit=true
      }      
    },
    handlerPassGen(){
      let data = {passgen: true, login:this.selectedData.login, email:this.selectedData.email}
      this.$vdesk.sendUpdate({id:this.id,data:data,type:this.type})
    },
    handlerEditCancel(){
      this.edit=false
      let worker = this.users.find( el => el.login === this.selectedNode )
      this.selectedData = Object.assign({passgen:false},worker);
    }
  }
};
</script>

<style>
.directorys-users__main {
  display: grid;
  overflow: hidden;
  max-height: 100%;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "directorys-users__tree directorys-users__view";
}
.directorys-users__main .el-select{
  width:100%;
}
.directorys-users__toolbar {
  grid-area: directorys-users__toolbar;
}
.directorys-users__tree {
  grid-area: directorys-users__tree;
  border-right: 1px solid #dfe6ec;
}
.directorys-users__view {
  grid-area: directorys-users__view;
  overflow: auto;
  max-height:100%;
}
.el-input-group__prepend{
  width:103px;
  text-align:right;
}
</style>
