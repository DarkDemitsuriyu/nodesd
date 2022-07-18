<template>
  <v-toolbar dense class="standart-tab__toolbar white elevation-1 mb-2">
    <!--<v-text-field solo flat single-line hide-details class="standart-tab__filter" label="Фильтр..." v-model="filterText" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
    <v-divider vertical></v-divider>-->
    <v-tooltip bottom>
      <v-btn slot="activator" icon @click="$emit('btn-click','add')">
        <v-icon color="green">mdi-file-plus</v-icon>        
      </v-btn>
      {{ $t('table.create') }}
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn slot="activator" icon @click="$emit('btn-click','edit')">
        <v-icon color="orange">mdi-file-document-edit</v-icon>        
      </v-btn>
      {{ $t('table.edit') }}
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn slot="activator" icon @click="$emit('btn-click','delete')">
        <v-icon color="red">mdi-file-remove</v-icon>
      </v-btn>
      {{ $t('table.delete') }}
    </v-tooltip>
    <v-tooltip v-if="printBtn" bottom>
      <v-btn slot="activator" icon @click="$emit('btn-click','print')">
        <v-icon color="blue">mdi-printer</v-icon>        
      </v-btn>
      {{ $t('table.print') }}
    </v-tooltip>
    <v-divider vertical></v-divider>
    <v-text-field solo flat hide-details class="standart-tab__filter" label="Фильтр..." v-model="filterText" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
    <v-spacer></v-spacer>
    
  </v-toolbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "vd-standart-tab-toolbar",
  props:{
    value:String,
    printBtn:{
      type:Boolean,
      default:false
    }
  },
  computed: {
    filterText:{
      get(){
        return this.value;
      },
      set(val){
        this.$emit('input', val)
      }
    }
  }
};
</script>

<style>
.standart-tab__filter{
  max-width:30%;
}
</style>