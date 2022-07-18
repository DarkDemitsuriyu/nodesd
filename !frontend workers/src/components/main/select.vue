<template>
  <table class="w-100">
    <tr>
      <td>
        <el-select class="w-100" :error="error" filterable :disabled="disabled" size="mini" v-model="val" :placeholder="placeholder">
          <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </td>
      <td>
        <el-button :disabled="disabled" style="padding: 7px 10px;" size="mini" icon="el-icon-more" @click="handlerBtnClick"></el-button>
      </td>
    </tr>
  </table>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'vd-select',
  props:{
    error: Boolean,
    disabled:Boolean,
    value:[String, Number],
    list:Array,
    placeholder:String
  },
  computed: {
    val:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      }
    }
  },
  methods: {
    handlerBtnClick(){
      this.$emit('click')
    }
  }
}
</script>

<style>

</style>