import moment from 'moment';

export default {
  state: {
    minimizedWindows:{},
    sideIsCollapsed: true,
    showCreateTiketDialog:false,
    showDialogSettings:false,
    themeShades: ['lighten-4', 'lighten-3', 'lighten-2', 'lighten-1', 'darken-1', 'darken-2', 'darken-3', 'darken-4'],
    themeList: ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey', 'default'],
    format: 'DD.MM.YYYY HH:mm:ss',
    lists:{},
    loading:true
  },
  actions: {
    stopLoading({commit}){
      commit('STOP_LOADING')
    },
    startLoading({commit}){
      commit('START_LOADING')
    },
    addMinimizedWindow(ctx,{id,wind}){
      commit('ADD_MINIMIZED_WINDOW', {id,wind})
    },
    deleteMinimizedWindow(ctx,id){
      commit('DELETE_MINIMIZED_WINDOW', id)
    },
    setSideWidth({commit}, width) {
      commit('SET_SIDE_WIDTH', width)
    },
    sideCollapse(ctx) {
      ctx.commit('SIDE_COLLAPSE')
    },
    sideExpand({
      commit
    }) {
      commit('SIDE_EXPAND')
    },
    setDefaultSideActive({
      commit
    }, item) {
      commit('DEFAULT_SIDE_ACTIVE', item)
    },
    setDataFormat({
      commit
    }, format) {
      commit('SET_DATA_FORMAT', format)
    },
    setDropdownsList({commit}, obj) {
      commit('SET_DROPDOWNS_LIST', obj)
    },
    setAddressbookList({commit}, obj) {
      commit('SET_ADDRESSBOOK_LIST', obj)
    },
  },
  mutations: {
    START_LOADING(state){
      state.loading = true
    },
    STOP_LOADING(state){
      state.loading = false
    },
    SET_SHOW_TIKET_DIALOG(state,value){
      state.showCreateTiketDialog = value
    },
    SET_DIALOG_SETTINGS(state,value){
      state.showDialogSettings = value
    },
    ADD_MINIMIZED_WINDOW(state, {id,wind}) {
      state.minimizedWindows[id] = wind;
    },
    DELETE_MINIMIZED_WINDOW(state, id){
      delete state.minimizedWindows[id]
    },
    SET_SIDE_WIDTH(state, width) {
      state.sideWidth = width;
    },
    SIDE_COLLAPSE(state) {
      state.sideIsCollapsed = true;
    },
    SIDE_EXPAND(state) {
      state.sideIsCollapsed = false;
    },
    DEFAULT_SIDE_ACTIVE(state, item) {
      state.defaultSideActive = item;
    },
    SET_DATA_FORMAT(state, format) {
      state.format = format;
    },
    SET_DROPDOWNS_LIST(state, {item,type}) {
      state.lists[type] = item;
    },
    SET_ADDRESSBOOK_LIST(state, list) {
      state.addressbook = list;
    }
  },
  getters: {
    getSideWidth(state) {
      return state.sideWidth;
    },
    sideIsCollapsed(state) {
      return state.sideIsCollapsed;
    },
    getDefaultSideActive(state) {
      return state.defaultSideActive;
    },
    getTheme(state) {
      return state.themeApp;
    },
    getColor(state) {
      return state.color;
    },
    getThemeShades(state) {
      return state.themeShades;
    },
    getThemeList(state) {
      return state.themeList;
    },
    momentData(state) {
      return (data) => {
        return moment(data).format(state.format);
      }
    }
  }
}
