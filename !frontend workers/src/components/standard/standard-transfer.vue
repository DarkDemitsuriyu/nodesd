<template>
  <v-layout column>
    <v-flex class="pl-2 pa-0">{{label}}</v-flex>
    <v-flex class="pt-2 pa-0">
      <v-layout row wrap align-center justify-center :style="{'height':`${height}px`}">
        <v-flex xs5 grow class="pa-0">
          <vd-standard-transfer-card :disabled="disabled" :height="height" :title="titles[0]" :data="leftData" v-model="leftSelected"></vd-standard-transfer-card>
        </v-flex>
        <v-flex shrink class="pa-0">
          <v-btn :disabled="!leftSelected.length" fab small depressed :dark="!!leftSelected.length" :style="{background:workerData.color}" :class="workerData.theme" @click="handlerSendItemsTo(true)">
            <v-icon dark>mdi-chevron-left</v-icon>
          </v-btn>
          <br/>
          <v-btn :disabled="!rightSelected.length" fab small depressed :dark="!!rightSelected.length" :style="{background:workerData.color}" :class="workerData.theme" @click="handlerSendItemsTo(false)">
            <v-icon dark>mdi-chevron-right</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs5 grow class="pa-0">
          <vd-standard-transfer-card :disabled="disabled" :height="height" :title="titles[1]" :data="rightData" v-model="rightSelected"></vd-standard-transfer-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'vd-standard-transfer',
  props:{
    label:{
      type:String,
      default:''
    },
    data:{
      type:Array,
      default(){return []}
    },
    value:{
      type:Array,
      default(){return []}
    },
    titles:{
      type:Array,
      default(){return ['1','2']}
    },
    height:{
      type:Number,
      default:340
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      leftSearch:'',
      leftSelected:[],
      rightSearch:'',
      rightSelected:[]
    }
  },
  computed:{
    ...mapState({
      workerData: state => state.worker_data.workerData
    }),
    leftData(){
      return this.data.filter( el => !this.value.includes(el.id))
    },
    leftCheckAll(){
      let value = this.leftSelected
      return {
        isIndeterminate: value.length === this.leftData.length || value.length === 0,
        checkAll: value.length === this.leftData.length
      }
    },
    rightData(){
      return this.data.filter( el => this.value.includes(el.id))
    },
    rightCheckAll(){
      let value = this.rightSelected
      return {
        isIndeterminate: value.length === this.rightData.length || value.length === 0,
        checkAll: value.length === this.rightData.length
      }
    }
  },
  methods: {
    handlerCheckAll(left){
      if(left){
        this.leftSelected = this.leftSelected.length === this.leftData.length ? [] : this.leftData.map( el => el.id)
      } else {
        this.rightSelected = this.rightSelected.length === this.rightData.length ? [] : this.rightData.map( el => el.id)
      }      
    },
    handlerSendItemsTo(left){
      if(left){
        this.$emit('input',this.value.filter( el => !this.rightSelected.includes(el) ))
        this.rightSelected = []
      } else {
        this.$emit('input',this.value.concat(this.leftSelected))
        this.leftSelected = []
      }  
    }
  }
}
</script>

<style>

</style>
