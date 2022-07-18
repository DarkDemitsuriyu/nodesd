<template>
  <el-tabs tab-position="left" class="grey lighten-3 additionally-reports__main" v-model="selectedNode" type="border-card">
      <el-tab-pane class="standart-tab pa-2" label="Для ЦО" name="co">
        <v-container fill-height grid-list-lg fluid>
          <v-layout row wrap align-space-between  justify-center fill-height>
            <v-flex xs6>
              <v-btn style="height:150px;" block dark large color="red" href="/reports/xlsx/weekA">Отчет А, за неделю</v-btn>
            </v-flex>
            <v-flex xs6>
              <v-btn style="height:150px;" block dark large color="green" href="/reports/xlsx/weekB">Отчет Б, за неделю</v-btn>
            </v-flex>
            <v-flex xs6>
              <v-btn style="height:150px;" block dark large color="blue" href="/reports/xlsx/monthA">Отчет А, за месяц</v-btn>
            </v-flex>
            <v-flex xs6>
              <v-btn style="height:150px;" block dark large color="yellow" href="/reports/xlsx/monthB">Отчет Б, за месяц</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- <v-toolbar dense class="standart-tab__toolbar white elevation-1 mb-2">
          <v-spacer></v-spacer>
          <el-form :inline="true" :model="co">
            <el-form-item class="mb-0" label="Тип отчета">
              <el-select size="small" v-model="co.type" placeholder="Выберите тип">
                <el-option label="Классификаторы" value="c"></el-option>
                <el-option label="Сотрудники" value="w"></el-option>
                <el-option label="Классификатор+Сотрудники" value="cw"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="mb-0" label="Период">
              <el-date-picker v-model="co.period" type="datetimerange" placeholder="Select date and time" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item class="mb-0" label="Добавить даты">
              <el-switch v-model="co.showDates"></el-switch>
            </el-form-item>
            <el-form-item class="mb-0">
              <el-button size="small" @click="handlerApply('co')">Применить</el-button>
            </el-form-item>              
          </el-form>
          <v-spacer></v-spacer>
          <el-button @click="saveXLSX">XLSX</el-button>
        </v-toolbar>-->

        <!-- <el-table  class="inner" size="mini" highlight-current-row :data="listData">
          <el-table-column v-if="co.showDates" prop="date" label="Дата" sortable show-overflow-tooltip></el-table-column>
          <el-table-column v-if="co.type.includes('c')" prop="classifiername" label="Классификатор" sortable show-overflow-tooltip></el-table-column>
          <el-table-column v-if="co.type.includes('w')" prop="workerFullName" label="Сотрудник" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="count" label="Количество" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="laborexpenditures" label="Трудозатраты(Мин.)" sortable show-overflow-tooltip></el-table-column>
        </el-table>-->
        <!--<vd-standart-tab-table ref="refComponent" @dbl-click="handlerEditClick" :filter-text="filterText" :main="toTree" :data="$vdesk.filterTable(filterText,listData)" ></vd-standart-tab-table>-->
      </el-tab-pane>
    </el-tabs>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "additionally-reports",
  props:['id'],
  data() {
    return {
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
          text: 'Этот месяц',
          onClick(picker) {
            const end = new Date();
            const start = moment().set('date', 1).toDate();
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
      },
      co:{
        type:'c',
        showDates:false,
        period:[moment().set('date', 1).toDate(),new Date()]
      },
      listData:[],
      toTree:{
        columns: function(){
          return [
            {prop:'classifiername', label:'Классификатор'},
            {prop:'count', label:'Количество'},
            {prop:'laborexpenditures', label:'Трудозатраты(Мин.)'}
          ]
        }
        
        
        
      },
      filterText:'',
      selectedNode:'co'
    };
  },
  computed: {
    ...mapState({
      users: state => state.directorys.users,
      listWorkers: state => state.settings.lists.workers,
      listWorkersStatus: state => state.settings.lists.statusworkers,
      listDepartments: state => state.settings.lists.department,
      listDivisions: state => state.settings.lists.division,
      theme: state => state.worker_data.workerData.theme,
      color: state => state.worker_data.workerData.color
    }),
    listGroup() {
      let data = this.$store.state.settings.lists.group
      data.forEach(element => element.disabled = !this.edit );
      return data
    },
    listTopic() {
      let data = this.$store.state.settings.lists.topic
      data.forEach(element => element.disabled = !this.edit );
      return data
    }
  },
  methods: {
    handlerApply(type){
      this.$http.post(`/reports/${type}`,this[type]).then(response => {
        console.log(response.body)
        this.listData = response.body        
      });
      /*switch(type){
        case 'co':
          
          break
      }*/
    },
    handlerEditClick(){

    },
    saveXLSX(){
      /*let self = this
      let headers = []
      let value = this.listData.map( el => Object.values(el))
      if(this.co.showDates){ headers.push("Дата") }
      if(this.co.type.includes('c')){ headers.push("Классификатор") }
      if(this.co.type.includes('w')){ headers.push("Сотрудник") }
      headers.push("Количество")
      headers.push("Трудозатраты(Мин.)")
      value.unshift(headers)*/
      let url = `/reports/xlsx/${this.selectedNode}?`
      for(let key in this[this.selectedNode]){
        url += `${key}=${encodeURIComponent(this[this.selectedNode][key])}&`
      }
      console.log(url)

      window.open(url,'_blank')
      //fetch(`/reports/xlsx`,{method:'POST',body:{value}})

      /*this.$http.post(`/reports/xlsx`,{value}).then(response => {
        console.log(response)
        window.open(response.body,'_blank')
      });*/

      /*XlsxPopulate.fromBlankAsync().then(workbook => {
        workbook.sheet("0").cell("A1").value([
          headers,
          self.listData
        ]);
        return workbook.toFileAsync("./out.xlsx");
      });*/
      /*let link = document.createElement("a");
      link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(data);
      link.style = "visibility:hidden";
      link.download = 'report';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      let uri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
      let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      let base64 = function(s) {
        return window.btoa(unescape(encodeURIComponent(s)))
      }
      let format = function(s, c) {
        return s.replace(/{(\w+)}/g, function(m, p) {
          return c[p];
        })
      }
      let table = "<table><thead><tr>"
      if(this.co.showDates){ table += "<th>Дата</th>" }
      if(this.co.type.includes('c')){ table += "<th>Классификатор</th>" }
      if(this.co.type.includes('w')){ table += "<th>Сотрудник</th>" }
      table += "<th>Количество</th><th>Трудозатраты(Мин.)</th></tr></thead><tbody>"
      this.listData.forEach( el => {
        table += "<tr>"//</tr>
        if(this.co.showDates){ table += `<td>${el.date}</td>` }
        if(this.co.type.includes('c')){ table += `<td>${el.classifiername}</td>` }
        if(this.co.type.includes('w')){ table += `<td>${el.workerFullName}</td>` }
        table += `<td>${el.count}</td><td>${el.laborexpenditures}</td></tr>`
      })
      table += "</tbody></table>"
      let ctx = {
        worksheet: 'report',
        table:table
      }
      window.open(uri + base64(format(template, ctx)),'_blank')*/
    },



    handlerSelect(id){
      let worker = this.users.find( el => el.login===id )
      this.selectedData = Object.assign({passgen:false},worker);
      this.type="update"
      this.edit=false
    },
    handlerAddNewWorker(){
      this.selectedData = {
        jabber:'',
        login:'',
        surname:'',
        name:'',
        patronymic:'',
        email:'',
        cityphone:'',
        internalphone:'',
        passgen:false,
        division:null,
        department:null,
        status:1,
        groups:[],
        topics:[]
      };
      this.type="new"
      this.edit=true
    },
    handlerEditSave(){
      if(this.edit){
        this.$vdesk.sendUpdateNoDialog(this)
        this.selectedData.passgen =false        
        this.edit=false
      } else {
        this.edit=true
      }      
    }
  }
};
</script>

<style>
.additionally-reports__main {
  display: grid;
  overflow: hidden;
  height: 100%;
  width:100%;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: 1fr;
  grid-template-areas: "additionally-reports__tree additionally-reports__view";
}
.additionally-reports__main > .el-tabs__header {
  overflow: hidden;
  grid-area: additionally-reports__tree
}
.additionally-reports__main > .el-tabs__content {
  padding: 0px !important;
  overflow: hidden;
  grid-area: additionally-reports__view
}
.additionally-reports__main > .el-tabs__content > .el-tab-pane {
  overflow: hidden;
  height: 100%;
}
.additionally-reports__main .el-select{
  width:100%;
}
.additionally-reports__toolbar {
  grid-area: additionally-reports__toolbar;
}
.additionally-reports__tree {
  grid-area: additionally-reports__tree;
  border-right: 1px solid #dfe6ec;
}
.additionally-reports__view {
  grid-area: additionally-reports__view;
  overflow: auto;
}
.el-input-group__prepend{
  width:103px;
  text-align:right;
}
</style>
