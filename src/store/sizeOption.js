
/**
 * 保存窗口尺寸的信息
 * */
export default {
    namespaced: true,
    state: {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
    },

    mutations: {
        changeScreenWidth(state, value) {
            state.screenWidth = value
        },
        changeScreenHeight(state, value) {
            state.screenHeight = value
        },
    },
}