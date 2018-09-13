import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import G2 from '@antv/g2';
import Vuex from 'vuex'
import echarts from 'echarts'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(G2);
Vue.use(echarts);
Vue.component('chart', ECharts)

import EsriMap from './components/EsriMap.vue'
import Home from './components/Home.vue'
import _Administrativearea from './components/_Administrative-area.vue'

const routes = [
  { path: '/EsriMap', component: EsriMap },
  { path: '/home', component: Home },
  { path: '/administrativearea', component: _Administrativearea },
  { path: '/*', redirect: '/home' },//默认首页,
];

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
