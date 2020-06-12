import Vue from 'vue';
import Vuex from 'vuex';
import index from './index.js';
import main from './main.js';
import edit from './edit.js';
import mould from './mould.js';
import stock from './stock.js';
Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        main,//存放共用方法
        index,
        edit,
        mould,
        stock
    }
});
