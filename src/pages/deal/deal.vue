<template>
    <div class="container">
        <div id="deal-title">全部订单</div>
        <div class="body">
            <div class="header">
                <div class="index">订单编号</div>
                <div class="time">生成时间</div>
                <div class="price">订单价格</div>
            </div>
            <div class="deals" :style="styleVar">
                <deal-item v-for="(item, index) in dealsInfo"
                           :key="index"
                           :deal="item"
                           :index="index + 1">
                </deal-item>
            </div>
        </div>
    </div>
</template>

<script>
import dealItem from "@/pages/deal/dealItem";
import {mapState} from "vuex";

export default {
    name: "deal",
    components: {
        dealItem
    },

    data() {
        return  {
            dealsInfo :[]
        }
    },
    computed: {
        ...mapState('sizeInfo', ['screenWidth', 'screenHeight']),
        styleVar() {
            return {
                '--height': this.screenHeight - 250 + 'px',
                '--width': this.screenWidth + 'px'
            }
        }
    },

    //转到该页面时加载订单数据
    mounted() {
        if (!this.$store.state.loginInfo.isLogin) {
            this.$toast.warning("请先登录！")
            this.$router.push('/login')
            return
        }
        this.$axios
            .get(`order/listByUser?userId=${this.$store.state.loginInfo.userId}`)
            .then(
                response => {
                    this.dealsInfo = response.data
                },
                error => {
                    this.$toast.error("网络出错！请刷新再试！")
                    console.log(error)
                }
            )
    }

}
</script>

<style scoped>
.container {
    margin: 20px;
}

#deal-title {
    margin-top: 5px;
    display: inline-block;
    color: red;
    font-weight: bold;
    border-bottom: red solid 2px;
}

.body {
    margin-top: 5px;
}

.header {
    box-sizing: border-box;
    display: flex;
    background-color: #f0f0f0;
    border-radius: 10px;
    outline: 1px #E0E0E0 solid;
    padding-right: 20px;
}

.header > div {
    text-align: center;
    height: 45px;
    line-height: 45px;
}

.index {
    width: 40%;
}

.time {
    width: 40%;
}

.price {
    width: 20%;
}

.deals {
    max-height: var(--height);
    min-height: 300px;
    overflow-y: auto;
}
</style>