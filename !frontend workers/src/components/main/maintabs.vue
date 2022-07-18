<template>
<div id="maintabs-div">
  <!--<template v-if="selectedItem.view" >
    <tikets-view-new-worker v-if="selectedItem.newworker" :id="selectedItem.name.replace('tiket','')" :value="selectedItem.data" :type="selectedItem.name" :in-tab="true"></tikets-view-new-worker>
    <tikets-view v-else :value="selectedItem.data" :type="selectedItem.name" :in-tab="true" @close="handlerTiketViewClose"></tikets-view>
  </template>-->
  <!--<iframe v-if="selectedItem.isLink" :src="selectedItem.name" class="w-100 h-100"></iframe>-->
  <keep-alive>    
    <component :is="selectedItem.name" :item="selectedItem" :id="selectedItem.id" :value="selectedItem.data" :type="selectedItem.name" :in-tab="true"></component>
  </keep-alive>
    <!--<el-tabs class="grey lighten-3 vdesk-maintabs" v-model="selected" type="border-card" @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane v-for="item in listTabs" :key="item.name" :closable="item.closable" :label="item.title" :name="item.name" :disabled="item.disabled">
        <template v-if="item.view" >
          <tikets-view-new-worker v-if="item.newworker" :id="item.name.replace('tiket','')" :value="item.data" :type="item.name" :in-tab="true"></tikets-view-new-worker>
          <tikets-view v-else                           :id="item.name.replace('tiket','')" :value="item.data" :type="item.name" :in-tab="true"></tikets-view>
        </template>
        <iframe v-if="item.isLink" :src="item.name" class="w-100 h-100"></iframe>
        <vd-component v-else v-once :name="item.name" :show="!item.isLink && !item.view"></vd-component>
      </el-tab-pane>
    </el-tabs>-->
    
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'vd-maintabs',
  data(){
    return {

    }
  },
  computed: {
    ...mapState({
      workerData: state => state.worker_data.workerData,
      listTabs: state => state.maintabs.mainTabs,
      selected: state => state.maintabs.selectedMainTab,
      tabDefaultOptions: state => state.maintabs.tabDefaultOptions,
    }),
    selectedItem(){
      let data = this.tabDefaultOptions
      if(this.selected){
        data = this.listTabs.find( el => el.id === this.selected )
      }
      return data
    }/*,
    selected: {
      get() {
        return this.$store.state.maintabs.selectedMainTab;
      },
      set(value) {
        this.$store.commit('SET_SELECTED_MAIN_TAB', value)
      }
    }*/
  },
  methods: {
    handlerTiketViewClose(id){
      this.$store.dispatch('deleteMainTab', `tiket${id}`); 
    },
    removeTab(targetName) {
      let tabs = this.listTabs;
      let activeName = this.selected;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.$store.dispatch('setSelectedMainTab', activeName);
      this.$store.dispatch('setMainTabs', tabs.filter(tab => tab.name !== targetName));
    }/*,
    clickTab(item, e) {
      this.$store.dispatch('setSelectedMainTab', item.name);
    }*/
  }
}
</script>

<style>
#maintabs-div{
  height:100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
}
.v-tabs__div a:focus{
  text-decoration: none;
}
.vdesk-maintabs {
  height:100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
}
.vdesk-maintabs > .el-tabs__header {
  overflow: hidden;
}
.vdesk-maintabs > .el-tabs__content {
  padding: 0px !important;
  overflow: hidden;
}
.vdesk-maintabs > .el-tabs__content > .el-tab-pane {
  overflow: hidden;
  height: 100%;
}
.vdesk-maintabs-tikets {
  grid-area: table;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem;
  grid-template-areas: "cont";
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
