<template>
  <v-card :class="toolbarsClasses">
    <v-layout :column="view==='left'" :row="view!=='left'">
      <v-flex>
        <v-text-field flat solo hide-details placeholder="Фильтр..." prepend-inner-icon="mdi-magnify"  @input="handlerFilterInput" :value="filters.input" clearable></v-text-field>
      </v-flex>
      <v-flex shrink>
        <v-app-bar light dense flat color="white">
          <v-menu v-model="menus.statuses" class="" offset-y :close-on-content-click="false"> <!-- Фильтр по статусам -->
            <v-tooltip bottom slot="activator">
              <v-btn icon small slot="activator" color="red--text text--darken-2">
                <v-icon v-show="!menus.statuses"  size="20">far fa-list-alt</v-icon>
                <v-icon v-show="menus.statuses"  size="20">fas fa-list-alt</v-icon>
              </v-btn>
              <span>Статусы</span>
            </v-tooltip>
            <v-list dense>
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox hide-details :indeterminate="!checkAllStatuses.isIndeterminate" :input-value="checkAllStatuses.checkAll" @change="handlerCheckStatusAll"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Все</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-for="statuse in lists.statuses" :key="statuse.id" >
                <v-list-tile-action>
                  <v-checkbox color="red" @change="handlerCheckStatus" hide-details :value="statuse.id" :input-value="filters.statuses"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{statuse.title}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-divider inset vertical class="mx-1"></v-divider>
          <v-tooltip bottom> <!-- Новые заявки -->
            <template v-slot:activator="{ on }">
              <v-btn  v-on="on" text icon @click="handlerFilterChange('new')" class="ma-0">
                <v-icon size="22" :class="`${ filters.new ? 'indigo' : 'grey'}--text`">mdi-new-box</v-icon>
              </v-btn>
            </template>            
            {{ filters.new ? 'Выключить' : 'Включить' }} фильтр новых заявок
          </v-tooltip>
          <v-tooltip bottom> <!-- Заявки повышенной важности -->
            <v-btn slot="activator" small icon @click="handlerFilterChange('important')" class="ma-0">
              <v-icon size="20" :class="`${ filters.important ? 'deep-orange' : 'grey'}--text`">fas fa-fire</v-icon>
            </v-btn>
            {{ filters.important ? 'Выключить' : 'Включить' }} фильтр повышенной важности
          </v-tooltip>
          <v-tooltip bottom> <!-- Заявки с вложениями -->
            <v-btn slot="activator" small icon @click="handlerFilterChange('attachments')" class="ma-0">
              <v-icon  size="20" :class="`${ filters.attachments ? 'brown' : 'grey'}--text`">fas fa-paperclip</v-icon>
            </v-btn>
            {{ filters.attachments ? 'Выключить' : 'Включить' }} фильтр заявок с вложениями
          </v-tooltip>
          <v-divider inset vertical class="mx-1"></v-divider>
          <v-menu v-model="menus.dates" offset-y :close-on-content-click="false"> <!-- Фильтр по датам -->
            <v-tooltip slot="activator" bottom>
              <v-btn slot="activator" small icon class="ma-0">
                <v-icon v-show="menus.dates"  size="20" class="teal--text text--darken-2">fas fa-calendar-alt</v-icon>
                <v-icon v-show="!menus.dates"  size="20" class="teal--text text--darken-2">far fa-calendar-alt</v-icon>
              </v-btn>
              Фильтровать по датам
            </v-tooltip>
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox :value="filters.dates.startdateCheck" @change="handlerFilterDateChange('startdate')"/>
                </v-list-tile-action>
                <v-list-tile-content>
                  <vd-standart-form-datepicker :disabled="!filters.dates.startdateCheck" :label="$locale({i: 'tikets.startdate'})" :value="filters.dates.startdate" :displayFormat="format" min-date="" range @input="handlerFilterDate($event,'startdate')"></vd-standart-form-datepicker>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox :value="filters.dates.deadlineCheck" @change="handlerFilterDateChange('deadline')"/>
                </v-list-tile-action>
                <v-list-tile-content>
                  <vd-standart-form-datepicker :disabled="!filters.dates.deadlineCheck" :label="$locale({i: 'tikets.deadline'})" :value="filters.dates.deadline" :displayFormat="format" min-date="" range @input="handlerFilterDate($event,'deadline')"></vd-standart-form-datepicker>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox :value="filters.dates.enddateCheck" @change="handlerFilterDateChange('enddate')"/>
                </v-list-tile-action>
                <v-list-tile-content>
                  <vd-standart-form-datepicker :disabled="!filters.dates.enddateCheck" :label="$locale({i: 'tikets.enddate'})" :value="filters.dates.enddate" :displayFormat="format" min-date="" range @input="handlerFilterDate($event,'enddate')"></vd-standart-form-datepicker>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-tooltip v-if="isAdmin" bottom> <!-- Заявки всех сотрудников -->
            <v-btn slot="activator" small icon @click="handlerFilterChange('my')" class="ma-0">
              <v-icon v-show="filters.my" color="green"  size="20">fas fa-user</v-icon>
              <v-icon v-show="!filters.my" color="orange"  size="20">fas fa-users</v-icon>
            </v-btn>
            Показать {{ filters.my ? 'заявки всех сотрудников' : 'только мои заявки' }}
          </v-tooltip>
          <v-tooltip bottom> <!-- Заявки из архива -->
            <v-btn slot="activator" small icon @click="handlerFilterChange('archive')" class="ma-0">
              <v-icon size="20" :class="`${ filters.archive ? 'pink' : 'grey'}--text`">fas fa-archive</v-icon>
            </v-btn>
            {{ filters.archive ? 'Убрать' : 'Подгрузить' }} данные из архива
          </v-tooltip>            
          <v-spacer></v-spacer>
          <v-menu v-if="view==='left'" v-model="menus.sort" offset-y> <!-- Меню сортировки -->
            <v-tooltip slot="activator" bottom>
              <v-btn slot="activator" small flat class="ma-0">
                {{sortingTitle}}
                <v-icon v-show="menus.sort">mdi-chevron-up</v-icon>
                <v-icon v-show="!menus.sort">mdi-chevron-down</v-icon>
              </v-btn>
              Поле для сортировки
            </v-tooltip>
            <v-list dense>
              <v-list-tile avatar v-for="sortItem in lists.sorting" :key="sortItem.id" @click="handlerSort(sortItem.id)">
                <v-list-tile-avatar style="min-width:40px;">
                  <v-icon v-show="sortItem.id === sorting.id">mdi-check</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{sortItem.title}}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-tooltip v-if="view==='left'" bottom> <!-- Кнопка сортировки -->
            <v-btn slot="activator" small icon @click="handlerSortASC" class="ma-0 text-xs-right">
              <v-icon v-show="sorting.ASC" size="22" class="blue--text">mdi-sort-ascending</v-icon>
              <v-icon v-show="!sorting.ASC" size="22" class="blue--text">mdi-sort-descending</v-icon>
            </v-btn>
            Сортировка {{ sorting.ASC ? 'по возрастанию' : 'по убыванию' }}
          </v-tooltip>
        </v-app-bar>          
      </v-flex>
    </v-layout>

    <vd-standart-tab-dialog v-model="dialogVisible" main-btn-text="Получить данные" main-btn-icon="mdi-check-circle-outline" overlay max-width="800px" @btn-click="handlerFilter" @closed="handlerCloseDialog">
      <v-container grid-list-md class="">
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field label="Номер заявки" hint="Для поиска по диапазону введите данные в формате ХХХ-ХХХ" v-model="archiveData.id" clearable/>
          </v-flex>
          <v-flex xs6>
            <v-text-field clearable dense v-model="archiveData.topicname" label="Тема"></v-text-field>
          </v-flex>
          
          <v-flex xs6>
            <v-layout row>
              <v-flex shrink>
                <v-checkbox v-model="archiveData.startdateCheck"/>
              </v-flex>
              <v-flex>
                <vd-standart-form-datepicker :disabled="!archiveData.startdateCheck" :label="$locale({i: 'tikets.startdate'})" v-model="archiveData.startdate" min-date="" :displayFormat="format" range></vd-standart-form-datepicker>
              </v-flex>
            </v-layout>            
          </v-flex>
          <v-flex xs6>
            <v-text-field clearable dense v-model="archiveData.sendersurname" label="Отправитель"/>
          </v-flex>
          
          <v-flex xs6>
            <v-layout row>
              <v-flex shrink>
                <v-checkbox v-model="archiveData.deadlineCheck"/>
              </v-flex>
              <v-flex>
                <vd-standart-form-datepicker :disabled="!archiveData.deadlineCheck" :label="$locale({i: 'tikets.deadline'})" v-model="archiveData.deadline" min-date="" :displayFormat="format" range></vd-standart-form-datepicker>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs6>
            <vd-standart-form-select :disabled="!isAdmin" v-model="archiveData.worker" label="Исполнители" :items="workerList"></vd-standart-form-select>
          </v-flex>
          
          <v-flex xs6>
            <v-layout row>
              <v-flex shrink>
                <v-checkbox v-model="archiveData.enddateCheck"/>
              </v-flex>
              <v-flex>
                <vd-standart-form-datepicker :disabled="!archiveData.enddateCheck" :label="$locale({i: 'tikets.enddate'})" v-model="archiveData.enddate" min-date="" :displayFormat="format" range></vd-standart-form-datepicker>
              </v-flex>
            </v-layout>            
          </v-flex>
          <v-flex xs6>
            <vd-standart-form-select v-model="archiveData.department" color="green" label="Подразделение" :items="departmentList"></vd-standart-form-select>
          </v-flex>
          <v-flex class="d-flex" xs12>
            <v-checkbox v-model="archiveData.status" label="Выполненые" color="green" :value="1" hide-details ></v-checkbox>
            <v-checkbox v-model="archiveData.status" label="Отказаные" color="red" :value="2" hide-details ></v-checkbox>
            <v-checkbox v-model="archiveData.importance" label="Только важные" color="orange" :value="true" hide-details ></v-checkbox>
            <v-checkbox v-model="archiveData.attachment" label="Только с вложениями" color="brown" :value="true" hide-details ></v-checkbox>
          </v-flex>
        </v-layout>
      </v-container>
    </vd-standart-tab-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'tikets-list-fast-filter',
  computed: {
    ...mapState({
      view: state => state.worker_data.workerData.tiketsview,
      workerData: state => state.worker_data.workerData,
      isAdmin: state => state.worker_data.isAdmin,
      filters: state => state.tikets.filters,
      toolbarsClasses: state => state.maintabs.toolbarsClasses,
      sorting: state => state.tikets.sorting,
      departmentList: state => state.settings.lists.department,
      workerList: state => state.settings.lists.workers
    }),
    sortingTitle(){
      let element = this.lists.sorting.find( el => el.id === this.sorting.id )
      return element.title
    },
    checkAllStatuses(){
      let value = this.filters.statuses
      return {
        isIndeterminate: value.length === this.lists.statuses.length || value.length === 0,
        checkAll: value.length === this.lists.statuses.length
      }
    }
  },
  created(){
    this.archiveData.worker.push(this.workerData.login)
  },
  data() {
    return {
      format: 'DD.MM.YYYY',
      dialogVisible:false,
      archiveData: {
        id:null,
        topicname:null,
        sendersurname:null,
        worker:[],
        department:[],        
        status:[1,2],
        importance:false,
        attachment:false,
        startdateCheck:false,
        deadlineCheck:false,
        enddateCheck:false,
        startdate: {start:null,end:null},
        deadline: {start:null,end:null},        
        enddate: {start:null,end:null}        
      },
      menus:{
        dates:false,
        statuses:false,
        addons:false,
        sort:false
      },
      dates: {        
        deadline: {start:null,end:null},
        startdate: {start:null,end:null},
        enddate: {start:null,end:null}
      },
      lists:{
        statuses:[{ title: 'Выполненые', id: 1 }, { title: 'Отказанные', id: 2 }, { title: 'На выполнении', id: 3 }, { title: 'На подтверждении', id: 4 }, { title: 'Отсрочка', id: 5 }, { title: 'Просроченные', id: 6 }, { title: 'На подтверждении:Выполнено', id: 7 }, { title: 'На подтверждении:Отказано', id: 8 }],
        sorting:[
          { title: 'Номер заявки', id: 'id' },
          { title: 'Отправитель', id: 'sender' },
          { title: 'Выполнить до', id: 'deadline' },
          { title: 'Важность', id: 'importance' },
          { title: 'Статус', id: 'status' },
          { title: 'Новая', id: 'new' }
        ]
      }
    }
  },
  methods: {
    handlerFilterChange(type,val){
      if(type === 'archive'){
        if(this.filters.archive){
          this.$store.commit('TIKET_FILTER_STATUSES',[3, 5, 6])
          this.handlerFilterChange('my',true)
        } else{
          this.dialogVisible = true
        }        
      }
      this.$store.commit('TIKET_FILTER_CHANGE',{type:type,val:val})
    },
    handlerFilterInput(val){
      this.$store.commit('TIKET_FILTER_INPUT',val)
    },
    handlerFilterDateChange(type){
      this.$store.commit('TIKET_FILTER_DATE_CHANGE',type)
    },
    handlerFilterDate(value,type){
      this.$store.commit('TIKET_FILTER_DATE',{type:type,value:value})
    },
    handlerCheckStatus(value){
      this.$store.commit('TIKET_FILTER_STATUSES',value)
    },
    handlerCheckStatusAll(){
      let value = []
      if(this.filters.statuses.length !== this.lists.statuses.length || this.filters.archive){
        value = this.lists.statuses.map( el => el.id)
      }
      this.$store.commit('TIKET_FILTER_STATUSES',value)
    },
    handlerSort(value) {
      this.$store.commit('TIKET_SORT_DATA_SET',{id:value})      
    },
    handlerSortASC() {
      this.$store.commit('TIKET_SORT_ASC_CHECK')      
    },
    handlerFilter(){
      let data = { 
        status: this.archiveData.status,
        worker: this.archiveData.worker
      }
      if(this.archiveData.id){ data.id = this.archiveData.id }
      if(this.archiveData.importance){ data.importance = this.archiveData.importance }
      if(this.archiveData.attachment){ data.attachment = this.archiveData.attachment }
      if(this.archiveData.topicname){ data.topicname = this.archiveData.topicname }
      if(this.archiveData.sendersurname){ data.sendersurname = this.archiveData.sendersurname }
      if(this.archiveData.department.length > 0){ data.department = this.archiveData.department }
      if(this.archiveData.startdateCheck){ data.startdate = this.archiveData.startdate }
      if(this.archiveData.deadlineCheck){ data.deadline = this.archiveData.deadline }
      if(this.archiveData.enddateCheck){ data.enddate = this.archiveData.enddate }
      this.$http.post(`/update/tikets/archive/filter`,data).then(response => {
        this.$store.commit('TIKET_ARCHIVE_DATA_SET',response.body)  
        this.dialogVisible = false
        this.handlerCheckStatusAll()
        this.handlerFilterChange('my',false)
      })
    },
    handlerCloseDialog(){
      this.dialogVisible = false
      this.handlerFilterChange('archive',false)
    }
  }
}
</script>

<style>

</style>