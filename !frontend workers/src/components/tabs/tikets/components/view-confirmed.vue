<template>
  <v-card class="tikets-show__header">
    <v-alert warning outline :value="true" class="ma-0">
      <v-layout column>
        <v-flex>
          <b v-html="data.text"></b>
        </v-flex>
        <v-flex shrink align-self-end>
          <v-btn small color="success" @click="handlerClick(true)">{{ $locale({i: 'iagree'}) }}</v-btn>
          <v-btn small color="error" @click="handlerClick(false)">{{ $locale({i: 'disagree'}) }}</v-btn>
        </v-flex>
      </v-layout>
    </v-alert>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'vd-tikets-view-confirmed',
    props: ['value'],
    computed: {
      data(){
        let obj = {text:null, type:null}
        switch (this.value.statusconfirm){
          case 2:
            obj.text = `Заявлен отказ в этой заявке.<br> Причина: ${this.value.solution}`;
            obj.type = 'refuse';
            break
          case 5:
            obj.text = `Сотрудник желает отложить эту заявку до ${this.$store.getters.momentData(this.value.postpone)}.<br> Причина: ${this.value.postponereason}`;
            obj.type = 'postpone';
            break
        }
        return obj
      }
    },
    methods: {
      handlerClick(check){
        this.$emit('click',this.data.type, check)
      }
    }
  }
</script>

<style>
</style>