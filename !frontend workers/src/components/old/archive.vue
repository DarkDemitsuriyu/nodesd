<template>
  <div class="tikets-main-content" v-loading="loading">
    {{this.newworker}}
    {{ this.tiketID}}
    <div :class="['tikets-main',view]" style="border-top: 1px solid #dfe6ec; padding:0px;">
      <div class="tikets-main-list">
        <v-toolbar class="tikets-main-list-filter white elevation-0" light dense>
          <v-btn depressed @click="dialogVisible = true">
            <v-icon left>mdi-filter</v-icon>
            Фильтр
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
        <tikets-list-data  @click="handlerListClick" :workerData="workerData" :isAdmin="isAdmin" :view="view" type="archive" :value="list" class="tikets-main-listview"></tikets-list-data>
      </div>      
      <tikets-view-new-worker v-if="newworker" type="archive" :id="tiketID"></tikets-view-new-worker>
      <tikets-view v-else type="archive" :id="tiketID"></tikets-view>
    </div>

    <v-dialog v-model="dialogVisible"  transition="dialog-bottom-transition" :overlay="false" scrollable>
      <v-card tile>
        <v-toolbar dense dark :class="['elevation-0',workerData.theme]" :style="{background:workerData.color}">
          <v-toolbar-items>
            <v-btn flat @click="handlerFilter">
              <div>
                <v-icon left>mdi-check-circle-outline</v-icon>
              </div>              
              Фильтровать
            </v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogVisible = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="h-100">
          
          <table class="w-100 align-right" style="border-spacing:8px;">
            <tr>
              <td class="subheading">
                <el-radio v-model="selectedData.tiketsIdMany" :label="true">Диапазон заявок</el-radio>
                <el-radio v-model="selectedData.tiketsIdMany" :label="false">Одна заявка</el-radio>
              </td>
              <td>
                <el-input-number size="small" :style="{width:selectedData.tiketsIdMany ? '48%' : '100%'}" v-model="selectedData.id[0]" controls-position="right"></el-input-number>
                <span v-show="selectedData.tiketsIdMany">-</span>
                <el-input-number size="small" style="width:48%" v-show="selectedData.tiketsIdMany" v-model="selectedData.id[1]" controls-position="right"></el-input-number>
              </td>
              <td class="subheading">Тема:</td>
              <td>
                <el-input v-model="selectedData.topicname"></el-input>
              </td>
              <td class="subheading">Статусы:</td>
              <td>
                <el-checkbox-group v-model="selectedData.status">
                  <el-checkbox border v-for="item in statusesList" :label="item.id" :key="item.id">{{item.title}}</el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr>
              <td class="subheading">Отправитель:</td>              
              <td>
                <el-input v-model="selectedData.sendersurname"></el-input>
              </td>
              <td class="subheading">Исполнитель:</td>
              <td>
                <el-select class="w-100" collapse-tags v-model="selectedData.worker" multiple placeholder="Все">
                  <el-option v-for="item in workerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </td>
              <td class="subheading">Подразделение:</td>              
              <td>
                <el-select class="w-100" collapse-tags v-model="selectedData.department" multiple placeholder="Все">
                  <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="subheading">Выполнить до:</td>
              <td>                
                <el-date-picker class="w-100" popper-class="tikets-filter-date-picker" v-model="selectedData.deadline" :format="dates.format" :type="dates.type" :picker-options="dates.pickerOptions" placeholder="Выполнить до"></el-date-picker>
              </td>
              <td class="subheading">Дата подачи заявки:</td>
              <td>
                <el-date-picker class="w-100" popper-class="tikets-filter-date-picker" v-model="selectedData.startdate" :format="dates.format" :type="dates.type" :picker-options="dates.pickerOptions" placeholder="Дата подачи заявки"></el-date-picker>
              </td>
              <td class="subheading">Дата выполнения заявки:</td>
              <td>
                <el-date-picker popper-class="tikets-filter-date-picker" v-model="selectedData.enddate" :format="dates.format" :type="dates.type" :picker-options="dates.pickerOptions" placeholder="Дата выполнения заявки"></el-date-picker>
              </td>
            </tr>
             <tr>
              <td class="subheading">Дополнительно:</td>
              <td class="align-left">
                <el-checkbox v-model="selectedData[item.id]" border v-for="item in additionalOptionsList" :key="item.id">{{item.title}}</el-checkbox>
              </td>
            </tr>
          </table>
        </v-card-text>        
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'tikets-archive',
  data() {
    return {
      dialogVisible:false,
      tiketID:null,
      newworker:false,
      loading: false,
      list:[],
      maxrange:10000,
      statusesList:[{ title: 'Выполненые', id: 1 }, { title: 'Отказанные', id: 2 }],
      additionalOptionsList:[{ title: 'Важные', id: 'importance' }, { title: 'С вложениями', id: 'attachment' }],
      dates: {
        type: 'daterange',
         format: 'dd.MM.yyyy',
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
      selectedData: {
        tiketsIdMany:true,
        topicname:null,
        sendersurname:null,
        worker:[],
        department:[],
        id:[1,10000],
        status:[1,2],
        deadline: [null, null],
        startdate: [null, null],
        enddate: [null, null],
        importance:true,
        attachment:true,
      }
    }
  },
  computed: {
    ...mapState({      
      view: state => state.worker_data.workerData.tiketsview,
      isAdmin: state => state.worker_data.isAdmin,
      workerData: state => state.worker_data.workerData,
      departmentList: state => state.settings.lists.department,
      workerList: state => state.settings.lists.workers
    }),
    count:{
      get(){
        let count = this.$store.state.tikets.archive
        this.selectedData.id[1] = count
        return count
      },
      set(val){
      }
    }
  },
  methods: {
    handlerListClick(data){
      this.tiketID=data.id;
      this.newworker=data.newworker;
    },
    handlerFilter(){
      this.$http.post(`/update/tikets/archive/filter`,this.selectedData).then(response => {
        this.list = response.body
        this.dialogVisible = false
      });
    }
  }
}
</script>

<style>
</style>
