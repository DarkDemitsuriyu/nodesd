<template>
  <div :class="['vd-tikets',view,'grey','lighten-3']" style="border-top: 1px solid #dfe6ec;">
    <tikets-list-fast-filter class="vd-tikets-list-filter"></tikets-list-fast-filter>
    <tikets-list-data :view="view" class="vd-tikets-list"></tikets-list-data>
    <tikets-view  style="min-width:500px" class="vd-tikets-content" v-if="tiket && view!=='none'" :value="tiket"></tikets-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'undefined-tikets',
  computed: mapState({
    view: state => state.worker_data.workerData.tiketsview,
    tiket: state => state.tikets.leftViewTiketSelected
  })
}
</script>

<style>
/*
.__vuescroll .__view{
  max-width:100%;
}
.active {
  background: #e2e1e1;
}
.list > li:not(:hover):not(.active):not(.tiket-expired){
  border-left: 4px solid #fff;
}
.list > li:hover:not(.tiket-expired){
  border-left: 4px solid #eee;
}
.list > li.active:not(:hover):not(.tiket-expired){
  border-left: 4px solid #e2e1e1;
}
.list > .tiket-expired, .tiket-expired.el-table__row td:first-child {
  border-left: 4px solid #f12d23;
}
.list > .tiket-expired:not(:hover):not(.active){
  background: #f12d23;
}
.list > .tiket-expired:not(:hover):not(.active) .list__tile__title,
.list > .tiket-expired:not(:hover):not(.active) .list__tile__sub-title,
.list > .tiket-expired:not(:hover):not(.active) .list__tile__action-text{
  color: #fff !important;
}
.tiket-expired.el-table__row {
  color: #f12d23 !important;
}
.tiket-expired.el-table__row td:last-child{
  border-right:4px solid #f12d23;
}
.vd-tikets-listview .el-table--mini td, .vd-tikets-listview .el-table--mini th{
  padding: 2px 0px;  
}*/

.vd-tikets {
  padding: 0px 6px;
  display: grid;
  /*grid-gap: 0.5rem;*/
  max-height: 100%;
  /*max-width: 100%;*/
  overflow: hidden;
}
.vd-tikets.left {
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr 2fr;  
  grid-template-areas: "vd-tikets-filter vd-tikets-content" "vd-tikets-list vd-tikets-content";
}
.vd-tikets.left .vd-tikets-content{
    margin-left:3px;
  }
.vd-tikets.top {
  grid-template-rows: auto minmax(250px, 1fr) auto 2fr;
  grid-template-columns: 1fr;
  grid-template-areas: "vd-tikets-filter" "vd-tikets-list" "vd-tikets-content";
}

.vd-tikets.none {
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;  
  grid-template-areas: "vd-tikets-filter" "vd-tikets-list";
}
.vd-tikets-listdiv{
  grid-area: vd-tikets-listdiv;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;  
  grid-template-areas: "vd-tikets-filter" "vd-tikets-list";
  overflow: hidden;
  max-height: 100%;
  min-width:500px;
}
.vd-tikets-list {
  grid-area: vd-tikets-list;
  /*height:100%;*/
  max-height:100%;
  overflow:hidden;
  margin:0px 3px 10px 3px;
}
.vd-tikets-list-filter {
  grid-area: vd-tikets-filter;
  margin:7px 3px 0px 3px;
}
.vd-tikets-content {
  grid-area: vd-tikets-content;
  overflow: hidden;
}

/*
.tikets-filter-date-picker {
  min-width: 690px !important;
  width: 690px;
}

.tikets-filter-date-picker .el-picker-panel [slot="sidebar"],
.tikets-filter-date-picker .el-picker-panel__sidebar {
  width: 160px;
}

.tikets-filter-date-picker .el-picker-panel [slot="sidebar"]+.el-picker-panel__body,
.tikets-filter-date-picker .el-picker-panel__sidebar+.el-picker-panel__body {
  margin-left: 160px;
}

.tikets-main .tikets-filters-dropdown-group {
  justify-self: end;
}

.tikets-main.left .tikets-main-list-filter {
  grid-template-rows: auto auto;
}

.tikets-main.left .tikets-filters-dropdown-group {
  margin: 10px 10px 0px 0px;
}

.tikets-main.top .tikets-filters-dropdown-group,
.tikets-main.none .tikets-filters-dropdown-group {
  margin: 0px;
  margin-right: 10px;
}

.tikets-main-list>.tikets-main-listview {
  grid-area: listList;
  overflow: auto;
  width: auto !important;
}

.tikets-sorter .el-icon-d-caret {
  color: #8492A6;
}
*/
.vd-tikets.top .vd-tikets-list,
.vd-tikets.none .vd-tikets-list {
  display: grid;
  grid-template-rows: auto 1fr;
}

.vd-tikets.top .vd-tikets-list>.el-table,
.vd-tikets.none .vd-tikets-list>.el-table {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.vd-tikets.top .vd-tikets-list>.el-table,
.vd-tikets.top .vd-tikets-list .el-table__header-wrapper,
.vd-tikets.top .vd-tikets-list .el-table__body-wrapper,
.vd-tikets.none .vd-tikets-list>.el-table,
.vd-tikets.none .vd-tikets-list .el-table__header-wrapper,
.vd-tikets.none .vd-tikets-list .el-table__body-wrapper {
  width: auto !important;
}
</style>
