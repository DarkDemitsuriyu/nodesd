<template>
  <v-menu :close-on-content-click="false" max-height="300px" max-width="300px" :nudge-right="84" right offset-y>
    <v-btn flat slot="activator">
      <span>{{titleBtn}}</span>
      <v-icon dark>arrow_drop_down</v-icon>
    </v-btn>
    <!--<v-toolbar-title slot="activator">
      <span>{{titleBtn}}</span>
      <v-icon dark>arrow_drop_down</v-icon>
    </v-toolbar-title>-->
    <v-card>
      <v-subheader>{{ titleBtn }}</v-subheader>
      <v-card-text>
        
        <v-layout wrap justify-space-around align-center style="width:100%;">
          <v-progress-circular :size="100" :width="15" :value="75" color="orange" >
            <!--<avatar :username="titleBtn" :size="80">
              
            </avatar>-->
            <v-avatar :size="80">
              <img src="http://10.72.1.253/images/43846936.jpg" />
            </v-avatar>
            
          </v-progress-circular>
          
        </v-layout>
        <v-divider class="mt-2"></v-divider>
        <!--<v-progress-linear value="75" height="5" info></v-progress-linear>-->
        <span class="grey--text">Уровень: 30</span>
        <v-divider></v-divider>
        <v-layout wrap justify-space-around align-center style="width:100%;">
          <v-btn outline color="info">Профиль</v-btn>
          <v-btn outline color="error">Выход</v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { Avatar } from 'vue-avatar'
export default {
  name: 'nav-worker-button',
  components: {
    Avatar
  },
  props: {
    titleBtn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
