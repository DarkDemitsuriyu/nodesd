<template>
  <v-card class="elevation-1 vd-standard-transfer-card" :style="{'height':`${height-24}px`,'overflow':'hidden'}">
    <v-toolbar dense dark :style="{background:workerData.color}" :class="workerData.theme">
      <v-checkbox :disabled="disabled" :label="title" hide-details :indeterminate="!checkAll.isIndeterminate" :input-value="checkAll.checkAll" @change="handlerCheckAll"></v-checkbox>
      <v-spacer></v-spacer>
      {{selected.length}}/{{list.length}}
    </v-toolbar>
    <v-list dense :style="{'height':`${height-24-48}px`,'overflow':'auto'}">
      <v-list-tile :disabled="disabled" v-for="item in list" :key="item.id" @click="handlerListItemClick(item.id)">
        <v-list-tile-action>
          <v-checkbox v-model="selected" :value="item.id"></v-checkbox>
        </v-list-tile-action>
        
        <v-list-tile-content>{{item.name}}</v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'vd-standard-transfer-card',
  props:{
    title:{
      type:String,
      default:''
    },
    data:{
      type:Array,
      default:[]
    },
    value:{
      type:Array,
      default:[]
    },
    height:{
      type:Number,
      default:400
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      search:''
    }
  },
  computed:{
    ...mapState({
      workerData: state => state.worker_data.workerData
    }),
    selected:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      }
    },
    list(){
      return this.data
    },
    checkAll(){
      return {
        isIndeterminate: this.selected.length === this.list.length || this.selected.length === 0,
        checkAll: this.selected.length === this.list.length
      }
    }
  },
  methods: {
    handlerCheckAll(){
      this.selected = this.selected.length === this.list.length ? [] : this.list.map( el => el.id)
    },
    handlerListItemClick(id){
      if(this.selected.includes(id)){
        this.selected = this.selected.filter( el => el !== id)
      } else {
        this.selected.push(id)
      }
    }
  }
}
</script>

<style>
.vd-standard-transfer-card .v-toolbar__content{
  padding:0px 16px;
}
</style>
