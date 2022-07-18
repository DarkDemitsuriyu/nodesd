<template>
  <div v-if="tiketData && tiketData && (view!=='none'|| inTab)" class="tikets-main-show pa-2">
    <!--<v-alert warning v-model="confirmed" class="tikets-show__header">
      <div class="title">
        <b v-html="confirmedData.text"></b>
      </div>
      <v-btn small color="success" @click="handlerConfirm(confirmedData.type,true)">{{ $locale({i: 'iagree'}) }}</v-btn>
      <v-btn small color="error" @click="handlerConfirm(confirmedData.type,false)">{{ $locale({i: 'disagree'}) }}</v-btn>
    </v-alert>-->
    <!--{{ isCompleted }}
    {{ isDisabled }}
    {{ !isAdmin }}
    {{ tiketData.status }}-->
    <v-toolbar dense class="tikets-show__toolbar white elevation-1">
      <v-toolbar-title class="ml-1">
        <v-chip class="blue lighten-1 white--text"><b>{{ tiketData.id }}</b></v-chip>
      </v-toolbar-title>
      <template v-for="btn in toolbar">
        <v-tooltip bottom v-if="view==='left' && !inTab" :key="btn.id">
          <v-btn small light icon flat :color="btn.color" :disabled="btn.disabled" @click="btn.action" slot="activator">
            <v-icon>{{btn.icon}}</v-icon>
          </v-btn>
          <span>{{ btn.label }}</span>
        </v-tooltip>
        <v-btn light flat v-else :key="btn.id" :color="btn.color" :disabled="btn.disabled" @click="btn.action">
          <v-icon left>{{btn.icon}}</v-icon>
          {{ btn.label }}
        </v-btn>
      </template>
      <v-spacer></v-spacer>
      <v-menu :disabled="isDisabled" offset-y left :nudge-top="30">
        <v-tooltip top slot="activator">
          <v-btn icon small class="" :disabled="isDisabled" slot="activator">
            <v-icon class="blue--text">apps</v-icon>
          </v-btn>
          <span>Управление</span>
        </v-tooltip>
        <v-list dense>
          <v-list-tile @click="handlerActionBtn('file')">
            <v-list-tile-title>Передача файлов</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="handlerActionBtn('telnet')">
            <v-list-tile-title>Telnet</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card class="tikets-show__info-panel pa-1" style="overflow:auto;">
      <v-btn block :disabled="isDisabled" flat small :color="importanceColor" @click="handlerImportance" class="ma-0">
        <template v-if="tiketData.importance">
          <v-icon class="red--text text--darken-2">error_outline</v-icon>
          <span class="mx-2">{{ $locale({i: 'IMPORTANCE.HIGH'}) }}</span>
          <v-icon class="red--text text--darken-2">error_outline</v-icon>
        </template>
        <span v-else>{{ $locale({i: 'IMPORTANCE.NORMAL'}) }}</span>
      </v-btn>
      <table class="text-secondary">
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">contact_phone</v-icon>
              <span class="capital">{{ $locale({i: 'contactphone'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ tiketData.senderphone }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.senderphone">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">contact_mail</v-icon>
              <span class="capital">{{ $locale({i: 'email'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ tiketData.sendermail }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.sendermail">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">person</v-icon>
              <span class="capital">{{ $locale({i: 'sender'}) }}</span>
            </v-tooltip> 
          </td>
          <td>
            {{ tiketData.sendersurname }} {{ tiketData.sendername }} {{ tiketData.senderpatronymic }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="senderFullname">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">location_city</v-icon>
              <span class="capital">{{ $locale({i: 'department'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ getDepartment(tiketData.department) }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.depname">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">place</v-icon>
              <span class="capital">{{ $locale({i: 'division'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ tiketData.divisionname }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.divisionname">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">person_pin_circle</v-icon>
              <span class="capital">{{ $locale({i: 'jobtitle'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ tiketData.jobtitlename }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.jobtitlename">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <!--<v-icon class="teal--text text--darken-2" slot="activator">transfer_within_a_station</v-icon>-->
              <v-icon class="teal--text text--darken-2" slot="activator">people</v-icon>
              <span class="capital">{{ $locale({i: 'insteadof'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ tiketData.insteadof.length > 0 ? tiketData.insteadof : "Не указано" }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.insteadof">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">phone_in_talk</v-icon>
              <span class="capital">{{ $locale({i: 'cityphone'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ tiketData.addscityphone }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.addscityphone">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">phone</v-icon>
              <span class="capital">{{ $locale({i: 'internalphone'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ tiketData.addsinternalphone }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.addsinternalphone">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr v-if="tiketData.addsnote.length>0">
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">event_note</v-icon>
              <span class="capital">{{ $locale({i: 'note'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ tiketData.addsnote }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="tiketData.addsnote">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">alarm_add</v-icon>
              <span class="capital">{{ $locale({i: 'tikets.dateReceipt'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ modeDate(tiketData.startdate) }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="modeDate(tiketData.startdate)">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr v-if="tiketData.enddate">
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">alarm_on</v-icon>
              <span class="capital">{{ $locale({i: 'tikets.endDate'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            {{ modeDate(tiketData.enddate) }}
          </td>
          <td>
            <v-btn small flat icon color="blue" class="ma-0" v-clipboard="modeDate(tiketData.enddate)">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-tooltip left>
              <v-icon class="teal--text text--darken-2" slot="activator">alarm_off</v-icon>
              <span class="capital">{{ $locale({i: 'tikets.deadlineCompletion'}) }}</span>
            </v-tooltip>
          </td>
          <td>
            <span v-if="postpone.menu===1">{{ modeDate(tiketData.deadline) }}</span>
            <el-date-picker v-if="postpone.menu===2" style="width:180px" size="mini" popper-class="postpone-datepicker" type="datetime" :format="postpone.format" v-model="postpone.form.postpone" :placeholder="$locale({i: 'dateSelect'})"></el-date-picker>
            <el-input v-if="postpone.menu===3" style="width:180px" size="mini" :placeholder="$locale({i: 'setReason'})" v-model="postpone.form.reason"></el-input>
          </td>
          <td>
            <v-btn v-if="postpone.menu===1" flat icon small :disabled="isDisabled" color="red" class="ma-0" @click.native.stop="postpone.menu = 2">
              <v-icon>mode_edit</v-icon>
            </v-btn>
            <v-btn v-if="postpone.menu===2" flat icon small :disabled="isDisabled" color="blue" class="ma-0" @click.native.stop="postpone.menu = 3">
              <v-icon>arrow_forward</v-icon>
            </v-btn>
            <v-btn v-if="postpone.menu===3" flat icon small :disabled="isDisabled" color="green" class="ma-0" @click.native.stop="postpone.menu = 1">
              <v-icon>done</v-icon>
            </v-btn>
          </td>
        </tr>
      </table>
    </v-card>
    <v-card class="tikets-show__description-panel">
      <v-system-bar window class="tikets-show__description-panel__attachment grey lighten-4">
        {{tiketData.description}}
      </v-system-bar>
        <v-container fluid class="pt-1 pb-2 px-3">
          <table class="w-100">
            <tr v-for="(item,index) in tiketData.confirmity" :key="item.id">
              <td class="v-align-bottom">
                <v-select style="min-width:200px" :disabled="(item.worker!=workerData.login && isDisabled) || item.status===1" hide-details v-bind:items="workersList" :label="item.equipmentname" v-model="equipments[index].worker" item-text="name" item-value="id"></v-select><!--  append-icon="compare_arrows" :append-icon-cb="handlerChangeWorker" -->
              </td>
              <td class="v-align-bottom">
                <v-text-field :disabled="(item.worker!=workerData.login && isDisabled) || item.status===1" counter name="input-1-3" label="Заметка" v-model="equipments[index].note" hide-details></v-text-field><!-- append-icon="done" :append-icon-cb="handlerSendChat" -->
              </td><!-- multi-line :rows="1"  -->
              <td style="vertical-align:bottom; width:72px;">
                <v-btn :disabled="equipments[index].worker===item.worker || item.status===1" small icon flat color="blue" class="ma-0 ml-2" @click="handlerChangeWorker(index)">
                  <v-icon>compare_arrows</v-icon>
                </v-btn>
                <v-btn v-if="item.status!==1" :disabled="item.worker!=workerData.login && isDisabled" small icon flat color="green" class="ma-0 ml-1" @click="handlerCompleetEquipment(index)">
                  <v-icon>done</v-icon>
                </v-btn>
                <v-btn v-if="item.status===1" :disabled="item.worker!=workerData.login && isDisabled" small icon flat color="red" class="ma-0 ml-1" @click="handlerCompleetEquipment(index)">
                  <v-icon>undo</v-icon>
                </v-btn>
              </td>
            </tr>
          </table>
        </v-container>
    </v-card>
    <v-card class="tikets-show__solution-panel">
      <v-text-field full-width hide-details multi-line v-model="solution" :disabled="isDisabled" :placeholder="$locale({i: 'enterProblemSolution'})"></v-text-field>
    </v-card>      
    <v-card class="tikets-show__comment-panel">
      <v-system-bar window class="tikets-show__comment-panel-tools">
        <v-btn flat icon class="ma-0" :disabled="isDisabled" @click="sendCommentMail">
          <v-icon class="mx-0">mail</v-icon>
        </v-btn>
        <v-btn flat icon class="ma-0" :disabled="isDisabled" @click="sendCommentAttachmentClick">
          <v-icon class="mx-0">attach_file</v-icon>
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

    <v-card class="tikets-show__chat-panel elevation-1" shadow="never">
      <div class="tikets-show__chat-panel__input">
        <v-text-field class="pa-0" :error="sendChat.error" solo hide-details v-model="sendChat.text" :disabled="isDisabled" :label="$locale({i: 'enterTextMessage'})" append-icon="mdi-send" :append-icon-cb="handlerSendChat"></v-text-field>
      </div>
      <el-tabs v-model="chatSelected" type="border-card" tab-position="bottom" style="border:0px;">
        <el-tab-pane label="Все" name="All" class="ma-0">
          <template v-for="log in tiketData.logs">
              <el-row :gutter="10" :key="log.date" class="ma-2">
                <!--<el-col :push="tiketData.workerfio!==log.who ? 20 : 0" :span="4">
                  <avatar :username="log.who" :size="30"></avatar>
                </el-col>-->
                <el-col :pull="tiketData.workerfio!==log.who ? 0 : 0" :span="24" class="elevation-2 pa-1">
                  <span class="caption green--text d-inline-flex">
                    <avatar class="float:left" :username="log.who" :size="30"></avatar>
                    <div class="pa-2">{{ log.who }}:</div>
                  </span>
                  <v-divider></v-divider>
                  <div class="caption" v-html="log.text"></div>
                  <span class="caption grey--text text--lighten-1" style="float:right">
                    <v-tooltip bottom>
                      <timeago :since="log.date" slot="activator"></timeago>
                      <span>{{ modeDate(log.date) }}</span>
                    </v-tooltip>                
                  </span>
                </el-col>
              </el-row>
          </template>        
        </el-tab-pane>
        <el-tab-pane label="Логи" name="Logs" class="ma-0">
          <template v-for="log in tiketData.logs">
              <el-row :gutter="10" :key="log.date" class="ma-2">
                <!--<el-col :push="tiketData.workerfio!==log.who ? 20 : 0" :span="4">
                  <avatar :username="log.who" :size="30"></avatar>
                </el-col>-->
                <el-col :pull="tiketData.workerfio!==log.who ? 0 : 0" :span="24" class="elevation-2 pa-1">
                  <span class="caption green--text d-inline-flex">
                    <avatar class="float:left" :username="log.who" :size="30"></avatar>
                    <div class="pa-2">{{ log.who }}:</div>
                  </span>
                  <v-divider></v-divider>
                  <div class="caption" v-html="log.text"></div>
                  <span class="caption grey--text text--lighten-1" style="float:right">
                    <v-tooltip bottom>
                      <timeago :since="log.date" slot="activator"></timeago>
                      <span>{{ modeDate(log.date) }}</span>
                    </v-tooltip>                
                  </span>
                </el-col>
              </el-row>
            </template>
        </el-tab-pane>
        <el-tab-pane label="Чат" name="Chat" class="ma-0">
          <template v-for="log in tiketData.logs">
              <el-row :gutter="10" :key="log.date" class="ma-2">
                <!--<el-col :push="tiketData.workerfio!==log.who ? 20 : 0" :span="4">
                  <avatar :username="log.who" :size="30"></avatar>
                </el-col>-->
                <el-col :pull="tiketData.workerfio!==log.who ? 0 : 0" :span="24" class="elevation-2 pa-1">
                  <span class="caption green--text d-inline-flex">
                    <avatar class="float:left" :username="log.who" :size="30"></avatar>
                    <div class="pa-2">{{ log.who }}:</div>
                  </span>
                  <v-divider></v-divider>
                  <div class="caption" v-html="log.text"></div>
                  <span class="caption grey--text text--lighten-1" style="float:right">
                    <v-tooltip bottom>
                      <timeago :since="log.date" slot="activator"></timeago>
                      <span>{{ modeDate(log.date) }}</span>
                    </v-tooltip>                
                  </span>
                </el-col>
              </el-row>
            </template>
        </el-tab-pane>
      </el-tabs>
    </v-card>
<!--
    <el-card class="tikets-show__chat-panel elevation-1">
      <div slot="header" class="clearfix">
        <span>Журнал/Чат</span>
      </div>
      <div class="tikets-show__chat-panel__list pa-0 chat" v-chat-scroll>
        <template v-for=" log in tiketData.logs">
          <el-row :gutter="10" :key="log.date" class="ma-2">
            <el-col :push="tiketData.workerfio!==log.who ? 20 : 0" :span="4">
              <avatar :username="log.who" :size="30"></avatar>
            </el-col>
            <el-col :pull="tiketData.workerfio!==log.who ? 4 : 0" :span="20" class="elevation-2 pa-1">
              <span class="caption green--text">{{ log.who }}:</span>
              <v-divider></v-divider>
              <div class="" v-html="log.text"></div>
              <span class="caption grey--text text--lighten-1" style="float:right">
                <timeago :since="log.date"></timeago>
              </span>
            </el-col>
          </el-row>
        </template>
      </div>
      <div class="tikets-show__chat-panel__input">
        <v-text-field class="pa-0" :error="sendChat.error" solo hide-details v-model="sendChat.text" :disabled="isDisabled" :label="$locale({i: 'enterTextMessage'})" append-icon="send" :append-icon-cb="handlerSendChat"></v-text-field>
      </div>
    </el-card>-->
    <iframe class="d-none" ref="protocolFrame"></iframe>
  </div>
  
</template>

<script>
import { Avatar } from 'vue-avatar'
import moment from 'moment'
import { mapState } from 'vuex'
import { Loading } from 'element-ui';
export default {
  name: 'tikets-view-new-worker',
  components: {
    Avatar
  },
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
    }
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
      equipments:[],
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
      departmentsData: state => state.directorys.departments,
      isAdmin: state => state.worker_data.isAdmin,
      workerData: state => state.worker_data.workerData,
      workersList: state => state.settings.lists.workers
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
      let data = this.$store.getters.getTiketsShow(this.type, this.tiketID);
      if(data){
        this.postpone.date = new Date(data.postpone || data.deadline)
        let isValid=true
        console.log(data.confirmity)
        this.equipments = data.confirmity//.map( el => {worker:el.worker,note:el.note} )
        /*data.confirmity.forEach((el,idx)=>{
          if(this.equipments.length>0 && isValid){
            if(this.equipments[idx].worker!==el.worker) this.equipments[idx].worker=el.worker
          } else {
            isValid=false
            this.equipments.push({worker:el.worker,note:el.note})//,id:el.id,equipment:el.equipment,equipmentname:el.equipmentname
          }                    
        })*/
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
          id: 'tiket-refuse',
          label: 'Отказать',
          disabled: this.isCompleted || (!this.isMy && !this.isAdmin),
          color: 'red',
          icon: 'clear',
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
          id: 'tiket-print',
          label: 'Распечатать',
          disabled: false,
          color: 'black',
          icon: 'print',
          action() {
            self.$store.dispatch('printTiket', Object.assign({ workerFioLong: `${self.workerData.surname} ${self.workerData.name} ${self.workerData.patronymic}` }, self.tiketData));
          }
        }
      ]
    },
    isCompleted() {
      return this.tiketData.status < 3;
    },
    /*isMy() {
      if (!!this.tiketData) {
        return this.tiketData.confirmity.some((el)=>{
            return el.worker === this.workerData.login
        })
      }
    },*/
    isDisabled() {
      return this.isCompleted && !this.isAdmin//(!this.isMy && )
    },
    workerFullname() {
      return `${this.workerData.surname} ${this.workerData.name.charAt(0)}.${this.workerData.patronymic.charAt(0)}.`
    }
  },
  methods: {
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
    handlerCompleetEquipment(index){
      let editData=this.equipments[index]
      let someData=this.tiketData.confirmity[index]
      let newWorker=this.workersList.find((el)=>{
        return el.id===editData.worker
      })
      let data={
        compleet:true,
        conformity:someData.id,
        tiket:this.tiketData.id,
        equipment:someData.equipment,
        equipmentname:someData.equipmentname,
        worker:someData.worker,
        note:editData.note
      }
      this.sendEdit(data);
    },
    handlerChangeWorker(index){
      let editData=this.equipments[index]
      let someData=this.tiketData.confirmity[index]
      let newWorker=this.workersList.find((el)=>{
        return el.id===editData.worker
      })
      let oldWorker=this.workersList.find((el)=>{
        return el.id===someData.worker
      })
      let data={
        conformity:someData.id,
        tiket:this.tiketData.id,
        equipment:someData.equipment,
        equipmentname:someData.equipmentname,
        newWorkerConfirmation: editData.worker,
        oldWorkerConfirmation: oldWorker.id,
        newWorkerFullname:newWorker.name,
        oldWorkerFullname:oldWorker.name
      }
      this.sendEdit(data);
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
    getDepartment(sid){
      let department = this.departmentsData.find( el => el.sid === sid*1 )
      if(!department){
        return "Неизвестно"
      }
      return department.name
    },
    attachmentName(attach, idx) {
      let ext = attach.split('.')[3];
      return `Вложение_${idx}.${ext}`;
    },
    closeTiket() {
      if(this.inTab){
        this.$store.dispatch('deleteMainTab', `tiket${this.tiketData.id}`);  
      }     
    },
    sendEdit(data) {
      let send = Object.assign({tiket:this.tiketData.id }, data);
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
/*.tikets-main-show {
  grid-area: cont;
  grid-template-rows: min-content 48px auto minmax(50px, max-content) 1fr minmax(250px, auto);/*minmax(120px, 1fr) minmax(50px, 1fr) minmax(250px, 1fr);*
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
}*//*
@media screen and (max-height:1045px) {
  .tabs-tikets-main, .tikets-main-show {
    overflow: auto;
  }
}
@media screen and (max-width:600px) {
  /*.tikets-main-show {
    background: blue;
}*//*
}
@media only screen and (min-width:600px) and (max-width:960px) {
  /*.tikets-main-show {
    background: yellow;
}*//*
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
}*//*
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
.tikets-show__info-panel table, .tikets-show__description-panel table{
  width:100%;
}
/*.tikets-show__info-panel table td:nth-child(2){
  border-right: 4px solid white;
}
.tikets-show__info-panel table td:nth-child(1),.tikets-show__info-panel table td:nth-child(3){
  width:28px;
}*//*
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
.tikets-show__solution-panel textarea, .tikets-show__comment-panel__text textarea, .tikets-show__description-panel textarea{
  resize: none !important;  
}
.tikets-show__solution-panel textarea, .tikets-show__comment-panel__text textarea{
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
}*/

</style>
