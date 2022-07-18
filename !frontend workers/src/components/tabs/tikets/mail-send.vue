<template>
  <div v-if="tiketData && tiketData && (view!=='none'|| inTab)" :class="['tikets-main-show',inTab ? 'px-2' : 'pb-2 px-2']">
    <v-card class="tikets-show__comment-panel">
      <v-system-bar window class="tikets-show__comment-panel-tools">
        <v-btn flat icon class="ma-0" :disabled="isDisabled" @click="sendCommentMail">
          <v-icon class="mx-0">mdi-email</v-icon>
        </v-btn>
        <v-btn flat icon class="ma-0" :disabled="isDisabled" @click="sendCommentAttachmentClick">
          <v-icon class="mx-0">mdi-paperclip</v-icon>
          <input class="d-none" @change="changeAttachmentFiles" ref="tikets-my-send-comment-attachment-input" type="file" multiple>
        </v-btn>
        <v-spacer></v-spacer>
        <span>{{ $locale({i: 'ReviewForSender'}) }}</span>
      </v-system-bar>
      <section class="tikets-show__comment-panel__text">
        <v-text-field full-width hide-details textarea v-model="comment.text" :disabled="isDisabled" :placeholder="$locale({i: 'enterTextMessage'})"></v-text-field>
        <div v-if="comment.attachment.filesList.length>0" class="tikets-show__comment-panel__attachment">
          <el-card>
            <div slot="header" class="clearfix">
              <span style="line-height: 36px;">Вложений - {{ comment.attachment.count }} на {{ comment.attachment.summText }}</span>
            </div>
            <el-upload multiple action="#" :auto-upload="false" :on-remove="removeAttachmentFiles" :file-list="comment.attachment.filesList"></el-upload>
          </el-card>
        </div>
      </section>
    </v-card>
    <iframe class="d-none" ref="protocolFrame"></iframe>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { Loading } from 'element-ui';
