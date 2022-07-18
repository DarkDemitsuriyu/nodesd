export default {
  state:{
    workerData: {},
    sideMenu:[],
    isLogged:false,
    isAdmin:false,
    counts:{

    }
  },
  actions:{
    setWorkerData ({ commit }, data) {
      commit('SET_WORKER_DATA', data)
    },
    setWorkerisLogged ({ commit }, data) {
      commit('SET_WORKER_IS_LOGGED', data)
    },
    setTheme({commit}, theme) {
      commit('SET_THEME', theme)
    },
    setColor({commit}, theme) {
      commit('SET_COLOR', theme)
    },
    setTiketsShowView(ctx, view) {
      ctx.commit('SET_TIKETS_SHOW_VIEW', view)
    },
    setMenu ({ commit }, menu) {
      commit('SET_MENU', menu)
    },
    addMenu({ commit }, menuItem) {
      commit('ADD_MENU', menuItem)
    },
    clearMenu({ commit }){
      commit('CLEAR_MENU')
    }
  },
  mutations:{
    SET_WORKER_DATA(state, data){
      state.workerData=data;
      state.isAdmin=data.groups.includes(2);
    },
    SET_WORKER_IS_LOGGED(state, data){
      state.isLogged=data;
    },
    SET_THEME(state, theme) {
      state.workerData.theme = theme;
    },
    SET_COLOR(state, color) {
      state.workerData.color = color;
    },
    SET_TIKETS_SHOW_VIEW(state, view) {
      state.workerData.tiketsview = view;
    },
    SET_MENU(state, menu){
      state.sideMenu=menu;
    },
    ADD_MENU(state, menuItem){
      state.sideMenu.push(menuItem)
    },
    CLEAR_MENU(state){
      state.sideMenu=[];
    }
  },
  getters:{
    getWorkerData(state) {
      return state.workerData;
    },
    getWorkerLogin(state) {
      return state.workerData.login;
    },
    getWorkerIsAdmin(state) {
      return state.isAdmin;
    },
    getWorkerIsLogged(state) {
      return state.isLogged;
    }
  }
}
