export default {
  state: {
    connect: false
  },
  actions: {
    socket_sendtiketchat(ctx, obj) {
      ctx.dispatch('editTiketShowData', {
        data: obj.data,
        type: `tiket${obj.header}`
      })
    },
    socket_tiketUpgrade(ctx, obj){
      console.log('socket_tiketUpgrade',obj)
      switch (obj.action) {
        case 'new':
          ctx.dispatch('addTiketsInList', obj.data)
          break;
        case 'edit':
          ctx.dispatch('updateTiketsInList', obj.data)
          break;
        case 'delete':
          ctx.dispatch('deleteTiketsFromList', obj.id)
          break;
      }
    },
    socket_dataload(ctx, obj) {
      let [main,second] = obj.header.split('-')
      let dispatch = `${main[0].toUpperCase()}${main.substring(1)}InList`
      let data = {item: obj.data,type: second}
      switch (obj.status) {
        case 'new':          
          ctx.dispatch(`add${dispatch}`,data);
          break;
        case 'update':
          ctx.dispatch(`update${dispatch}`,data);
          break;
        case 'delete':
          ctx.dispatch(`delete${dispatch}`,data);
          if (obj.header.includes('tikets')) {
            let type = obj.header.split('-')
            ctx.dispatch('deleteTiketsFromList', {
              id: obj.data.id,
              type: second
            })
          }
          break;
      }
    },
    socket_edittiketstatus(ctx, obj) {
      ctx.dispatch('editTiketShowData', {
        data: obj.data,
        type: `tiket${obj.header}`
      })
    },
    socket_notify(ctx, obj) {
      ctx.dispatch('addNoticeData', obj);
    },
    socket_returned(ctx,obj){
      console.log('socket_returned',obj)
      for(let key in obj){
        let dispatch = `set${key[0].toUpperCase()}${key.slice(1)}List`
        switch(key){
          case 'tikets':
            ctx.dispatch(dispatch,{item:obj[key]});
            break;
          case 'menu':
            ctx.dispatch('setDirectorysList',{item:obj[key],type:'menu'});
            break;
          case 'worker':
            ctx.dispatch('setWorkerData', obj[key]);
            break;
          case 'addressbook':
              ctx.dispatch('setAddressbookList', obj[key]);
              break;
          default:
            for(let skey in obj[key]){
              ctx.dispatch(dispatch,{item:obj[key][skey],type:skey});
            }
            break;
        }
      }
      let notices = JSON.parse(window.localStorage.getItem("notices"));
      ctx.dispatch("setNoticeData", notices);
      ctx.dispatch('setWorkerisLogged', true);
      ctx.dispatch('stopLoading')
    }
  },
  mutations: {
    SOCKET_ERROR(state, status) {
      state.connect = false;
    },
    SOCKET_CONNECT(state, status) {
      state.connect = true;
    },
    SOCKET_DISCONNECT(state, status) {
      state.connect = false;
    }
  },
  getters: {
    getConnection(state) {
      return state.connect;
    }
  }
}
