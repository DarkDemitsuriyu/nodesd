<template>
  <vd-standard-tab :id="id" :columns="columns" :form-data="data" :list="listData"></vd-standard-tab>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "directorys-contractors",
  props:['id'],
  data(){
    return {
      columns:[
        {prop:'id', label:'№',width:80},
        {prop:'name', label:'Наименование'},
        {prop:'inn', label:'ИНН'}
      ],
      data:[
        {name:'id',value:null,type:'text',hide:true},
        {name:'name',value:null,type:'text',label:"Название",required:true},
        {name:'inn',value:null,type:'text',label:"URL",required:true}
      ]
    }
  },
  computed: mapState({
      listData: state => state.directorys.contractors
  })
};
</script>

<style>

</style>