import components from './components'
import numeral from "numeral";
import "numeral/locales/ru.js";
numeral.locale("ru");

let vDesk={}
vDesk.install = function( Vue, options ){

  for(let component in components){
    Vue.component(component, components[component])
  }
  /*Vue.component('vd-component', {
    props:{
      name:{
        type:String,
        required: true
      },
      show:{
        type:Boolean,
        default:true
      }
    },
    render: function (createElement) {
      if(this.show){
        return createElement(this.name,{
          props: {
            componentId: this.name
          }
        })
      }      
    }
  })*/

  Vue.prototype.$vdesk = {
    minimizedWindows:[],
    sendTiketEdit(data,tiket){
      Vue.prototype.$socket.emit('tiket_edit', Object.assign({tiket:tiket.id, worker: tiket.worker }, data))
    },
    sendUpdate({id,data,type}){
      Vue.prototype.$socket.emit('data_update',id,type,data)
      /*Vue.$http.post(`/update/${component.id.replace('-','/')}/${component.type}`,component.selectedData).then(response => {
        component.dialogVisible = false
        //return true
      });*/
    },
    randomGenerator(len=8){
      let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let retVal = ""
      for (let i = 0, n = charset.length; i < len; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    },
    sendUpdateNoDialog(component){
      Vue.$http.post(`/update/${component.id.replace('-','/')}/${component.type}`,component.selectedData).then(response => {});
    },
    copyArray(array){
      let newA = array.map( item => {
        let el = Object.assign({},item)
        if(el.children){
          el.children = this.copyArray(el.children)
        }
        return el
      })
      return newA
    },
    formatNumeral(val,format = "0,0.00 $"){
      switch(format){
        case 'pl':
          return `${val} шт.`//val ?  : ''//${Vue.prototype.$locale({i: 'numberAbbr'})}
      }
      return numeral(+val).format(format)
    },
    filterTable(value,list){
      if(value && (list || list.length>0)){
        return list.filter( el => Object.values(el).toString().trim().toUpperCase().includes( value.trim().toUpperCase() ) )
      } else {
        return list
      } 
    },
    filterTree(value,list,folders){
      let search = function(array,value){
        let np=[]
        array.forEach( el => {
          if(el.children){
            np=np.concat(search(el.children,value))
          } else {
            for(let key in el){
              if(folders.includes(key)){
                if(el[key] && el[key].toString().toLowerCase().includes(value.toLowerCase())){
                  el.depth=0
                  np.push(el)
                  return false
                }
              }              
            }
          }
        })
        return np
      }
      return value ? search(this.copyArray(list),value) : list
    },
    tableRow_Delete(component,row){
      if(row){
        Vue.prototype.$confirm(`Вы пытаетесь удалить пункт - ${row.name}. Продолжить?`, 'Warning', {
          confirmButtonText: 'Да',
          cancelButtonText: 'Нет',
          type: 'warning'
        }).then(() => {
          this.sendUpdate({id:component,data:{id:row.id},type:'delete'})
          Vue.prototype.$message({type: 'success',message: 'Удаление выполнено'});
        }).catch(() => {
          Vue.prototype.$message({type: 'info',message: 'Удаление отменено'});
        });
      } else {
        Vue.prototype.$message({type: 'info',message: 'Не выделено ни одной строки'});
      }
    },
    tableRow_Edit(component,row){
      if(row){
        component.formData.forEach( el => el.value = row[el.name] )
        //component.selectedData = Object.assign({},row)
        component.type="update"
        component.dialogVisible=true
      }
    },
    tableRow_Add(component){
      Object.keys(component.selectedData).forEach( key => component.selectedData[key] = null )
      component.type="new"
      component.dialogVisible = true
    }
  }
}

export default vDesk