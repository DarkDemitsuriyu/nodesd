<template>
  <v-tooltip bottom>
    <v-btn icon @click.stop.prevent="" slot="activator">
      <v-avatar light :size="32" color="grey lighten-4"><!-- :color="workerData.theme" -->
        <!--<b style="color:white">{{ workerData.surname[0] }}{{ workerData.name[0] }}{{ workerData.patronymic[0] }}</b>-->
        <img src="/static/logo.png" alt="avatar">
      </v-avatar>
      <!--<avatar class="float:left" :username="`${ workerData.surname } ${ workerData.name } ${ workerData.patronymic }`" :size="32"></avatar>-->
    </v-btn>
    <span>
      {{ workerData.surname }} {{ workerData.name }} {{ workerData.patronymic }}<br>
      Опыт: 231/234<br>
      Уровень: 30
    </span>
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex'
//import { Avatar } from 'vue-avatar'
export default {
  name: 'vd-button-profile',  
  /*components: {
    Avatar
  },*/
  computed: mapState({
    workerData: state => state.worker_data.workerData
  })
}
</script>

<style>

</style>
