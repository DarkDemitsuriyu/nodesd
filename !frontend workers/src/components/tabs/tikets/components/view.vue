<template>
  <div :class="showMainClass">
    <vd-tikets-view-confirmed   v-if="confirmed" class="tikets-show__header" :value="tiketData" @click="handlerConfirm" />
    <vd-tikets-view-toolbar     class="tikets-show__toolbar" :options="toolbarOpt" @click="handlerToolbarClick" @dialog-save="handlerToolbarDialogSave" />
    <vd-tikets-view-infocard    class="tikets-show__info-panel pa-0" :data="tiketData" :is-disabled="isDisabled" @mail-click="commentPanelShow = !commentPanelShow" @close="closeTiket" />
    <vd-tikets-view-description :value="tiketData" :disabled="isDisabled" @save="sendEdit"/>
    <vd-tikets-view-chatlog     :value="tiketData" :disabled="isDisabled" @save="sendEdit"/>
    <vd-tikets-view-attachments class="tikets-show__attachments-panel" :list="tiketData.attachment" :id="tiketData.id" />

    <vd-standart-tab-dialog v-model="commentPanelShow" :title="$locale({i: 'ReviewForSender'})" no-main-btn no-min-btn max-width="800px">
      <vd-tikets-view-send slot="main" :value="tiketData" :disabled="isDisabled" />
    </vd-standart-tab-dialog>

    <vd-standart-tab-dialog v-model="completeDialogShow" max-width="500px" @btn-click="handlerBtnStatusClick">
      <v-form ref="form">
        <v-text-field label="Трудозатраты (В минутах)" v-model="laborexpenditures" type="number" :min="1" />
        <v-textarea label="Решение по заявке" v-model="solution" :rules="rules" :rows="3" no-resize />
      </v-form>
    </vd-standart-tab-dialog>
    
    <vd-standart-tab-dialog v-model="classifierDialogShow" overlay @btn-click="handlerBtnClassifierClick">
      <vd-standart-form-classifier-change v-model="classifierDataChanged" />
    </vd-standart-tab-dialog>

    <iframe class="d-none" ref="protocolFrame"></iframe>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'tikets-view',
    props: {
      inTab: {
        type: Boolean,
        default: false
      },
      value:Object
    },
    data() {
      return {
        rules: [ v => !!v || 'Поле не должно быть пустым' ],
        completeDialogShow:false,
        classifierDialogShow:false,
        commentPanelShow:false,
        laborexpenditures:1,
        classifierDataChanged:null,
        compleetStatus:"complete"
      }
    },
    computed: {
      ...mapState({
        view: state => state.worker_data.workerData.tiketsview,
        isAdmin: state => state.worker_data.isAdmin,
        workerData: state => state.worker_data.workerData,
        workersList: state => state.settings.lists.workers
      }),
      showMainClass(){
        return {
          'vd-tikets-show--in-tab':this.inTab,
          'vd-tikets-show--confirmed':this.confirmed,
          'vd-tikets-show--newworker':this.tiketData.newworker,
          'vd-tikets-show--attachments':this.tiketData.attachment,
          'vd-tikets-show':true          
          }
      },
      toolbarOpt(){
        return {
          inTab:this.inTab,
          isDisabled:this.isDisabled,
          isMy:this.isMy,
          isCompleted:this.isCompleted,
          isAdmin:this.isAdmin,
          newworker:this.tiketData.newworker,
          data:this.value
        }
      },
      confirmed() {
        return this.isAdmin && !this.isMy && this.tiketData.statusconfirm
      },
      tiketData() {
        let data = this.value
        if(data){
          this.classifierDialogShow = !data.classifiername && !data.newworker ? true : false
        }      
        return data;
      },
      solution: {
        get() {
          return this.tiketData.solution
        },
        set(value) {
          this.$store.dispatch('editTiketData', { field: 'solution', value: value, id: this.tiketData.id });
        }
      },
      isCompleted() {
        return this.tiketData.status < 3;
      },
      isMy() {
        let isValid = true
        if (!!this.tiketData) {
          if(this.tiketData.newworker){
            isValid = isValid && this.tiketData.confirmity.some( el => el.worker===this.workerData.login)
          } else {
            isValid = isValid && this.workerData.login === this.tiketData.worker
          }
          return isValid
        }
      },
      isDisabled() {
        return this.isCompleted || (!this.isMy && !this.isAdmin)
      }      
    },
    mounted(){
      if(this.value.new && this.isMy){
        this.$socket.emit('tiketinfo', this.value.id)
      }
    },
    methods: {
      handlerToolbarClick(type){
        this.$refs.form.resetValidation()
        switch(type){
          case 'complete':
          case 'refuse':
            this.compleetStatus = type
            this.completeDialogShow = true
            break
          case 'send':
            this.commentPanelShow = true
            break
        }
      },
      handlerToolbarDialogSave(data,change){
        this.sendEdit(data)
      },
      handlerBtnStatusClick(){
        if(this.compleetStatus === 'refuse' && !this.$refs.form.validate()){
          return false
        }
        this.sendEdit({status: this.compleetStatus, solution: this.solution, isMine: this.tiketData.isMine, laborexpenditures: this.laborexpenditures})
        this.completeDialogShow = false
        this.closeTiket()
      },
      handlerBtnClassifierClick(){
        this.sendEdit({classifier: this.classifierDataChanged})
        this.classifierDataChanged = null
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
      closeTiket() {
        this.$store.commit('TIKET_LEFT_VIEW_SELECTED_DELETE')
        this.$emit('close',this.tiketData.id)
      },
      sendEdit(data) {
        this.$vdesk.sendTiketEdit(data, this.tiketData)
      }
    },
    watch: {
      'value.id'(val) {
        if(this.value.new && this.isMy){
          this.$socket.emit('tiketinfo', this.value.id);
        }
      }      
    }
  }
