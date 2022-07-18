import moment from 'moment';
export default {
  state: {
   /*forumsknowledgebase: [],
    knowledgebase:[],
    links:[]*/
  },
  actions: {
    setAdditionallyList(ctx, obj) {
     // ctx.commit('SET_FILLING_LIST', obj)
    }/*,
    addFillingInList(ctx, obj) {
      switch(obj.type){
        default: ctx.commit('ADD_FILLING_IN_LIST', obj); break;
      }
    },
    updateFillingInList(ctx, obj) {
      switch(obj.type){
        default: ctx.commit('UPDATE_FILLING_IN_LIST', obj); break;
      }
    },
    deleteFillingInList(ctx, obj) {
      switch(obj.type){
        default: ctx.commit('DELETE_FILLING_IN_LIST', obj); break;
      }
    }*/
  },
  mutations: {
    /*SET_FILLING_LIST(state, {item:data,type}) {
      state[type] = data;
    },
    ADD_FILLING_IN_LIST(state, {item:data,type}) {
      state[type].unshift(data)
    },
    UPDATE_FILLING_IN_LIST(state, {item:data,type}) {
      state[type].forEach((el) => {
        if (el.id === data.id) {
          el = Object.assign(el,data);
        }
      })
    },
    DELETE_FILLING_IN_LIST(state, {item:data,type}) {
      if (state[type].length > 0) {
        let idx = state[type].findIndex( elem => elem.id === data.id);
        state[type].splice(idx, 1);
      }
    }*/
  },
  getters: {

  }
}