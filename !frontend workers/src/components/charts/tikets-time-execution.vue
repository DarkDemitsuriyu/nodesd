<template>
  <vd-card :maximized="maximized" @apply-filter="handlerApplyFilter" @maximize="handlerMaximize" icon="mdi-trending-up" title="Время выполнения заявок" class="ma-2" >
    <span slot="settings">
      <el-date-picker class="w-100" v-model="date" type="datetimerange"></el-date-picker>
    </span>
    <highcharts class="h-100" :options="options"></highcharts>
  </vd-card>
</template>

<script>
  import moment from 'moment'
  moment.locale('ru');
  export default {
    name: 'tikets-time-execution',
    props:{
      maximized:Boolean
    },
    data(){
      return {
        date:[new Date('2015-01-01'),new Date()]
      }
    },
    computed:{
      options(){
        return {
          chart: {
            type: 'bar',
            height: this.maximized ? null : 270
          },
          legend:{
            enabled: true
          },
          title: false,
          xAxis: {
            categories: ['Минимальное значение', 'Среднее значение', 'Максимальное значение']
          },
          yAxis: {
            title:{
              text:'Секунды'
            }
          },
          plotOptions: {
            bar: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                //format:'{point.name} - {point.y} сек',
                formatter:function(){
                  return moment.duration(this.y, "seconds").humanize()
                },
                enabled: this.maximized
              },
              showInLegend: true
            }
          },
          series: this.$store.getters.getCharTiketsExecution || []
        }
      }
    },
    methods:{
      handlerMaximize(){
        this.$emit('maximized',{name:"tikets-time-execution",title:"Время выполнения заявок"})
      },
      handlerApplyFilter(){
        this.$http.post('/counts',{type:'tikets-time-execution',filter:true,date:this.date}).then((response) => {
          this.$store.dispatch('setCharTiketsExecution',response.data);
        }).catch((e) => {
          console.log(e)
        })
        //this.$emit('apply-filter',{date:this.date})
      }
    }
  }
</script>
