<template>
  <v-footer :style="{background:workerData.color}" :class="[workerData.theme, 'vd-footer pa-0 px-0', 'white--text']">
    <!--<v-tooltip top class="vd-exp-tooltip">
      <v-progress-linear slot="activator" value="75" height="7" class="ma-0 exp">
        234/234
      </v-progress-linear>
      <span>234/234</span>
    </v-tooltip>
    <v-progress-circular :size="25" :width="5" :rotate="360" :value="75" color="yellow" >234/234</v-progress-circular>-->
    <v-spacer></v-spacer>
  </v-footer>  
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'vd-footer',
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      workerData: state => state.worker_data.workerData
    }),
    data(){
      return this.$store.getters.getTiketsCountses
    }
  },
  methods: {

  }
}
</script>

<style>
.vd-footer{
  position:relative;
}
.vd-exp-tooltip{
  width: 100%;
  top: 0px;
   position: absolute;
}
.exp{
  position:absolute;
  top:0px;
  filter: invert(100%);
}
</style>
