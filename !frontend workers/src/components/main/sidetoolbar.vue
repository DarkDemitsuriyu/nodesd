<template>
  <v-toolbar card dense dark :style="{background:workerData.color}" :class="[workerData.theme,'vd-asidetoolbar']">
    <template v-if="collapsed">
      <v-spacer></v-spacer>
      <v-tooltip v-if="collapsed" bottom>
        <v-btn icon @click.stop="toggleClick" slot="activator">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <span>Развернуть</span>
      </v-tooltip>
      <v-spacer></v-spacer>
    </template>
    <template v-else>
      <v-spacer></v-spacer>
      <v-btn icon small @click.stop="toggleClick">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <span class="text-uppercase font-weight-black">Служба заявок</span>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </template>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
import { Avatar } from 'vue-avatar'
export default {
  name: 'vd-sidetoolbar',
  data() {
    return {
      isOpenMenu:false
    }
  },  
  components: {
    Avatar
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
    },
    hardwaresections(){
      return this.$store.getters.searchHardwareDirectorys
    }
  },
  methods: {
    toggleClick() {
      if (this.$store.state.settings.sideIsCollapsed) {
        this.$store.dispatch('sideExpand');
      } else {
        this.$store.dispatch('sideCollapse');
      }
    },
    toggleSettings(){
       this.$emit('toggle-settings')
    },
    handlerSelect(id, arrId, { $el: { textContent: title } }) {
      let isValue = true;
      let isLink = id.startsWith('http')

      this.mainTabs.forEach((elem, idx) => {
        if (elem.name === id) { isValue = false; }
      })
      if(isLink){
        this.data.forEach( el => {
          if(el.link === id){ title = el.name }
        })
      }
      if (isValue) {
        this.$store.dispatch('addMainTab', {
          title: title,
          name: id,
          closable: true,
          isLink:isLink
        });
      }
      this.$store.dispatch('setSelectedMainTab', id);
    }
  }
}
</script>

<style>
.vd-asidetoolbar .v-toolbar__content{
  padding:0px !important;
}
</style>