export default {
  name: 'vd-tikets-view-comment',
  props: {
    inTab: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    id: {
      type: String
    },
    value:Object
  },
  data() {
    return {
      chatSelected:'All',
      sendChat: {
        text: '',
        error: false
      },
      end: ['б', 'Кб', 'Мб', 'Гб'],
      comment: {
        text: '',
        attachment: {
          summ: 0,
          count: 0,
          subText: '',
          filesList: []
        },
        formData: new FormData()
      },
      confirmedData:{
        text:'',
        type:''
      },
      worker: {
        visible:false,
        changed:''
      },
      importance: false,
      postpone: {
        menu:1,
        error:false,
        format:'dd.MM.yyyy HH:mm:ss',
        date:'',
        reason: ''
      }
    }
  },
  computed: {
    ...mapState({
      view: state => state.worker_data.workerData.tiketsview,
      isAdmin: state => state.worker_data.isAdmin,
      workerData: state => state.worker_data.workerData,
      workersList: state => state.settings.lists.workers,
    }),
    postponeClass(){
      return (this.tiketData.statusconfirm===5 && this.tiketData.postpone) ? 'deep-orange--text' : ''//
    },
    importanceColor(){
      return this.tiketData.importance ? 'red' : 'teal'
    },
    senderFullname(){
      return `${this.tiketData.sendersurname} ${this.tiketData.sendername} ${this.tiketData.senderpatronymic}`
    },
    tiketID() {
      return this.id
    },
    confirmed() {
      if (this.isAdmin && !this.isMy && this.tiketData.statusconfirm) {
        switch (this.tiketData.statusconfirm) {
          case 2:
            this.confirmedData.text = `Заявлен отказ в этой заявке.<br> Причина: ${this.tiketData.solution}`;
            this.confirmedData.type = 'refuse';
            return true;
          case 5:
            this.confirmedData.text = `Сотрудник хочет отложить эту заявку до ${this.modeDate(this.tiketData.postpone)}.<br> Причина: ${this.tiketData.postponereason}`;
            this.confirmedData.type = 'postpone';
            return true;
        }        
      } else {
        return false
      }
    },
    tiketData() {
      let data = this.value || this.$store.getters.getTiketsShow(this.type, this.tiketID);
      if(data){
        this.postpone.date = new Date(data.postpone || data.deadline)
        this.worker.changed = data.worker
      }
      return data;
    },
    solution: {
      get() {
        return this.tiketData.solution
      },
      set(value) {
        this.$store.dispatch('editTiketData', { field: 'solution', value: value, type: this.type, id: this.tiketData.id });
      }
    },
    toolbar() {
      let self=this;
      return [
        {
          id: 'tiket-complete',
          label: 'Выполнено',
          disabled: this.isCompleted || (!this.isMy && !this.isAdmin),
          color: 'green',
          icon: 'mdi-check-circle-outline',
          action() {
            self.sendEdit({status: 'complete', solution: self.solution})
            self.closeTiket();
          }
        },
        {
          id: 'tiket-refuse',
          label: 'Отказать',
          disabled: this.isCompleted || (!this.isMy && !this.isAdmin),
          color: 'red',
          icon: 'mdi-close-circle-outline',
          action() {
            const h = self.$createElement;
            if (self.solution) {
              self.sendEdit({status: 'refuse', solution: self.solution})
              self.closeTiket();
            } else {
              self.$msgbox({
                type: 'error',
                title: 'Внимание!',
                message: h('p', null, [
                  h('span', null, 'Не заполнено '),
                  h('b', null, 'Решение'),
                  h('span', null, '!')
                ]),
                confirmButtonText: 'OK'//' !', '',
              });
            }
          }
        },
        {
          id: 'tiket-undo',
          label: 'Вернуть в работу',
          disabled: !this.isCompleted || !this.isAdmin,
          color: 'cyan',
          icon: 'mdi-reply',
          action() {
            self.sendEdit({status: 'return'})
          }
        },
        {
          id: 'tiket-print',
          label: 'Распечатать',
          disabled: false,
          color: 'black',
          icon: 'mdi-printer',
          action() {
            self.$store.dispatch('printTiket', Object.assign({ workerFioLong: `${self.workerData.surname} ${self.workerData.name} ${self.workerData.patronymic}` }, self.tiketData));
          }
        }
      ]
    },  
    isCompleted() {
      return this.tiketData.status < 3;
    },
    isMy() {
      if (!!this.tiketData) {
        return this.workerData.login === this.tiketData.worker;
      }
    },
    isDisabled() {
      return this.isCompleted || (!this.isMy && !this.isAdmin)
    },
    workerFullname() {
      return `${this.workerData.surname} ${this.workerData.name.charAt(0)}.${this.workerData.patronymic.charAt(0)}.`
    }
  },
  methods: {
    humanize(second){
      return moment.duration(second, "second").humanize()
    },
    handlerPostpone(stage){
      switch(stage){
        case 1:
          this.postpone.menu=2
        break;
        case 2:
          if(moment(this.postpone.date).diff(moment(this.tiketData.deadline)) > 0){
            this.postpone.menu=3
          } else {
            this.postpone.date=new Date(this.tiketData.postpone || this.tiketData.deadline)
            this.postpone.menu=1
          }          
        break;
        case 3:
          if(!this.isAdmin && !this.postpone.reason){
            this.postpone.error=true
            setTimeout(()=>{this.postpone.error=false},2000)
          } else {
            let data={
              postpone:this.postpone.date,
              reason:this.postpone.reason
            }
            this.sendEdit(data);
            this.postpone.menu=1
          }          
        break;
      }
    },
    handlerChangeWorker(){
      if(this.worker.visible && this.worker.changed!==this.tiketData.worker){
        let data = {
          newWorkerLogin: this.worker.changed,
          newWorkerName: this.workersList.find((el) => { return el.id === this.worker.changed; }).name,
          oldWorkerName: this.tiketData.workerfio
        }
        this.sendEdit(data);
        this.closeTiket()
      }
      this.worker.visible=!this.worker.visible
    },
    handlerImportance() {
      this.importance = !this.tiketData.importance;
      this.sendEdit({importance:this.importance});
    },
    handlerConfirm(type, check) {
      let sendStatus = (status) => {
        this.$socket.emit('edittiketstatus', Object.assign({}, this.tiketData, { status: status }));
      }
      switch (type) {
        case 'postpone':
          this.sendEdit({confirm: check,postpone: this.tiketData.postpone})
          break;
        case 'refuse':
          if (check) {
            this.sendEdit({status: 'confirmrefuse'})
          } else {
            this.sendEdit({status: 'noconfirmrefuse'})
          }
          break;
      }
    },    
    handlerActionBtn(command) {
      let link = this.tiketData.sendercompname === 'Неизвестен' ? this.tiketData.senderip : this.tiketData.sendercompname;
      this.handleCommandAction(link, command);
    },
    handleCommandAction(link, command, event) {
      switch (command) {
        case 'control':
          this.$refs.protocolFrame.src = `radmin://${link}`
          break;
        default:
          this.$refs.protocolFrame.src = `radmin://${link}/${command}`
          break;
      }
    },
    handlerSendChat() {
      if (this.sendChat.text) {
        this.$socket.emit('send_tiket_chat', { text: this.sendChat.text, tiket: this.tiketData.id, date: moment(), worker: this.tiketData.worker });
      } else {
        this.sendChat.error = true;
        setTimeout(() => { this.sendChat.error = false; }, 2000)
      }
    },
    attachmentName(attach, idx) {
      let ext = attach.split('.')[3];
      return `Вложение_${idx}.${ext}`;
    },
    closeTiket() {
      if(this.inTab){
        this.$store.dispatch('deleteMainTab', `tiket${this.tiketData.id}`);  
      } else {
        
      }
    },
    sendEdit(data) {
      let send = Object.assign({tiket:this.tiketData.id, worker: this.tiketData.worker }, data);
      this.$socket.emit('tiket_edit', send);
    },
    modeDate(data) {
      return this.$store.getters.momentData(data)
    },
    attachClick(name, attachment) {
      window.open(`/getFile?type=tiketsAttachment&file=${attachment}&newname=${name}`, 'attachment', 'menubar =no,toolbar=no,location =no,status =no')
    },
    setSize(size, bit = 0) {
      if (size > 1024) {
        size = ((size / 1024).toFixed(2)) * 1;
        bit++;
        return this.setSize(size, bit);
      } else {
        return `${size}${this.end[bit]}`;
      }
    },
    addLog(log) {
      this.$store.dispatch('addTiketLog', { id: this.tiketData.id, log: log, type: this.type })
    },
    sendCommentMail() {
      if (this.comment.text) {
        let loadingInstance = Loading.service();
        this.comment.formData.append('id', this.tiketData.id)
        this.comment.formData.append('topic', this.tiketData.topicname)
        this.comment.formData.append('sendermail', this.tiketData.sendermail)
        this.comment.formData.append('worker', JSON.stringify(this.workerData))
        this.comment.formData.append('description', this.tiketData.description)
        this.comment.formData.append('datestart', moment(this.tiketData.startdate).format('DD.MM.YYYY HH:mm:ss'))
        this.comment.formData.append('mail_msg', this.comment.text)
        this.$http.post('/tiketSendMail', this.comment.formData).then(({ data }) => {
          loadingInstance.close();
          data.forEach(el => {
            el.who = el.worker;
            this.addLog(el)
          })
          this.$message.success('Комментарий отправлен!');
          this.comment.text = ''
          this.comment.attachment = {
            summ: 0,
            count: 0,
            subText: '',
            filesList: []
          }
          this.comment.formData = new FormData()
        });
      }
      else {
        this.$message.error('Не заполнено тело письма!');
      }
    },
    sendCommentAttachmentClick() {
      this.$refs['tikets-my-send-comment-attachment-input'].click();
    },
    changeAttachmentFiles(e) {
      let files = e.target.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let sizeText = this.setSize(files[i].size);
          let fileName = `(${sizeText})${files[i].name}`;
          let isValue = true;
          this.comment.attachment.filesList.forEach(function(f, i) {
            if (f.name === fileName) {
              isValue = false;
              return false;
            }
          }, this);
          if (isValue) {
            this.comment.attachment.summ += files[i].size;
            this.comment.attachment.filesList.push({ name: fileName, size: files[i].size, sizeText: sizeText });
          }
          this.comment.formData.append(`mail_file[]`, files[i], files[i].name)
        }
        this.comment.attachment.count = this.comment.attachment.filesList.length;
        this.comment.attachment.summText = this.setSize(this.comment.attachment.summ);
      }
    },
    removeAttachmentFiles(file, fileList) {
      this.comment.attachment.filesList.forEach(function(f, i) {
        if (f.name === file.name) {
          this.comment.attachment.filesList.splice(i, 1);
          this.comment.attachment.count = this.comment.attachment.filesList.length;
          this.comment.attachment.summ -= file.size;
          this.comment.attachment.summText = this.setSize(this.comment.attachment.summ);
        }
      }, this)
    }
  },
  watch: {
    tiketID(val) {
      this.sendChat.text = ''
      this.comment = {
        text: '',
        attachment: {
          summ: 0,
          count: 0,
          subText: '',
          filesList: []
        },
        formData: new FormData()
      }
    }
  }
}
</script>

