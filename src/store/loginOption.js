
/**
 * 保存登录的信息
 * */
export default {
    namespaced: true,
    state: {
        isLogin: false,
        userId: '',
        username: '',
    },

    actions: {

    },
    mutations: {
        signInResponseId(state, userId) {
            state.isLogin = true;
            state.userId = userId;
        },
        signInResponseName(state, username) {
            state.username = username
        },
        singOut(state) {
            state.userId = ''
            state.username = ''
            state.isLogin = false
        }
    },

    getters: {

    }

}