<template>
  <v-menu :close-on-content-click="false" max-width="450px" min-width="410px" max-height="300px" left bottom offset-y offset-x v-model="isOpen">
    <v-btn slot="activator" class="mr-" icon v-model="isOpen">
      <v-badge overlap v-model="downData.length">
        <span slot="badge">{{ downData.length }}</span>
        <v-icon medium :class="btnClass">{{ downData.length > 0 ? 'mdi-bell-ring-outline' : 'mdi-bell-outline'}}</v-icon>
      </v-badge>
    </v-btn>
    <template v-if="downData.length>0">
      <v-list dense three-line class="ma-0 pa-0">
        <template v-for="item in downData">
          <v-list-tile :key="item.title" @click="listClick(item,$event)">
            <v-list-tile-content>
              <v-list-tile-title>
                <timeago :since="item.date"></timeago>
              </v-list-tile-title>
              <v-list-tile-sub-title>{{ item.text }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click.stop.prevent="closeClick(item,$event)">
                <v-icon class=" pink--text ">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider :key="item.title"></v-divider>
        </template>
      </v-list>
      <div style="position:sticky; bottom:0; width:100%; max-width:450px">
        <v-btn depressed block small class="ma-0" color="red" @click="closeAllClick">Очистить все</v-btn>
      </div> 
    </template>
    <div v-else class="pa-5 align-center white">
      <h3 v-localize="{i: 'nodata'}"></h3>
    </div>       
  </v-menu>
</template>

<script>
export default {
  name: 'vd-button-notice',
  computed: {
    btnClass() {
      return [
         "grey--text text--darken-2",
        this.downData.length > 0 ? 'ani-ring ani-slow' : ''
      ]
    },
    downData() {
      return this.$store.state.navbar.noticeData;
    }
  },
  data(){
    return {
      isOpen:false
    }
  },
  methods: {
    listClick(item, e) {
      let tiket = this.$store.getters.getTiketsShow(item.tiket);
      let id = 'tiket' + tiket.id;
      let isValue = true;
      this.$store.state.maintabs.mainTabs.forEach((elem, idx) => {
        if (elem.name === id) { isValue = false; }
      })
      
      if (isValue) {
        let data = {
          title: `№ ${tiket.id}`,
          id: id,
          name: 'tikets-view',
          newworker:tiket.newworker,
          view: true,
          data: tiket
        }
        console.log('data',data)
        this.$store.commit('ADD_MAIN_TAB',data)
      }
      this.$store.dispatch('setSelectedMainTab', id);
      this.closeClick(item)
      /*let type = item.ruk ? 'all' : 'my';
      let tiket = this.$store.getters.getTiketsToId(item.tiket, type)[0];
      let id = 'tiket' + tiket.id;
      let isValue = true;
      this.$store.state.maintabs.mainTabs.forEach((elem, idx) => {
        if (elem.name === id) { isValue = false; }
      })
      if (isValue) {
        this.$store.dispatch('addMainTab', {
          title: `${tiket.id} / ${tiket.topicname}`,
          name: id,
          view: true,
          closable: true
        });
      }
      this.$store.dispatch('setSelectedMainTab', id);
      this.$store.dispatch('deleteFromNoticeData', item);*/
    },
    closeClick(item, e) {
      this.$store.dispatch('deleteFromNoticeData', item);
      if(this.downData.length<=0){
        this.isOpen=false;
      }
    },
    closeAllClick(){
      this.$store.dispatch('deleteAllFromNoticeData');
      this.isOpen=false;
    }
  }
}
</script>

<style>

</style>