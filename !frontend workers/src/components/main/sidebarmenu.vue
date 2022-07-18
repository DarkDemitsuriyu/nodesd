<template>
  <el-menu :default-active="selectedMainTab" class="main-menu" background-color="#424242" text-color="#fff" @select="handlerSelect" :collapse="collapsed">
    <template v-for="menu in data">
      <el-submenu v-if="menu.children" :key="menu.id" :index="menu.link">
        <template slot="title">
          <v-icon color="white" v-if="collapsed">{{menu.icon}}</v-icon>
          <span slot="title">{{menu.name}}</span>
        </template>
        <el-menu-item-group>
          <span v-show="collapsed" slot="title" class="body-2 font-weight-bold white--text">{{menu.name}}</span>
          <v-divider v-show="collapsed" dark></v-divider>
          <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.link">
            <v-icon color="white">{{item.icon}}</v-icon>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item v-else :key="menu.id" :index="menu.link">
        <v-icon color="white">{{menu.icon}}</v-icon>
        <span slot="title">{{menu.name}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'vd-sidebar',
  data() {
    return {
      isOpenMenu:false,
      mini:true,
    }
  },
  computed: {
    ...mapState({
      workerData: state => state.worker_data.workerData,
      mainTabs: state => state.maintabs.mainTabs,
      collapsed: state => state.settings.sideIsCollapsed,
      selectedMainTab: state => state.maintabs.selectedMainTab
    }),
    data(){
      return this.$store.getters.getMySideMenu(this.$store.state.worker_data.workerData.groups)
    }
  },
  methods: {
    handlerSelect(id, arrId, { $el: { textContent: title } }) {
      let isExists = this.mainTabs.some( tab => tab.name === id)
      let tab = { title: title, id:id, name: id.startsWith('http') ? 'vd-frame' : id }
      if(!isExists) {
        this.$store.commit('ADD_MAIN_TAB', tab)
      }
      this.$store.dispatch('setSelectedMainTab', id);
    }
  }
}
</script>

<style>
ul.main-menu {
  height: 100%;
}
ul.main-menu:not(.el-menu--collapse) {
  width: 250px;
}
ul.main-menu.el-menu{
  border-right:0px;
}
ul.main-menu:not(.el-menu--collapse) .el-menu-item-group__title{
  padding:0px;
}
</style>
