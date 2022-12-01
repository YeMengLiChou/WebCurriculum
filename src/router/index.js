import VueRouter from "vue-router";

import login from "@/pages/login/login";
import cart from "@/pages/cart/cart";
import signIn from "@/pages/login/sign-in";
import register from "@/pages/login/register";
import goodsList from "@/pages/goodList/goodsList";
import deal from "@/pages/deal/deal";

export default new VueRouter({
    routes: [
        { //默认界面是登录界面
            path: '/',
            redirect: '/login'
        },

        { //登录界面
            name: 'login',
            path: '/login',
            component: login,
            redirect: '/login/sign-in',
            children: [
                { //登录界面
                    name: 'sign-in',
                    path: 'sign-in',
                    component: signIn,
                },
                { //注册界面
                    name: 'register',
                    path: 'register',
                    component: register
                }
            ]
        },

        { //购物车界面
            name: 'cart',
            path: '/cart',
            component: cart,
        },
        { //商品界面
            name: 'goodsList',
            path: '/goodsList',
            component: goodsList
        },
        { //订单界面
            name: 'deal',
            path: '/deal',
            component: deal
        }
    ]
})