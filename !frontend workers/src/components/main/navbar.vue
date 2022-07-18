<template>
  <v-toolbar flat light dense tabs color="white">
    <v-tabs :value="selected" show-arrows color="transparent" :style="{overflow:'hidden'}">
      <v-tab v-for="item in listTabs" :key="`tab-${item.id}`" :disabled="item.disabled" :href="`#${item.id}`" @click="handlerSelectTab(item.id)">
        {{ item.title }}
        <v-btn icon small v-if="item.closable" @click.stop="removeTab(item.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
    <v-divider vertical></v-divider>
    <vd-button-createtiket></vd-button-createtiket>
    <v-divider vertical></v-divider>
    <v-toolbar-items>
      <vd-button-notice></vd-button-notice>
      <vd-button-addressbook></vd-button-addressbook>
      <vd-button-settings></vd-button-settings>
      <vd-button-logout></vd-button-logout>
      <vd-button-profile></vd-button-profile>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'vd-navbar',
  computed: mapState({
      listTabs: state => state.maintabs.mainTabs,
      selected: state => state.maintabs.selectedMainTab
  }),
  methods: {
    handlerSelectTab(value){
      this.$store.commit('SET_SELECTED_MAIN_TAB', value)
    },
    removeTab(targetId) {
      let idx = this.listTabs.findIndex( tab => tab.id === targetId )
      if (this.selected === targetId) {
        let nextTab = this.listTabs[idx + 1] || this.listTabs[idx - 1]
        this.handlerSelectTab(nextTab.id)
      }      
      this.$store.commit('DELETE_MAIN_TAB', idx)
    }
  }
}
</script>

<style>

</style>
