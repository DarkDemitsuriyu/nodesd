export default {
  state: {
    noticeData: [],
    mailData: []
  },
  actions: {
    updateNoticeLocalStorageData(ctx) {
      window.localStorage.setItem('notices', JSON.stringify(ctx.state.noticeData));
    },
    setNoticeData(ctx, notices) {
      ctx.commit('SET_NOTICE_DATA', notices)
    },
    addNoticeData({commit,dispatch}, notice) {
      commit('ADD_NOTICE_DATA', {dispatch,notice})
    },
    deleteFromNoticeData({commit,dispatch}, notice) {
      commit('DELETE_FROM_NOTICE_DATA', {dispatch,notice})
    },
    deleteAllFromNoticeData({commit,dispatch}, notice) {
      commit('DELETE_ALL_FROM_NOTICE_DATA', {dispatch,notice})
    }
  },
  mutations: {
    SET_NOTICE_DATA(state, notices) {
      state.noticeData = notices || [];
    },
    ADD_NOTICE_DATA(state, {dispatch,notice}) {
      state.noticeData.push(notice);
      dispatch('updateNoticeLocalStorageData');
    },
    DELETE_FROM_NOTICE_DATA(state, {dispatch,notice}) {
      if (state.noticeData.length > 0) {
        let idx = state.noticeData.findIndex((elem, idx) => {
          return elem.tiket === notice.tiket && elem.text === notice.text;
        });
        state.noticeData.splice(idx, 1);
        dispatch('updateNoticeLocalStorageData');
      }
    },
    DELETE_ALL_FROM_NOTICE_DATA(state, {dispatch}) {
      state.noticeData=[]
      dispatch('updateNoticeLocalStorageData');
    }
  },
  getters: {
    
  }
}
