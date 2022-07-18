<template>
  <vd-card :maximized="maximized" @apply-filter="handlerApplyFilter" @maximize="handlerMaximize" icon="mdi-trending-up" title="По сотрудникам" class="ma-2" >
    <table slot="settings">
      <tr>
        <td>Подразделение:</td>
        <td>
          <el-select v-model="departments" class="w-100" multiple collapse-tags placeholder="Все">
            <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td>Период:</td>
        <td><el-date-picker class="w-100" v-model="date" type="datetimerange"></el-date-picker></td>
      </tr>
    </table>
    <highcharts class="h-100" :options="options"></highcharts>
  </vd-card>
</template>

<script>
  import moment from 'moment'
  import { mapState } from 'vuex'
  export default {
    name: 'tikets-all-senders-chart',
    /*props:{
      maximized:Boolean
    },*/
    data(){
      return {
        departments:[],
        date:[moment('2015-01-01').format(),moment().format()],
        maximized:false
      }
    },
    computed:{
      ...mapState({      
        departmentList: state => state.settings.lists.department
      }),
      options(){
        return {
          chart: {
            type: 'pie',
            height: this.maximized ? null : 270,
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
            }
          },
          legend:{
            enabled: true,
            lineHeight:4,
            maxHeight:80
          },
          title: false,
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 25,
              dataLabels: {
                formatter(){
                  return `${this.point.name} - ${this.point.percent}%`
                },
                enabled: this.maximized
              },
              showInLegend: true
            }
          },
          series: [{
            dashStyle:'Dot',
            name: 'Заявок',
            colorByPoint: true,
            data: this.$store.getters.getCharTiketsAllSendersData || []
          }]
        }
      }
    },
    methods:{
      handlerMaximize(maximized){
        this.maximized = maximized//$emit('maximized',{name:"tikets-all-deps-chart",title:"По подразделениям"})
      },
      handlerApplyFilter(){

        this.$http.post('/counts',{type:'tikets-all-senders',filter:true,date:this.date}).then((response) => {
          this.$store.dispatch('setCharTiketsAllSendersData',response.data);
        }).catch((e) => {
          console.log(e)
        })
        //this.$emit('apply-filter',{date:this.date})
      }
    }
  }
</script>