<style>
.tikets-main-show {
  grid-area: cont;
  grid-template-rows: min-content 48px auto minmax(50px, max-content) 1fr minmax(250px, auto);/*minmax(120px, 1fr) minmax(50px, 1fr) minmax(250px, 1fr);*/
  grid-template-columns: 1fr 300px;
  grid-gap: 0.5rem;
  grid-template-areas:
    "tikets-show__header tikets-show__header"
    "tikets-show__toolbar tikets-show__info-panel"
    "tikets-show__description-panel tikets-show__info-panel"
    "tikets-show__solution-panel tikets-show__info-panel"
    "tikets-show__solution-panel tikets-show__chat-panel"
    "tikets-show__comment-panel tikets-show__chat-panel";
  display: grid;
  width: auto;
  overflow: hidden;
}
@media screen and (max-height:1045px) {
  .tabs-tikets-main, .tikets-main-show {
    overflow: auto;
  }
}
@media screen and (max-width:600px) {
  /*.tikets-main-show {
    background: blue;
  }*/
}
@media only screen and (min-width:600px) and (max-width:960px) {
  /*.tikets-main-show {
    background: yellow;
  }*/
  .tabs-tikets-main {
    overflow: auto;
  }
  .tikets-main-show {
    grid-area: cont;
    grid-template-rows: auto auto auto auto 250px 240px;
    grid-template-columns: 2fr 1fr;
    grid-gap: 0.5rem;
    grid-template-areas:
      "tikets-show__header tikets-show__header"
      "tikets-show__toolbar tikets-show__toolbar"
      "tikets-show__info-panel tikets-show__info-panel"
      "tikets-show-down-tabs tikets-show-down-tabs"
      "tikets-show__chat-panel tikets-show__chat-panel";
    display: grid;
    width: auto;
    overflow: visible;
  }
}
@media only screen and (min-width:960px) and (max-width:1163px) {
  .tikets-main-show {
    grid-template-rows: min-content 1fr auto auto 150px 200px;
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      "tikets-show__header tikets-show__toolbar"
      "tikets-show__description-panel tikets-show__description-panel"
      "tikets-show__solution-panel tikets-show__solution-panel"
      "tikets-show__info-panel tikets-show__info-panel"
      "tikets-show__comment-panel tikets-show__comment-panel"
      "tikets-show__chat-panel tikets-show__chat-panel";
    overflow: auto;
  }
  .tikets-show__header{
    vertical-align: middle;
  }
}
@media only screen and (min-width:1163px) and (max-width:1265px) {
  .tikets-main-show {
    grid-template-rows: min-content 1fr 150px 200px;
    grid-template-areas:
      "tikets-show__header tikets-show__toolbar"
      "tikets-show__description-panel tikets-show__info-panel"
      "tikets-show__solution-panel tikets-show__chat-panel"
      "tikets-show__comment-panel tikets-show__comment-panel";
    overflow: auto;
  }
}
@media only screen and (min-width:1265px) and (max-width:1450px) {
  .tikets-main-show {
    grid-template-rows: min-content min-content 1fr 1fr 150px 200px;
    grid-template-areas:
      "tikets-show__header tikets-show__info-panel"
      "tikets-show__toolbar tikets-show__info-panel"
      "tikets-show__description-panel tikets-show__info-panel"
      "tikets-show__solution-panel tikets-show__info-panel"
      "tikets-show__comment-panel tikets-show__comment-panel"
      "tikets-show__chat-panel tikets-show__chat-panel";
    overflow: auto;
  }
}
@media only screen and (min-width:1450px) and (max-width:1960px) {
  
}
@media only screen and (min-width:1960px) {
  /*.tikets-main-show {
    background: green;
  }*/
}
.tikets-show__header{
  grid-area: tikets-show__header;
  width:100%;
}
.tikets-show__toolbar{
  grid-area: tikets-show__toolbar;
}
.tikets-show__info-panel{
  grid-area: tikets-show__info-panel;
}
.tikets-show__info-panel__btn {
  width: 100%;
  margin: 2px;
  height: 20px !important;
}
.tikets-show__info-panel .postpone-error > input{
  border-color:red;
}
.tikets-show__info-panel table{
  width:100%;
}
.tikets-show__info-panel table td:nth-child(2){
  border-right: 4px solid white;
}
.tikets-show__info-panel table td:nth-child(1),.tikets-show__info-panel table td:nth-child(3){
  width:28px;
}
.tikets-show__description-panel {
  grid-area: tikets-show__description-panel;
}
.tikets-show__description-panel__attachment{
  position:relative !important;
}
.tikets-show__description-panel__attachment .btn__content {
  padding: 0px 5px;
}
.tikets-show__solution-panel {
  grid-area: tikets-show__solution-panel;
}
.tikets-show__comment-panel {
  grid-area: tikets-show__comment-panel;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas: "tikets-show__comment-panel-tools" "tikets-show__comment-panel__text";
}
.tikets-show__comment-panel-tools {
  grid-area: tikets-show__comment-panel-tools;
  position: relative;
  height: 36px !important;
}
.tikets-show__comment-panel__text {
  grid-area: tikets-show__comment-panel__text;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: "comment attachment";
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
}
.tikets-show__comment-panel__attachment {
  grid-area: attachment;
  overflow: hidden;
}
.tikets-show__comment-panel__attachment>.el-card {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}
.tikets-show__comment-panel__attachment .el-card__header {
  padding: 3px 20px !important;
}
.tikets-show__comment-panel__attachment .el-card__header>.clearfix>span {
  line-height: 20px !important;
}
.tikets-show__comment-panel__attachment .el-card__body {
  padding: 0px;
  width: 200px;
  overflow: auto;
}
.tikets-show__comment-panel__attachment .el-upload--text {
  display: none;
}
.tikets-show__comment-panel__attachment .el-upload-list__item {
  margin: 0px;
}
.tikets-show__solution-panel>.input-group, .tikets-show__comment-panel__text .input-group{
  height: 100%;
  padding:0px;
}
.tikets-show__solution-panel .input-group__details, .tikets-show__comment-panel__text .input-group__details{
  display: none !important;
}
.input-group textarea::-webkit-input-placeholder{color:#b5b5b5;}
.input-group textarea::-moz-placeholder{color:#b5b5b5;}
.input-group textarea:-moz-placeholder{color:#b5b5b5;}
.input-group textarea:-ms-input-placeholder{color:#b5b5b5;}
.tikets-show__solution-panel textarea, .tikets-show__comment-panel__text textarea{
  resize: none !important;
  padding:16px !important;
}
.tikets-show__chat-panel{
  grid-area: tikets-show__chat-panel;
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  height: 100%;
}
.tikets-show__chat-panel>.el-card__header {
  padding: 10px 20px;
}
.tikets-show__chat-panel>.el-card__body {
  padding: 0px;
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;
}
.tikets-show__chat-panel__input {
  width: 100% !important;
}
.tikets-show__chat-panel__list {
  overflow: auto;
}
.btn-justify-left .btn__content {
  justify-content: left;
  padding-left: 0px;
}
.border-red{
  border: 1px solid red;
}
.tikets-show__chat-panel .el-tabs__content{
  margin:0px;
  padding:0px;
}
</style>
