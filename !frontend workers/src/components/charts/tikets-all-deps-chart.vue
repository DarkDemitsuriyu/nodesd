<template>
  <vd-card :maximized="maximized" @apply-filter="handlerApplyFilter" @maximize="handlerMaximize" icon="mdi-trending-up" title="По подразделениям" class="ma-2" >
    <span slot="settings">
      <el-date-picker class="w-100" v-model="date" type="datetimerange"></el-date-picker>
    </span>
    <highcharts class="h-100" :options="options"></highcharts>
  </vd-card>
</template>

<script>
  export default {
    name: 'tikets-all-deps-chart',
    /*props:{
      maximized:Boolean
    },*/
    data(){
      return {
        date:[new Date('2015-01-01'),new Date()],
        maximized:false
      }
    },
    computed:{
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
            data: this.$store.getters.getCharTiketsAllDepsData || []
          }]
        }
      }
    },
    methods:{
      handlerMaximize(maximized){
        this.maximized = maximized//$emit('maximized',{name:"tikets-all-deps-chart",title:"По подразделениям"})
      },
      handlerApplyFilter(){
        this.$emit('apply-filter',{date:this.date})
      }
    }
  }
</script>