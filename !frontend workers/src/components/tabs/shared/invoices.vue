<template>
  <div class="standart-tab shared-invoices__main pa-2">
    <vd-standard-tab :id="id" :columns="columns" :dialog-btn-disabled="!edit" :options="options" :list="treeData" :dialog-width="900" external @dbl-click="handlerRowDblClick" @toolbar-click="handlerToolbarClick" @save-click="handlerSave">

      <v-card-text slot="dialog" class="h-100">
        <v-layout row wrap>
          <v-flex xs3 class="px-2">
            <vd-standart-form-datepicker v-model="data.date" :disabled="!edit" :minDate="null" label="Дата документа" :hide-details="false"></vd-standart-form-datepicker>
          </v-flex>
          <v-flex xs3 class="px-2">
            <v-text-field v-model="data.reason" :disabled="!edit" :label="documentType" :prepend-inner-icon="consignmentNote ? 'mdi-file-document-box-outline' : 'mdi-file-document-box-outline'" @click:prepend-inner="handlerSwitchDocumentType"></v-text-field>
          </v-flex>
          <v-flex xs3 class="px-2">
            <v-autocomplete v-model="data.department" :disabled="!edit" :items="departmentList" clearable label="Подразделение" append-outer-icon="mdi-dots-horizontal-circle-outline" item-text="name" item-value="id" @click:append-outer="btnClick('department')"></v-autocomplete>
          </v-flex>
          <v-flex xs3 class="px-2">
            <v-autocomplete v-model="data.contractor" :disabled="!edit" :items="contractorList" clearable label="Контрагент" append-outer-icon="mdi-dots-horizontal-circle-outline" item-text="name" item-value="id" @click:append-outer="btnClick('contractor')"></v-autocomplete>
          </v-flex>
          <v-flex xs3 class="px-2">
            <v-autocomplete v-model="data.released_jobtitle" :disabled="!edit" :items="jobtitleList" clearable label="Выдал должность" append-outer-icon="mdi-dots-horizontal-circle-outline" item-text="name" item-value="id" @click:append-outer="btnClick('released_jobtitle')"></v-autocomplete>
          </v-flex>
          <v-flex xs3 class="px-2">
            <v-text-field v-model="data.released_fio" :disabled="!edit" label="Выдал ФИО"></v-text-field>
          </v-flex>
          <v-flex xs3 class="px-2">
            <v-autocomplete v-model="data.received_jobtitle" :disabled="!edit" :items="jobtitleList" clearable label="Получил должность" append-outer-icon="mdi-dots-horizontal-circle-outline" item-text="name" item-value="id" @click:append-outer="btnClick('received_jobtitle')"></v-autocomplete>
          </v-flex>
          <v-flex xs3 class="px-2">
            <v-text-field v-model="data.received_fio" :disabled="!edit" label="Получил ФОИ"></v-text-field>
          </v-flex>
          <v-flex xs12 class="pt-2">
            <v-data-table :headers="headers" :items="data.equipments" hide-actions>
              <template v-slot:items="props">
                <td>{{ getListName(hardwareitemsList, props.item.equipment) }}</td>
                <td class="text-xs-right">{{ $vdesk.formatNumeral(props.item.quantity,'pl') }}</td>
                <td class="text-xs-right">{{$vdesk.formatNumeral(computedPrices(props.item).withoutVAT)}}</td>
                <td class="text-xs-right">{{$vdesk.formatNumeral(computedPrices(props.item).price)}}</td>
                <td class="text-xs-right">{{$vdesk.formatNumeral(props.item.total)}}</td>
                <td>
                  <v-icon small class="mr-2" @click="handlerEditItem(props.item)">edit</v-icon>
                  <v-icon small @click="handlerDeleteItem(props.item)">delete</v-icon>
                </td>
              </template>
              <template v-slot:footer>
                <td><strong>Итого</strong></td>
                <td class="text-xs-right"><strong>{{ $vdesk.formatNumeral(computedTotalQuantity,'pl') }}</strong></td>
                <td :colspan="2"></td>
                <td class="text-xs-right"><strong>{{$vdesk.formatNumeral(computedTotalSum)}}</strong></td>
                <td class="text-xs-right">
                  <v-btn :disabled="!edit" @click="handlerAddItem" small icon>
                    <v-icon>add</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>       
          </v-flex>
        </v-layout>
      </v-card-text>        
    </vd-standard-tab>
  
    <v-dialog v-model="addDialogVisible"  max-width="600px" :overlay="true" scrollable>
    	<v-card tile>
        <v-toolbar dark dense :class="['elevation-0',theme]" :style="{background:color}">
          <v-toolbar-items>
            <v-btn flat @click="handlerSaveItem">
              <v-icon left>save</v-icon>
              Сохранить и закрыть
            </v-btn>
          </v-toolbar-items>
					<v-spacer></v-spacer>
					<v-btn icon dark @click.native="addDialogVisible = false">
						<v-icon>close</v-icon>
					</v-btn>
      	</v-toolbar>
				<v-card-text class="h-100">
          <v-form ref="itemsForm" v-model="itemsFormValid">
            <v-layout row wrap>
              <v-flex xs12 class="px-2">
                <v-autocomplete v-model="itemsData.item" :rules="rules" :items="hardwareitemsList" clearable label="Наименование" append-outer-icon="mdi-dots-horizontal-circle-outline" item-text="name" item-value="id" @click:append-outer="btnClick('hardware')" required></v-autocomplete>
              </v-flex>
              <v-flex xs3 class="px-2">
                <v-text-field v-model="itemsData.quantity" :rules="rules" label="Количество" required></v-text-field>
              </v-flex>
              <v-flex xs3 class="px-2">
                <v-text-field v-model="itemsData.total" :rules="rules" label="Сумма" required></v-text-field>
              </v-flex>
              <v-flex xs3 class="px-2">
                <v-text-field :value="$vdesk.formatNumeral(computedPrices(itemsData).price)" label="Цена с НДС" readonly></v-text-field>
              </v-flex>
              <v-flex xs3 class="px-2">
                <v-text-field :value="$vdesk.formatNumeral(computedPrices(itemsData).withoutVAT)" label="Цена без НДС" readonly></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
				</v-card-text>
			</v-card>
		</v-dialog>

    <v-dialog v-model="itemDialogVisible" max-width="703px" :overlay="true" scrollable>
      <v-card tile>
        <v-toolbar dark dense :class="['elevation-0',theme]" :style="{background:color}">
          <v-spacer></v-spacer>
          <v-btn flat icon @click="getEquipmentFromList">
            <v-icon>check</v-icon>
          </v-btn>
          <v-btn icon dark @click.native="itemDialogVisible = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <component :is="component" :id="component" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment"
