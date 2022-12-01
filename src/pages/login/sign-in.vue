<template>
    <div id="container">
        <p>登 录</p>
        <div :class="{'div-focus': nameFocus}">
            <span :class="{'span-focus': nameFocus}">账号</span>
            <input
                type="text"
                ref="username"
                placeholder="账号"
                v-model.trim="username"
                @focusin="nameFocus = true"
                @focusout="nameFocus = false"
                @keydown.enter="focusNext"
                :class="{'input-focus': nameFocus}">
        </div>
        <div :class="{'div-focus': pwdFocus}">
            <span :class="{'span-focus': pwdFocus}">密码</span>
            <input
                type="password"
                ref="password"
                placeholder="密码"
                v-model.trim="password"
                @focusin="pwdFocus = true"
                @focusout="pwdFocus = false"
                @keydown.enter="signIn()"
                :class="{'input-focus': pwdFocus}">
        </div>
        <button @click="signIn">登录</button>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
        name: "login-in",

        data() {
            return {
                username: this.$route.params.username,
                password: this.$route.params.password,
                nameFocus: false,
                pwdFocus: false
            }
        },
        methods: {
            focusNext(e) {
                const inputs = Array.from(document.querySelectorAll('input[type="password"]'));
                const index = inputs.indexOf(e.target);

                if (index < inputs.length) {
                    inputs[index + 1].focus();
                }
            },

            //登录方法
            signIn() {
                if(this.username.length === 0 || this.password.length === 0) {
                    this.$toast.error('用户名或密码不可为空!')
                    return
                }
                this.$axios
                    .get(`user/login?name=${this.username}&password=${this.password}`)
                    .then(
                        response => {
                            if (response.data === 'invalid') this.$toast.error('该账号不存在或密码错误！')
                            else {
                                this.signInResponseId(response.data) //把返回的用户id和用户的账号更新到store里面
                                this.signInResponseName( this.username)
                                this.$toast.success('登录成功')
                                this.$router.replace('/goodsList') //路由导航到商品列表
                            }
                        },
                        error => {
                            console.log(error)
                            this.$toast.error('网络错误！登陆失败')
                        }
                    )
            },
            ...mapMutations('loginInfo', ['signInResponseId', 'signInResponseName'])
        },

        mounted() {
        }
    }
</script>

<style scoped>
    #container {
        display: flex;
        height: 450px;
        width: 500px;
        text-align: center;
        background-color: white;
        flex-direction: column;
    }

    p {
        margin-top: 15%;
        font-size: 35px;
        color: cornflowerblue;
        font-weight: bold;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    span {
        margin-right: 5%;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }


    input {
        width: 70%;
        height: 40px;
        margin-top: 20px;
        border-radius: 3px;
        border: 1px solid #E0E0E0;
        padding: 0 10px 0 10px;
    }

    .div-focus {
        transition: 0.5s ease;
        transform: scale(1.05);
    }

    .input-focus{
        border: 1px solid cornflowerblue;
        outline: none;
        caret-color: cornflowerblue;
        color: cornflowerblue;
        font-size: 16px;
        font-weight: lighter;
    }

    .span-focus {
        color: cornflowerblue;
    }

    button {
        box-sizing: border-box;
        width: 30%;
        height: 10%;
        margin: 10% 15% 0 35%;
        text-align: center;
        font-size: 18px;
        outline: none;
        background-color: #f0f0f0;
        border: none;
        border-radius: 3px;
    }

    button:hover {
        background-color: #E0E0E0;
        transition: 0.3s;
        transform: scale(1.05);
    }



</style>