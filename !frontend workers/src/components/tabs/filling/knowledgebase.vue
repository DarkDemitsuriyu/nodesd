<template>
  <div class="filling-knowledgebase__main" v-loading="loading">
    <v-toolbar dense :height="40" class="filling-knowledgebase__toolbar ">
      <v-btn flat icon @click="handlerAddClick">
        <v-icon >add_box</v-icon>        
      </v-btn>
      <v-btn flat icon @click="handlerEditClick">
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn flat icon @click="handlerDeleteClick">
        <v-icon>delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field class="filling-knowledgebase__filter" single-line hide-details label="Быстрый фильтр..." v-model="filterText" :append-icon="filterText ? 'clear' : 'search'" :append-icon-cb="() => (filterText='')"></v-text-field>
    </v-toolbar>

    <v-card class="filling-knowledgebase__tree">      
      <el-button type="text" size="mini" icon="el-icon-circle-plus-outline" style="width:100%">
         Добавить пользователя
      </el-button><!--  @click="handlerAddNewWorker" :default-active="selectedNode" @select="handlerSelect" -->
      <el-table @row-dblclick="handlerEditClick" current-row-key="id" ref="refComponent" size="mini" highlight-current-row :data="filter()" class="filling-knowledgebase__tree box-card">
        <el-table-tree-column column-key="id" file-icon="mdi mdi-24px mdi-file-document" folder-icon="mdi mdi-24px mdi-folder" prop="name"
          show-overflow-tooltip width="auto" label="Наименование" parent-key="_parentId"></el-table-tree-column>
      </el-table>
    </v-card>

     <v-card v-show="true" class="filling-knowledgebase__view pa-2" style="border-top: 1px solid #dfe6ec; padding:0px;">
      <el-row>
        <el-col :span="12" class="py-2 pr-2">
          <el-input :disabled="selectedData.noDelete" size="small" :error="selectedDataValidationErrors.name" placeholder="Укажите название" v-model="selectedData.name"></el-input>
        </el-col>
        <el-col :span="12" class="py-2">
          <el-select :disabled="selectedData.noDelete" filterable size="small" v-model="selectedData._parentId" placeholder="Выберите раздел" class="w-100">
            <el-option v-for="item in forumsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <!--<textarea name="content" id="editor">
    <p>Here goes the initial content of the editor.</p>