import { mapState } from "vuex"
export default {
  name: "shared-invoices",
  props:['id'],
  data() {
    let vue = this;
    return {
      columns:[
          {prop:'date', label:'Дата', width:150, render: (scope) => scope.row.isItem ? vue.modeDate(scope.row.date,'DD.MM.YYYY') : scope.row.date},
          {prop:'id', label:'№', width:70, render: (scope) => scope.row.isItem ? scope.row.id : ''},
          {prop:'reason', label:'Основание'},
          {prop:'contractorname', label:'Контрагент', width:230},
          {prop:'departmentname', label:'Подразделение'},
          {prop:'released_fio', label:'Выдал', width:250},
          {prop:'received_fio', label:'Получил', width:250},
          {prop:'total_count', label:'Количество', render: (scope) => scope.row.isItem ? `${ scope.row.total_count } ${ vue.$locale({i: 'numberAbbr'}) }` : ''},
          {prop:'total_sum', label:'Сумма', render: (scope) => scope.row.isItem ? vue.$vdesk.formatNumeral(scope.row.total_sum) : ''}
        ],
      options:{
        defSort:{prop: 'id', order: 'ascending'},
        type:'tree'
      },
      headers: [
        { text: 'Наименование', align: 'left', sortable:false },
        { text: 'Количество', value: 'quantity', sortable:false },
        { text: 'Цена без НДС', sortable:false },
        { text: 'Цена', sortable:false },
        { text: 'Сумма', value: 'total', sortable:false },
        { text: 'Действия', sortable:false}
      ],
      consignmentNote:true,
      data:{
        date:null,
        reason:null,
        department:null,
        contractor:null,
        released_jobtitle:18,
        released_fio: "Дмитриев Александр Николаевич",
        received_jobtitle: 8,
        received_fio: "Волхонцев Дмитрий Александрович",
        equipments:[]
      },
      itemsData:{
        item:null,
        quantity:null,
        total:null,
        edit:false
      },
      rules:[
        v => !!v || 'Поле не должно быть пустым',
      ],
      component:null,
      itemsFormValid:false,
      type:'new',
      edit: false,
      selectType:'',
      dialogVisible: false,
      addDialogVisible: false,
      itemDialogVisible: false,

      selectedData: {
        date: null,
        reason: "",
        document_type: 1,
        department: null,
        contractor: null,
        released_jobtitle: 18,
        released_fio: "Дмитриев Александр Николаевич",
        received_jobtitle: 8,
        received_fio: "Волхонцев Дмитрий Александрович",
        equipments: [
          { name: 123, quantity: 4, withoutVAT: 7, price: 6, total: 5 },
          { name: 123, quantity: 4, withoutVAT: 7, price: 6, total: 5 }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      treeData: state => state.shared.invoices,
      jobtitleList: state => state.directorys.jobtitle,
      departmentList: state => state.directorys.departments,
      contractorList: state => state.directorys.contractors,
      //hardwareitemsList: state => state.settings.lists.hardwareitems,//getHardwareItems
      theme: state => state.worker_data.workerData.theme,
      color: state => state.worker_data.workerData.color
    }),
    documentType(){
      return `${this.consignmentNote ? 'Товарная накладная' : 'Счет-Фактура'} №`
    },
    computedTotalQuantity(){
      return this.data.equipments.reduce( (acc, el) => acc + el.quantity , 0 )
    },
    computedTotalSum(){
      return this.data.equipments.reduce( (acc, el) => acc + el.total , 0 )
    },
    computedItemsDataPrice(){
      return this.itemsData.total ? this.itemsData.total.replace(',','.') / this.itemsData.quantity : ""
    },
    computedItemsDataWithoutVAT(){
      return this.computedItemsDataPrice ? +(this.computedItemsDataPrice / 1.20).toFixed(2) : ""
    },



    hardwareitemsList(){
      return this.$store.getters.getHardwareItems
    },
  },
  methods: {
    computedPrices({quantity,total}){
      if(quantity && total){
        let price = total / quantity
        return { price:price, withoutVAT:+(price / 1.20).toFixed(2) }
      }
      return  { price:'', withoutVAT: '' }
    },
    handlerSwitchDocumentType(){
      this.consignmentNote = !this.consignmentNote
    },
    handlerSave(){
      this.$vdesk.sendUpdate({id:this.id,data:Object.assign({total_count:this.computedTotalQuantity,total_sum:this.computedTotalSum},this.data),type:this.type})
    },
    handlerAddItem(){
      this.itemsData.item = null
      this.itemsData.quantity = null
      this.itemsData.total = null
      this.itemsData.edit = false
      this.addDialogVisible = true
    },
    handlerSaveItem(){
      if(this.$refs.itemsForm.validate()){
        if(this.itemsData.edit){
          this.data.equipments.forEach( el => {
            if(el.equipment === this.itemsData.item){
              el.quantity = +this.itemsData.quantity
              el.total = +this.itemsData.total
              return false
            }            
          },this)
        } else {
          this.data.equipments.push({ equipment: this.itemsData.item, quantity: +this.itemsData.quantity, total: +this.itemsData.total })
        }
        this.addDialogVisible = false
      }  
    },
    handlerEditItem(item){
      this.itemsData.item = item.equipment
      this.itemsData.quantity = item.quantity
      this.itemsData.total = item.total
      this.itemsData.edit = true
      this.addDialogVisible = true
    },
    handlerDeleteItem(item){
      this.type = 'delete'
      const index = this.data.equipments.indexOf(item)
      confirm(`Вы уверены, что хотите удалить элемент "${this.getListName(this.hardwareitemsList, item.equipment)}" на сумму ${this.$vdesk.formatNumeral(item.total)}?`) && this.data.equipments.splice(index, 1)
    },



    handlerToolbarClick(type,row){
      console.log(row)
      switch(type){
        case 'add':
          this.handlerAddClick()
          break
        case 'edit':
          this.handlerEditClick(row)
          break;
        /*case 'delete':
          this.handlerDeleteClick()
          break;
        case 'print':
          this.handlerPrint()
          break;*/
      }
    },
    handlerAddClick() {
      this.edit = true
      this.type = 'new'
      this.data = { date: null, reason: null, document_type: 1, department: null, contractor: null, released_jobtitle: 18, released_fio: "Дмитриев Александр Николаевич", received_jobtitle: 8, received_fio: "Волхонцев Дмитрий Александрович", total_count: 0, total_sum: 0, equipments: [] }
    },
    handlerEditClick(row) {
      console.log(row)
      if (row.isItem) {
        this.handlerRowDblClick(row);
        this.edit = true
        this.type = 'update'
      }
    },
    handlerRowDblClick(row, event) {
      console.log(row)
      if (row.isItem) {
        this.data = Object.assign({}, row)
        this.data.equipments = [].concat(row.equipments)
      }
    },
    modeDate(data, format) {
      return moment(data).format(format);
    },
    btnClick(value){
      switch(value){
        case 'department':
          this.component = 'directorys-departments'
          break
        case 'contractor':
          this.component = 'directorys-contractors'
          break
        case 'released_jobtitle':
        case 'received_jobtitle':
          this.component = 'directorys-jobtitle'
          break
        case 'hardware':
          this.component = 'directorys-hardware'
          break
      }
      this.selectType=value
      this.itemDialogVisible = true
    },
    getEquipmentFromList() {
      let node = Object.assign({},this.$store.state.maintabs.tempSelectedData[this.component])
      if(node){
        if(this.selectType === 'hardware' && node.isItem){
          this.addEquipmentName = node.id
        } else {
          this.data[this.selectType] = node.id
        }
        this.itemDialogVisible = false
        this.$store.commit('SET_TEMP_SELECTED_DATA',{id:this.id,data:null})
      }      
    },
    getListName(list, id) {
      let item = list.find(el => el.id === id )
      return item ? item.name : ""
    },
    /*saveDataAndClose() {
      if(this.saveData()){
        this.dialogVisible = false
      }      
    },
    saveData() {
      let isValid = true;
      console.log('this.id',this.id)
      let keys = Object.keys(this.selectedData);
      keys.forEach(el => {
        if (el === "equipments" && !this.selectedData[el].length > 0) {
          isValid=false
          this.selectedDataValidationErrors[el]=true;
        } else {
          isValid=this.selectedData[el]
          this.selectedDataValidationErrors[el]=!this.selectedData[el];
        }
        if(this.selectedDataValidationErrors[el]){
          setTimeout(()=>{this.selectedDataValidationErrors[el]=!this.selectedDataValidationErrors[el]},2000)
        }
      })
      if (isValid) {
        
        this.edit = false
        this.$http.post(`/update/${this.id.replace('-','/')}/${this.type}`,this.selectedData).then(response => {
          this.selectedData.id = response.body.id
        });
      }
      return isValid
    },*/
    goPrint(printData){
      let equipmentsLength = printData.equipments.length >= 20 ? printData.equipments.length : 20
      let pageCSS = '<link rel="stylesheet" href="/static/styles/print-template.css" type="text/css" />';
      let printWindow = window.open("","","left=50,top=50,width=800, height=600,toolbar=0,scrollbars=1,status=0");
      let equipmentRows = ''
      for(let i=0; i<=equipmentsLength;i++){
        let isValid = printData.equipments[i] != undefined && printData.equipments[i] != 'undefined'
        equipmentRows+=`<tr><td>${i+1}</td><td>${isValid ? printData.equipments[i].name : ''}</td><td>${isValid ? printData.equipments[i].quantity+'шт.' : ''} </td><td>${isValid ? this.$vdesk.formatNumeral(printData.equipments[i].price) : ''}</td><td>${isValid ? this.$vdesk.formatNumeral(printData.equipments[i].total) : ''}</td></tr>`
      }
      printWindow.document.write(pageCSS);
      printWindow.document.write(`<div id="header-mini">ПАО СК &#8243;Росгосстрах&#8243;</div>
				<div style="height:20px"></div>
				<div id="header">Расходная накладная №${printData.id} от ${this.modeDate(printData.date,'DD.MM.YYYY')}</div>
				<div style="height:10px"></div>
				<div style="float:left; width:49%;"><b>Основание:</b> Товарная накладная №${printData.reason}</div>
				<div style="float:right; width:49%;"><b>Подразделение:</b> ${ this.getListName(this.departmentList,printData.department) }</div>
				<div style="height:10px; clear:both;"></div>
				<table class="data-user">
          <tr><th>№</th><th>Наименование</th><th>Количество</th><th>Цена за единицу</th><th>Сумма</th></tr>
          ${equipmentRows}
          <tr><td></td><td style="font-weight:bold; font-size:14px;">Итого</td><td>${printData.total_count} шт.</td><td></td><td>${this.$vdesk.formatNumeral(printData.total_sum)}</td></tr>
	  		</table>
				<div style="height:20px"></div>
				<div class="post"><i>Выдал:</i> ${ this.getListName(this.jobtitleList,printData.released_jobtitle) }____________${printData.released_fio}</div>
				<div style="height:20px"></div>
				<div class="post"><i>Получил:</i>${ this.getListName(this.jobtitleList,printData.received_jobtitle) }____________${printData.received_fio}</div>
				<div style="height:20px"></div>`);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    },
    handlerPrint() {
      let data = this.$refs.refComponent.$children[0].$children[0].store.states.currentRow;
      if(data && !this.dialogVisible){
        if(data.isItem){
          this.goPrint(data)
        }
      } else {
        if(!this.edit){
          this.goPrint(this.data)
        }
      }
    }
  }
};
</script>

<style>

</style>
