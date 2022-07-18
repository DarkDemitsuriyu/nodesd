<template>
  <v-menu v-model="showMenu" :close-on-content-click="false" transition="scale-transition" offset-y max-height="300px" min-width="400px" max-width="400px">
    <template v-slot:activator="{ on }">
      <v-text-field label="Классификация" :rules="rules" :required="required" :value="text" :append-icon="showMenu ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click:append="showMenu = !showMenu" readonly v-on="on"></v-text-field>
    </template>
    <v-list dense>
      <template v-for="item in list">
        <v-list-group v-if="item.children" :key="item.id" v-model="item.active" no-action>
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          
          <v-list-tile v-for="subItem in item.children" :key="subItem.id" @click="handlerChange(subItem,item)">
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else :key="item.id" @click="handlerChange(item)">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "vd-standart-form-classifier-change",
  props:['value','rules','required'],
  data(){
    return {
      showMenu:false,
      text:''
    }
  },
  computed:mapState({
      list: state => state.directorys.classifier
    }),
  methods: {
    handlerChange(item,parent){
      this.text = parent ? `${parent.name}.${item.name}` : item.name
      this.showMenu = false
      this.$emit('input',item.id)
    }
  },
  watch:{
    value(val){
      if(!val) { this.text = ''}
    }
  }
};
</script>

<style>

</style>