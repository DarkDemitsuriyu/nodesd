<template>
  <div class="standart-tab pa-2">
    <vd-standart-tab-toolbar @btn-click="handlerBtnClick" v-model="filterText"></vd-standart-tab-toolbar>
    <vd-standart-tab-table ref="thisTable" @select-item="handlerSelectItem" @dbl-click="handlerClick_Edit" :options="options" :columns="columns" :filter-text="filterText" :data="list" ></vd-standart-tab-table>
    
    <vd-standart-tab-dialog v-model="dialogVisible" :main-btn-disabled="dialogBtnDisabled" :max-width="`${dialogWidth}px`" @btn-click="saveDataAndClose">
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
  name: "vd-standard-tab",
  props:{
    id:String,
    external:Boolean,
    formData:{type:Array, default:()=>[]},
    columns:{type:Array, default:()=>[]},
    list:{type:Array, default:()=>[]},
    options:{type:Object, default:()=>{}},
    dialogWidth:{type:Number, default:450},
    dialogBtnDisabled:Boolean
  },
  created(){
    this.data = Object.assign([], this.formData)
  },
  data(){
    return {
      type:'new',
      filterText:'',
      dialogVisible:false,
      data:[]
    }
  },
  methods:{
    handlerBtnClick(type){
      let row=this.$refs.thisTable.currentRow
      switch(type){
        case 'add':
          this.handlerClick_Add()
          break;
        case 'edit':
          this.handlerClick_Edit(row)
          break;
        case 'delete':
          this.handlerClick_Delete(row)
          break;
      }
      this.$emit('toolbar-click',type,row)
    },
    handlerDblClick(row=this.$refs.thisTable.currentRow){
      if(options.type === 'tree'){

      } else {
        this.handlerClick_Edit(row)
      }
      this.$emit('dbl-click',row,event)
    },
    handlerClick_Delete(row){
      if(row){
        if(!this.external){
          this.$confirm(`Вы пытаетесь удалить пункт - ${row.name}. Продолжить?`, 'Warning', {confirmButtonText: 'Да', cancelButtonText: 'Нет', type: 'warning'}).then(() => {
            this.$vdesk.sendUpdate({id:this.id,data:{id:row.id},type:'delete'})
            this.$message({type: 'success',message: 'Удаление выполнено'});
          }).catch(() => {
            this.$message({type: 'info',message: 'Удаление отменено'});
          });
        }
      } else {
        this.$message({type: 'info',message: 'Не выделено ни одной строки'});
      }
    },
    handlerClick_Edit(row){
      if(row){
        if(!this.external){
          this.data.forEach( el => el.val = row[el.name] )
        }
        if(this.options.type !== 'tree' || row.isItem){
          this.type="update"
          this.dialogVisible = true
        }        
      }
    },
    handlerClick_Add() {
      if(!this.external){
        this.data.forEach( el => el.val = null )
      }
      this.type="new"
      this.dialogVisible = true
    },
    saveDataAndClose() {
      if(this.external){
        this.dialogVisible = false
        this.$emit('save-click',event)
      } else {
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
    handlerSelectItem(row){
      if(row){
        this.$store.commit('SET_TEMP_SELECTED_DATA',{id:this.id,data:row})
      }
    }
  }
};
</script>

<style>
.standart-tab{
  display: grid;
  max-height: 100%;
  overflow:hidden;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "standart-tab__toolbar"
    "standart-tab__card";
}
.standart-tab__toolbar{
  grid-area: standart-tab__toolbar;
}
.standart-tab__toolbar .btn{
  margin:2px;
}
.standart-tab__card{
  grid-area: standart-tab__card;
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
</style>