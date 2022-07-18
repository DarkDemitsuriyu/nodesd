<template>
  <v-card :class="['vd-card',{maximized:maximized}]">
    <v-system-bar draggable="true" window dark :class="['elevation-0',theme]" :style="{background:color}">
      <v-icon v-if="icon" class="mr-3">{{ localIcon }}</v-icon>
      {{ localTitle }}
      <v-spacer></v-spacer>
      
      <v-menu offset-y :close-on-content-click="false" :nudge-width="200" >
        <v-btn small flat icon slot="activator">
          <v-icon class="ma-0">mdi-settings</v-icon>
        </v-btn>
        <v-card>
          <v-card-text class="h-100">
              <slot name="settings"></slot>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="handlerApplyFilter">Применить</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn small flat icon @click="handlerMaximize">
        <v-icon class="ma-0">{{ maximizedIcon }}</v-icon>
      </v-btn>
    </v-system-bar>
    <v-card-text class="h-100">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: 'vd-card',
  props:{
    title:{
      type:String,
      required:true
    },    
    icon:String
  },
  computed: {
    ...mapState({
      theme: state => state.worker_data.workerData.theme,
      color: state => state.worker_data.workerData.color
    }),
    maximizedIcon(){
      return this.maximized ? "mdi-window-restore" : "mdi-window-maximize"
    }            
  },
  data(){
    return {
      maximized:false,
      localTitle:this.title,
      localIcon:this.icon
    }
  },
  methods: {
    handlerMaximize(){
      this.maximized = !this.maximized
      this.$emit('maximize',this.maximized)
    },
    handlerApplyFilter(){
      this.$emit('apply-filter')
    }
  }
}
</script>

<style>
.vd-card{
  display: grid;
  grid-template-rows: auto 1fr;  
}
.vd-card.maximized{
  position:fixed !important;
  top:0px !important;
  left:0px !important;
  bottom:0px !important;
  right:0px !important;
  margin:0px !important;
  z-index:1000 !important;
  transition: 1s;
}
</style>
