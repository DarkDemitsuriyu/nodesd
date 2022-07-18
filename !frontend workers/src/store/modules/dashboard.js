function getMaxValue(array){
  var max = array[0];
  for (var i = 0; i < array.length; i++) {
      if (max < array[i]) max = array[i]; 
  }
  return max;
}
function getMinValue(array){
  var min = array[0];
  for (var i = 0; i < array.length; i++) {
      if (min > array[i]) min = array[i];
  }
  return min;
}
import moment from 'moment'
export default {
  state:{
    charTiketsMyData:[],
    charTiketsAllWorkersData:[],
    charTiketsAllThemesData:[],
    charTiketsAllDepsData:[],
    charTiketsAllSendersData:[],
    charTiketsTrendWorkersYears:[],
    charTiketsExecution:[]
  },
  actions:{
    setCharTiketsMyData ({ commit }, data) {
      commit('SET_CHAR_TIKETS_MY_DATA', data)
    },
    setCharTiketsAllWorkersData ({ commit }, data) {
      commit('SET_CHAR_TIKETS_ALL_WORKERS_DATA', data)
    },
    setCharTiketsAllThemesData ({ commit }, data) {
      commit('SET_CHAR_TIKETS_ALL_THEMES_DATA', data)
    },
    setCharTiketsAllDepsData ({ commit }, data) {
      commit('SET_CHAR_TIKETS_ALL_DEPS_DATA', data)
    },
    setCharTiketsTrendWorkersYears({ commit }, data){
      commit('SET_CHAR_TIKETS_TREND_WORKERS_YEARS', data)
    },
    setCharTiketsExecution({ commit }, data){
      commit('SET_CHAR_TIKETS_EXECUTION', data)
    },
    setCharTiketsAllSendersData({ commit }, data){
      commit('SET_CHAR_TIKETS_ALL_SENDERS_DATA', data)
    }
  },
  mutations:{
    SET_CHAR_TIKETS_MY_DATA(state, data){
      state.charTiketsMyData=data;
    },
    SET_CHAR_TIKETS_ALL_WORKERS_DATA(state, data){
      state.charTiketsAllWorkersData=data;
    },
    SET_CHAR_TIKETS_ALL_THEMES_DATA(state, data){
      state.charTiketsAllThemesData=data;
    },
    SET_CHAR_TIKETS_ALL_DEPS_DATA(state, data){
      state.charTiketsAllDepsData=data;
    },
    SET_CHAR_TIKETS_TREND_WORKERS_YEARS(state, data){
      state.charTiketsTrendWorkersYears=data;
    },
    SET_CHAR_TIKETS_EXECUTION(state, data){
      state.charTiketsExecution=data;
    },
    SET_CHAR_TIKETS_ALL_SENDERS_DATA(state, data){
      state.charTiketsAllSendersData=data;
    }
  },
  getters:{
    getCharTiketsMyData(state) {
      return state.charTiketsMyData;
    },
    getCharTiketsAllWorkersData(state) {
      return state.charTiketsAllWorkersData;
    },
    getCharTiketsExecution(state){
      return state.charTiketsExecution.map( el => {
        return {
          name:el.workerfio,
          data:[
            {
              name:el.workerfio,
              x:0,
              y:el.min*1
            },
            {
              name:el.workerfio,
              x:1,
              y:el.avg*1
            },
            {
              name:el.workerfio,
              x:2,
              y:el.max*1
            }
          ]
        }
      });
    },
    getCharTiketsAllThemesData(state){
      return state.charTiketsAllThemesData.map( el => {
        return {
          name:el.name,
          y:el.y*1
        }
      })
    },
    getCharTiketsAllDepsData(state){
      return state.charTiketsAllDepsData
    },
    getCharTiketsAllSendersData(state){
      return state.charTiketsAllSendersData
    },
    getCharTiketsTrendWorkersYears(state){
      let obj = {}
      state.charTiketsTrendWorkersYears.forEach( el => {
        if(obj[el.name]){
          obj[el.name].push(el)
        } else {
          obj[el.name]=[el]
        }
      });
      return Object.keys(obj).map( key => {
        //let temp = { name:key }
        //temp.data = obj[key].map( el => { return {y:el.y, x:new Date(el.x)}} )
        return { 
          name:key,
          data:obj[key].map( el => { return {y:el.y*1, x:el.x} } )
        } //{name:key,data:obj[key]}
      })
      //return state.charTiketsTrendWorkersYears
    },
    getCharTiketsTrendWorkersYearsYEAR(state){
      let year = 99999999
      let month = 99999999
      state.charTiketsTrendWorkersYears.forEach( el => {
        year = el.year < year ? el.year : year
      });
      state.charTiketsTrendWorkersYears.forEach( el => {
        if(year === el.year){
          month = el.month < month ? el.month : month
        }        
      });
      return {year:year,month:month}
    }
  }
}
