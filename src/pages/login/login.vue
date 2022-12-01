<template>
    <div id="body" :style="styleVars">
        <div>
            <div id="top">
                <router-link active-class="active" to="sign-in" tag="div" class="title">登录</router-link>
                <router-link active-class="active" to="register" tag="div" class="title">注册</router-link>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import signIn from "@/pages/login/sign-in";
import register from "@/pages/login/register";
import {mapState} from "vuex";

export default {
        name: "login",
        components: {
            signIn, register
        },
        computed: {
            ...mapState('sizeInfo', ['screenWidth', 'screenHeight']),
            styleVars() {
                return {
                    '--height': this.screenHeight - 100 + 'px',
                    '--width': this.screenWidth + 'px',
                }
            }
        }
    }
</script>

<style scoped>
    #body {
        height: var(--height);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    #body:before {
        height: var(--height);
        width: var(--width);
        background-image: url("./../../assets/background.jpg");
        background-size: cover;
        z-index: -1;
        position: absolute;
        content: "";
        /*filter: blur(3px);*/
        /*-webkit-filter: blur(3px);*/
    }

    #body > div {
        background-color: #f0f0f0;
        border-radius: 5px;
        box-shadow: #E0E0E0 1px 2px ;
        z-index: 10;
        opacity: 0.7;
    }

    .title:not(.active):hover {
        background-color: #E0E0E0;
    }

    #top {
        display: flex;
        justify-content: space-around;
        line-height: 60px;
        height: 60px;
        font-size: 20px;
        text-align: center;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    #top > .active {
        width: 60%;
    }

    #top :not(.active) {
        width: 40%;
    }

    /*上方路由激活的样式*/
    .active {
        background-color: cornflowerblue;
        color: white;
    }
</style>