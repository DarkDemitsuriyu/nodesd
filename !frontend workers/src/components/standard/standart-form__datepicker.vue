<template>
  <v-menu v-model="showMenu" :disabled="disabled" :close-on-content-click="false" transition="scale-transition" offset-y min-width="500px">
    <template v-slot:activator="{ on }">
      <v-text-field :disabled="disabled" :solo="solo" :prepend-inner-icon="prependInnerIcon" :prepend-icon="prependIcon" :label="label" :hide-details="hideDetails" :value="formatted" append-icon="event" @click:append="showMenu = !showMenu" readonly v-on="on"></v-text-field>
    </template>
    <VueCtkDateTimePicker v-model="date" :disabled="disabled" :range="range" :custom-shortcuts="customShortcuts" :minute-interval="minuteInterval" :format="outputFormat" no-button :min-date="minDate" inline no-keyboard/>
  </v-menu>
</template>

<script>
import moment from 'moment';
export default {
  name: "vd-standart-form-datepicker",
  props:{
    disabled:Boolean,
    range:Boolean,
    label:String,
    hideDetails:{type:Boolean, default:true},
    prependInnerIcon:String,
    prependIcon:String,
    solo:Boolean,
    value:[String, Object],
    minDate:{ type:String, default:new Date().toISOString().substr(0, 10) },
    displayFormat:{ type:String, default:'DD.MM.YYYY HH:mm:ss' },
    outputFormat:{ type:String, default:'YYYY-MM-DD HH:mm' },
    minuteInterval:{ type:Number, default:10 }
  },
  data(){
    return {
      showMenu:false,
      customShortcuts:[
        { label: `Сегодня`, value: 'day', isSelected: false },
        { label: 'Вчера', value: '-day', isSelected: false },
        { label: 'Эта неделя', value: 'week', isSelected: true },
        { label: 'Прошлая неделя', value: '-week', isSelected: false },
        { label: 'Этот месяц', value: 'month', isSelected: false },
        { label: 'Прошлый месяц', value: '-month', isSelected: false },
        { label: 'Этот год', value: 'year', isSelected: false },
        { label: 'Прошлый год', value: '-year', isSelected: false }
      ]
    }
  },
  computed: {
    formatted(){
      if(this.range){
        return (this.value.start && this.value.end) ? `${moment(this.value.start).format(this.displayFormat)} - ${moment(this.value.end).format(this.displayFormat)}` : ''
      } else {
        return this.value ? moment(this.value).format(this.displayFormat) : ''
      }
    },
    date:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      }
    }
  }
};
</script>

<style>
.shortcuts-container{
  width: 180px !important;
  max-width: 180px !important;
  min-width: 180px !important;
}
</style>