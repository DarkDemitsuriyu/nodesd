<template>
  <v-toolbar dense class="white elevation-1">
    <template v-for="btn in toolbar">
      <v-tooltip bottom v-if="btn.show" :key="`vd-tiket-toolbar-btn-${btn.type}`">
        <v-btn small icon :disabled="btn.disabled" @click="handlerClick(btn.type)" slot="activator">
          <v-icon :color="btn.color">{{btn.icon}}</v-icon>
        </v-btn>
        <span>{{ btn.label }}</span>
      </v-tooltip>
      <!--<v-btn v-else-if="btn.show" :key="`vd-tiket-toolbar-btn-${btn.type}`" flat :color="btn.color" :disabled="btn.disabled" @click="handlerClick(btn.type)">
        <v-icon left>{{btn.icon}}</v-icon>
        {{ btn.label }}
      </v-btn>-->
    </template>
    <v-spacer></v-spacer>
    <v-menu :disabled="options.isDisabled" offset-y left :nudge-top="30">
      <v-tooltip top slot="activator">
        <v-btn icon small class="" :disabled="options.isDisabled" slot="activator">
          <v-icon class="blue--text">mdi-apps</v-icon>
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
    
    <vd-standart-tab-dialog v-model="postponeDialogShow" max-width="500px" @btn-click="handlerSavePostponeBtnClick">
      <v-form>
        <vd-standart-form-datepicker v-model="compPostpone" label="Отложить до" :min-date="minDate" :hide-details="false"></vd-standart-form-datepicker>
        <v-textarea v-model="postponeReason" label="Причина" :error="postponeReasonError" :error-messages="postponeReasonError ? 'Данное поле должно быть заполнено' : ''"></v-textarea>
      </v-form>
    </vd-standart-tab-dialog>

    <vd-standart-tab-dialog v-model="switchDialogShow" max-width="500px" @btn-click="handlerSaveSwitchBtnClick">
      <v-form>
        <v-autocomplete label="Исполнитель" dense :items="listWorkers" item-value="id" item-text="name" v-model="compWorker"></v-autocomplete>
      </v-form>
    </vd-standart-tab-dialog>
  </v-toolbar>
