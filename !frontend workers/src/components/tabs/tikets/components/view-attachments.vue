<template>
  <v-card class="pa-2">
    <template v-if="list">
      <v-item-group>
        <v-item>
          <v-btn  small color="info" flat class="ma-0 lowercase" @click="attachClick(id,list)">
            <v-icon left class="mr-1">description</v-icon>
            <span class="first-char-upper">{{ attachmentName(list,1) }}</span>
          </v-btn>
        </v-item>
      </v-item-group>
    </template>
    <v-layout v-else fill-height>
      <v-flex align-self-center class="text-xs-center grey--text">
        Вложения отсутствуют
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'vd-tikets-view-attachments',
  props: ['list','id','isDisabled'],
  data(){
    return {
      
    }
  },
  methods: {
    attachmentName(attach, idx) {
      let ext = attach.split('.')[3];
      return `Вложение_${idx}.${ext}`;
    },
    attachClick(name, attachment) {
      window.open(`/getFile?type=tiketsAttachment&file=${attachment}&newname=${name}`, 'attachment', 'menubar =no,toolbar=no,location =no,status =no')
    }
  }
}
</script>

<style>

</style>
