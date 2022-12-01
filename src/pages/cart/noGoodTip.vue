<template>
    <div id="tips" :style="styleVar">
        <span>暂无商品~</span>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "no-good-tip",

    computed: {
        ...mapState('sizeInfo', ['screenWidth', 'screenHeight']),
        styleVar() {
            return {
                '--height': this.screenHeight - 300 + 'px',
                '--width': this.screenWidth + 'px'
            }
        }
    }
}
</script>

<style scoped>
    #tips {
        height: var(--height);
        line-height: var(--height);
        font-size: 30px;
        text-align: center;
        vertical-align: center;
        color: #747474;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }
</style>