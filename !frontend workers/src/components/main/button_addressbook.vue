<template>
  <div>
    <v-tooltip bottom>
      <v-btn icon slot="activator" @click="isOpen = true">
        <v-icon class="grey--text text--darken-2" >far fa-address-book</v-icon>
      </v-btn>
      <span>Адресная книга</span>
    </v-tooltip>
    <vd-standart-tab-dialog v-model="isOpen" title="Адресная книга" fullscreen overlay no-main-btn>
      <div class="standart-tab">
        <v-toolbar dense class="standart-tab__toolbar">
          <v-text-field flat single-line hide-details full-width class="standart-tab__filter" label="Фильтр..." v-model="filterText" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
        </v-toolbar>
        <vd-standart-tab-table ref="linkTable" :options="options" :columns="columns" :filter-text="filterText" :data="list" ></vd-standart-tab-table>
      </div>
    </vd-standart-tab-dialog>
  </div>
 <!-- <v-menu :close-on-content-click="false" max-width="1250px" min-width="1210px" max-height="700px" left offset-y v-model="isOpen">
    <v-tooltip bottom slot="activator">
      <v-btn icon slot="activator">
        <v-icon class="grey--text text--darken-2" >far fa-address-book</v-icon>
      </v-btn>
      <span>Адресная книга</span>
    </v-tooltip>
    <v-card class="standart-tab" style="max-height:700px">
      <v-toolbar dense class="standart-tab__toolbar white elevation-1 pa-2">
        <v-text-field flat single-line hide-details full-width class="standart-tab__filter" label="Фильтр..." v-model="filterText" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
      </v-toolbar>
      <vd-standart-tab-table ref="linkTable" :options="options" :columns="columns" :filter-text="filterText" :data="list" ></vd-standart-tab-table>
    </v-card>
  </v-menu>-->
</template>

<script>
import { mapState } from "vuex"
export default {
  name: 'vd-button-addressbook',
  computed: mapState({
      list: state => state.settings.addressbook
  }),
  data(){
    return {
      isOpen:false,
      columns:[
        {value:'fullname', text:'ФИО'},
        {value:'extphone', text:'Гор. номер телефона',width:180},
        {value:'outphone', text:'Вн. номер телефона',width:170},
        {value:'mail', text:'E-Mail',render:(scope) => `<a href="mailto:${scope.row.mail}">${scope.row.mail}</a>`},
        {value:'department', text:'Подразделение'},
        {value:'jobtitle', text:'Должность'}
      ],
      options:{
        defSort:{prop: 'fullname', order: 'ascending'},
        key:'fullname',
      },
      filterText:''
    }
  },
  methods: {

  }
}
</script>

<style>
.standart-tab{
  display: grid;
  max-height: 100%;
  overflow:hidden;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "standart-tab__toolbar"
    "standart-tab__card";
}
.standart-tab__toolbar{
  grid-area: standart-tab__toolbar;
}
.standart-tab__toolbar .btn{
  margin:2px;
}
.standart-tab__card{
  grid-area: standart-tab__card;
  overflow: hidden;
}
.standart-tab__card .el-table {
  height:100%;
  display: grid;
  grid-template-rows: auto auto 1fr;
  overflow: hidden;
}
.standart-tab__card .el-table .el-table__header-wrapper, .standart-tab__card .el-table .el-table__body-wrapper{
  width:auto !important;
}
</style>