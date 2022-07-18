<template>
  <vd-standard-tab :id="id" :columns="columns" :form-data="data" :list="listData"></vd-standard-tab>
  <!--<div class="standart-tab directorys-topics__main pa-2" v-loading="loading">
    <vd-standart-tab-toolbar @btn-click="handlerBtnClick" v-model="filterText"></vd-standart-tab-toolbar>
    <vd-standart-tab-table ref="refComponent" @dbl-click="handlerEditClick" :filter-text="filterText" :main="toTree" :data="$vdesk.filterTable(filterText,listData)" ></vd-standart-tab-table>
    
    <v-dialog v-model="dialogVisible" max-width="500px" :overlay="true" scrollable>
      <v-card tile>
        <vd-standart-tab-dialog-toolbar v-model="dialogVisible" @btn-click="saveDataAndClose"></vd-standart-tab-dialog-toolbar>
        <v-card-text class="h-100">
          <el-form size="small" ref="form" :model="selectedData" label-width="150px">
            <el-form-item label="Название">
              <el-input :error="selectedDataValidationErrors.name" v-model="selectedData.name"></el-input>
            </el-form-item>
            <el-form-item label="Порядок">
              <el-input-number v-model="selectedData.orders"></el-input-number>
            </el-form-item>
            <el-form-item label="Показывать">
              <el-switch v-model="selectedData.visibility"></el-switch>
            </el-form-item>
            <el-form-item label="Иконка">
              <el-input v-model="selectedData.icon"></el-input>
            </el-form-item>
            <el-form-item label="Описание">
              <el-input type="textarea" :rows="4" v-model="selectedData.description"></el-input>
            </el-form-item>
          </el-form>
        </v-card-text>        
      </v-card>
    </v-dialog>
  </div>-->
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "directorys-topics",
  props:['id'],
  data(){
    return {
      columns:[
        {prop:'id', label:'№',width:80},
        {prop:'name', label:'Наименование',width:200},
        {prop:'orders', label:'Порядок',width:100},
        {prop:'visibility', label:'Показывать',width:120, render:(scope) => scope.row.visibility ? 'Да' : 'Нет'},
        {prop:'icon', label:'Иконка',width:120, render:(scope) => `<i class="fa fa-lg ${scope.row.icon}"></i>`},
        {prop:'description', label:'Описание'}
      ],
      data:[
        {name:'id',value:null,type:'text',hide:true},
        {name:'name',value:null,type:'text',label:"Название",required:true},
        {name:'orders',value:null,type:'number',label:"Порядок",required:true},
        {name:'visibility',value:null,type:'switch',label:"Показывать"},
        {name:'icon',value:null,type:'icons',label:"Иконка"},
        {name:'description',value:null,type:'textarea',label:"Описание"}
      ]
    }
  },
  computed: mapState({
      listData: state => state.directorys.topics
  })
};
</script>

<style>

</style>