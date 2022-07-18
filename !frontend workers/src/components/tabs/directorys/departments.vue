<template>
  <vd-standard-tab :id="id" :columns="columns" :form-data="data" :list="listData"></vd-standard-tab>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "directorys-departments",
  props:['id'],
  data(){
    return {
      columns:[
        {prop:'id', label:'№',width:80},
          {prop:'sid', label:'SID',width:80},
          {prop:'name', label:'Наименование',width:180},
          {prop:'address', label:'Адрес'},
          {prop:'ip', label:'Подсеть',width:120}
      ],
      data:[
        {name:'id',value:null,type:'text',hide:true},
        {name:'name',value:null,type:'text',label:"Наименование",required:true},
        {name:'address',value:null,type:'text',label:"Адрес",required:true},
        {name:'ip',value:null,type:'text',label:"Подсеть",required:true}
      ]
    }
  },
  computed: mapState({
      listData: state => state.directorys.departments
  })
};
</script>

<style>

</style>