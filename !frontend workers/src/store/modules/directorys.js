import moment from 'moment';
let searchAdd = function (array,data,depth=1){
  let parentExpanded=false
  let newArray =  array.map( el => {
    if(el.id===data._parentId){
      Object.assign(el,{expanded:!el.isItem,count:0})
      data.depth=depth
      parentExpanded=true
      if(el.children){
        el.children.unshift(data)
      } else {
        el.children=[data]
      }      
    } else {
      if(el.children){
        Object.assign(el,searchAdd(el.children,data,depth+1))
      }
    }
    return el
  })
  return {children:newArray,expanded:parentExpanded}
}
let searchUpdate = function (array,data){
  let parentExpanded=false
  let newArray = array.map( el => {
    if(el.id===data.id){
      Object.assign(el,data,{expanded:!el.children})
      parentExpanded=true
    } else {
      if(el.children){
        Object.assign(el,searchUpdate(el.children,data))
      }
    }
    return el
  })
  return {children:newArray,expanded:parentExpanded}
}
let searchDelete = function (array,data){
  let parentExpanded=false
  array.forEach( (el,idx) => {
    if(el.id===data.id){
      array.splice(idx, 1)
      parentExpanded=true
      return false
    } else {
      if(el.children){
        Object.assign(el,searchDelete(el.children,data))
      }
    }
  })
  return {children:array,expanded:parentExpanded}
}
let searchHardwareItems = function(array){
  let np=[]
  array.forEach( el => {
    if(el.isItem){
      np.push(Object.assign({depth:0},el))
    } else {
      if(el.children){
        np=np.concat(searchHardwareItems(el.children))
      }
    }
  })
  return np
}
let searchHardwareDirectorys = function(array,np = []){
  array.forEach( el => {
    if(!el.isItem){
      np.push({id:el.id,name:el.name})
    }
    if(el.children){
      np.concat(searchHardwareDirectorys(el.children,np))
    }
  })
  return np
}
let searchMenu = function(array,directory=false){
  let np=[]
  array.forEach( el => {
    let isValid = directory ? "el.type==='directory'" : "el.type!=='directory'"
    if(eval(isValid)){
      np.push(Object.assign({depth:0},el))
    } else {
      if(el.children){
        np=np.concat(searchMenu(el.children,directory))
      }
    }
  })
  return np
}
let searchMyMenu = function(array,groups,main){
  let returnArray = []
  array.forEach( el => {
    for(let group of groups){
      let isValid = false
      if(el.type === 'directory'){
        let item = Object.assign({},el)
        item.children = searchMyMenu(el.children,groups,el.link)
        if(item.children.length > 0){
          isValid = true
          returnArray.push(item)
        }        
      } else if(el.groups.includes(group)){
        isValid = true
        returnArray.push(Object.assign({},el,{link:el.link.startsWith('http') ? el.link : `${main}-${el.link}`}))
      }
      if(isValid){
        return false
      }
    }
    /*groups.forEach( group => {
      
    })*/
  })
  return returnArray
}
export default {
  state: {
    users: [],
    menu:[],
    hardware:[],
    topics:[],
    newemployeeequipments:[],
    departments:[],
    contractors:[],
    jobtitle:[],
    divisions:[]
  },
  actions: {
    setDirectorysList(ctx, obj) {
      ctx.commit('SET_DIRECTORYS_LIST', obj)
    },
    addDirectorysInList(ctx, obj) {
      switch(obj.type){
        case 'hardware': ctx.commit('ADD_DIRECTORYS_HARDWARE_IN_LIST', obj.item); break;
        case 'menu': ctx.commit('ADD_DIRECTORYS_TREE_IN_LIST', obj); break;
        default: ctx.commit('ADD_DIRECTORYS_IN_LIST', obj); break;
      }
    },
    updateDirectorysInList(ctx, obj) {
      switch(obj.type){
        case 'hardware': ctx.commit('UPDATE_DIRECTORYS_HARDWARE_IN_LIST', obj.item); break;
        case 'users': ctx.commit('UPDATE_DIRECTORYS_USERS_IN_LIST', obj); break;
        case 'menu': ctx.commit('UPDATE_DIRECTORYS_TREE_IN_LIST', obj); break;
        default: ctx.commit('UPDATE_DIRECTORYS_IN_LIST', obj); break;
      }
    },
    deleteDirectorysInList(ctx, obj) {
      switch(obj.type){
        case 'hardware': ctx.commit('DELETE_DIRECTORYS_HARDWARE_IN_LIST', obj.item); break;
        default: ctx.commit('DELETE_DIRECTORYS_IN_LIST', obj); break;
      }
    },
  /*
    setDirectorysUsersList(ctx, list) {
      ctx.commit('SET_DIRECTORYS_USERS_LIST', list)
    },
    setDirectorysHardwareList(ctx, list) {
      ctx.commit('SET_DIRECTORYS_HARDWARE_LIST', list)
    },
  */
   /*addDirectorysHardwareInList(ctx, data) {
      ctx.commit('ADD_DIRECTORYS_HARDWARE_IN_LIST', data)
    },
    updateDirectorysHardwareInList(ctx, obj) {
      ctx.commit('UPDATE_DIRECTORYS_HARDWARE_IN_LIST', obj)
    },
    deleteDirectorysHardwareInList(ctx, obj) {
      ctx.commit('DELETE_DIRECTORYS_HARDWARE_IN_LIST', obj)
    }*/
  /**,
    setDirectorysTopicsList(ctx, list) {
      ctx.commit('SET_DIRECTORYS_TOPICS_LIST', list)
    },
    setDirectorysNewemployeeequipmentsList(ctx, list) {
      ctx.commit('SET_DIRECTORYS_NEWEMPLOYEEEQUIPMENTS_LIST', list)
    },
    setDirectorysDepartmentsList(ctx, list) {
      ctx.commit('SET_DIRECTORYS_DEPARTMENTS_LIST', list)
    },
    addDirectorysDepartmentsInList(ctx, data) {
      ctx.commit('ADD_DIRECTORYS_DEPARTMENTS_IN_LIST', data)
    },
    updateDirectorysDepartmentsInList(ctx, obj) {
      ctx.commit('UPDATE_DIRECTORYS_DEPARTMENTS_IN_LIST', obj)
    },
    deleteDirectorysDepartmentsInList(ctx, obj) {
      ctx.commit('DELETE_DIRECTORYS_DEPARTMENTS_IN_LIST', obj)
    },
    setDirectorysContractorsList(ctx, list) {
      ctx.commit('SET_DIRECTORYS_CONTRACTORS_LIST', list)
    },
    addDirectorysContractorsInList(ctx, data) {
      ctx.commit('ADD_DIRECTORYS_CONTRACTORS_IN_LIST', data)
    },
    updateDirectorysContractorsInList(ctx, obj) {
      ctx.commit('UPDATE_DIRECTORYS_CONTRACTORS_IN_LIST', obj)
    },
    deleteDirectorysContractorsInList(ctx, obj) {
      ctx.commit('DELETE_DIRECTORYS_CONTRACTORS_IN_LIST', obj)
    },
    setDirectorysJobtitleList(ctx, list) {
      ctx.commit('SET_DIRECTORYS_JOBTITLE_LIST', list)
    },
    setDirectorysDivisionsList(ctx, list) {
      ctx.commit('SET_DIRECTORYS_DIVISIONS_LIST', list)
    }
  */
  },
  mutations: {
    SET_DIRECTORYS_LIST(state, {item:data,type}) {
      state[type] = data;
    },
    ADD_DIRECTORYS_IN_LIST(state, {item:data,type}) {
      state[type].unshift(data)
    },
    UPDATE_DIRECTORYS_IN_LIST(state, {item:data,type}) {
      state[type].forEach((el) => {
        if (el.id === data.id) {
          el = Object.assign(el,data);
        }
      })
    },
    DELETE_DIRECTORYS_IN_LIST(state, {item:data,type}) {
      if (state[type].length > 0) {
        let idx = state[type].findIndex( elem => elem.id === data.id);
        state[type].splice(idx, 1);
      }
    },
    UPDATE_DIRECTORYS_USERS_IN_LIST(state, {item:data,type}) {
      state[type].forEach((el) => {
        if (el.login === data.login) {
          el = Object.assign(el,data);
        }
      })
    },
  /*
    SET_DIRECTORYS_USERS_LIST(state, list) {
      state.users = list;
    },
    SET_DIRECTORYS_HARDWARE_LIST(state, list){
      state.hardware = list.data;
    },
  */
    ADD_DIRECTORYS_HARDWARE_IN_LIST(state, data) {
      if(data._parentId){
        let added=searchAdd(state.hardware,data)
        state.hardware=added.children
      } else {
        state.hardware.unshift(data)
      }
    },
    UPDATE_DIRECTORYS_HARDWARE_IN_LIST(state, data) {
      let updated=searchUpdate(state.hardware,data)
      state.hardware=updated.children
    },
    DELETE_DIRECTORYS_HARDWARE_IN_LIST(state, data) {
      let deleted=searchDelete(state.hardware,data)
      state.hardware=[]
    },
    ADD_DIRECTORYS_TREE_IN_LIST(state, {item:data,type}) {
      if(data._parentId){
        let added=searchAdd(state[type],data)
        state[type]=added.children
      } else {
        state[type].unshift(data)
      }
    },
    UPDATE_DIRECTORYS_TREE_IN_LIST(state, {item:data,type}) {
      let updated=searchUpdate(state[type],data)
      state[type]=updated.children
    },
    DELETE_DIRECTORYS_TREE_IN_LIST(state, {item:data,type}) {
      let deleted=searchDelete(state[type],data)
      state[type]=[]
    }
  /*,
    SET_DIRECTORYS_TOPICS_LIST(state, list) {
      state.topics = list;
    },
    SET_DIRECTORYS_NEWEMPLOYEEEQUIPMENTS_LIST(state, list){
      state.newemployeeequipments = list.data;
    },
    SET_DIRECTORYS_DEPARTMENTS_LIST(state, list) {
      state.departments = list;
    },
    ADD_DIRECTORYS_DEPARTMENTS_IN_LIST(state, data) {
      state.departments.unshift(data)
    },
    UPDATE_DIRECTORYS_DEPARTMENTS_IN_LIST(state, data) {
      state.departments.forEach((el) => {
        if (el.id === data.id) {
          el = Object.assign(el,data);
        }
      })
    },
    DELETE_DIRECTORYS_DEPARTMENTS_IN_LIST(state, data) {
      if (state.departments.length > 0) {
        let idx = state.departments.findIndex( elem => elem.id === data.id);
        state.departments.splice(idx, 1);
      }
    },
    SET_DIRECTORYS_CONTRACTORS_LIST(state, list){
      state.contractors = list;
    },
    ADD_DIRECTORYS_CONTRACTORS_IN_LIST(state, data) {
      state.contractors.unshift(data)
    },
    UPDATE_DIRECTORYS_CONTRACTORS_IN_LIST(state, data) {
      state.contractors.forEach((el) => {
        if (el.id === data.id) {
          el = Object.assign(el,data);
        }
      })
    },
    DELETE_DIRECTORYS_CONTRACTORS_IN_LIST(state, data) {
      if (state.contractors.length > 0) {
        let idx = state.contractors.findIndex( elem => elem.id === data.id);
        state.contractors.splice(idx, 1);
      }
    },
    SET_DIRECTORYS_JOBTITLE_LIST(state, list) {
      state.jobtitle = list;
    },
    SET_DIRECTORYS_DIVISIONS_LIST(state, list){
      state.divisions = list;
    }
  */
  },
  getters: {
    getDepartmentName: state => sid => {
      let department = state.departments.find( el => el.sid === sid*1 )
      if(!department){
        return "Неизвестно"
      }
      return department.name
    },
    getHardwareItems(state) {
      return searchHardwareItems(state.hardware)
    },
    getHardwareDirectorys(state) {
      return searchHardwareDirectorys(state.hardware)
    },
    getMenuItems(state) {
      return searchMenu(state.menu)
    },
    getMenuDirectorys(state) {
      return searchMenu(state.menu,true)
    },
    getMySideMenu(state){
      return groups => {
        if(groups){
          return searchMyMenu(state.menu,groups)
        }
        return []
      }      
    }
  }
}
