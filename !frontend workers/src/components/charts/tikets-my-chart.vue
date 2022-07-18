<template>
  <vd-card :maximized="maximized" @apply-filter="handlerApplyFilter" @maximize="handlerMaximize" icon="mdi-trending-up" title="Мои заявки" class="ma-2" >
    <span slot="settings">
      <el-date-picker class="w-100" v-model="date" type="datetimerange"></el-date-picker>
    </span>
    <highcharts class="h-100" :options="options"></highcharts>
  </vd-card>
</template>

<script>
  export default {
    name: 'tikets-my-chart',
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
            type: 'pie',
            height: this.maximized ? null : 270,
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
            }
          },
          legend:{
            enabled: true
          },
          title: false,
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 25,
              dataLabels: {
                format:'{point.name} - {point.percentage:.2f}%',
                enabled: this.maximized
              },
              showInLegend: true
            }
          },
          series: [{
            name: 'Заявок',
            colorByPoint: true,
            data: this.$store.getters.getCharTiketsMyData || []
          }]
        }
      }
    },
    methods:{
      handlerMaximize(){
        this.$emit('maximized',{name:"tikets-my-chart",title:"Мои заявки"})
      },
      handlerApplyFilter(){
        this.$emit('apply-filter',{date:this.date})
      }
    }
  }
</script>
