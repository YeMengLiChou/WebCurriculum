<template>
    <div id="container" >
        <p>注 册</p>
        <div :class="{'div-focus': nameFocus}">
            <span :class="{'span-focus': nameFocus}">账号</span>
            <input
                type="text"
                placeholder="请输入账号"
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
                placeholder="请输入密码"
                v-model.trim="password"
                @focusin="pwdFocus = true"
                @focusout="pwdFocus = false"
                @keydown.enter="register()"
                :class="{'input-focus': pwdFocus}">
        </div>
        <button @click="register">注册</button>
    </div>
</template>

<script>
    export default {
        name: "register",
        data() {
            return {
                username: '', //用户名
                password: '', //密码
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
            //注册
            register() {
                if(this.username.length === 0 || this.password.length === 0) {
                    this.$toast.error('用户名或密码不可为空!')
                    return
                }
                this.$axios
                    .get(`user/register?name=${this.username}&password=${this.password}`)
                    .then(
                        response => { //账号存在返回 isexist, 否则返回OK
                            console.log('@register-response', response.data)
                            if (response.data === 'isexist') {
                                this.$toast.error('该账号已存在！')
                            }
                            else {
                                this.$toast.success('注册成功')
                                this.$router.push({
                                    name:'sign-in',
                                    params: {
                                        'username': this.username,
                                        'password': this.password,
                                    },

                                }) //注册成功后跳转到login
                            }
                        },
                        error => {
                            console.log('@login-error', error.toJSON())
                            this.$toast.error('网络错误！')
                        }
                    )
            },

        },
    }
</script>

<style scoped>
#container {
    display: flex;
    height: 450px;
    width: 500px;
    background-color: white;
    text-align: center;
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