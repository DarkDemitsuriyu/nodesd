<template>
  <div class="tikets-main-content" v-loading="loading">
    <div :class="['tikets-main',view]" style="border-top: 1px solid #dfe6ec; padding:0px;">
      <tikets-list :statuses="[3, 5, 6, 8]" type="all" @click="handlerListClick"></tikets-list>
      <tikets-view-new-worker v-if="newworker" type="all" :id="tiketID"></tikets-view-new-worker>
      <tikets-view v-else type="all" :id="tiketID"></tikets-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'tikets-all',
  data() {
    return {
      tiketID:null,
      newworker:null,
      loading: false
    }
  },
  computed: {
    ...mapState({
      view: state => state.worker_data.workerData.tiketsview,
    })
  },
  methods: {
    handlerListClick(data){
      this.tiketID=data.id;
      this.newworker=data.newworker;      
    }
  }
}
</script>

<style>
</style>