</textarea>-->
      <!--<ckeditor v-model="contentck" name="editor-5" id="editor-5" :config="configck"></ckeditor>-->
      <!--<quill-editor :content="content" :options="editorOption"></quill-editor>-->
      <froala :tag="'textarea'" :config="config" v-model="model"></froala>
    </v-card>

    <v-dialog v-model="dialogVisible" max-width="500px" :overlay="true" scrollable>
      <v-card tile>
        <v-toolbar dense dark :class="['elevation-0',theme]" :style="{background:color}">
          <v-toolbar-items>
            <v-btn flat @click="saveDataAndClose">
              <div>
                <v-icon>save</v-icon>
                <v-icon>arrow_forward</v-icon>
                <v-icon>close</v-icon>
              </div>              
              Сохранить и закрыть
            </v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogVisible = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="h-100">
          <table class="w-100 align-right" style="border-spacing:8px;">
            <tr>
              <td class="subheading">Название:</td>
              <td>
                <el-input :disabled="selectedData.noDelete" :error="selectedDataValidationErrors.name" placeholder="Укажите название" v-model="selectedData.name"></el-input>
              </td>
            </tr>
            <tr>
              <td class="subheading">Раздел:</td>
              <td>
                <el-select :disabled="selectedData.noDelete" filterable size="medium" v-model="selectedData._parentId" placeholder="Выберите раздел" class="w-100">
                  <el-option v-for="item in forumsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </td>
            </tr>
						<tr>
              <td class="subheading">
								<span>Файл:</span>
							</td>
              <td>
                <el-upload action="#" :limit="1" :auto-upload="false"><el-button size="small" type="primary">Click to upload</el-button></el-upload>
                <!--<input type="file" :disabled="selectedData.noDelete" :error="selectedDataValidationErrors.file" placeholder="Введите данные" />-->
              </td>
            </tr>
            
          </table>
        </v-card-text>        
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "filling-knowledgebase",
  props:{
    window:{
      type:Boolean,
      default:true
    },
    id:String
  },
  data() {
    return {
      contentck: '',
      configck: {
        toolbar: [
          [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
        ],
        height: 300
      },
      content: '',
      editorOption: {
        modules:{
          formula: true,
          toolbar:[
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              [['formula']],
              ['link', 'image', 'video']
            ]
        }
        // some quill options
      },
      config: {
        events: {
          'froalaEditor.initialized': function () {
            console.log('initialized')
          }
        },
        imageUpload: false,
        language: 'ru',
        width: '100%',
        toolbarSticky: false
      },
      model: '',
      filterText: '',
      dialogVisible:false,
      selectedDataValidationErrors:{
				name:false,
				file:false
      },
      type:'new',
      selectedData:{
				name:'',
        _parentId:null,
        order:null,
        file:null
      },
      loading: false
    };
  },
  computed: {
    ...mapState({
			listData: state => state.filling.knowledgebase,
			forumsList: state => state.settings.lists.forum,
      theme: state => state.worker_data.workerData.theme,
      color: state => state.worker_data.workerData.color
    })
  },
  methods: {
    filter() {
      let search = function(array,value){        
        let np=[]
        array.forEach( el => {
          if(el.name.toLowerCase().includes(value.toLowerCase())){
            el.depth=0
            np.push(el)
          }
          if(el.children){
            np=np.concat(search(el.children,value))
          }
        })
        return np
      }
      return this.filterText ? search(this.$vdesk.copyArray(this.listData),this.filterText) : this.listData
    },
    handlerDeleteClick(){
      let node = this.$refs.refComponent.store.states.currentRow;
      if(node){
        if(node.noDelete){
          this.$message({type: 'error',message: 'Данный элемент нельзя удалить'});
        } else {
          this.$confirm(`Вы пытаетесь удалить пункт - ${node.name}. Продолжить?`, 'Warning', {
            confirmButtonText: 'Да',
            cancelButtonText: 'Нет',
            type: 'warning'
          }).then(() => {
            this.selectedData = { id:node.id };
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
      let node = this.$refs.refComponent.store.states.currentRow;
      if(node){
  			this.selectedData = Object.assign({},node)
				this.type="update"
				this.dialogVisible=true
      }      
    },
    handlerAddClick() {
			let node = this.$refs.refComponent.store.states.currentRow;
			this.selectedData = {
				name:'',
        _parentId:node ? node._parentId ? node._parentId : node.id : null,
        order:null,
        file:null
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
/*.filling-knowledgebase__main {
  display: grid;
  height: 100%;
  overflow:hidden;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    "filling-knowledgebase__toolbar"
    "filling-knowledgebase__filter"
    "filling-knowledgebase__tree";
}*/

.filling-knowledgebase__main {
  display: grid;
  overflow: hidden;
  height: 100%;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "filling-knowledgebase__tree filling-knowledgebase__toolbar" "filling-knowledgebase__tree filling-knowledgebase__view";
}
.filling-knowledgebase__main .el-select{
  width:100%;
}
.filling-knowledgebase__filter{
  grid-area: filling-knowledgebase__filter;
}
.filling-knowledgebase__toolbar {
  grid-area: filling-knowledgebase__toolbar;
}
.filling-knowledgebase__toolbar .btn{
  margin:2px;
}
.filling-knowledgebase__tree {
  grid-area: filling-knowledgebase__tree;
  border-right: 1px solid #dfe6ec;
  overflow: auto;
}
.filling-knowledgebase__tree.el-table {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}
.filling-knowledgebase__tree .el-table__header-wrapper,
.filling-knowledgebase__tree .el-table__body-wrapper {
  width: auto !important;
}
/*.filling-knowledgebase__tree .el-button*/
.filling-knowledgebase__view {
  grid-area: filling-knowledgebase__view;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr
}
.filling-knowledgebase__view > .fr-box{
  height:100%;
  display: grid;
  grid-template-rows: auto 1fr auto 
}
.filling-knowledgebase__view > .fr-box > .fr-wrapper{
  overflow: auto
}
.el-input-group__prepend{
  width:103px;
  text-align:right;
}
</style>