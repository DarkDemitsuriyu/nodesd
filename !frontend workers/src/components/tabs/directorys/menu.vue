<template>
  <vd-standard-tab-tree :id="id" :columns="columns" :options="options" :form-data="data" :list="treeData"></vd-standard-tab-tree>
  <!--<vd-standard-tab :id="id" :columns="columns" :options="options" :form-data="data" :list="treeData"></vd-standard-tab>-->
  <!--<div class="standart-tab directorys-menu__main pa-2" v-loading="loading">
    <vd-standart-tab-toolbar @btn-click="handlerBtnClick" v-model="filterText"></vd-standart-tab-toolbar>
    <vd-standart-tab-table ref="refComponent" @dbl-click="handlerEditClick" :filter-text="filterText" :main="toTree" :data="$vdesk.filterTree(filterText,treeData,toTree.folders)" ></vd-standart-tab-table>

    <v-dialog v-model="dialogVisible" max-width="500px" :overlay="true" scrollable>
      <v-card tile>
        <vd-standart-tab-dialog-toolbar v-model="dialogVisible" @btn-click="saveDataAndClose"></vd-standart-tab-dialog-toolbar>
        <v-card-text class="h-100">
          <el-form size="small" ref="form" :model="selectedData" label-width="150px">
            <el-form-item label="Название">
              <el-input :disabled="selectedData.noDelete" :error="selectedDataValidationErrors.name" placeholder="Укажите название" v-model="selectedData.name"></el-input>
            </el-form-item>
            <el-form-item :label="selectedData.type==='link' ? 'URL' : 'Идентификатор'">
              <el-input :disabled="selectedData.noDelete" :error="selectedDataValidationErrors.link" placeholder="Введите данные" v-model="selectedData.link"></el-input>
            </el-form-item>
            <el-form-item label="Раздел">
              <el-select :disabled="selectedData.noDelete" filterable size="medium" v-model="selectedData._parentId" placeholder="Выберите раздел">
                <el-option v-for="item in mainmenu" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Доступно для групп">
              <el-select multiple collapse-tags filterable size="medium" v-model="selectedData.groups" placeholder="Выберите группы">
                <el-option v-for="item in groupsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Тип">
              <el-radio :disabled="selectedData.noDelete" v-model="selectedData.type" label="directory">Раздел</el-radio>
  						<el-radio :disabled="selectedData.noDelete" v-model="selectedData.type" label="link">Ссылка</el-radio>
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
  name: "directorys-menu",
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
        {prop:'name', label:'Наименование'},
        {prop:'order', label:'Порядок'},
        {prop:'link', label:'Идентификатор / URL'}
      ],
      options:{
        defSort:{prop: 'id', order: 'ascending'},
        type:'tree'
      }/*,
      filterText: '',
      dialogVisible:false,
      selectedDataValidationErrors:{
				name:false,
				link:false
			},
      type:'new',
      selectedData:{
				name:'',
				icon:'',
				groups:[],
        _parentId:null,
        order:null,
        link:null,
        noDelete:false,
        type:'link'
      },
      loading: false*/
    };
  },
  computed: {
    ...mapState({
			treeData: state => state.directorys.menu,
			groupsList: state => state.settings.lists.group
    }),
    data(){
      return [
        {name:'id',val:null,type:'text',hide:true},
        {name:'icon',value:null,type:'icons',hide:true},
        {name:'name',val:null,type:'text',label:"Название",required:true},
        {name:'order',val:null,type:'number',label:"Порядок"},
        {name:'link',val:null,type:'text',label:"Идентификатор / URL",required:true},
        {name:'groups',val:[],type:'select',label:"Доступно для групп",multiple:true,items:this.groupsList},
        {name:'_parentId',val:1,type:'select',label:"Раздел",items:this.mainmenu,required:true},
        {name:'type',val:true,type:'switch',label:"Тип",labelTrue:"Ссылка",labelFalse:"Раздел",required:true}
      ]
    },
    mainmenu(){
      return this.$store.getters.getMenuDirectorys
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
        if(node.noDelete){
          this.$message({type: 'error',message: 'Данный элемент нельзя удалить'});
        } else {
          this.$confirm(`Вы пытаетесь удалить пункт - ${node.name}. Продолжить?`, 'Warning', {
            confirmButtonText: 'Да',
            cancelButtonText: 'Нет',
            type: 'warning'
          }).then(() => {
            this.selectedData = {
              id:node.id,
							icon:node.icon,
							groups:node.groups,
              name:node.name,
              _parentId:node._parentId,
              order:node.order,
              link:node.link,
              noDelete:!!node.noDelete,
              type:node.type
            };
            this.type="delete"
            this.$vdesk.sendUpdate(this)
            this.$message({type: 'success',message: 'Удаление выполнено'});
          }).catch(() => {
            this.$message({type: 'info',message: 'Удаление отменено'});
          });
        }
      }
    },
    handlerEditClick(){
      let node = this.$refs.refComponent.$children[0].$children[0].store.states.currentRow;
      if(node){
				if(node.noDelete && node.type==='directory'){
					this.$message({type: 'error',message: 'Данный элемент нельзя редактировать'});
				} else {
					this.selectedData = {
						id:node.id,
						name:node.name,
						icon:node.icon,
						groups:node.groups,
						_parentId:node._parentId,
						order:node.order,
						link:node.link,
						noDelete:!!node.noDelete,
						type:node.type
					};
					this.type="update"
					this.dialogVisible=true
				}        
      }      
    },
    handlerAddClick() {
			let node = this.$refs.refComponent.$children[0].$children[0].store.states.currentRow;
			this.selectedData = {
				name:'',
				icon:'',
				groups:[],
        _parentId:node && node.type==='directory' ? node.id : null,
        order:null,
        link:null,
        noDelete:false,
        type:'link'
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
  }
};
</script>

<style>

</style>
