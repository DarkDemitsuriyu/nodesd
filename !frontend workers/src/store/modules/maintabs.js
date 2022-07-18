export default {
  state: {
    toolbarsClasses:"white elevation-1 mb-2",
    tempSelectedData:{},
    mainTabs: [/*{
      title: 'Dashboard',
      name: 'dashboard',
      closable: false
    },*/ {
      title: 'Заявки',
      id: 'undefined-tikets',
      name: 'undefined-tikets',
      closable: false,
      newworker:false,
      view: false,
      data: {}
    }],
    selectedMainTab: 'undefined-tikets',//'dashboard'
    defaultOptions:{
      title: '',
      id:'',
      name: '',
      closable: true,
      newworker:false,
      view: false,
      data: {}
    },
    openSubMenu:'tikets'
  },
  actions: {
    setSelectedMainTab({commit}, id) {
      commit('SET_SELECTED_MAIN_TAB', id)
    },
    deleteMainTabOnObject({state,commit}, obj) {
      let idx = state.mainTabs.findIndex( el => el.id.includes(obj.id) )
      let nextTab = state.mainTabs[idx + 1] || state.mainTabs[idx - 1]
      commit('SET_SELECTED_MAIN_TAB', nextTab.id)
      commit('DELETE_MAIN_TAB', idx)
    }
  },
  mutations: {
    SET_TEMP_SELECTED_DATA(state,{id,data}){
      state.tempSelectedData[id] = data
    },
    SET_MAIN_TABS(state, tabs) {
      state.mainTabs = tabs;
    },
    ADD_MAIN_TAB(state, tab) {
      state.mainTabs.push(Object.assign({},state.defaultOptions,tab))
    },
    SET_SELECTED_MAIN_TAB(state, id) {
      state.selectedMainTab = id;
    },
    DELETE_MAIN_TAB(state, idx) {
      state.mainTabs.splice(idx, 1)
      console.log(state.mainTabs)
    }
  }
}