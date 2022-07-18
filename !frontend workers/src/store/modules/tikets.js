import moment from 'moment';
export default {
  state: {
    leftViewTiketSelected:null,
    list: [],
    archive:[],
    filters:{
      new:false,
      attachments:false,
      important:false,
      archive:false,
      my:true,
      statuses:[3, 5, 6],
      input:null,
      dates:{
        startdateCheck:false,
        deadlineCheck:false,
        enddateCheck:false,
        deadline: {start:null,end:null},
        startdate: {start:null,end:null},
        enddate: {start:null,end:null}
      }
    },
    sorting:{
      ASC:true,
      id:"id"
    },
    viewList: [{
        name: 'Слева',
        type: 'left',
        icon: 'view_quilt'
      },
      {
        name: 'Сверху',
        type: 'top',
        icon: 'view_stream'
      },
      {
        name: 'Все пространство',
        type: 'none',
        icon: 'view_headline'
      }
    ],
    view: 'left'
  },
  actions: {
    setTiketsList(ctx, list) {
      ctx.commit('SET_TIKETS_LIST', list)
    },
    addTiketsInList(ctx, data) {
      ctx.commit('ADD_TIKETS_IN_LIST', data)
    },
    addTiketLog(ctx, obj) {
      ctx.commit('ADD_TIKET_LOG', obj)
    },
    updateTiketsInList(ctx, obj) {
      ctx.commit('UPDATE_TIKETS_IN_LIST', obj)
    },
    deleteTiketsFromList(ctx, obj) {
      ctx.commit('DELETE_TIKETS_FROM_LIST', obj)
      ctx.commit('TIKET_LEFT_VIEW_SELECTED_DELETE')
      ctx.dispatch('deleteMainTabOnObject',obj)
    },
    editTiketData(ctx, obj) {
      ctx.commit('EDIT_TIKET_DATA', obj)
    },
    editTiketShowData({commit,getters}, {data,type}) {
      /*commit('EDIT_TIKETS_SHOW_DATA', {
        getters,
        data,
        type
      })*/
    }
  },
  mutations: {
    TIKET_FILTER_CHANGE(state,{type,val}){
      state.filters[type] = typeof val == "undefined" ? !state.filters[type] : val
    },
    TIKET_FILTER_STATUSES(state,value){
      state.filters.statuses = value
    },
    TIKET_FILTER_INPUT(state,value){
      state.filters.input = value
    },
    TIKET_FILTER_DATE(state,obj){
      state.filters.dates[`${obj.type}`] = obj.value
    },
    TIKET_FILTER_DATE_CHANGE(state,value){
      state.filters.dates[`${value}Check`] = !state.filters.dates[`${value}Check`]
    },
    TIKET_SORT_ASC_CHECK(state,val){
      state.sorting.ASC = !state.sorting.ASC
    },
    TIKET_SORT_DATA_SET(state,value){
      Object.assign(state.sorting, value)
    },
    TIKET_ARCHIVE_DATA_SET(state,value){
      state.archive = value
    },
    TIKET_LEFT_VIEW_SELECTED_ADD(state,value){
      state.leftViewTiketSelected = value
    },
    TIKET_LEFT_VIEW_SELECTED_DELETE(state){
      state.leftViewTiketSelected = null
    },

    SET_TIKETS_LIST(state, {item:data,type}) {
      if(type==='archive'){
        state.archive = data.count        
      } else {
        state.list = data;
      }      
    },
    ADD_TIKETS_IN_LIST(state, data) {
      state.list.push(data);
    },
    UPDATE_TIKETS_IN_LIST(state, data) {
      let dataKeys=Object.keys(data)
      let idd=''
      state.list.forEach((el,idx)=>{
        if(el.id===data.id){
          Object.assign(el,data)
          idd = idx
          /*dataKeys.forEach((key)=>{
            if(key!=='logs' && key!=='id' && key!=='confirmity'){
              el[key]=data[key]
            } else if(key==='logs' && key!=='id' && key!=='confirmity') {
              Array.prototype.push.apply(el[key], data[key]);
            } else if(key!=='logs' && key!=='id' && key==='confirmity') {
              el[key].forEach((cEl,idx) => {
                if(cEl.id===data[key].id) el[key].splice(idx, 1, data[key])
              })
            }
          })*/
        }
      })
    },
    DELETE_TIKETS_FROM_LIST(state, id) {
      if (state.list.length > 0) {
        let idx = state.list.findIndex( elem => elem.id === id );
        state.list.splice(idx, 1);
      }
    },
    EDIT_TIKET_DATA(state, {field,value,id}) {
      state.list.forEach((el) => {
        if (el.id === id) {
          el[field] = value;
        }
      })
    },
    ADD_TIKET_LOG(state, {id,log}) {
      if (state.list.length > 0) {
        let list = state.list
        list.forEach( el => {
          if (el.id === id) {
            el.logs.push(log);
            return false;
          }
        })
      }
    },
    EDIT_TIKETS_SHOW_DATA(state, {getters,data,type}) {
      if (data.msg) {
        data.data.logs = data.msg
      }
      state.list.forEach((el) => {        
        if (el.id === data.data.logs.tiket) {
          el.logs.push(data.data.logs)
        }
      })
    }
  },
  getters: {
    getTiketsList(state, getters) {
      let login = getters.getWorkerLogin;
      let filters = state.filters
      let data = filters.archive ? state.archive : state.list
        
      data = data.filter( tiket => {
        let isValid = true
        if(filters.my){
          if(!tiket.newworker && tiket.worker){
            isValid = isValid && tiket.worker === login
          }
          if(tiket.newworker && tiket.confirmity.length>0){
            isValid = isValid && tiket.confirmity.some( el => el.worker===login) 
          }
        }
        if(filters.new){
          isValid = isValid && tiket.new
        }
        if(filters.attachments){
          isValid = isValid && tiket.attachment
        }
        if(filters.important){
          isValid = isValid && tiket.importance
        }
        if(filters.input){
          isValid = isValid && Object.values(tiket).toString().trim().toUpperCase().includes(filters.input.trim().toUpperCase())
        }
        if(filters.dates.startdateCheck){
          isValid = isValid && moment(tiket.startdate).isBetween(filters.dates.startdate.start, filters.dates.startdate.end)
        }
        if(filters.dates.deadlineCheck){
          isValid = isValid && moment(tiket.deadline).isBetween(filters.dates.deadline.start, filters.dates.deadline.end)
        }
        if(filters.dates.enddateCheck){
          isValid = isValid && moment(tiket.enddate).isBetween(filters.dates.enddate.start, filters.dates.enddate.end)
        }
        isValid = isValid && filters.statuses.some(status => {
          switch(status){
            case 6:
              if (!tiket.statusconfirm) {
                return tiket.status === 3 && moment().diff(moment(tiket.deadline)) > 0 && tiket.worker
              }
              return false
            case 7:
              return tiket.status === 4 && tiket.statusconfirm === 1
            case 8:
              return tiket.status === 3 && tiket.statusconfirm === 2
            default:
              return filters.statuses.includes(tiket.status)
          }
        })
        tiket.expired = !tiket.statusconfirm ? tiket.status === 3 && moment().diff(moment(tiket.deadline)) > 0 : false
        return isValid
      })
      
      data.sort( (a,b) => {
        let id = state.sorting.id
        if(state.sorting.ASC){
          if (a[id] > b[id]) { 
            return 1; 
          } 
          if (a[id] < b[id]) { 
            return -1; 
          }
        } else {
          if (a[id] < b[id]) { 
            return 1; 
          } 
          if (a[id] > b[id]) { 
            return -1; 
          }
        }
        return 0
      })

      return data;
    },
    getTiketsShow: state => id => {
        return state.list.find((el) => el.id === id)
    }
    /*,
    filterTiketsToField(state, getters) {
      return (field, value, type) => {
        let list=getters.getTiketsList(type);
        return list.filter(el => {
          let isValid = false;
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              switch (typeof el[field]) {
                case 'number':
                  if (el[field] === value[i]) {
                    isValid = true;
                  }
                  break;
                default:
                  if (el[field].includes(value[i])) {
                    isValid = true;
                  }
                  bresk;
              }
            }
          } else {
            switch (typeof el[field]) {
              case 'number':
                isValid = el[field] === value[i];
                break;
              default:
                isValid = el[field].includes(value);
                bresk;
            }

          }
          return isValid;
        })
      }
    },
    getTiketsToId(state, getters) {
      return (id, type) => {
        let list=getters.getTiketsList(type)
        return list.filter(el => {
          let isValid = false;
          if (Array.isArray(id)) {
            for (let i = 0; i < id.length; i++) {
              if (el.id.endsWith(id[i])) {
                isValid = true;
              }
            }
          } else {
            isValid = el.id.endsWith(id);
          }
          return isValid;
        })
      }
    },
    getTiketsShowView(state) {
      return state.view;
    },
    getTiketsShowViewList(state) {
      return state.viewList;
    },
    getTiketsCountses(state){
      let returned = {
        done:0,
        denied:0,
        fulfilling:0,
      }
      if(state.list.length>0){
        returned.done = state.list.reduce( (previousValue=0, currentValue, index, array) => {
            return currentValue.status === 1 ? previousValue + 1 : previousValue 
        },0)
        returned.denied = state.list.reduce( (previousValue=0, currentValue, index, array) => {
            return currentValue.status === 2 ? previousValue + 1 : previousValue 
        },0)
        returned.fulfilling = state.list.reduce( (previousValue=0, currentValue, index, array) => {
            return currentValue.status === 3 ? previousValue + 1 : previousValue 
        },0)
      }
      return returned
    }*/
  }
}
