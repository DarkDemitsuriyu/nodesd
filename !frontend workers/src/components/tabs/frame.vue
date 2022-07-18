<template>
  <iframe :src="id" class="w-100 h-100"></iframe>
</template>

<script>
export default {
  name: 'vd-frame',
  props:['id']
}
</script>

<style>
</style>
