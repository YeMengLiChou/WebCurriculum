import Vue from 'vue'
import App from './App.vue'
import Vuex from "vuex";
import VueRouter from "vue-router";
import router from './router/index'
import store from "./store/index";
import axios from "axios";
import Toast, {POSITION} from 'vue-toastification'
import "vue-toastification/dist/index.css";


Vue.use(Toast, {
    position: POSITION.TOP_CENTER,
    hideProgressBar: true
})

axios.defaults.baseURL = '/api'
Vue.prototype.$axios = axios
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
