<template>
    <div id="container">
        <router-link
            :to="{ name: 'goodsList' }"
            active-class="active"
            tag="div">商品</router-link>
        <router-link
            :to="{ name: 'cart' }"
            active-class="active"
            tag="div">购物车</router-link>
        <router-link
            :to="{ name: 'deal' }"
            active-class="active"
            tag="div">订单</router-link>
        <router-link
            v-if="!isLogin"
            :to="{ name: 'login' }"
            active-class="active"
            tag="div" v-text="isLoginText"></router-link>
        <div v-else class="username" ref="username" @mouseover="isListShow = true">
            <div v-text="isLoginText"></div>
            <transition name="drop-down">
                <div class="list" v-show="isListShow" ref="dropDown" @click="loginOut">退出登录</div>
            </transition>
        </div>
    </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
        name: "bar",
        data() {
            return {
                isListShow: false
            }
        },
        computed: {
            ...mapState('loginInfo', ['isLogin', 'username']),
            isLoginText() {
                if (this.isLogin) return this.username
                return '登录'
            },

        },
        methods: {
            ...mapMutations('loginInfo', ['singOut']),
            //退出登录
            loginOut() {
                if(confirm("确认退出登录?")) {
                    this.singOut()
                    this.$toast.success("退出登录成功")
                    this.$router.replace('/login')
                }
            }
        },
        mounted() {
            //添加事件，只有在上面的时候才会在展示数据
            let _this = this
            document.addEventListener("mouseover", function( e ){
                if(_this.$refs.username) {
                    if ((!!_this.$refs.username.contains(e.target) || !!_this.$refs.dropDown.contains(e.target) ))
                        return false
                    else
                        _this.isListShow = false;
                }
            })
        }
    }
</script>

<style scoped>
    div {
        box-sizing: border-box;
    }
    #container {
        height: 80px;
        line-height: 80px;
        background-color: transparent;
        position: fixed;
        top: 0;
        display: flex;
        justify-content: right;
        width: 100%;
        z-index: 1000;
        overflow: visible;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;

    }

    #container div {
        min-width: 60px;
        text-align: center;
        padding: 0 30px 0 30px;
    }

    /*路由激活*/
    .active {
        background-color: cornflowerblue;
        color: white;
    }

    .drop-down-enter {
        opacity: 0;
        transform:translate(0px, -80px) scaleY(0.2);
    }
    .drop-down-leave-to {
        opacity: 0;
        transform:translate(0px, -80px) scaleY(0.2);
    }
    .drop-down-enter-active {
        transition: all 0.2s ease-in;
    }
    .drop-down-leave-active {
        transition: all 0.2s ease-out;
    }
    .username:hover {
        background-color: #E0E0E0;
    }

    .list {
        margin-top: 0;
        z-index: 10;
        background-color: #f0f0f0;
        width: 150px;
        text-align: center;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 0 0 5px 5px;
    }

    .list:hover {
        background-color: #E0E0E0;
    }

</style>