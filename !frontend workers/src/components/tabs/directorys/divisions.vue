<template>
  <vd-standard-tab :id="id" :columns="columns" :form-data="data" :list="listData"></vd-standard-tab>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "directorys-divisions",
  props:['id'],
  data(){
    return {
      columns:[
        {prop:'id', label:'№',width:80},
        {prop:'name', label:'Наименование'}
      ],
      data:[
        {name:'id',value:null,type:'text',hide:true},
        {name:'name',value:null,type:'text',label:"Название",required:true}
      ]
    }
  },
  computed: mapState({
    listData: state => state.directorys.divisions
  })
};
</script>

<style>

</style>