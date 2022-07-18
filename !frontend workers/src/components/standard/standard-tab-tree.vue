<template>
  <div class="standart-tab-tree pa-2">
    <!--<vd-standart-tab-toolbar v-model="filterText"></vd-standart-tab-toolbar>-->
    
    <v-card class="standart-tab__card-left mr-2">
      <vd-standart-tab-tree-toolbar v-model="filterText" @btn-click="handlerBtnClick"></vd-standart-tab-tree-toolbar>
      <slot name="list">
        <v-card-text>
          <v-treeview ref="thisTable" :items="list" :search="filterText" :open.sync="open" :active.sync="active" :open-all="isOpen" return-object activatable hoverable open-on-click>
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="item.children && item.children.length > 0">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
              <v-icon v-else>mdi-file-document-outline</v-icon>
            </template>
            <template v-slot:append="{ item, open }">
              <v-tooltip v-if="item.children && item.children.length > 0 && item.link === 'links'" right>
                <v-btn icon small slot="activator" @click.stop="">
                  <v-icon color="blue">mdi-link-plus</v-icon>
                </v-btn>
                <span>Добавить</span>
              </v-tooltip>
              <v-tooltip v-if="!item.children || item.children.length <= 0" right>
                <v-btn icon small slot="activator" @click.stop="">
                  <v-icon color="red">mdi-file-remove</v-icon>
                </v-btn>
                <span>Удалить запись</span>
              </v-tooltip>
            </template>
          </v-treeview>
        </v-card-text>
      </slot>      
    </v-card>

    <v-card v-show="active.length > 0" class="standart-tab__card-right">
      <v-toolbar dense class="white elevation-0">
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="handlerEditSave">
            <v-icon v-show="!edit" color="orange">mdi-file-document-edit</v-icon>
            <v-icon v-show="edit" color="green">save</v-icon>
          </v-btn>
          <span v-show="!edit">Редактировать</span>
          <span v-show="edit">Сохранить</span>
        </v-tooltip>
        <v-btn v-if="edit" icon @click="edit = !edit">
          <v-icon color="red">mdi-cancel</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <slot name="card">
          <template v-for="(field,index) in data">
            <v-text-field   v-if="field.type==='text' && !field.hide"     :disabled="!edit" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val" clearable></v-text-field>
            <v-text-field   v-if="field.type==='number' && !field.hide"   :disabled="!edit" type="number" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val"></v-text-field>
            <v-text-field   v-if="field.type==='icons' && !field.hide"    :disabled="!edit" :prepend-icon="`fa ${field.val} fa-2x`" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val"></v-text-field>
            <v-textarea     v-if="field.type==='textarea' && !field.hide" :disabled="!edit" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val"></v-textarea>
            <v-autocomplete v-if="field.type==='select' && !field.hide"   :disabled="!edit" :key="field.name+index" :label="field.label" clearable dense  :items="field.items" :multiple="field.multiple" item-value="id" item-text="name" v-model="field.val"></v-autocomplete>
            <v-switch       v-if="field.type==='switch' && !field.hide"   :disabled="!edit" :key="field.name+index" :label="field.val ? `${field.label}: ${field.labelTrue}` : `${field.label}: ${field.labelFalse}`" v-model="field.val"></v-switch>
          </template>
        </slot>
      </v-container>
    </v-card>
    
    <vd-standart-tab-dialog v-model="dialogVisible" :max-width="`${dialogWidth}px`" @btn-click="saveDataAndClose">
      <slot name="dialog">
        <template v-for="(field,index) in data">
          <v-text-field   v-if="field.type==='text' && !field.hide" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val" clearable></v-text-field>
          <v-text-field   v-if="field.type==='number' && !field.hide" type="number" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val"></v-text-field>
          <v-text-field   v-if="field.type==='icons' && !field.hide" :prepend-icon="`fa ${field.val} fa-2x`" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val"></v-text-field>
          <v-textarea     v-if="field.type==='textarea' && !field.hide" :error="field.error" :key="field.name+index" :label="field.label" v-model="field.val"></v-textarea>
          <v-autocomplete v-if="field.type==='select' && !field.hide" :key="field.name+index" :label="field.label" clearable dense  :items="field.items" :multiple="field.multiple" item-value="id" item-text="name" v-model="field.val"></v-autocomplete>
          <v-switch       v-if="field.type==='switch' && !field.hide" :key="field.name+index" :label="field.val ? `${field.label}: ${field.labelTrue}` : `${field.label}: ${field.labelFalse}`" v-model="field.val"></v-switch>
        </template>
      </slot>
    </vd-standart-tab-dialog>
  </div>
