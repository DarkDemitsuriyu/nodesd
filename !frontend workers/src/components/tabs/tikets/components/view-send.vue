<template>
  <v-card class="tikets-show__comment-panel" height="300px">
    <v-layout fill-height column>
      <v-flex shrink>
        <v-system-bar window class="tikets-show__comment-panel-tools">
          <v-btn flat class="ma-0" :disabled="disabled" @click="sendCommentMail">
            <v-icon left class="mx-0">mdi-email</v-icon>
            Отправить
          </v-btn>
          <v-btn flat class="ma-0" :disabled="disabled" @click="sendCommentAttachmentClick">
            <v-icon left class="mx-0">mdi-paperclip</v-icon>
            Прикрепить
            <input class="d-none" @change="changeAttachmentFiles" ref="attachment-input" type="file" multiple>
          </v-btn>
        </v-system-bar>
      </v-flex>
      <v-flex class="overflow-hidden">
        <v-layout fill-height row align-content-space-around class="overflow-hidden">
          <v-flex>
            <v-textarea no-resize full-width hide-details v-model="text" :disabled="disabled" :placeholder="$t('enterTextMessage')"></v-textarea>
          </v-flex>
          <v-flex shrink>
            <v-divider vertical/>
          </v-flex>
          <v-flex xs5 v-if="filesList.length > 0" class="overflow-hidden">
            <v-layout fill-height column>
              <v-flex shrink>
                <v-subheader >Вложений - {{ filesList.length }} на {{ $vdesk.formatNumeral(filesSize,'0.0 b') }}</v-subheader>
                <v-divider />
              </v-flex>
              <v-flex style="overflow:auto;">
                <v-list dense>
                  <template v-for="item in filesList">
                    <v-list-tile :key="item.name">
                      <v-list-tile-content>
                        <v-list-tile-title>{{item.name}}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>{{ $vdesk.formatNumeral(item.size,'0.0 b') }}</v-list-tile-action>
                      <v-list-tile-action style="min-width:30px;">
                        <v-btn small icon ripple @click.native="removeAttachmentFiles(item)">
                          <v-icon color="grey lighten-1">mdi-close</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'vd-tikets-view-send',
    props: {
      value:[Array,Object],
      disabled:{ type: Boolean, default: false }
    },
    data(){
      return {
        text: '',
        filesList:[],
        filesSize:0,
        formData: new FormData()
      }
    },
    computed: mapState({
      workerData: state => state.worker_data.workerData,
      listWorkers: state => state.settings.lists.workers
    }),
    methods: {
      sendCommentMail() {
        if (this.text) {
          this.formData.append('id', this.value.id)
          this.formData.append('topic', this.value.topicname)
          this.formData.append('sendermail', this.value.sendermail)
          this.formData.append('worker', JSON.stringify(this.workerData))
          this.formData.append('description', this.value.description)
          this.formData.append('datestart', moment(this.value.startdate).format('DD.MM.YYYY HH:mm:ss'))
          this.formData.append('mail_msg', this.text)
          this.filesList.forEach( el => { this.formData.append(`mail_file[]`, el, el.name) })
          this.$http.post('/tiketSendMail', this.formData).then(({ data }) => {
            data.forEach(el => {
              el.who = el.worker;
              this.addLog(el)
            })
            this.$message.success('Комментарий отправлен!');
            this.text = ''
            this.filesList = []
            this.filesSize = 0
            this.formData = new FormData()
          })
        } else {
          this.$message.error('Не заполнено тело письма!');
        }
      },
      addLog(log) {
        this.$store.dispatch('addTiketLog', { id: this.value.id, log: log })
      },
      sendCommentAttachmentClick() {
        this.$refs['attachment-input'].click();
      },
      changeAttachmentFiles(e){
        let files = e.target.files
        for (let file of files) {
          let isExist = this.filesList.some( el => (el.name === file.name && el.size === file.size ) )
          if(!isExist){
            this.filesSize += file.size
            this.filesList.push(file)
          }
        }
      },
      removeAttachmentFiles(file) {
        this.filesList = this.filesList.filter( el => el.name != file.name )
        this.filesSize -= file.size
      }
    }
  }
</script>

<style>
.tikets-show__comment-panel .v-input.v-textarea,
.tikets-show__comment-panel .v-input.v-textarea .v-input__control,
.tikets-show__comment-panel .v-input.v-textarea .v-input__slot{
  height:100%;
}
</style>