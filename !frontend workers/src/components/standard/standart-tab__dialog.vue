<template>
  <v-dialog ref="dialog" v-model="dialogVisible" :fullscreen="dialogMaximize || fullscreen" :max-width="maxWidth"  persistent :hide-overlay="!overlay" :scrollable="!noScrollable">
      <v-card tile>
        <slot name="toolbar">
          <v-toolbar dense dark :class="['elevation-0',theme]" :style="{background:color}">
            <v-toolbar-items>
              <slot name="toolbarItems">
                <v-btn v-if="!noMainBtn" :disabled="mainBtnDisabled" flat @click="$emit('btn-click')">
                  <v-icon left>{{mainBtnIcon}}</v-icon>
                  {{mainBtnText}}
                </v-btn>
              </slot>
            </v-toolbar-items>
            <v-spacer v-if="!noMainBtn"></v-spacer>
            <slot name="title">
              <v-toolbar-title>{{title}}</v-toolbar-title>
            </slot>
            <v-spacer></v-spacer>
            <v-btn v-if="!fullscreen && !noMinBtn" icon dark @click="dialogMinimize = !dialogMinimize">
              <v-icon v-show="!dialogMinimize">mdi-window-minimize</v-icon>
              <v-icon v-show="dialogMinimize">mdi-window-restore</v-icon>
            </v-btn>
            <v-btn v-if="!fullscreen && !noMaxBtn" icon dark @click="dialogMaximize = !dialogMaximize">
              <v-icon v-if="dialogMaximize">mdi-window-restore</v-icon>
              <v-icon v-else>mdi-window-maximize</v-icon>
            </v-btn>
            <v-btn icon dark @click="dialogVisible = false">
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
          </v-toolbar>
          <!--<vd-standart-tab-dialog-toolbar :title="title" :no-main-btn="noMainBtn" :main-btn-text="mainBtnText" :main-btn-icon="mainBtnIcon" @btn-minimize="dialogMinimize = !dialogMinimize" :minimize="dialogMinimize" @btn-maximize="dialogMaximize = !dialogMaximize" :maximize="dialogMaximize" v-model="dialogVisible" @btn-click="handlerBtnClick"></vd-standart-tab-dialog-toolbar>-->
        </slot>
        <slot name="main">
          <v-card-text v-show="!dialogMinimize" class="h-100">
            <slot></slot>
          </v-card-text>
        </slot>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "vd-standart-tab-dialog",
  props:{
    noScrollable:Boolean,
    fullscreen :Boolean,
    value:Boolean,
    title:String,
    noMainBtn:Boolean,
    noMinBtn:Boolean,
    noMaxBtn:Boolean,
    mainBtnDisabled:Boolean,
    mainBtnText:{
      type:String,
      default:'Сохранить и закрыть'
    },
    mainBtnIcon:{
      type:String,
      default:'mdi-content-save'
    },
    overlay:{
      type:Boolean,
      default:true
    },
    maxWidth:{
      type:String,
      default:"600px"
    }
  },
  data(){
    return {
      dialogMaximize:false,
      minimize:false,
      id:this.$vdesk.randomGenerator(16)
    }
  },
  computed: {
    dialogMinimize:{
      get(){return this.minimize},
      set(val){
        this.minimize = val
        if(val){
          this.$store.commit("ADD_MINIMIZED_WINDOW", {id:this.id, wind:{id:this.id,title:'qweasd'}});
        } else {
          this.$store.commit("DELETE_MINIMIZED_WINDOW", this.id);
        }        
      }
    },
    dialogVisible:{
      get(){return this.value;},
      set(val){
        this.$emit('input', val)
        this.$emit('closed', val)
      }
    },
    ...mapState({
      theme: state => state.worker_data.workerData.theme,
      color: state => state.worker_data.workerData.color
    }) 
  },
  methods:{
    /*handlerBtnClick(){
      this.$emit('btn-click')
    }*/
  }
};
</script>

<style>

</style>