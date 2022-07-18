<template>
  <div class="body-1 vd-tikets-view-infocard-item">
    <v-tooltip left v-if="icon">
      <v-icon class="teal--text text--darken-2 vd-tikets-view-infocard-item-icon" slot="activator">{{ icon }}</v-icon>
      <div class="sentence-capitalized">{{ title }}</div>
    </v-tooltip>
    <slot>
      {{ text }}
    </slot>
    <slot name="right">
      <v-btn v-if="copyData" small flat icon color="blue" class="ma-0" v-clipboard="copyData">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'vd-tikets-view-infocard-item',
  props: ['icon','title','copyData','text']
}
</script>

<style>
.vd-tikets-view-infocard-item{
  display:grid;
  grid-template-columns:28px 1fr auto;
  grid-template-rows:1fr;
  align-items: center;
  text-align:left;
}
.vd-tikets-view-infocard-item .v-btn__content{
  justify-content:left;
}
</style>
