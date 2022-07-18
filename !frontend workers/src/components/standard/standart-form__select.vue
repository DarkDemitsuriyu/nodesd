<template>
  <v-select clearable dense :disabled="disabled" :solo="solo" :label="noTextLabel ? '' : label" :hide-details="hideDetails" item-text="name" item-value="id" :value="computedValue" :items="items" @change="handlerChange" multiple>
    <template slot="selection" slot-scope="{ item, index }">
        <div v-if="index === 0" class="text-truncate" :style="{'max-width':value.length > 1 ? 'calc(100% - 60px)' : '100%'}">
          {{ item.name }}
        </div>
        <div v-if="index === 1" class="grey--text caption">
            (+ еще {{ value.length - 1 }})
        </div>
      
      <!--<v-chip v-if="index === 0" small>
        <span class="grey--text caption">{{ item.name }}</span>
      </v-chip>
      <v-chip v-if="index === 1" small>
        + {{ value.length - 1 }}
      </v-chip>-->
      
    </template>
    <v-tooltip v-if="prependIcon" slot="prepend-inner" bottom>
      <v-icon slot="activator" :color="color || ''">{{prependIcon}}</v-icon>
      {{label}}
    </v-tooltip>
  </v-select>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "vd-standart-form-select",
  props:{
    value:Array,
    items:Array,
    label:String,
    disabled:Boolean,
    hideDetails:Boolean,
    prependIcon:String,
    color:String,
    solo:Boolean,
    noTextLabel:Boolean
  },
  computed:{
    computedValue(){
      return this.value
    }
  },
  methods: {
    handlerChange(val){
      this.$emit('input',val)
    }
  }
};
</script>

<style>

</style>