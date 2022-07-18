<template>
  <div :class="[view==='left' ? 'py-2 px-2' : 'pa-1' , 'tikets-main-list']">
    <tikets-list-fast-filter class="tikets-main-list-filter"></tikets-list-fast-filter>
    <tikets-list-data @click="handlerListClick" :view="view" class="tikets-main-listview"></tikets-list-data>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'tikets-list',
  computed: mapState({
    view: state => state.worker_data.workerData.tiketsview
  }),
  methods:{
    handlerListClick(value){
      this.$emit('click', value)
    }
  }
}
</script>

<style>
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
.tikets-main-listview .el-table--mini td, .tikets-main-listview .el-table--mini th{
  padding: 2px 0px;  
}

.tikets-main {
  padding: 5px;
  grid-area: table;
  display: grid;
  /*grid-gap: 0.5rem;*/
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
}

.tikets-main.left {
  grid-template-columns: 1fr 2fr;
  grid-template-areas: "list cont";
}

.tikets-main.top {
  grid-template-rows: minmax(250px, 1fr) 2fr;
  grid-template-areas: "list" "cont";
}

.tikets-main.none {
  grid-template-columns: 1fr;
  grid-template-areas: "list";
}

.tikets-main-list {
  grid-area: list;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas: "listFilter" "listList";
  border: 1px solid #dfe6ec;
  border-top: 0px;
}

.tikets-main-list-filter {
  grid-area: listFilter;
  display: grid;
  border-bottom: 1px solid #dfe6ec;
}

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

.tikets-main-list>.tikets-main-listview>.listview-outlook .list-subtitle>span.text-left {
  max-width: 56%;
}

.tiket-list-description {
  max-width: 76%;
}

.tikets-main-list>.tikets-main-listview>.listview-outlook .list-subtitle>span.text-left,
.tiket-list-description {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tikets-main-listview>.listview-outlook>.list {
  cursor: pointer;
}

.tikets-sorter .el-icon-d-caret {
  color: #8492A6;
}

.tikets-main.top .tikets-main-listview,
.tikets-main.none .tikets-main-listview {
  display: grid;
  grid-template-rows: auto 1fr;
}

.tikets-main.top .tikets-main-listview>.el-table,
.tikets-main.none .tikets-main-listview>.el-table {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.tikets-main.top .tikets-main-listview>.el-table,
.tikets-main.top .tikets-main-listview .el-table__header-wrapper,
.tikets-main.top .tikets-main-listview .el-table__body-wrapper,
.tikets-main.none .tikets-main-listview>.el-table,
.tikets-main.none .tikets-main-listview .el-table__header-wrapper,
.tikets-main.none .tikets-main-listview .el-table__body-wrapper {
  width: auto !important;
}
</style>