</script>

<style>
  .vd-tikets-show{
    margin-top:7px;
    padding:0px 3px;
    overflow:hidden;
    display: grid !important;
    width: auto !important;
    max-height: 100% !important;
    grid-gap: 0.5rem !important;
    grid-template-rows: 48px minmax(200px,auto) auto minmax(50px,1fr);
    grid-template-columns: 2fr minmax(300px,1fr);
    grid-template-areas: 
      "tikets-show__toolbar tikets-show__info-panel"
      "tikets-show__description-panel tikets-show__info-panel"
      "tikets-show__attachments-panel tikets-show__info-panel"
      "tikets-show__chat-panel tikets-show__chat-panel";
  }
  .vd-tikets-show.vd-tikets-show--confirmed{
    grid-template-rows: auto 48px min-content minmax(50px,1fr);
    grid-template-areas:
      "tikets-show__header tikets-show__header"
      "tikets-show__toolbar tikets-show__info-panel"
      "tikets-show__description-panel  tikets-show__info-panel"
      "tikets-show__attachments-panel tikets-show__info-panel"      
      "tikets-show__chat-panel tikets-show__chat-panel";
  }
  .vd-tikets.top .vd-tikets-show.vd-tikets-show--newworker{
    grid-template-rows: 48px min-content minmax(250px,2fr);
  }
  .vd-tikets.top .vd-tikets-show{
    overflow:auto;
    padding-left:3px;
    grid-template-rows: 48px min-content minmax(250px,2fr);
  }
  .vd-tikets-show--in-tab{
    padding:6px 6px 0px 6px;
  }
  /*
  @media only screen and (min-width:960px) and (max-width:1163px) {
    .tikets-main-show {
      grid-template-rows: min-content 1fr auto auto 150px 200px !important;
      grid-template-columns: 2fr 1fr !important;
      grid-template-areas:
        "tikets-show__header tikets-show__toolbar"
        "tikets-show__description-panel tikets-show__description-panel"
        "tikets-show__solution-panel tikets-show__solution-panel"
        "tikets-show__info-panel tikets-show__info-panel"
        "tikets-show__comment-panel tikets-show__comment-panel"
        "tikets-show__chat-panel tikets-show__chat-panel" !important;
      overflow: auto;
    }
    .tikets-show__header{
      vertical-align: middle !important;
    }
  }*/
  .tikets-show__header{
    grid-area: tikets-show__header !important;
    width:100% !important;
  }
  .tikets-show__toolbar{
    grid-area: tikets-show__toolbar !important;
  }
  .tikets-show__info-panel{
    grid-area: tikets-show__info-panel !important;
    overflow: auto !important;
  }
  .vd-tikets-show .tikets-show__description-panel, .vd-tikets-show.vd-tikets-show--newworker .tikets-show__description-panel{
    grid-area: tikets-show__description-panel !important;
    text-align:justify;
  }
  .vd-tikets-show.vd-tikets-show--newworker .tikets-show__description-panel {
    display: grid !important;
    grid-template-rows: 1fr;
    grid-template-columns: minmax(300px,1fr) 2fr;
    grid-template-areas: "tikets-show__description-list tikets-show__description-data";
  }
  .tikets-show__solution-panel {
    grid-area: tikets-show__solution-panel !important;
    display:none;
  }
  .tikets-show__chat-panel{
    grid-area: tikets-show__chat-panel !important;
    overflow:hidden;
    display:grid;
    grid-template-rows: min-content 1fr;
  }
  .tikets-show__elements-list{
    grid-area: tikets-show__elements-list !important;
    overflow:hidden;
  }
  .tikets-show__elements-data{
    grid-area: tikets-show__elements-data !important;
  }
  .tikets-show__attachments-panel{
    grid-area: tikets-show__attachments-panel !important;
  }
</style>