</template>

<script>
export default {
  name: "vd-standard-tab-tree",
  props:{
    id:String,
    formData:{type:Array, default:()=>[]},
    /*columns:{type:Array, default:()=>[]},*/
    list:{type:Array, default:()=>[]},
    /*options:{type:Object, default:()=>{}},*/
    dialogWidth:{type:Number, default:450}
  },
  created(){
    this.data = Object.assign([], this.formData)
  },
  data(){
    return {
      type:'new',
      filterText:'',
      active: [],
      open: [],
      isOpen:false,
      edit:false,
      dialogVisible:false,
      data:[]
    }
  },
  computed:{
    selected(){
      if (!this.active.length) return {}
      const id = this.active[0]
      console.log('id',id)
      return this.active[0]
    }
  },
  methods:{
    handlerEditSave(){
      if(this.edit){
        console.log(this.active)
        this.$vdesk.sendUpdate({id:this.id,data:this.active[0],type:this.type})
        this.edit=false
      } else {
        this.edit=true
      }      
    },

    handlerBtnClick(e){
      console.log('btn-click',e)
    },
    handlerDblClick(){
      if(options.type === 'tree'){

      } else {
        this.handlerClick_Edit()
      }
    },
    handlerClick_Delete(row=this.$refs.thisTable.currentRow){
      if(row){
        this.$confirm(`Вы пытаетесь удалить пункт - ${row.name}. Продолжить?`, 'Warning', {confirmButtonText: 'Да', cancelButtonText: 'Нет', type: 'warning'}).then(() => {
          this.$vdesk.sendUpdate({id:this.id,data:{id:row.id},type:'delete'})
          this.$message({type: 'success',message: 'Удаление выполнено'});
        }).catch(() => {
          this.$message({type: 'info',message: 'Удаление отменено'});
        });
      } else {
        this.$message({type: 'info',message: 'Не выделено ни одной строки'});
      }
    },
    handlerClick_Edit(row=this.$refs.thisTable.currentRow){
      if(row){
        this.data.forEach( el => el.val = row[el.name] )
        this.type="update"
        this.dialogVisible=true
        this.$emit('dbl-click',row,event)
      }
    },
    handlerClick_Add() {
      this.data.forEach( el => el.val = null )
      this.type="new"
      this.dialogVisible = true
    },
    saveDataAndClose() {
      let isValid = true
      this.data = this.data.map( el => {
        if(el.required && !el.val){
          isValid = false
          el.error=true
        }
        return el
      })
      if(isValid){
        let returned = {}
        this.data.forEach( el => returned[el.name] = el.val )
        this.$vdesk.sendUpdate({id:this.id,data:returned,type:this.type})
        this.dialogVisible = false
      } else {
        setTimeout(()=>{ this.data = this.data.map( el => Object.assign(el,{error:false}) )},2000)
      }
    }
  },
  watch: {
    active(val){
      this.edit = false
      let row=val[0]
      if(row){
        this.data.forEach( el => el.val = row[el.name] )
        this.type="update"
        //this.dialogVisible=true
        //this.$emit('dbl-click',row,event)
      } else {
        this.data.forEach( el => el.val = null )
      }
      console.log('val',val)
      this.$emit('active',val[0])
    },
    filterText(val){
      if(val){
        this.$refs.thisTable.updateAll(true)
      } else {
        this.$refs.thisTable.updateAll(false)
      }
    }
    
  }
};
</script>

<style>
.standart-tab-tree{
  display: grid;
  max-height: 100%;
  overflow:hidden;
  grid-template-rows: auto 1fr;
  grid-template-columns: 500px 1fr;
  grid-template-areas:
    "standart-tab__toolbar standart-tab__toolbar"
    "standart-tab__card-left standart-tab__card-right";
}
.standart-tab__toolbar{
  grid-area: standart-tab__toolbar;
}
.standart-tab__toolbar .btn{
  margin:2px;
}
.standart-tab__card-left{
  grid-area: standart-tab__card-left;
  overflow-y: auto;
  overflow-x: hidden;
}
.standart-tab__card-right{
  grid-area: standart-tab__card-right;
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
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

.v-treeview-node__content{
  max-width:95%;
}
.v-treeview-node__label{
  overflow: hidden!important;
    text-overflow: ellipsis!important;
    line-height: 1.1!important;
    white-space:nowrap!important;
    width: 85%;
}
</style>