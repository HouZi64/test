<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import EsriMap from './components/EsriMap.vue'
import Home from  './components/Home.vue'
import administrativearea from './components/_Administrative-area.vue'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },components:{
    'v-map':EsriMap,
    'v-home':Home,
    'v-administrativearea':administrativearea
  }
}
</script>

<style>

</style>
