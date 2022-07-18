<template>
  <div class="tikets-show__description-panel">
    <v-card v-if="!value.newworker" class="h-100">
      <div class="pa-3 subheading">{{value.description}}</div>
    </v-card>
    <template v-else>
      <v-card class="tikets-show__description-list">
        <v-list dense two-line>
          <template v-for="(item, index) in value.confirmity">
            <v-list-tile :key="item.id" @click="handlerQWE(item)" :class="{'active': selectedEQ.id === item.id}">
              <v-list-tile-content>
                <v-list-tile-title :class='classNWcolor(item.status)'>{{item.equipmentname}}</v-list-tile-title>
                <v-list-tile-sub-title :class='classNWcolor(item.status)'>{{ workersList.find( el => el.id === item.worker).name}}</v-list-tile-sub-title>
                <v-list-tile-sub-title :class='classNWcolor(item.status)'>{{item.note}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
      </v-card>        
      <v-card class="tikets-show__description-data h-100">
        <v-toolbar v-if="selectedEQ.id" dense light color="white">
          <v-btn :disabled="(selectedEQ.worker!=workerData.login && disabled) || selectedEQ.status===1" icon @click="handlerNWEditItem(selectedEQ.id)">
            <v-icon v-if="nw.edited!==selectedEQ.id" color="blue" >mdi-circle-edit-outline</v-icon>
            <v-icon v-else color="blue" >mdi-content-save-outline</v-icon>
          </v-btn>
          <v-btn v-if="nw.edited===selectedEQ.id" class="ml-0" icon @click="handlerNWEditCancel">
            <v-icon  color="blue" >mdi-cancel</v-icon>
          </v-btn>
          <v-btn v-else :disabled="selectedEQ.worker!=workerData.login && disabled || nw.edited===selectedEQ.id" class="ml-0" icon @click="handlerNWCompleet(selectedEQ.id)">
            <v-icon v-if="selectedEQ.status!==1" color="green">mdi-checkbox-marked-circle-outline</v-icon>
            <v-icon v-else color="red">undo</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title v-if="selectedEQ.id" style="height:70px" class="font-weight-bold">
          {{selectedEQ.equipmentname}}
        </v-card-title>
        <v-divider v-if="selectedEQ.id" />
        <v-card-text v-if="selectedEQ.id">
          <v-layout fill-height column justify-space-between >
            <v-flex shrink>
              <v-autocomplete label="Исполнитель" :disabled="nw.edited!==selectedEQ.id" :items="workersList" :value="selectedEQ.worker" item-text="name" item-value="id" @change="handlerNWChangeWorker" hide-details></v-autocomplete>
            </v-flex>
            <v-flex>
              <v-textarea label="Заметка" :disabled="nw.edited!==selectedEQ.id" :value="selectedEQ.note" @input="handlerNWInputeNote" hide-details></v-textarea>
            </v-flex>              
          </v-layout>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'vd-tikets-view-description',
    props: ['value','disabled'],
    computed: {
      ...mapState({
        workerData: state => state.worker_data.workerData,
        workersList: state => state.settings.lists.workers
      })
    },
    data(){
      return {
        nw:{
          edited:null,
          editedWorker:null,
          editedNote:null
        },
        selectedEQ:{
          enddate:null,
          equipment:null,
          equipmentname:null,
          id:null,
          note:null,
          status:null,
          statusname:null,
          tiket:null,
          worker:null,
          workerfio:null
        }
      }
    },
    methods: {
      classNWcolor(status){
        return status < 3 ? 'green--text font-italic' : 'text--primary'
      },
      handlerQWE(item){
        console.log('item',item)
        this.selectedEQ = item
      },
      handlerNWGetData(id){
        let confirm = this.value.confirmity.find( el => el.id === id)
        return {
          data:{
            conformity:id,
            equipment:confirm.equipment,
            equipmentname:confirm.equipmentname
          },
          confirm
        }
      },
      handlerNWChangeWorker(login){
        this.nw.editedWorker = login
      },
      handlerNWInputeNote(value){
        this.nw.editedNote = value
      },
      handlerNWCompleet(id){
        console.log(this.selectedEQ)
        let { data,confirm } = this.handlerNWGetData(id)
        Object.assign(data, this.selectedEQ.status === 3 ? {compleet:true} : {refuse:true})
        this.$emit('save',data)
      },
      handlerNWEditItem(id){
        if(this.nw.edited === id){
          let { data,confirm } = this.handlerNWGetData(id)
          let isValid = false
          if(this.nw.compleet === id){
            Object.assign(data,{compleet:true})
          }
          if(this.nw.editedWorker && this.nw.editedWorker !== confirm.worker){
            let newWorker=this.workersList.find( el => el.id === this.nw.editedWorker )
            Object.assign(data,{newWorkerConfirmation: newWorker.id, oldWorkerConfirmation: confirm.worker, newWorkerFullname:newWorker.name, oldWorkerFullname:confirm.workerfio})
            isValid = true
          }
          if(this.nw.editedNote !== confirm.note){
             Object.assign(data,{note:this.nw.editedNote})
             isValid = true
          }
          if(isValid){
            this.$emit('save',data)
          }
          this.handlerNWEditCancel()
        } else {
          this.nw.edited = id
        }
      },
      handlerNWEditCancel(){
        this.nw.edited=this.nw.editedWorker=this.nw.editedNote = null
      },
    },
    watch:{
      'value.confirmity'(val){
        if(this.selectedEQ.id && this.selectedEQ.tiket === this.value.id){
          this.selectedEQ = val.find( el => this.selectedEQ.id === el.id )
        } else {
          this.selectedEQ = { enddate:null, equipment:null, equipmentname:null, id:null, note:null, status:null, statusname:null, tiket:null, worker:null, workerfio:null }
        }
      }
    }
  }
</script>

<style>
.tikets-show__description-list{
  grid-area: tikets-show__description-list !important;
}
.tikets-show__description-data{
  grid-area: tikets-show__description-data !important;
}
</style>