import Vuex from "vuex";
import Vue from 'vue';

import loginOption from "@/store/loginOption";
import cartOption from "@/store/cartOption";
import sizeOption from "@/store/sizeOption";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        loginInfo: loginOption,
        cartInfo: cartOption,
        sizeInfo: sizeOption
    }
})