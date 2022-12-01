<template>
    <div id="app">
        <bar></bar>
        <div id="fill"></div>
        <router-view></router-view>
    </div>
</template>

<script>
import bar from './components/bar'
import login from "@/pages/login/login";
import signIn from "@/pages/login/sign-in";
import register from "@/pages/login/register";
import goodsList from "@/pages/goodList/goodsList";
import deal from "@/pages/deal/deal";
import {mapMutations, mapState} from "vuex";

export default {
        name: 'app',
        components: {
            bar, login, signIn, register, goodsList, deal
        },

        methods: {
            ...mapMutations('sizeInfo', ['changeScreenWidth', "changeScreenHeight"]),
            ...mapMutations('cartInfo', ['updateReadyToDeal', 'updateReadyToLogin'])
        },
        computed: {
            ...mapState('cartInfo', ['readyToLogin', 'readyToDeal'])
        },
        watch: {
            readyToLogin(newValue) {
                if(newValue){
                    this.$router.push('/login')
                    this.updateReadyToLogin(false)
                }
            },
            readyToDeal(newValue) {
                if(newValue) {
                    setTimeout(()=>{
                        this.$router.push('/deal')
                        this.updateReadyToDeal(false)
                    }, 1000) //模拟提交
                }
            }
        },
        mounted() {
            //记录窗口的大小
            let _this = this
            window.onresize = function () {
                _this.changeScreenWidth(window.innerWidth)
                _this.changeScreenHeight(window.innerHeight)
            }
        }
    }
</script>

<style>
    body {
        margin: 0;
    }
    #fill {
        height: 80px;
    }

</style>
