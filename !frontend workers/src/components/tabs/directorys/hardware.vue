<template>
  <vd-standard-tab-tree :id="id" :form-data="data" :list="treeData">
    <!--<v-layout slot="card">
      <v-flex>
        <v-text-field :disabled="!edit" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val" clearable></v-text-field>
      </v-flex>
      <v-flex>

      </v-flex>
    </v-layout>-->
  </vd-standard-tab-tree>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "directorys-hardware",
  props:['id'],
  data() {
    return {
      columns:[
        {
          prop:'name',
          label:'',
          //render: (scope) => scope.row.isItem ? scope.row.name : `${scope.row.name} (${scope.row.children.length})`
        }
      ],
      options:{
        defSort:{prop: 'id', order: 'ascending'},
        //key:"name",
        type:'tree'
      },
      form:{
        id:null,
        name:null,
        _parentId:null,
        isItem:true
      }
    };
  },
  computed: {
    ...mapState({
      treeData: state => state.directorys.hardware
    }),
    hardwaresections(){
      return this.$store.getters.getHardwareDirectorys
    },
    data(){
      return [
        {name:'id',type:'text',hide:true},
        {name:'name',type:'text',label:"Название",required:true},
        {name:'_parentId',type:'select',label:"Раздел",items:this.hardwaresections,required:true},
        {name:'isItem',type:'switch',label:"Тип",labelTrue:"Техника",labelFalse:"Раздел",required:true}
      ]
    }
  },
  methods: {
    handlerBtnClick(type){
      switch(type){
        case 'add':
          this.handlerAddClick()
          break;
        case 'edit':
          this.handlerEditClick()
          break;
        case 'delete':
          this.handlerDeleteClick()
          break;
      }
    },
    handlerDeleteClick(){
      let node = this.$refs.refComponent.$children[0].$children[0].store.states.currentRow;
      if(node){
        this.$confirm(`Вы пытаетесь удалить пункт - ${node.name}. Продолжить?`, 'Warning', {
          confirmButtonText: 'Да',
          cancelButtonText: 'Нет',
          type: 'warning'
        }).then(() => {
          this.selectedData = {
            id:node.id,
            name:node.name,
            _parentId:node._parentId,
            isItem:!!node.isItem
          };
          this.type="delete"
          this.$vdesk.sendUpdate(this)
          this.$message({type: 'success',message: 'Удаление выполнено'});
        }).catch(() => {
          this.$message({type: 'info',message: 'Удаление отменено'});
        });
      }      
    },
    handlerEditClick(){
      let node = this.$refs.refComponent.$children[0].$children[0].store.states.currentRow;
      if(node){
        this.selectedData = {
          id:node.id,
          name:node.name,
          _parentId:node._parentId,
          isItem:!!node.isItem
        };
        this.type="update"
        this.dialogVisible=true
      }      
    },
    handlerAddClick() {
      let node = this.$refs.refComponent.$children[0].$children[0].store.states.currentRow;
      this.selectedData = {
        name:'',
        _parentId:node && !node.isItem ? node.id : null,
        isItem:true
      };
      this.type="new"
      this.dialogVisible = true
    },
    saveDataAndClose() {
      if(!this.selectedData.name){
        this.selectedDataValidationErrors.name=true;
        setTimeout(()=>{this.selectedDataValidationErrors.name=false},2000)
      } else {
        this.$vdesk.sendUpdate(this)
      }
    }
  }
};
</script>

<style>

</style>