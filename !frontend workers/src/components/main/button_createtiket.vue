<template>
  <div>
    <v-tooltip bottom>
      <v-btn icon @click.stop.prevent="handlerOpenDialog" slot="activator">
        <v-icon color="pink lighten-2" medium>mdi-plus-circle-outline</v-icon>
      </v-btn>
      <span>Создать заявку</span>
    </v-tooltip>
    <vd-standart-tab-dialog v-model="showDialog" title="Создание заявки" :no-main-btn="messageShow" main-btn-text="Создать заявку" main-btn-icon="mdi-plus-circle" max-width="700px" overlay @btn-click="handlerBtnClick">
      <div v-if="messageShow" class="text-xs-center display-1">
        Номер вашей заявки
        <h1 class="red--text display-3">{{messageTiketId}}</h1>
      </div>
      <v-form v-else ref="form">
        <v-container grid-list-xl fluid class="pt-0">
          <v-layout row wrap>
            <v-flex xs6>
              <v-autocomplete label="Исполнитель" dense :items="listWorkers" item-value="id" item-text="name" v-model="tiketData.worker"></v-autocomplete>
            </v-flex>
            <v-flex xs6>
              <vd-standart-form-datepicker label="Выполнить до" v-model="tiketData.deadline"></vd-standart-form-datepicker>
            </v-flex>
            <v-flex xs12>
              <vd-standart-form-classifier-change v-model="tiketData.classifier" :rules="rules" required></vd-standart-form-classifier-change>
            </v-flex>
            <v-flex xs12>
              <v-textarea label="Описание" :rules="rules" v-model="tiketData.description" :rows="3" no-resize required></v-textarea>
            </v-flex>
            <v-flex xs6>
              <v-checkbox v-model="tiketIsCompleet" label="Выполнено"></v-checkbox>
            </v-flex>
            <v-flex xs6>
              <v-text-field label="Трудозатраты (В минутах)" hide-details v-model="tiketData.laborexpenditures" :disabled="!tiketIsCompleet" type="number" :min="1"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </vd-standart-tab-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex"
import moment from 'moment'
export default {
  name: 'vd-button-createtiket',
  data(){
    return {
      showDialog:false,
      messageShow:false,
      messageTiketId:null,
      rules: [ v => !!v || 'Не заполнено описание проблемы' ],
      tiketIsCompleet:false,
      tiketData:{
        worker: null,
        description:null,
        deadline:moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        classifier: null,
        laborexpenditures: 1,
        status:3
      }
    }
  },
  computed: {
    workerData(){
      let data = this.$store.state.worker_data.workerData || {}
      if(data){ this.tiketData.worker = data.login }
      return data
    },
    ...mapState({
      listWorkers: state => state.settings.lists.workers
    })
  },
  methods:{
    handlerOpenDialog(){
      this.messageShow = false
      this.messageTiketId = null
      this.tiketData.worker = this.workerData.login
      this.tiketData.description = null
      this.tiketData.deadline = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      this.tiketData.classifier = null
      this.tiketData.laborexpenditures = 1
      this.tiketData.status = 3
      this.tiketIsCompleet = false
      this.showDialog = true
      console.log()
      this.$refs.form.resetValidation()
    },
    handlerBtnClick(){
      let self = this
      if(this.$refs.form.validate()){
        let addingData = {
          senderfullname : `${this.workerData.surname} ${this.workerData.name} ${this.workerData.patronymic}`,
          sendername:this.workerData.name,
          sendersurname:this.workerData.surname,
          senderpatronymic:this.workerData.patronymic,
          sendermail:this.workerData.email,
          senderphone:this.workerData.internalphone,
          topicname:"Внутренняя заявка",
          sender:this.workerData,
          isMine: this.workerData.login === this.tiketData.worker
        }
        this.tiketData.status = this.tiketIsCompleet ? 1 : 3
        this.tiketData.new = !this.tiketIsCompleet
        this.$http.post(`/sendtiketself`,Object.assign(addingData, this.tiketData)).then(response => {
          self.messageShow = true
          self.messageTiketId = response.body.id
        });
      }
    }
  }
}
</script>

<style>

</style>
