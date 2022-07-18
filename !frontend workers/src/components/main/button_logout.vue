<template>
  <v-tooltip bottom>
    <v-btn icon @click.stop.prevent="handlerLogout" slot="activator">
      <v-icon medium class="grey--text text--darken-2">mdi-logout-variant</v-icon>
    </v-btn>
    <span>Выход</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'vd-button-logout',
  methods: {
    handlerLogout(){
       //this.$emit('toggle-settings')
    }
  }
}
</script>

<style>

</style>
