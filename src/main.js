import Vue from 'vue'
import App from './App.vue'
import { Slider ,Upload,Loading,Pagination,Radio, RadioGroup,Message,MessageBox,Dialog} from 'element-ui'
import router from './router'
import { store } from './store/store'
import db from './utils/db';
import { get, post, del, put } from './utils/http';
import  {get as _get,set as _set}  from 'lodash'
import  'element-ui/lib/theme-chalk/index.css'
import GlobalButton from "./components/GlobalButton";
import EasyScroll from '@/components/EasyScroll';
import * as THREE from 'three';
import { DatePicker } from 'element-ui';
import { log } from './utils/utilsMethods'

//全局指令 start
import clickOutside from '@/directives/clickOutside';
Vue.use(Vue.directive('clickOutside', clickOutside));
//全局指令 end

Vue.use(Slider);
Vue.use(Upload);
Vue.use(Pagination);
Vue.use(Dialog);
// Vue.use(Message);
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Loading.directive);
Vue.use(DatePicker);
Vue.component('EasyScroll', EasyScroll);
Vue.component('global-button',GlobalButton);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$THREE=THREE;
Vue.config.productionTip = false;
//------------原型添加方法和对象start--------------
Vue.prototype.$getVw = store.getters['main/getVw'];
Vue.prototype.$getVh = store.getters['main/getVh'];
Vue.prototype.$vwToPx = store.getters['main/vwToPx'];
Vue.prototype.$vhToPx = store.getters['main/vhToPx'];
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$del = del;
Vue.prototype._get = _get;
Vue.prototype._set = _set;
Vue.prototype.$dexieDB = db;
Vue.prototype.log = log;
//------------原型添加方法和对象end--------------

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
