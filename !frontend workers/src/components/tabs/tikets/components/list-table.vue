<template>
  <v-card class="vd-tikets__list">
    <vue-scroll>
      <v-list v-if="view==='left'" dense two-line class="pa-0 ma-0">
        <template v-for="(item, idx) in list">
          <v-list-item :class="[{'vd-tiket--expired':item.expired},{'marked':item.new},{'active':idx===currentRow}]" ripple :key="item.id" @click="listClick(item,idx)" @dblclick="listDblClick(item,idx)">
            <v-list-item-action>
              <v-chip>{{idx+1}}</v-chip>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.id }}
                <span v-if="!filters.my && !item.newworker">({{ item.workerfio }})</span>
              </v-list-item-title>
              <v-list-item-subtitle class="grey--text text--darken-4">{{ item.sender }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>До {{ modeDate(item.deadline) }}</v-list-item-action-text>
              <!--<v-list-item-action-text>{{ item.topicname }}</v-list-item-action-text>-->
              <span>
                <v-icon v-show="item.importance" class="deep-orange--text">mdi-fire</v-icon>
                <v-icon v-show="item.attachment" class="brown--text">attach_file</v-icon><!-- item.attachment.length>0 -->

                <v-icon v-show="item.status===1" class="green--text">mdi-check-circle-outline</v-icon>
                <v-icon v-show="item.status===2" class="red--text">mdi-close-circle-outline</v-icon>
                <v-icon v-show="item.status===3 && item.statusconfirm!==5" class="cyan--text">mdi-lightbulb-on-outline</v-icon>
                <v-icon v-show="item.status===4" class="ico-ani-spin">mdi-rotate-right</v-icon>
                <v-icon v-show="item.status===3 && item.statusconfirm===5" class="orange--text">mdi-alarm</v-icon>                
              </span>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`divider-${item.id}`"></v-divider>
        </template>
      </v-list>
    </vue-scroll>
    <el-table v-if="view==='top' || view==='none'" size="mini" :default-sort="{prop: 'id'}" highlight-current-row :data="list" @row-dblclick="listDblClick" @row-click="listClick" :row-class-name="tableRowClassName">
      <el-table-column sortable type="expand">
        <template slot-scope="scope">
            <p>
              <i>{{ scope.row.sender }}</i><br>
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
        <el-table-column sortable prop="id" label="Номер" width="90px"></el-table-column>
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
        <el-table-column v-if="!filters.my" sortable property="workerfio" label="Исполнитель" width="150px"></el-table-column>
        <el-table-column sortable show-overflow-tooltip property="sender" label="Отправитель" width="200px"></el-table-column>
        <el-table-column sortable property="depname" label="Подразделение" width="170px"></el-table-column>
        <el-table-column v-if="!filters.my" sortable property="startdate" label="Поступила" width="170px">
          <template slot-scope="scope">
            {{ modeDate(scope.row.startdate) }}
          </template>
        </el-table-column>
        <el-table-column sortable property="deadline" label="Выполнить до" width="170px">
          <template slot-scope="scope">
            {{ modeDate(scope.row.deadline) }}
          </template>
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip property="topicname" label="Тема" width="auto"></el-table-column>
      </el-table>
  </v-card>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'tikets-list-data',
  computed: {
    ...mapState({
      view: state => state.worker_data.workerData.tiketsview,
      workerData: state => state.worker_data.workerData,
      isAdmin: state => state.worker_data.isAdmin,
      filters: state => state.tikets.filters,
      sorting: state => state.tikets.sorting
    }),    
    list(){
      return this.$store.getters.getTiketsList;
    }
  },
  data() {
    return {
      currentRow: null      
    }
  },
  methods: {    
    modeDate(date) {
      return this.$store.getters.momentData(date)
    },
    /*checkNewTiket(item){
      if(item.new){
        this.$socket.emit('tiketinfo', item.id);
      }      
    },*/
    listClick(item, index) {
      if (this.view !== 'none') {
        this.currentRow = isFinite(index) ? index : item;
       // this.$store.commit('TIKET_LEFT_VIEW_SELECTED_DELETE')
        this.$store.commit('TIKET_LEFT_VIEW_SELECTED_ADD',item)
        //this.checkNewTiket(item)
        this.$emit('click', item)
      }      
    },
    listDblClick(item) {
      console.log('item',item)
      let id = 'tiket' + item.id;
      let isValue = true;
      this.$store.state.maintabs.mainTabs.forEach((elem, idx) => {
        if (elem.name === id) { isValue = false; }
      })
      if (isValue) {
        let data = {
          title: `№ ${item.id}`,
          id: id,
          name: 'tikets-view',
          newworker:item.newworker,
          view: true,
          data: item
        }
        console.log('data',data)
        this.$store.commit('ADD_MAIN_TAB',data)
      }
      this.$store.dispatch('setSelectedMainTab', id);
      /*if(this.view==='none'){
        this.checkNewTiket(item)
      }*/
    },
    tableRowClassName({row, index}) {
      return row.expired ? 'vd-tiket--expired' : '';
    }
  }
}
</script>

<style>
.vd-tikets-list .__view{
  max-width:100%;
}
.marked {
  border-left: 4px solid green;
}
.active {
  background: #e2e1e1;
}
.vd-tikets__list li:not(:hover):not(.active):not(.vd-tiket--expired){
  border-left: 4px solid #fff;
}
.vd-tikets__list li:hover:not(.vd-tiket--expired){
  border-left: 4px solid #eee;
}
.vd-tikets__list li.active:not(:hover):not(.vd-tiket--expired){
  border-left: 4px solid #e2e1e1;
}
.vd-tikets__list .vd-tiket--expired, .vd-tiket--expired.el-table__row td:first-child {
  border-left: 4px solid #f12d23;
}
.vd-tikets__list .vd-tiket--expired:not(:hover):not(.active){
  background: #f12d23;
}
.vd-tikets__list .vd-tiket--expired:not(:hover):not(.active) .list__tile__title,
.vd-tikets__list .vd-tiket--expired:not(:hover):not(.active) .list__tile__sub-title,
.vd-tikets__list .vd-tiket--expired:not(:hover):not(.active) .list__tile__action-text{
  color: #fff !important;
}
.vd-tikets__list .vd-tiket--expired.el-table__row {
  color: #f12d23 !important;
  background: inherit !important;;
}
.vd-tikets__list .vd-tiket--expired.el-table__row td:last-child{
  border-right:4px solid #f12d23;
}
/*
.tikets-main-listview .el-table--mini td, .tikets-main-listview .el-table--mini th{
  padding: 2px 0px;  
}

.tikets-main {
  padding: 5px;
  grid-area: table;
  display: grid;
  grid-gap: 0.5rem;
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
}*/
</style>
