<template>
  <v-text-field :disabled="disabled" class="vd-standard-numberfield" v-model="number" :label="label" :prefix="prefix" :suffix="suffix">
    <div slot="append">
      <!--<v-icon class="mr-4" @click="number--" @mousedown="handlerLaborexpendituresChange($event,true)">mdi-minus-circle-outline</v-icon>
      <v-icon @click="number++" @mousedown="handlerLaborexpendituresChange">mdi-plus-circle-outline</v-icon>-->
      <v-layout column>
        <v-flex class="pa-0">
          <v-icon @click="number++" @mousedown="handlerLaborexpendituresChange">mdi-menu-up</v-icon>
        </v-flex>
        <v-flex class="pa-0">
          <v-icon @click="number--" @mousedown="handlerLaborexpendituresChange($event,true)">mdi-menu-down</v-icon>
        </v-flex>
      </v-layout>
    </div>
  </v-text-field>
</template>

<script>
export default {    
    name: 'vd-standard-numberfield',
    props:{
      label:String,
      disabled:Boolean,
      prefix:String,
      suffix:String,
      value:Number,
      min:{ type:Number, default:Infinity},
      max:{ type:Number, default:Infinity}
    },
    data(){
        return {
        }
    },
    computed:{
      number:{
        get(){
          return this.value
        },
        set(val){
          if(this.min !== Infinity){ val = val < this.min ? this.min : val }
          if(this.max !== Infinity){ val = val > this.max ? this.max : val }
          this.$emit('input',val)
        }
      }
    },
    methods: {
      handlerLaborexpendituresChange(e,min){
        let change = setInterval(() => {
          if(min){
            if(this.number > 1){
              this.number--;
            }            
          } else {
            this.number++;
          }          
        },100)
        e.target.onmouseup = () => {
          clearInterval(change);
          e.target.onmouseup=null;
        }
      }
    }
}
</script>

<style>
.vd-standard-numberfield .flex .v-icon:hover{
  color: #1976d2;
}
.vd-standard-numberfield{

}
</style>
