<template>
  <vd-standard-tab :id="id" :columns="columns" :form-data="data" :list="listData"></vd-standard-tab>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "filling-links",
  props:['id'],
  data(){
    return {
      columns:[
        {prop:'id', label:'№',width:80},
        {prop:'name', label:'Наименование'},
        {prop:'link', label:'Ссылка'},
        {prop:'screen', label:'Скриншот', render:(scope) => `<img style="height:50px;" src="/images/linksScreens/${scope.row.screen}" />`}
      ],
      data:[
        {name:'id',value:null,type:'text',hide:true},
        {name:'name',value:null,type:'text',label:"Название",required:true},
        {name:'link',value:null,type:'text',label:"URL",required:true},
        {name:'screen',value:null,type:'text',label:"Скриншот"}
      ]
    }
  },
  computed: mapState({
    listData: state => state.filling.links
  })
};
</script>

<style>

</style>