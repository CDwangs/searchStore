import Vue from 'vue'
import Vuex from 'vuex'
import app from './store/modules/app'
import getters from './store/getters'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    app
  },
  getters
})

export default store
