<template>
  <div class="tikets-main-list">    
    <v-toolbar class="tikets-main-list-filter white elevation-0" light dense>
      <v-text-field single-line hide-details label="Быстрый фильтр..." v-model="filters.filterInput" :append-icon="filters.filterInput ? 'clear' : 'search'" :append-icon-cb="() => (filters.filterInput='')"></v-text-field>
      <v-spacer v-if="view!=='left'"></v-spacer>
      <div :slot="view==='left' ? 'extension' : $slots.default">
        <v-menu class="" offset-y :close-on-content-click="false">
          <div slot="activator">
            Статусы<v-icon>keyboard_arrow_down</v-icon>
          </div>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-action>
                <v-checkbox hide-details :indeterminate="filters.statuses.isIndeterminate" v-model="filters.statuses.checkAll" @change="handlerStatusesCheckAllChange"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Все</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="statuse in filters.statuses.list" :key="statuse.id" >
              <v-list-tile-action>
                <v-checkbox color="red" @change="handlerCheckedStatusesChange" hide-details :value="statuse.id" v-model="filters.statuses.checkList"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{statuse.title}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>      

        <v-menu class="" offset-y :close-on-content-click="false">
          <div slot="activator">
            Доп. параметры<v-icon>keyboard_arrow_down</v-icon>
          </div>
          <v-list dense>            
            <v-list-tile v-for="item in filters.additionalOptions.list" :key="item.id" @click="handlerCheckedAdditionalOptionsChange(item.id)">
              <v-list-tile-title>
                <v-icon v-if="filters.additionalOptions.checkList===item.id">radio_button_checked</v-icon>
                <v-icon v-else>radio_button_unchecked</v-icon>
                {{item.title}}
              </v-list-tile-title>
            </v-list-tile>
          </v-list>          
        </v-menu>

        <v-menu class="" offset-y :close-on-content-click="false">
          <div slot="activator">
            Даты<v-icon>keyboard_arrow_down</v-icon>
          </div>
          <v-card>
            <div class="pa-2" style="line-height: 36px;">
              Выполнить до<br>
              <el-date-picker popper-class="tikets-filter-date-picker" v-model="filters.dates.deadline" :format="filters.dates.format" :type="filters.dates.type" :picker-options="filters.dates.pickerOptions" placeholder="Выполнить до"></el-date-picker>
            </div>
            <div class="pa-2" style="line-height: 36px;">
              Дата подачи заявки<br>
              <el-date-picker popper-class="tikets-filter-date-picker" v-model="filters.dates.startdate" :format="filters.dates.format" :type="filters.dates.type" :picker-options="filters.dates.pickerOptions" placeholder="Дата подачи заявки"></el-date-picker>
            </div>
            <div class="pa-2" style="line-height: 36px;">
              Дата выполнения заявки<br>
              <el-date-picker popper-class="tikets-filter-date-picker" v-model="filters.dates.enddate" :format="filters.dates.format" :type="filters.dates.type" :picker-options="filters.dates.pickerOptions" placeholder="Дата выполнения заявки"></el-date-picker>
            </div>
          </v-card>          
        </v-menu>


      
        <!--<el-dropdown :hide-on-click="false" trigger="click" placement='bottom-start'>
          <span class="el-dropdown-link">
            Даты
            <v-icon>keyboard_arrow_down</v-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="pa-2" style="line-height: 36px;">
              Выполнить до<br>
              <el-date-picker popper-class="tikets-filter-date-picker" v-model="filters.dates.deadline" :format="filters.dates.format" :type="filters.dates.type" :picker-options="filters.dates.pickerOptions" placeholder="Выполнить до"></el-date-picker>
            </div>
            <div class="pa-2" style="line-height: 36px;">
              Дата подачи заявки<br>
              <el-date-picker popper-class="tikets-filter-date-picker" v-model="filters.dates.startdate" :format="filters.dates.format" :type="filters.dates.type" :picker-options="filters.dates.pickerOptions" placeholder="Дата подачи заявки"></el-date-picker>
            </div>
            <div class="pa-2" style="line-height: 36px;">
              Дата выполнения заявки<br>
              <el-date-picker popper-class="tikets-filter-date-picker" v-model="filters.dates.enddate" :format="filters.dates.format" :type="filters.dates.type" :picker-options="filters.dates.pickerOptions" placeholder="Дата выполнения заявки"></el-date-picker>
            </div>
          </el-dropdown-menu>
        </el-dropdown>-->

        <!--<el-dropdown :hide-on-click="false" trigger="click" placement='bottom-start'>
          <span class="el-dropdown-link">
            Статусы
            <v-icon>keyboard_arrow_down</v-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-checkbox :indeterminate="filters.statuses.isIndeterminate" v-model="filters.statuses.checkAll" @change="handlerStatusesCheckAllChange">Все</el-checkbox>
            </el-dropdown-item>
            <el-checkbox-group v-model="filters.statuses.checkList" @change="handlerCheckedStatusesChange">
              <el-dropdown-item v-for="statuse in filters.statuses.list" :key="statuse.id">
                <el-checkbox :label="statuse.id">{{statuse.title}}</el-checkbox>
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>-->

        <!--<el-dropdown :hide-on-click="false" trigger="click" placement='bottom-start'>
          <span class="el-dropdown-link">
            Доп. параметры
            <v-icon>keyboard_arrow_down</v-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-radio-group v-model="filters.additionalOptions.checkList" @change="handlerCheckedAdditionalOptionsChange">
              <el-dropdown-item v-for="item in filters.additionalOptions.list" :key="item.id">
                <el-radio :label="item.id">{{item.title}}</el-radio>
              </el-dropdown-item>
            </el-radio-group>
          </el-dropdown-menu>
        </el-dropdown>-->

        <el-dropdown v-if="view==='left'" class="tikets-sorter" :hide-on-click="false" trigger="click" @command="handlerSort" placement='bottom-start'>
          <span class="el-dropdown-link">
            Сортировка
            <v-icon>keyboard_arrow_down</v-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="sortItem in sortingList" :command="sortItem.id" :key="sortItem.id">
              <i :class="['el-icon--left',!!sortingData[sortItem.id] ? (sortingData[sortItem.id]===-1 ? 'el-icon-caret-top' : 'el-icon-caret-bottom' )   : 'el-icon-d-caret']"></i>
              {{sortItem.title}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </v-toolbar>
    <div v-if="view==='left'" class="tikets-main-listview">
      <v-list dense two-line class="pa-0">
        <template v-for="(item, idx) in tiketListModify()">
          <v-list-tile :class="[{'tiket-expired':item.expired},{'marked':item.new},{'active':idx===currentRow}]" ripple :key="item.id" @click="listClick(item,idx)" @dblclick="listDblClick(item,idx)">
            <v-list-tile-action>
              <v-chip>{{idx+1}}</v-chip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.id }}
                <span v-if="type==='all'">({{ item.workerfio }})</span>
              </v-list-tile-title>
              <v-list-tile-sub-title class="grey--text text--darken-4">{{ item.sender }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ item.description }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>До {{ modeDate(item.deadline) }}</v-list-tile-action-text>
              <!--<v-list-tile-action-text>{{ item.topicname }}</v-list-tile-action-text>-->
              <span>
                <v-icon v-show="item.importance" class="deep-orange--text">mdi-fire</v-icon>
                <v-icon v-show="item.attachment" class="brown--text">attach_file</v-icon><!-- item.attachment.length>0 -->

                <v-icon v-show="item.status===1" class="green--text">mdi-check-circle-outline</v-icon>
                <v-icon v-show="item.status===2" class="red--text">mdi-close-circle-outline</v-icon>
                <v-icon v-show="item.status===3 && item.statusconfirm!==5" class="cyan--text">mdi-lightbulb-on-outline</v-icon>
                <v-icon v-show="item.status===4" class="ico-ani-spin">mdi-rotate-right</v-icon>
                <v-icon v-show="item.status===3 && item.statusconfirm===5" class="orange--text">mdi-alarm</v-icon>                
              </span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider :key="item.id"></v-divider>
        </template>
      </v-list>
    </div>
    <div v-if="view==='top' || view==='none'" class="tikets-main-listview"><!-- :class="[{'tiket-expired':item.expired},{'marked':item.new},{'active':idx===currentRow}]" -->
      <el-table size="mini" :default-sort="{prop: 'id'}" highlight-current-row :data="tiketListModify()" @row-dblclick="listDblClick" @row-click="listTableClick" :row-class-name="tableRowClassName">
        <el-table-column sortable type="expand">
          <template slot-scope="scope">
            <p>
              <i>{{ scope.row.sendersurname }} {{ scope.row.sendername }} {{ scope.row.senderpatronymic }}</i><br>
              <b>E-Mail:</b> {{ scope.row.sendermail }}<br>
              <b>Контактный номер телефона:</b> {{ scope.row.senderphone }}<br>
              <b>IP:</b> {{ scope.row.senderip }}<br>
              <b>Имя компьютера:</b> {{ scope.row.sendercompname }}<br>              
              <b>Дата подачи заявки:</b> {{ modeDate(scope.row.startdate) }}<br>
              <b>Описание:</b> {{ scope.row.description }}
            </p>
          </template>
        </el-table-column>
        <el-table-column sortable type="index" width="57px"></el-table-column>
        <el-table-column sortable prop="id" label="Номер" width="110px"></el-table-column>
        <el-table-column sortable property="status" label="Статусы" width="140px" align="center">
          <template slot-scope="scope">
            <el-tooltip v-show="scope.row.status===1" class="item" effect="dark" content="Заявка выполнена" placement="left">
              <v-icon :class="['green--text','grey-text text-lighten-3']">mdi-check-circle-outline</v-icon>
            </el-tooltip>
            <el-tooltip v-show="scope.row.status===2" class="item" effect="dark" content="В заявке отказано" placement="left">
              <v-icon class="red--text">mdi-close-circle-outline</v-icon>
            </el-tooltip>
            <el-tooltip v-show="scope.row.status===3 && !scope.row.statusconfirm" class="item" effect="dark" content="Заявка в процессе выполнения" placement="left">
              <v-icon class="cyan--text">mdi-lightbulb-on-outline</v-icon>
            </el-tooltip>
            <el-tooltip v-show="(scope.row.status===4) || (scope.row.status === 3 && scope.row.statusconfirm === 2)" class="item" effect="dark" content="Заявка на подтверждении" placement="left">
              <v-icon class="ico-ani-spin">mdi-rotate-right</v-icon>
            </el-tooltip>
            <el-tooltip v-show="scope.row.status===3 && scope.row.statusconfirm===5" class="item" effect="dark" content="Заявка на отсрочке" placement="left">
              <v-icon class="orange--text">mdi-alarm</v-icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Новая заявка" placement="left">
              <v-icon :class="scope.row.new ? 'indigo--text' :'grey--text text--lighten-3'">mdi-new-box</v-icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Важная заявка" placement="left">
              <v-icon :class="scope.row.importance ? 'deep-orange--text' :'grey--text text--lighten-3'">mdi-fire</v-icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Есть вложения" placement="bottom">
              <v-icon :class="scope.row.attachment ? 'brown--text' :'grey--text text--lighten-3'">attach_file</v-icon>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='all'" sortable property="workerfio" label="Исполнитель" width="150px"></el-table-column>
        <el-table-column sortable property="sender" label="Отправитель" width="150px"></el-table-column>
        <el-table-column sortable property="depname" label="Подразделение" width="170px"></el-table-column>
        <el-table-column v-if="type==='all'" sortable property="startdate" label="Поступила" width="170px">
          <template slot-scope="scope">
            {{ modeDate(scope.row.startdate) }}
          </template>
        </el-table-column>
        <el-table-column sortable property="deadline" label="Выполнить до" width="170px">
          <template slot-scope="scope">
            {{ modeDate(scope.row.deadline) }}
          </template>
        </el-table-column>
        <el-table-column sortable property="topicname" label="Тема" width="auto"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'tikets-listr',
  props: {
    type: {
      type: String
    },
    statuses:{
      type:Array,
      default:function(){
        return [3, 5, 6]
      }
    }
  },
  computed: {
    ...mapState({
      view: state => state.worker_data.workerData.tiketsview,
      isAdmin: state => state.worker_data.isAdmin,
      workerData: state => state.worker_data.workerData
    }),
    list() {
      return this.$store.getters.getTiketsList(this.type)
    }
  },
  data() {
    return {
      currentRow: null,
      sortingData: {},
      sortingDataTemp: {},
      sortingList: [
        { title: 'Номер заявки', id: 'id' },
        { title: 'Отправитель', id: 'sender' },
        { title: 'Тема заявки', id: 'topicname' },
        { title: 'Выполнить до', id: 'deadline' },
        { title: 'Важность', id: 'importance' },
        { title: 'Статус', id: 'status' },
        { title: 'Новая', id: 'new' },
        { title: 'Вложения', id: 'attachment' },
        { title: 'Описание', id: 'description' },
        { title: 'Подразделение', id: 'dep' }
      ],
      filters: {
        filterInput: null,
        dates: {
          type: 'daterange',
          format: 'dd.MM.yyyy',
          deadline: [null, null],
          startdate: [null, null],
          enddate: [null, null],
          pickerOptions: {
            shortcuts: [{
              text: 'Последняя неделя',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: 'Последний месяц',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: 'Последние 3 месяца',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          }
        },
        statuses: {
          isIndeterminate: true,
          checkAll: true,
          checkList: this.statuses,
          list: [{ title: 'Выполненые', id: 1 }, { title: 'Отказанные', id: 2 }, { title: 'На выполнении', id: 3 }, { title: 'На подтверждении', id: 4 }, { title: 'Отсрочка', id: 5 }, { title: 'Просроченные', id: 6 }, { title: 'На подтверждении:Выполнено', id: 7 }, { title: 'На подтверждении:Отказано', id: 8 }]
        },
        additionalOptions: {
          isIndeterminate: false,
          checkAll: true,
          checkList: 0,
          list: [{ title: 'Все', id: 0 }, { title: 'Новые', id: 'new' }, { title: 'Важные', id: 'importance' }, { title: 'С вложениями', id: 'attachment' }]
        }
      }
    }
  },
  methods: {    
    tiketListModify(){
      let data=this.tiketListFilter();      
      data.forEach((el) => {
        el.expired = this.isExpired(el);
      })
      return this.tiketListSort(data);
    },
    tiketListSort(data){
      let compare = function (field, order) {
        var len = arguments.length;
        if (len === 0) {
          return (a, b) => (a < b && -1) || (a > b && 1) || 0;
        }
        if (len === 1) {
          switch (typeof field) {
            case 'number':
              return field < 0 ? ((a, b) => (a < b && 1) || (a > b && -1) || 0) : ((a, b) => (a < b && -1) || (a > b && 1) || 0);
            case 'string':
              return (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0;
          }
        }
        if (len === 2 && typeof order === 'number') {
          return order < 0 ? ((a, b) => (a[field] < b[field] && 1) || (a[field] > b[field] && -1) || 0) : ((a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0);
        }
        var fields, orders;
        if (typeof field === 'object') {
          fields = Object.getOwnPropertyNames(field);
          orders = fields.map(key => field[key]);
          len = fields.length;
        } else {
          fields = new Array(len);
          orders = new Array(len);
          for (let i = len; i--;) {
            fields[i] = arguments[i];
            orders[i] = 1;
          }
        }
        return (a, b) => {
          for (let i = 0; i < len; i++) {
            if (a[fields[i]] < b[fields[i]]) return orders[i];
            if (a[fields[i]] > b[fields[i]]) return -orders[i];
          }
          return 0;
        }
      };
      return data.sort(compare( this.sortingData));
    },
    tiketListFilter(){
      let value=this.filters.statuses.checkList;
      let data=this.list.filter(el => {
        let isValid = false;
                
        for (let i = 0; i < value.length; i++) {
          switch (value[i]) {
            case 1:
              if (el.status === 1) {
                isValid = true;
              } else if(el.status === 3 && !el.worker){
                el.confirmity.forEach((elem,idx)=>{
                  if((elem.worker===this.workerData.login || this.isAdmin) && elem.status===1){
                    isValid = true;
                    return false
                  }
                })
              }
              break;
            case 3:
              if (!el.statusconfirm) {
                if (el.status === 3 && moment().diff(moment(el.deadline)) <= 0 && el.worker) {
                  isValid = true;
                } else if (el.status === 3 && moment().diff(moment(el.deadline)) <= 0 && !el.worker){
                  el.confirmity.forEach((elem,idx)=>{
                    if((elem.worker===this.workerData.login || this.isAdmin) && elem.status===3){
                      isValid = true;
                      return false
                    }
                  })
                }
              }
              break;
            case 5:
              if (el.status === 3 && el.statusconfirm === 5) {
                isValid = true;
              }
              break;
            case 6:
              if (!el.statusconfirm) {
                if (el.status === 3 && moment().diff(moment(el.deadline)) > 0 && el.worker) {
                  isValid = true;
                } else if (el.status === 3 && moment().diff(moment(el.deadline)) > 0 && !el.worker) {
                  el.confirmity.forEach((elem,idx)=>{
                    if((elem.worker===this.workerData.login || this.isAdmin) && elem.status===3){
                      isValid = true;
                      return false
                    }
                  })
                }
              }
              break;
            case 7:
              if (el.status === 4 && el.statusconfirm === 1) {
                isValid = true;
              }
              break;
            case 8:
              if (el.status === 3 && el.statusconfirm === 2) {
                isValid = true;
              }
              break;
            default:
              if (el.status === value[i]) {
                isValid = true;
              }
              break;
          }
        }
        return isValid;
      });
      let filters = this.filters;
      let filterForDate=(date, typedate) => {
        return data.filter(el => {
          let isValid = false;
          for (let prop in el) {
            if (prop === typedate && el[prop]) {
              isValid = moment(el[prop], 'YYYY-MM-DD').isBetween(date[0], date[1], null, '[]');
              break;
            }
          }
          return isValid;
        })
      }
      if (filters.additionalOptions.checkList.length > 0){
        data = data.filter(el => {
          let isValid = false;
          if (!!el[filters.additionalOptions.checkList]) {
            isValid = true;
          }
          return isValid;
        })
      }
      if (filters.filterInput){
        data = data.filter(el => {
          let isValid = false;
          for (let prop in el) {
            if (typeof el[prop] === 'string' && el[prop].trim().toUpperCase().includes(filters.filterInput.trim().toUpperCase())) {
              isValid = true;
              break;
            }
          }
          return isValid;
        })
      }
      if ( filters.dates.deadline[0]  ) filterForDate(filters.dates.deadline, 'deadline')
      if ( filters.dates.startdate[0] ) filterForDate(filters.dates.startdate, 'startdate')
      if ( filters.dates.enddate[0]   ) filterForDate(filters.dates.enddate, 'enddate')
      return data;
    },
    modeDate(date) {
      return this.$store.getters.momentData(date)
    },
    isExpired(el) {
      if (!el.statusconfirm) {
        if (el.status === 3 && moment().diff(moment(el.deadline)) > 0) {
          return true;
        }
      }
      return false;
    },
    handlerSort(command) {
      if (!!!this.sortingDataTemp[command]) {
        this.sortingDataTemp[command] = -1;
      } else if (this.sortingDataTemp[command] === -1) {
        this.sortingDataTemp[command] = 1;
      } else {
        delete this.sortingDataTemp[command];
      }
      this.sortingData = Object.assign({}, this.sortingDataTemp);
    },
    handlerStatusesCheckAllChange(event) {
      let array = [];
      let obj = this.filters.statuses;
      if (event/*.target.checked*/) {
        obj.list.forEach((el, idx) => {
          array.push(el.id);
        })
      }
      obj.checkList = array;
      obj.isIndeterminate = false;
    },
    handlerCheckedStatusesChange(value) {
      let checkedCount = value.length;
      let obj = this.filters.statuses;
      obj.checkAll = checkedCount === obj.list.length;
      obj.isIndeterminate = checkedCount > 0 && checkedCount < obj.list.length;
    },
    handlerAdditionalOptionsCheckAllChange(event) {
      let array = [];
      let obj = this.filters.additionalOptions;
      if (event.target.checked) {
        obj.list.forEach((el, idx) => {
          array.push(el.id);
        })
      }
      obj.checkList = array;
      obj.isIndeterminate = false;
    },
    handlerCheckedAdditionalOptionsChange(value) {
      this.filters.additionalOptions.checkList=value
      /*const i = this.filters.additionalOptions.checkList.indexOf(value)

        if (i > -1) {
          this.filters.additionalOptions.checkList.splice(i, 1)
        } else {
          this.filters.additionalOptions.checkList.push(value)
        }*/
      /*let checkedCount = value.length;
      let obj = this.filters.additionalOptions;
      obj.checkAll = checkedCount === obj.list.length;
      obj.isIndeterminate = checkedCount > 0 && checkedCount < obj.list.length;*/
    },
    checkNewTiket(item){
      if(item.new){
        this.$socket.emit('tiketinfo', item.id);
      }      
    },
    listClick(item, index) {
      this.currentRow = index;
      this.checkNewTiket(item)
      //this.$socket.emit('tiketinfo', item.id);
      this.$emit('click', {id:item.id,newworker:item.newworker})
    },
    listTableClick(item) {
      if (this.view !== 'none') {
        this.currentRow = item;
        this.checkNewTiket(item)
        //this.$socket.emit('tiketinfo', item.id);
        this.$emit('click', {id:item.id,newworker:item.newworker})
      }
    },
    listDblClick(item) {
      let id = 'tiket' + item.id;
      let isValue = true;
      this.$store.state.maintabs.mainTabs.forEach((elem, idx) => {
        if (elem.name === id) { isValue = false; }
      })
      if (isValue) {
        this.$store.dispatch('addMainTab', {
          title: `№ ${item.id}`,
          name: id,
          newworker:item.newworker,
          view: true,
          closable: true
        });
      }
      this.$store.dispatch('setSelectedMainTab', id);
      if(this.view==='none'){
        this.checkNewTiket(item)
        //this.$socket.emit('tiketinfo', item.id);
      }
    },
    tableRowClassName({row, index}) {
      return this.isExpired(row) ? 'tiket-expired' : '';
    }
  }
}
</script>

<style>
.marked {
  border-left: 4px solid green;
}
.active {
  background: #e2e1e1;
}
.list > li:not(:hover):not(.active):not(.tiket-expired){
  border-left: 4px solid #fff;
}
.list > li:hover:not(.tiket-expired){
  border-left: 4px solid #eee;
}
.list > li.active:not(:hover):not(.tiket-expired){
  border-left: 4px solid #e2e1e1;
}
.list > .tiket-expired, .tiket-expired.el-table__row td:first-child {
  border-left: 4px solid #f12d23;
}
.list > .tiket-expired:not(:hover):not(.active){
  background: #f12d23;
}
.list > .tiket-expired:not(:hover):not(.active) .list__tile__title,
.list > .tiket-expired:not(:hover):not(.active) .list__tile__sub-title,
.list > .tiket-expired:not(:hover):not(.active) .list__tile__action-text{
  color: #fff !important;
}
.tiket-expired.el-table__row {
  color: #f12d23 !important;
}
.tiket-expired.el-table__row td:last-child{
  border-right:4px solid #f12d23;
}
.tikets-main-listview .el-table--mini td, .tikets-main-listview .el-table--mini th{
  padding: 2px 0px;  
}

.tikets-main {
  padding: 5px;
  grid-area: table;
  display: grid;
  /*grid-gap: 0.5rem;*/
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
}

.tikets-main.left {
  grid-template-columns: 1fr 2fr;
  grid-template-areas: "list cont";
}

.tikets-main.top {
  grid-template-rows: minmax(250px, 1fr) 2fr;
  grid-template-areas: "list" "cont";
}

.tikets-main.none {
  grid-template-columns: 1fr;
  grid-template-areas: "list";
}

.tikets-main-list {
  grid-area: list;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas: "listFilter" "listList";
  border: 1px solid #dfe6ec;
  border-top: 0px;
}

.tikets-main-list-filter {
  grid-area: listFilter;
  display: grid;
  border-bottom: 1px solid #dfe6ec;
}

.tikets-filter-date-picker {
  min-width: 690px !important;
  width: 690px;
}

.tikets-filter-date-picker .el-picker-panel [slot="sidebar"],
.tikets-filter-date-picker .el-picker-panel__sidebar {
  width: 160px;
}

.tikets-filter-date-picker .el-picker-panel [slot="sidebar"]+.el-picker-panel__body,
.tikets-filter-date-picker .el-picker-panel__sidebar+.el-picker-panel__body {
  margin-left: 160px;
}

.tikets-main .tikets-filters-dropdown-group {
  justify-self: end;
}

.tikets-main.left .tikets-main-list-filter {
  grid-template-rows: auto auto;
}

.tikets-main.left .tikets-filters-dropdown-group {
  margin: 10px 10px 0px 0px;
}

.tikets-main.top .tikets-filters-dropdown-group,
.tikets-main.none .tikets-filters-dropdown-group {
  margin: 0px;
  margin-right: 10px;
}

.tikets-main-list>.tikets-main-listview {
  grid-area: listList;
  overflow: auto;
  width: auto !important;
}

.tikets-main-list>.tikets-main-listview>.listview-outlook .list-subtitle>span.text-left {
  max-width: 56%;
}

.tiket-list-description {
  max-width: 76%;
}

.tikets-main-list>.tikets-main-listview>.listview-outlook .list-subtitle>span.text-left,
.tiket-list-description {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tikets-main-listview>.listview-outlook>.list {
  cursor: pointer;
}

.tikets-sorter .el-icon-d-caret {
  color: #8492A6;
}

.tikets-main.top .tikets-main-listview,
.tikets-main.none .tikets-main-listview {
  display: grid;
  grid-template-rows: auto 1fr;
}

.tikets-main.top .tikets-main-listview>.el-table,
.tikets-main.none .tikets-main-listview>.el-table {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.tikets-main.top .tikets-main-listview>.el-table,
.tikets-main.top .tikets-main-listview .el-table__header-wrapper,
.tikets-main.top .tikets-main-listview .el-table__body-wrapper,
.tikets-main.none .tikets-main-listview>.el-table,
.tikets-main.none .tikets-main-listview .el-table__header-wrapper,
.tikets-main.none .tikets-main-listview .el-table__body-wrapper {
  width: auto !important;
}
</style>
