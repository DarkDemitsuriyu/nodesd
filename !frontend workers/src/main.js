import Vue from 'vue'
import App from './App'

import ElementUI from 'element-ui';
import locale from 'element-ui/src/locale/lang/ru-RU'
import VueChatScroll from 'vue-chat-scroll'
import VueResource from 'vue-resource';
import store from './store'
import Vuetify from 'vuetify'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client';
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';
import loadHighcharts3d from 'highcharts/highcharts-3d';

import vuescroll from 'vuescroll';

import VueTimeago from 'vue-timeago'

import Localize from 'v-localize';
import VueI18n from 'vue-i18n'

import VueClipboard from 'vue-clipboard2'
import language from './lang/language'
import ElTableTreeColumn from "element-tree-grid/src/index.js";
//import tinymce from 'vue-tinymce-editor'
import VueFroala from 'vue-froala-wysiwyg'
import VueQuillEditor from 'vue-quill-editor'

//import Metro from 'metro4/build/js/metro.js'
//import 'metro4/build/css/metro-all.css'
//console.log(Metro)

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

import Sortable from 'sortablejs'

import vDesk from './vDesk'
import 'vuetify/dist/vuetify.min.css'
import 'element-ui/packages/theme-chalk/lib/index.css'
import '../static/styles/style.css'
import '../static/styles/animation.css'
import '@mdi/font/css/materialdesignicons.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import "../static/styles/material-icons.css";
import "../static/styles/app.css";

import 'froala-editor/js/froala_editor.pkgd.min'
import 'froala-editor/js/languages/ru'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'font-awesome/css/font-awesome.css'
import 'froala-editor/css/froala_style.min.css'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

loadHighcharts3d(Highcharts)

Vue.component('el-table-tree-column', ElTableTreeColumn)

Vue.use(VueHighcharts, {
  Highcharts
});
Vue.use(VueSocketio, socketio('/' /*,{transports: ['websocket']}*/ ), store);

Vue.use(Localize)
Vue.use(VueI18n)

//Vue.use(MultiLanguage, language);
Vue.use(VueChatScroll)
Vue.use(VueClipboard)

Vue.use(VueFroala)
Vue.use(VueQuillEditor, /* { default global options } */ )

Vue.config.productionTip = false

Vue.use(vuescroll,{ops:{
  bar: {
    onlyShowBarOnScroll: false,
    background: '#c1c1c1'
  }
}})

Vue.use(ElementUI, {
  locale
})
Vue.use(VueResource);
Vue.use(Vuetify)
Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'ru-RU',
  locales: {
    'ru-RU': require('vue-timeago/locales/ru-RU.json')
  }
})
Vue.use(vDesk)

VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  switch(this.locale){
    case 'ru-RU':
      if (choice === 0) {
        return 0;
      }
      const tens =  choice.toString().slice(-2)*1
      const teen = tens > 10 && tens < 20;
      const endsWithOne = choice % 10 === 1;
    
      if (!teen && endsWithOne) {
        return 1;
      }
    
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2;
      }
    
      return (choicesLength < 4) ? 2 : 3;
  }
}

/*Vue.directive( "sortable", function( value ) {
  var that = this,
      key = this.arg;

  value = value || {};
  value.onUpdate = function( e ) {
    var vm = that.vm,
        array = vm[ key ],
        target = array[ e.oldIndex ];
    array.$remove( target );
    array.splice( e.newIndex, 0, target );
    vm.$emit( "sort", target, e.oldIndex, e.newIndex );
  };
  // TODO: other callbacks...

  Sortable.create( this.el, value );
});*/
Vue.directive('sortable', {
  inserted: function (el, binding) {
    var sortable = new Sortable(el, binding.value || {});
  }
});

let localize = Localize.config(language)
console.log(language)
let app = new Vue({
  el: '#app',
  i18n:new VueI18n(language),
  //  router,
  store,
  localize,
  /*mounted: function () {
    Metro.init();
  },*/
  template: '<App/>',
  components: {
    App 
  }
})
/*
Sortable.create(byId('multi'), {
		animation: 150,
		draggable: '.tile',
		handle: '.tile__name'
	});
*/