</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'vd-tikets-view-toolbar',
    props: ['options'],
    data(){
      return {
        postponeDialogShow:false,
        postpone:null,
        postponeReason:null,
        postponeReasonError:false,
        switchDialogShow:false,
        worker:null
      }
    },
    computed: {
      ...mapState({
        view: state => state.worker_data.workerData.tiketsview,
        listWorkers: state => state.settings.lists.workers
      }),
      minDate(){
        return moment(this.options.data.deadline).format('YYYY-MM-DD')
      },
      compWorker:{
        get(){
          return this.worker || this.options.data.worker
        },
        set(val){
          this.worker = val
        }
      },
      compPostpone:{
        get(){
          if(this.postpone){
            return this.postpone
          } else {
            return moment(this.options.data.postpone || this.options.data.deadline).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
          }          
        },
        set(val){
          this.postpone = val
        }
      },
      toolbar() {
        return [
          {type: 'complete', color: 'green',  icon: 'mdi-check-circle-outline', label: 'Выполнено',                     show:!this.options.newworker, disabled: this.options.isCompleted || !this.options.isMy},
          {type: 'refuse',   color: 'red',    icon: 'mdi-close-circle-outline', label: 'Отказать',                      show:true,                    disabled: this.options.isCompleted || !this.options.isMy},
          {type: 'postpone', color: 'orange', icon: 'mdi-update',               label: 'Отложить',                      show:true,                    disabled: this.options.isCompleted || (!this.options.isMy && !this.options.isAdmin)},
          {type: 'send',     color: 'blue', icon: 'mdi-send-circle-outline',  label: 'Отправить сообщение заявителю', show:!this.options.newworker, disabled: this.options.isCompleted || (!this.options.isMy && !this.options.isAdmin)},
          {type: 'switch',   color: 'purple', icon: 'mdi-account-switch',       label: 'Сменить исполнителя',           show:!this.options.newworker, disabled: this.options.isCompleted || (!this.options.isMy && !this.options.isAdmin)},          
          {type: 'undo',     color: 'cyan',   icon: 'mdi-reply',                label: 'Вернуть в работу',              show:!this.options.newworker, disabled: !this.options.isCompleted || !this.options.isAdmin},
          {type: 'print',    color: 'black',  icon: 'mdi-printer',              label: 'Распечатать',                   show:true,                    disabled: false}
        ]
      }     
    },
    methods: {
      handlerSavePostponeBtnClick(){
        if(!this.postponeReason && !this.options.isAdmin){
            this.postponeReasonError=true
            setTimeout(()=>{this.postponeReasonError=false},2000)
        } else {
          {{this.compPostpone}}
          this.$emit('dialog-save',{postpone:this.postpone || this.compPostpone, reason:this.postponeReason})
          this.postponeDialogShow = false
          this.postpone = null
          this.postponeReason = null
          this.postponeReasonError = false
        }
      },
      handlerSaveSwitchBtnClick(){
        if(this.worker){
          let data = {
            newWorkerLogin: this.worker,
            oldWorkerLogin: this.options.data.worker
          }
          this.$emit('dialog-save',data,true)
          this.worker = null
          this.switchDialogShow = false
          this.$store.commit('TIKET_LEFT_VIEW_SELECTED_DELETE')
        }
      },
      handlerClick(type){
        switch(type){
          case 'postpone':
            this.postponeDialogShow = true
            break
          case 'switch':
            this.switchDialogShow = true
            break
          case 'print':
            this.handlerPrintTiket()
            break
          case 'undo':
            this.$vdesk.sendTiketEdit({status: 'return'}, this.options.data)
            break
        }
        this.$emit('click',type)
      },
      handlerPrintTiket() {
        let workers = {}
        if (this.options.data.newworker) {
          this.options.data.confirmity.forEach( el => workers[el.workerfio] = true )
        } else {
          workers[this.options.data.workerFullName] = true
        }
        var newWindow = window.open('', '', 'width=800, height=600');
        var document = newWindow.document.open();
        var pageContent =
          `<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8"/>
              <title>Печать</title>
              <style>
                body{text-align:justify; font-size:13px;}
                td:first-child{text-align:right; width:150px; font-weight:bold;vertical-align:top;}
                ol{margin:0px;padding-left:12px;}
              </style>
            </head>
            <body>
              <table>
                <tr><td>№:</td><td>${this.options.data.id}</td></tr>
                <tr><td>Тема:</td><td>${this.options.data.topicname}</td></tr>
                <tr><td>Статус:</td><td>${this.options.data.tiketstatusname}</td></tr>
                <tr><td>Подразделение:</td><td>${this.$store.getters.getDepartmentName(this.options.data.department)}</td></tr>
                <tr><td>Отправитель:</td><td>${this.options.data.sender}</td></tr>
                <tr><td>${this.options.data.newworker ? 'Исполнители' : 'Исполнитель'}:</td><td>${Object.keys(workers).join(', ')}</td></tr>
                <tr><td>Дата создания:</td><td>${moment(this.options.data.startdate).format('DD.MM.YYYY HH:mm:ss')}</td></tr>
                <tr><td>Выполнить до:</td><td>${moment(this.options.data.deadline).format('DD.MM.YYYY HH:mm:ss')}</td></tr>
                ${this.options.data.enddate ? `<tr><td>Дата выполнения:</td><td>${moment(this.options.data.enddate).format('DD.MM.YYYY HH:mm:ss')}</td></tr>` : ''}
                <tr><td>Описание:</td><td>${this.options.data.description}</td></tr>
              </table>
            </body>
          </html>`;
        document.write(pageContent);
        document.close();
        newWindow.print();
      }
    }
  }
</script>

<style>
</style>