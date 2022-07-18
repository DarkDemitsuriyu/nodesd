<template>
  <vd-card :maximized="maximized" @apply-filter="handlerApplyFilter" @maximize="handlerMaximize" icon="mdi-trending-up" title="Тренд поступления заявок" class="ma-2" >
    <span slot="settings">
      <el-date-picker class="w-100" v-model="date" type="datetimerange"></el-date-picker>
    </span>
    <highcharts class="h-100" :options="options"></highcharts>
  </vd-card>
</template>

<script>
  export default {
    name: "tikets-trend-workers-years",
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
          title: false,
          chart:{
            height: this.maximized ? null : 270,
          },
          legend:{
            enabled: true
          },
          xAxis:{type: 'datetime'},
          yAxis: {title: false},
          series: this.$store.getters.getCharTiketsTrendWorkersYears || []
        }
      }
    },
    methods:{
      handlerMaximize(){
        this.$emit('maximized',{name:"tikets-trend-workers-years",title:"Тренд поступления заявок"})
      },
      handlerApplyFilter(){
        this.$emit('apply-filter',{date:this.date})
      }
    }
  }
</script>