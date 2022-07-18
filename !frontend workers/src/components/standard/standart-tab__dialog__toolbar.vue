<template>
  <v-toolbar dense dark :class="['elevation-0',theme]" :style="{background:color}">
    <v-toolbar-items v-if="!noMainBtn">
      <v-btn flat @click="$emit('btn-click')">
        <v-icon left>{{mainBtnIcon}}</v-icon>
        {{mainBtnText}}
      </v-btn>
    </v-toolbar-items>
    <v-spacer v-if="!noMainBtn"></v-spacer>
    <v-toolbar-title>{{title}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon dark @click="$emit('btn-minimize')">
      <v-icon v-show="!minimize">mdi-window-minimize</v-icon>
      <v-icon v-show="minimize">mdi-window-restore</v-icon>
    </v-btn>
    <v-btn icon dark @click="$emit('btn-maximize')">
      <v-icon v-if="maximize">mdi-window-restore</v-icon>
      <v-icon v-else>mdi-window-maximize</v-icon>
    </v-btn>
    <v-btn icon dark @click="dialogVisible = false">
      <v-icon>mdi-window-close</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "vd-standart-tab-dialog-toolbar",
  props:{
    title:String,
    value:Boolean,
    noMainBtn:Boolean,
    mainBtnText:{
      type:String,
      default:'Сохранить и закрыть'
    },
    mainBtnIcon:{
      type:String,
      default:'mdi-content-save'
    },
    maximize:{
      type:Boolean,
      default:false
    },
    minimize:{
      type:Boolean,
      default:false
    }
  },
  computed: {
    dialogVisible:{
      get(){
        return this.value;
      },
      set(val){
        this.$emit('input', val)
      }
    },
    ...mapState({
      theme: state => state.worker_data.workerData.theme,
      color: state => state.worker_data.workerData.color
    })      
  }
};
</script>

<style>

</style>