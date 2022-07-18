<template>
  <v-card class="standart-tab__card">
    {{columns}}
    <v-data-table :headers="headers" :items="desserts" :items-per-page="5" class="elevation-1" ></v-data-table>
    <!--<el-table ref="table" class="inner" :data="list" :default-expand-all="expand" :row-key="opts.key" :default-sort="opts.defSort" :show-header="opts.headers" size="mini" highlight-current-row @row-dblclick="handlerRowDblClick" @row-click="handlerRowClick">
      <template v-for="column in columns">
        <!--<el-table-tree-column v-if="column.tree" :key="column.prop" :column-key="opts.key" :prop="column.prop" :label="column.label" :width="column.width || 'auto'" file-icon="mdi mdi-24px mdi-file-document" folder-icon="mdi mdi-24px mdi-folder" parent-key="_parentId" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ column.render ? column.render(scope) : scope.row[column.prop] }}
          </template>
        </el-table-tree-column>-->
        <!--<el-table-column  :key="column.prop" :sortable="column.sortable || true" :prop="column.prop" :label="column.label" :width="column.width" :show-overflow-tooltip="!column.tooltipOff">
          <template slot-scope="scope">
            <span v-html="column.render ? column.render(scope) : scope.row[column.prop]"></span>
          </template>
        </el-table-column>
      </template>
    </el-table>-->
    <!--{{filterText}}
    <v-treeview v-if="opts.type === 'tree'" :items="list" :search="filterText" hoverable open-on-click activatable
    @click="handlerTest" @hover="handlerTest" @activate="handlerTest"
    ></v-treeview>-->
  </v-card>
</template>

<script>
export default {
  name: "vd-standart-tab-table",
  props:{
    filterText:String,
    options:Object,
    columns:Array,
    data:Array
  },
  data(){
    return {
      currentRow:null,
      expand:false,
      headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
        ],
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ],
    }
  },
  computed:{
    /*headers(){
      let heads = []
      this.columns.forEach( el => {
        heads.push({text:el.label,value:el.prop,width:el.width})
      })
      return heads
    },*/
    opts(){
      let defaultOptions = {
        defSort:{prop: 'id', order: 'ascending'},
        key:'id',
        type:'table',
        folders:[]
      }
      return Object.assign(defaultOptions,this.options)
    },
    colNames(){
      return this.columns.map( el => el.prop )
    },
    list(){
      if(this.opts.type === 'tree'){

        return this.filterTree(this.filterText,this.data,this.opts.folders)
      } else {
        return this.$vdesk.filterTable(this.filterText,this.data)
      }
    }
  },
  methods:{
    filterTree(value,list,folders){
      let self = this
      console.log(this.colNames)
      let search = function(array,value){
        return array.filter( el => {          
          let isValid = self.colNames.some( col => el[col].toString().toLowerCase().includes(value.toString().toLowerCase()) )
          if(el.children){
            el.children = search(el.children,value)
            if(el.children.length>0){
              isValid = true
            }
          }
          return isValid
        })
      }
      this.expand = true
      return value ? search(this.$vdesk.copyArray(list),value) : list
    },
    handlerRowDblClick(row, event){
      this.$emit('dbl-click',row,event)
    },
    handlerRowClick(row){
      //if(row)
      if(this.currentRow && Object.is(this.currentRow, row)){
        this.currentRow = null
        this.$refs.table.setCurrentRow(null)
      } else {
        this.currentRow = row
        this.$refs.table.setCurrentRow(row);        
      }
      this.$emit('select-item',row)
    },
    handlerTest(){
      console.log(1112222)
    }
  }
};
</script>

<style>

</style>