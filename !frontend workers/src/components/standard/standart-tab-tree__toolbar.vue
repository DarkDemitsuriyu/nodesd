<template>
  <v-sheet>
    <v-layout>
      <v-flex>
        <v-text-field solo flat hide-details label="Фильтр..." v-model="filterText" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
      </v-flex>
      <v-flex shrink>
        <v-divider vertical />
      </v-flex>
      <v-flex shrink>
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="handlerBtnClick">
            <v-icon :color="workerData.theme || workerData.color">{{btnIcon}}</v-icon>
          </v-btn>
          <span>{{btnLabel}}</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
    <v-divider />
  </v-sheet>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "vd-standart-tab-tree-toolbar",
  props:{
    value:String,
    btnIcon:{ type:String, default:'mdi-file-plus' },
    btnLabel:{ type:String, default:'Создать запись' }
  },
  computed: {
    ...mapState({
      workerData: state => state.worker_data.workerData
    }),
    filterText:{
      get(){
        return this.value;
      },
      set(val){
        this.$emit('input', val)
      }
    }
  },
  methods:{
    handlerBtnClick(e){
      this.$emit('btn-click',e)
    }
  }
};
</script>

<style>
</style>