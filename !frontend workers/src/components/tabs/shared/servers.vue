<template>
  <div class="shared-servers__main" v-loading="loading">
    <v-toolbar v-if="selectedData" dense class="shared-servers__toolbar white elevation-0">
      <v-toolbar-title><h3>{{selectedData.label}}</h3></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat icon :color="edit ? 'green' : 'orange'" @click="edit=!edit">
        <v-icon v-if="!edit">edit</v-icon>
        <v-icon v-else>save</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="shared-servers__tree box-card">      
      <el-button type="text" size="mini" icon="el-icon-circle-plus-outline" style="width:100%">
         Добавить сервер
      </el-button>
      <el-tree highlight-current :data="servers" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
    </div>
    
    <v-card class="shared-servers__view" style="border-top: 1px solid #dfe6ec; padding:0px;">
      <v-card-title v-if="selectedData" primary-title>
        
        <v-layout row wrap>
          <v-flex xs5 class="pa-2">
            <el-input :readonly="!edit" size="small" placeholder="Местоположение" v-model="selectedData.location">
              <template slot="prepend">Местоположение</template>
            </el-input>
          </v-flex>
          <v-flex xs4 class="pa-2">
            <el-input :readonly="!edit" size="small" placeholder="IP адрес" v-model="selectedData.ip">
              <template slot="prepend">IP адрес</template>
            </el-input>
          </v-flex>
          <v-flex xs3 class="pa-2">
            <el-input :readonly="!edit" size="small" placeholder="Количество лицензий" v-model="selectedData.numberOfLicense">
              <template slot="prepend">Количество лицензий</template>
            </el-input>            
          </v-flex>

          <v-flex xs5 class="pa-2">
            <el-input :readonly="!edit" size="small" placeholder="Операционная система" v-model="selectedData.OS">
              <template slot="prepend">Операционная система</template>
            </el-input>
          </v-flex>
          <v-flex xs4 class="pa-2">
            <el-input :readonly="!edit" size="small" placeholder="Модель/Тип" v-model="selectedData.modelTipe">
              <template slot="prepend">Модель/Тип</template>
            </el-input>
          </v-flex>
          <v-flex xs3 class="pa-2">
            <el-input :readonly="!edit" size="small" placeholder="ОЗУ" :value="modifyRAM(selectedData.RAM)">
              <template slot="prepend">ОЗУ</template>
            </el-input>
          </v-flex>

          <v-flex xs4 class="pa-2">
            <el-card class="box-card h-100">
              <div slot="header" class="clearfix">
                <el-button type="text" icon="el-icon-circle-plus-outline"></el-button>
                CPU
              </div>
              <el-tree :data="selectedData.CPU" ></el-tree>
            </el-card>
          </v-flex>
          <v-flex xs4 class="pa-2">
            <el-card class="box-card h-100">
              <div slot="header" class="clearfix">
                HDD
                <el-switch :disabled="!edit" style="float: right; display: block" v-model="selectedData.RAID" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                <span style="float: right; padding:3px 5px">RAID<span v-show="selectedData.RAID">(Уровень - {{selectedData.RAIDType}})</span></span>                
              </div>
              <el-tree :data="selectedData.HDD" ></el-tree>
            </el-card>
          </v-flex>
          <v-flex xs4 class="pa-2">
            <el-card class="box-card h-100">
              <div slot="header" class="clearfix">Функционал</div>
              <el-tree :data="selectedData.functionality" ></el-tree>
            </el-card>
          </v-flex>
          
          <v-flex xs12 class="pa-2">
            <el-input :readonly="!edit" type="textarea" :rows="3" placeholder="Примечание" :value="selectedData.note"></el-input>
          </v-flex>
        </v-layout>
      </v-card-title>
    </v-card>


  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "shared-servers",
  props:['id'],
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectedData: null,
      loading: false,
      edit:false
    };
  },
  computed: {
    ...mapState({
      servers: state => state.shared.servers,
    })
  },
  methods: {
    modifyRAM(ram){
      return ram >= 1024 ? `${ram / 1024}Гб` : `${ram}Мб`;
    },
    handleNodeClick(obj, tree, elem){
      this.selectedData = obj;
    }
  }
};
</script>

<style>
.shared-servers__main {
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "tree toolbar" "tree view";
}
.shared-servers__toolbar {
  grid-area: toolbar;
}
.shared-servers__tree {
  grid-area: tree;
  border-right: 1px solid #dfe6ec;
}
.shared-servers__tree .el-button
.shared-servers__view {
  grid-area: view;
  overflow: auto;
}
.el-input-group__prepend{
  width:183px;
  text-align:right;
}
.qe .el-input-group__prepend{
  width:20%;
  text-align:right;
}
</style>
