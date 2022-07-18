<template>
  <v-card>
    <v-btn block :disabled="isDisabled" flat :color="data.importance ? 'red' : 'teal'" @click="handlerImportance" :class="['ma-0',{'ani-flash':data.importance}]">
      <template v-if="data.importance">
        <v-icon class="">mdi-alert-decagram</v-icon>
        <span class="mx-2">{{ $locale({i: 'IMPORTANCE.HIGH'}) }}</span>
        <v-icon>mdi-alert-decagram</v-icon>
      </template>
      <span v-else>{{ $locale({i: 'IMPORTANCE.NORMAL'}) }}</span>
    </v-btn>
    <el-table :data="list" :show-header="false" style="width: 100%" size="mini" @cell-click="handlerCellClick" highlight-current-row border>
      <el-table-column class-name="sentence-capitalized vd-infocard-col-prop" prop="name" width="140" show-overflow-tooltip  />
      <el-table-column prop="field" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-clipboard="scope.row.field">{{scope.row.field}}</template>
        </template>
      </el-table-column>
    </el-table>

    <v-snackbar v-model="messageShow" multi-line color="info" top>
      {{ messageText }}
      <v-btn dark icon @click="messageShow = false"><v-icon>mdi-close</v-icon></v-btn>
    </v-snackbar>
    <!--<vd-tikets-view-infocard-item icon="mdi-account" :title="$locale({i: 'sender'})" :text="`${ data.sender }`" :copy-data="data.sender"></vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item :icon="data.newworker ? 'contact_phone' : 'mdi-phone-classic'" :title="$locale({i: 'contactphone'})" :text="`${ data.senderphone }`" :copy-data="data.senderphone"></vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item :icon="data.newworker ? 'contact_mail' : 'mdi-email-outline'" :title="$locale({i: 'email'})" :text="data.sendermail">
      <v-btn slot="right" small flat icon color="blue" class="ma-0" @click="handlerToggleMail">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item icon="mdi-city-variant" :title="$locale({i: 'department'})" :text="getDepartment(data.department)" :copy-data="getDepartment(data.department)"></vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item v-if="data.newworker" icon="place" :title="$locale({i: 'division'})" :text="data.divisionname" :copy-data="data.divisionname"></vd-tikets-view-infocard-item>
    <vd-tikets-view-infocard-item v-if="data.newworker" icon="person_pin_circle" :title="$locale({i: 'jobtitle'})" :text="data.jobtitlename" :copy-data="data.jobtitlename"></vd-tikets-view-infocard-item>
    <vd-tikets-view-infocard-item v-if="data.newworker" icon="people" :title="$locale({i: 'insteadof'})" :text="data.insteadof.length > 0 ? data.insteadof : 'Не указано'" :copy-data="data.insteadof.length > 0 ? data.insteadof : 'Не указано'"></vd-tikets-view-infocard-item>
    <vd-tikets-view-infocard-item v-if="data.newworker" icon="phone_in_talk" :title="$locale({i: 'cityphone'})" :text="data.addscityphone" :copy-data="data.addscityphone"></vd-tikets-view-infocard-item>
    <vd-tikets-view-infocard-item v-if="data.newworker" icon="phone" :title="$locale({i: 'internalphone'})" :text="data.addsinternalphone" :copy-data="data.addsinternalphone"></vd-tikets-view-infocard-item>
    <vd-tikets-view-infocard-item v-if="data.newworker" icon="event_note" :title="$locale({i: 'note'})" :text="data.addsnote" :copy-data="data.addsnote"></vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item v-if="!data.newworker" icon="mdi-desktop-classic" :title="$locale({i: 'computerName'})" :copy-data="data.sendercompname">
      <v-btn flat small :disabled="isDisabled" class="tikets-show__info-panel__btn orange--text btn-justify-left caption ma-0" @click="handleCommandAction(data.sendercompname, 'control')">{{data.sendercompname }}</v-btn>
    </vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item v-if="!data.newworker" icon="mdi-map-marker-outline" :title="$locale({i: 'ipAddress'})" :copy-data="data.senderip">
      <v-btn flat small :disabled="isDisabled" class="tikets-show__info-panel__btn orange--text btn-justify-left caption ma-0" @click="handleCommandAction(data.senderip, 'control')">{{ data.senderip }}</v-btn>
    </vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item icon="mdi-alarm-plus" :title="$locale({i: 'tikets.dateReceipt'})" :text="modeDate(data.startdate)" :copy-data="modeDate(data.startdate)"></vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item v-if="data.enddate" icon="mdi-alarm-check" :title="$locale({i: 'tikets.endDate'})" :text="modeDate(data.enddate)" :copy-data="modeDate(data.enddate)"></vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item icon="mdi-alarm-off" :title="$locale({i: 'tikets.deadlineCompletion'})" :copy-data="data.deadline">
      <template>
        <v-menu v-model="showDialogTimeout" :close-on-content-click="false" transition="scale-transition" offset-y min-width="500px">
          <v-btn slot="activator" flat block small :disabled="isDisabled" class="tikets-show__info-panel__btn orange--text btn-justify-left caption ma-0" @click="handleCommandAction(data.sendercompname, 'control')">{{ modeDate(data.deadline) }}</v-btn>
          <v-card>
            <v-card-text>
              <VueCtkDateTimePicker v-model="postpone.date" :minute-interval="10"  no-header format="YYYY-MM-DD HH:mm" no-button :min-date="new Date().toISOString().substr(0, 10)" inline />
              <v-textarea hide-details label="Причина" value=""></v-textarea>
            </v-card-text>
          </v-card>
        </v-menu>--
        <span v-if="postpone.menu===1" :class="(data.statusconfirm===5 && data.postpone) ? 'deep-orange--text' : ''">{{ modeDate(data.deadline) }}</span>
        <div v-if="postpone.menu===2">
          <v-menu v-model="showDialogTimeout" :close-on-content-click="false" transition="scale-transition" offset-y min-width="500px">
            <template v-slot:activator="{ on }">
              <v-text-field v-model="postpone.date" class="pr-2" :height="28" hide-details clearable solo append-icon="event" readonly v-on="on"></v-text-field>
            </template>
            <VueCtkDateTimePicker v-model="postpone.date" :minute-interval="10" format="DD.MM.YYYY HH:mm" output-format="YYYY-MM-DD HH:mm" no-button :min-date="new Date().toISOString().substr(0, 10)" inline />
          </v-menu>
        </div>
        <v-text-field v-if="postpone.menu===3" v-model="postpone.reason" :height="24" hide-details clearable solo></v-text-field>
        <el-date-picker v-if="postpone.menu===2" style="width:180px" :picker-options="postpone.options" size="mini" popper-class="postpone-datepicker" type="datetime" :format="postpone.format" v-model="postpone.date" :placeholder="$locale({i: 'dateSelect'})"></el-date-picker>--
        <el-input v-if="postpone.menu===3" :class="{'postpone-error':postpone.error}" style="width:180px" size="mini" :placeholder="$locale({i: 'setReason'})" v-model="postpone.reason"></el-input>-->
        <!--<span v-if="postpone.menu===1" :class="(data.statusconfirm===5 && data.postpone) ? 'deep-orange--text' : ''">{{ modeDate(data.deadline) }}</span>
        <el-date-picker v-if="postpone.menu===2" style="width:180px" :picker-options="postpone.options" size="mini" popper-class="postpone-datepicker" type="datetime" :format="postpone.format" v-model="postpone.date" :placeholder="$locale({i: 'dateSelect'})"></el-date-picker>
        <el-input v-if="postpone.menu===3" :class="{'postpone-error':postpone.error}" style="width:180px" size="mini" :placeholder="$locale({i: 'setReason'})" v-model="postpone.reason"></el-input>--
      </template>
      <template slot="right">
        <v-btn v-if="postpone.menu===1" flat icon small color="red" :disabled="isDisabled" class="ma-0" @click.native.stop="handlerPostpone(1)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn v-if="postpone.menu===2" flat icon small color="blue" :disabled="isDisabled" class="ma-0" @click.native.stop="handlerPostpone(2)">
          <v-icon>mdi-forward</v-icon>
        </v-btn>
        <v-btn v-if="postpone.menu===3" flat icon small color="green" :disabled="isDisabled" class="ma-0" @click.native.stop="handlerPostpone(3)">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </template>
    </vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item v-if="data.reactiontime" icon="mdi-timer" :title="$locale({i: 'tikets.reactionTime'})" :text="humanize(data.reactiontime)" :copy-data="humanize(data.reactiontime)"></vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item v-if="data.laborexpenditures" icon="mdi-timer" title="Трудозатраты" :text="`${data.laborexpenditures} минут(а/ы)`" :copy-data="data.laborexpenditures"></vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item v-if="!data.newworker" icon="mdi-account-outline" :title="$locale({i: 'tikets.performer'})" :copy-data="data.workerFullName">
      <template>
        <el-select v-if="worker.visible" v-model="worker.changed" size="mini">
          <el-option v-for="item in workersList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span v-else>{{ data.workerFullName }}</span>
      </template>
      <template slot="right">
        <v-btn v-if="worker.visible" flat icon small color="green" :disabled="isDisabled" class="ma-0" @click.native.stop="handlerChangeWorker">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn v-else flat icon small color="red" :disabled="isDisabled" class="ma-0" @click.native.stop="handlerChangeWorker">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </vd-tikets-view-infocard-item>-->
    <!--<vd-tikets-view-infocard-item v-if="data.classifiername" icon="mdi-book-variant" title="Классификатор" :text="data.classifiername" :copy-data="data.classifiername"></vd-tikets-view-infocard-item>-->
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  name: 'vd-tikets-view-infocard',
  props: ['data','isDisabled'],
  data(){
    return {
      importance: false,  
      showDialogTimeout:false,
      messageShow:false,
      messageText:null,
      postpone: {
        menu:1,
        error:false,
        format:'dd.MM.yyyy HH:mm:ss',
        date:'',
        reason: '',
        options:{
          firstDayOfWeek:1
        }
      },
      worker: {
        visible:false,
        changed:''
      }
    }
  },
  computed: {
    list(){
      let data = [
        { name:this.$locale({i: 'sender'}), field:this.data.sender },
        { name:this.$locale({i: 'contactphone'}), field:this.data.senderphone },
        { name:this.$locale({i: 'email'}), field:this.data.sendermail },
        { name:this.$locale({i: 'department'}), field:this.$store.getters.getDepartmentName(this.data.department)  },                
      ]
      if(this.data.newworker){
        data.push({ name:this.$locale({i: 'division'}), field:this.data.divisionname })
        data.push({ name:this.$locale({i: 'jobtitle'}), field:this.data.jobtitlename })
        data.push({ name:this.$locale({i: 'insteadof'}), field:this.data.insteadof.length > 0 ? this.data.insteadof : 'Не указано' })
        data.push({ name:this.$locale({i: 'cityphone'}), field:this.data.addscityphone })
        data.push({ name:this.$locale({i: 'internalphone'}), field:this.data.addsinternalphone })
        data.push({ name:this.$locale({i: 'note'}), field:this.data.addsnote })
      }
      if(!this.data.newworker) data.push({ name:this.$locale({i: 'computerName'}), field:this.data.sendercompname })
      if(!this.data.newworker) data.push({ name:this.$locale({i: 'ipAddress'}), field:this.data.senderip })
      data.push({ name:this.$locale({i: 'tikets.startdate'}), field:this.modeDate(this.data.startdate) })
      data.push({ name:this.$locale({i: 'tikets.deadline'}), field:this.modeDate(this.data.deadline), edited:true,type:'deadline' })
      if(this.data.enddate) data.push({ name: this.$locale({i: 'tikets.enddate'}), field: this.modeDate(this.data.enddate)})
      if(this.data.reactiontime) data.push({ name: this.$locale({i: 'tikets.reactiontime'}), field: this.humanize(this.data.reactiontime)})
      if(this.data.laborexpenditures) data.push({ name: this.$locale({i: 'tikets.laborexpenditures'}), field: this.data.laborexpenditures})
      if(!this.data.newworker) data.push({ name: this.$locale({i: 'tikets.performer'}), field: this.data.workerFullName, edited:true, type:'performer'})
      if(this.data.classifiername) data.push({ name: this.$locale({i: 'tikets.classifier'}), field: this.data.classifiername})
      return data
    },
    ...mapState({
      isAdmin: state => state.worker_data.isAdmin,
      workersList: state => state.settings.lists.workers
    })
  },
  created() {
    this.postpone.date = moment(this.data.postpone || this.data.deadline).format('YYYY-MM-DD HH:mm:ss')
    this.worker.changed = this.data.worker
  },
  methods: {
    handlerCellClick(row, column, cell, event){
      let self = this
      if(!row.edited){
        this.$copyText(row.field).then(e => {
          this.messageText = `Значение параметра "${row.name}" было скопировано в буфер обмена`,
          this.messageShow = true
        })
      }
    },
    humanize(second){
      return moment.duration(second, "second").humanize()
    },
    modeDate(data) {
      return this.$store.getters.momentData(data)
    },
    handlerImportance() {
      this.importance = !this.data.importance;
      this.sendEdit({importance:this.importance});
    },
    handlerPostpone(stage){
      switch(stage){
        case 1:
          this.postpone.menu=2
        break;
        case 2:
          if(moment(this.postpone.date).diff(moment(this.data.deadline)) > 0){
            this.postpone.menu=3
          } else {
            this.postpone.date=moment(this.data.postpone || this.data.deadline).format('YYYY-MM-DD HH:mm:ss')
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
      if(this.worker.visible && this.worker.changed!==this.data.worker){
        let data = {
          newWorkerLogin: this.worker.changed,
          newWorkerName: this.workersList.find((el) => { return el.id === this.worker.changed; }).name,
          oldWorkerName: this.data.workerFullName
        }
        this.sendEdit(data);
        this.$emit('close')
      }
      this.worker.visible=!this.worker.visible
    },
    handlerToggleMail(){
      this.$emit('mail-click')
    },
    sendEdit(data) {
      let send = Object.assign({tiket:this.data.id, worker: this.data.worker }, data);
      this.$socket.emit('tiket_edit', send);
    },
  }
}
</script>

<style>
.vd-tikets-view-infocard-item .v-text-field.v-text-field--solo .v-input__control{
  min-height:auto;
  font-size: 14px
}
.vd-infocard-col-prop{
  background:#FAFAFA;
  font-weight:600;
  
}
.tikets-show__info-panel table tr td:last-child{
  font-size:14px;
}
</style>
