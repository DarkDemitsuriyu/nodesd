<template>
  <v-card class="vd-table-card" style="">
    <div class="vd-table">
      <div class="vd-table-header" :style="{'grid-template-columns':colWidth}">
        <div class="vd-table-header-cell" v-for="item in genHeaders" :key="item.value" :style="{'max-width':item.width}" @click="handlerClickHeaderCell(item.value)">
          <div>{{item.text}}</div>
          <div class="vd-table-header-cell-icon">
            <v-icon v-show="sortCol === item.value && asc">mdi-sort-ascending</v-icon>
            <v-icon v-show="sortCol === item.value && !asc">mdi-sort-descending</v-icon>
          </div>
        </div>
      </div>
      <div class="vd-table-body">
        <div :style="{'grid-template-columns':colWidth}" :class="[{'vd-table-body-row-active':selectedRow === index},'vd-table-body-row']" v-for="(item,index) in list" :key="index" @click="handlerClickRow(index)">
          <div class="vd-table-body-row-cell" v-for="(header,index) in genHeaders" :key="index+header.value" :style="{'max-width':header.width}">
            <v-tooltip bottom>
              <span slot="activator" >{{item[header.value]}}</span>
              <span>{{item[header.value]}}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {    
    name: 'vd-standard-table',
    props:{
        data:Array,
        searchable:{
            type:Boolean,
            default:false
        },
        headers:Array,
        defaultSort:String
    },
    data(){
        return {
            search:'',
            sortColTemp:null,
            asc:true,
            selectedRow:null,
            colWidth:''
        }
    },
    computed:{
        sortCol:{
            get(){
                return this.sortColTemp || this.defaultSort
            },
            set(val){
                this.sortColTemp = val
            }
        },
        list(){
            let data = this.data
            if(this.sortCol){
                console.log(this.sortCol, data)
                return data.sort( (a,b) => {
                    if (a[this.sortCol] < b[this.sortCol]) {
                        return this.asc ? -1 : 1;
                    }
                    if (a[this.sortCol] > b[this.sortCol]) {
                        return this.asc ? 1 : -1;
                    }
                    return 0;
                })
            } else {
                return data
            }
        },
        genHeaders(){
            return this.headers.map( el => {
                if(el.width){
                    if(!Number.isFinite(el.width)){
                        el.width = el.width.replace('px','')*1
                    }
                    this.colWidth += (el.width + 44) + 'px '
                } else {
                    this.colWidth += '1fr '
                }
                return el
            })
        }
    },
    methods: {
        handlerClickRow(index){
            this.selectedRow = index
        },
        handlerClickHeaderCell(type){
            if(this.sortCol!=type){
                this.sortCol=type
                this.asc=true
            } else {
                this.asc=!this.asc
            }      
        }
    }
}
</script>

<style>
.vd-table-card{
    display:grid;
    grid-template-rows: auto 1fr;
    overflow:hidden;
}
.vd-table{
    display:grid;
    overflow: hidden;
    grid-template-rows: auto 1fr;
    margin:0px;
    padding:0px;
    max-width:100%;
    max-height:100%;
}
.vd-table-header{
    width:100%;
    display:grid;
    text-align:left;
    border-bottom: 1px solid rgba(0,0,0,.12);;
    cursor: pointer;
    align-self:center;
    padding: 5px 15px;
    font-weight: 500;
    font-size: 12px;
}
.vd-table-header-cell{
    /*flex: 1 1 auto;
    flex-grow: 0;*/
    display:flex;
    align-items: center;
    color: rgba(0,0,0,.54);
    padding:0px 7px;
}
.vd-table-header-cell-text{

}
.vd-table-header-cell-icon{
    padding:3px;
    width:24px;
}
.vd-table-body{
    width: 100%;
    flex: 1 1 100%;
    margin:0px;
    padding:0px;
    text-align: center!important;
    overflow-y: auto;
    max-height: 100%;
    max-width: 100%;
}
.vd-table-body-row{
    width:100%;
    display:grid;
    text-align: left;
    border-bottom: 1px solid rgba(0,0,0,.12);
    cursor: pointer;
    align-self:center;
    padding: 5px 15px;
    font-weight: 400;
    font-size: 13px;
}
.vd-table-body-row-active, .vd-table-body-row:hover{
    background: #eee;
}
.vd-table-body-row-cell{
    align-self: center;
    padding: 2px 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
