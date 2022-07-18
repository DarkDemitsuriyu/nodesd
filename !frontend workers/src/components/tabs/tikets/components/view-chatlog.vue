<template>
  <v-card class="tikets-show__chat-panel">
      <v-text-field class="pa-0" style="z-index:1" :error="error" solo hide-details v-model="text" :disabled="disabled" :label="$t('enterTextMessage')" append-icon="mdi-send" @click:append="handlerSendChat"></v-text-field>
      <v-list dense style="overflow:auto; padding-top:5px;">
        <template v-for="log in value.logs">
          <v-list-tile :key="'log-' + log.id" @click="">

              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout>
                    <v-flex class="pr-2" align-self-center shrink><span>{{ $store.getters.momentData(log.date) }}</span></v-flex>
                    <v-flex align-self-center shrink><v-icon>mdi-chevron-right</v-icon></v-flex>
                    <v-flex class="pl-2" v-html="log.text"></v-flex>
                  </v-layout>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
        </template>
      </v-list>
      <!--<div style="overflow:auto; padding-top:5px;">
      <!--<v-alert outline :value="true" class="elevation-4" v-for="log in value.logs" :key="'log-' + log.id">
              <v-layout>
                <v-flex class="caption pa-2" align-self-center shrink><span>{{ $store.getters.momentData(log.date) }}</span> > </v-flex>
                <v-flex class="caption pa-2" v-html="log.text"></v-flex>
              </v-layout>
              <!--<div class="caption grey--text text--lighten-1 text-xs-right pr-2 py-1">
                <v-tooltip bottom>
                  <timeago :since="log.date" slot="activator"></timeago>
                  
                </v-tooltip>
              </div>
              <v-divider></v-divider>
              <div class="caption pa-2" v-html="log.text"></div>-->
            <!--</v-alert>-->
        <!--<v-timeline dense clipped class="mr-2" style="overflow:hidden">
          <v-timeline-item v-for="log in value.logs" :key="'log-' + log.id" color="pink" small>
            <v-tooltip bottom slot="icon">
              <v-avatar slot="activator" class="float:left" :username="log.who" :size="24" />
              <span>{{ log.who }}</span>
            </v-tooltip>
            <v-alert outline :value="true" class="elevation-4">
              <v-layout>
                <v-flex class="caption pa-2" align-self-center shrink><span>{{ $store.getters.momentData(log.date) }}</span> > </v-flex>
                <v-flex class="caption pa-2" v-html="log.text"></v-flex>
              </v-layout>
              <!--<div class="caption grey--text text--lighten-1 text-xs-right pr-2 py-1">
                <v-tooltip bottom>
                  <timeago :since="log.date" slot="activator"></timeago>
                  
                </v-tooltip>
              </div>
              <v-divider></v-divider>
              <div class="caption pa-2" v-html="log.text"></div>-->
            <!--</v-alert>
          </v-timeline-item>
        </v-timeline>
      </div>-->
    </v-card>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'vd-tikets-view-chatlog',
    props: ['list', 'value','disabled'],
    computed: {
      ...mapState({
        workerData: state => state.worker_data.workerData,
        workersList: state => state.settings.lists.workers
      })  
    },
    data(){
      return {
        text: '',
        error: false
      }
    },
    methods: {
      handlerSendChat() {
        if (this.text) {
          this.$socket.emit('send_tiket_chat', { text: this.text, tiket: this.value.id, date: moment(), worker: this.value.worker });
        } else {
          this.error = true;
          setTimeout(() => { this.error = false; }, 2000)
        }
      },
    },
    watch: {
      'value.id'(val) {
        this.text = ''
      }      
    }
  }
</script>

<style>
.tikets-show__description-list{
  grid-area: tikets-show__description-list !important;
}
.tikets-show__description-data{
  grid-area: tikets-show__description-data !important;
}
</style>