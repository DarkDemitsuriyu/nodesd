import moment from 'moment';
export default {
  state: {
    invoices: [],
    servers: []
  },
  actions: {
    setSharedList(ctx, obj) {
      ctx.commit('SET_SHARED_LIST', obj)
    },
    addSharedInList(ctx, obj) {
      switch(obj.type){
        case 'invoices': ctx.commit('ADD_SHARED_INVOICES_IN_LIST', obj.item); break;
        default: ctx.commit('ADD_SHARED_IN_LIST', obj); break;
      }
    },
    updateSharedInList(ctx, obj) {
      switch(obj.type){
        case 'invoices':/* ctx.commit('UPDATE_DIRECTORYS_HARDWARE_IN_LIST', obj);*/ break;
        default: ctx.commit('UPDATE_SHARED_IN_LIST', obj); break;
      }
    },
    deleteSharedInList(ctx, obj) {
      switch(obj.type){
        case 'invoices': /*ctx.commit('DELETE_DIRECTORYS_HARDWARE_IN_LIST', obj);*/ break;
        default: ctx.commit('DELETE_SHARED_IN_LIST', obj); break;
      }
    }/*,
    setSharedInvoicesList(ctx, list) {
      ctx.commit('SET_SHARED_INVOICES_LIST', list)
    },
    setSharedServersList(ctx, list) {
      ctx.commit('SET_SHARED_SERVERS_LIST', list)
    },
    addSharedInvoicesInList(ctx, data) {
      ctx.commit('ADD_SHARED_INVOICES_IN_LIST', data)
    },*/
  },
  mutations: {
    SET_SHARED_LIST(state, {item:data,type}) {
      state[type] = data;
    },
    ADD_SHARED_IN_LIST(state, {item:data,type}) {
      state[type].unshift(data)
    },
    UPDATE_SHARED_IN_LIST(state, {item:data,type}) {
      state[type].forEach((el) => {
        if (el.id === data.id) {
          el = Object.assign(el,data);
        }
      })
    },
    DELETE_SHARED_IN_LIST(state, {item:data,type}) {
      if (state[type].length > 0) {
        let idx = state[type].findIndex( elem => elem.id === data.id);
        state[type].splice(idx, 1);
      }
    },
    ADD_SHARED_INVOICES_IN_LIST(state, data) {
      let isNew=true;
      state.invoices.forEach(year => {
        if(year.id===data.id){
          isNew=false;
          let isNewMonth=true
          year.children.forEach(month => {
            if(month.id===data.children[0].id){
              isNewMonth=false
              month.children.push(data.children[0].children[0])
            }
          })
          if(isNewMonth){
            year.children.push(data.children[0])
          }
        }
      });
      if(isNew){
        state.invoices.push(data)
      }
    }
  },
  getters: {

  }
}
