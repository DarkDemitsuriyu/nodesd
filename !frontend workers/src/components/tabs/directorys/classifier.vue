<template>
<vd-standard-tab :id="id" :columns="columns" :options="options" :form-data="data" :list="treeData"></vd-standard-tab>
  <!--<div class="standart-tab directorys-menu__main pa-2" v-loading="loading">
    <vd-standart-tab-toolbar @btn-click="handlerBtnClick" v-model="filterText"></vd-standart-tab-toolbar>
    <vd-standart-tab-table ref="refComponent" @dbl-click="handlerEditClick" :filter-text="filterText" :main="toTree" :data="$vdesk.filterTree(filterText,treeData)" ></vd-standart-tab-table>

    <v-dialog v-model="dialogVisible" max-width="500px" :overlay="true" scrollable>
      <v-card tile>
        <vd-standart-tab-dialog-toolbar v-model="dialogVisible" @btn-click="saveDataAndClose"></vd-standart-tab-dialog-toolbar>
        <v-card-text class="h-100">
          <el-form size="small" ref="form" :model="selectedData" label-width="150px">
            <el-form-item label="Название">
              <el-input :disabled="selectedData.noDelete" :error="selectedDataValidationErrors.name" placeholder="Укажите название" v-model="selectedData.name"></el-input>
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
  name: "directorys-classifier",
  props:{
    window:{
      type:Boolean,
      default:true
    },
    id:String
  },
  data() {
    return {
      columns:[
        {prop:'name', label:'Наименование',tree:true},
        {prop:'number', label:'Порядок'}
      ],
      options:{
        defSort:{prop: 'id', order: 'ascending'},
        type:'tree'
      }/*,
      filterText: '',
      dialogVisible:false,
      selectedDataValidationErrors:{
				name:false
			},
      type:'new',
      selectedData:{
        id:null,
				name:''
      },
      loading: false*/
    };
  },
  computed: {
    ...mapState({
			treeData: state => state.directorys.classifier
    }),
    data(){
      return [
        {name:'id',val:null,type:'text',hide:true},
        {name:'name',val:null,type:'text',label:"Название",required:true}
      ]
    }
  }/*,
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
          this.selectedData = {id:node.id,name:node.name};
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
  			this.selectedData = {id:node.id,name:node.name};
				this.type="update"
				this.dialogVisible=true
      }      
    },
    handlerAddClick() {
			let node = this.$refs.refComponent.$children[0].$children[0].store.states.currentRow;
			this.selectedData = {
        id:null,
				name:'',
        _parentId:node && node.type==='directory' ? node.id : null
      }
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
  }*/
};
</script>

<style>

</style>
