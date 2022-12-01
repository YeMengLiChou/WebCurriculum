<template>
    <div class="container">
        <div id="cart-title">购物车全部商品</div>
        <div class="cart-head">
            <div class="check">
                <input id="check-all" type="checkbox" ref="check" v-model="checked">全选
            </div>
            <div class="goods">商品</div>
            <div class="price">单价</div>
            <div class="number">数量</div>
            <div class="sum-price">小计</div>
            <div class="operation">操作</div>
        </div>
        <div class="cart-body" :style="styleVar" v-if="cartGoods.length > 0">
            <cart-row
                v-for="(g, position) in cartGoods"
                  :cart-id="g.cardid"
                  :goodId="g.goodsId"
                  :num="parseInt(g.num)"
                  :price="parseFloat(g.price)"
                  :good-name="g.name"
                  :img-url="g.thumbnail"
                  :index="position"
                  :key="g.cardid">
            </cart-row>
        </div>
        <no-good-tip v-else></no-good-tip>
        <div class="cart-footer">
            <div>
                <div class="delete-goods" @click="deleteGoods()">
                    <span >删除所选的商品</span>
                </div>
                <div class="clear-goods" @click="deleteAll()">
                    <span >清空购物车</span>
                </div>
            </div>
            <div>
                <div class="choose-num">
                    <span v-if="count === 0">未选择商品</span>
                    <div v-else>
                        <span>已选择</span>
                        <span id="goodsCount" v-text="count"></span>
                        <span> 件商品</span>
                    </div>
                </div>
                <div class="sum">
                    <span>总价:</span>
                    <span style="font-size: 20px">￥{{sumPrice}}</span>
                </div>
                <div class="payment" @click="toDeal()">
                    <span >去结算</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import cartRow from "@/pages/cart/cart-row";
import {mapActions, mapMutations, mapState} from "vuex";
import NoGoodTip from "@/pages/cart/noGoodTip";

export default {
        name: "cart",
        components: {
            NoGoodTip,
            cartRow
        },
        computed: {
            ...mapState("cartInfo", ["cartGoods", "checkedCount", "isAllChecked", 'readyToDeal']),
            ...mapState('sizeInfo', ['screenWidth', 'screenHeight']),
            //选中商品的数量
            count() {
                return this.checkedCount
            },

            //选中商品的总价格
            sumPrice() {
                let sum = 0
                for(let index = 0; index < this.cartGoods.length; index ++)
                    if (this.cartGoods[index].checked) {
                        sum += parseInt(this.cartGoods[index].num) * parseFloat(this.cartGoods[index].price)
                    }
                return sum.toFixed(2)
            },
            //是否选中的状态：从store中获取状态，更新store里面的状态
            checked: {
                get() {
                    return this.isAllChecked
                },
                set(value) {
                    this.updateAllChecked(value)
                }
            },
            styleVar() {
                return {
                    '--height': this.screenHeight - 280 + 'px',
                    '--width': this.screenWidth + 'px'
                }
            }
        },
        watch: {
            readyToDeal(newValue) {
                if(newValue) {
                    this.$forceUpdate()
                    setTimeout( () => {
                        this.$axios
                            .get(`cart/listByUser?userId=${this.$store.state.loginInfo.userId}`)
                            .then(
                                response => {
                                    this.initGoods(response.data) //根据返回数据初始化选中数组
                                },
                                error => {
                                    this.$toast.error("网络出错！加载失败！")
                                    console.log(error)
                                }
                            )
                    }, 1000)
                }
            }
        },
        methods: {
            ...mapActions('cartInfo', ['deleteCheckedGoods', 'deleteAllGoods', 'createDeal']),
            ...mapMutations('cartInfo', ['initGoods', "updateAllChecked",]),
            //删除所选商品
            deleteGoods() {
                if (this.checkedCount === 0) this.$toast.warning("未选择商品！", {
                    timeout: 1500
                })
                else {
                    if (confirm("确定删除所选商品?")) {
                        this.deleteCheckedGoods()
                    }
                }
            },
            //删除所有商品
            deleteAll() {
                if (this.cartGoods.length === 0) {
                    this.$toast.warning("购物车为空！")
                } else {
                    if (confirm("确定清空购物车？")) {
                        this.deleteAllGoods()
                    }
                }
            },
            //结算
            toDeal() {
                if (this.checkedCount === 0) {
                    this.$toast.warning("未选中商品！无法结算！")
                } else {
                    this.$toast.info("生成订单中.....", {
                        timeout: 1000
                    })
                    this.createDeal()
                }
            }
        },

        //挂载时判断是否已经登录
        mounted() {
            if (!this.$store.state.loginInfo.isLogin) {
                this.$toast.error('请先登录！')
                this.$router.replace('/login')
                return
            }
            this.$axios
                .get(`cart/listByUser?userId=${this.$store.state.loginInfo.userId}`)
                .then(
                    response => {
                        this.initGoods(response.data) //根据返回数据初始化选中数组
                    },
                    error => {
                        this.$toast.error("网络出错！加载失败！")
                        console.log(error)
                    }
                )
        }
    }
</script>

<style scoped>
    div {
        box-sizing: border-box;
    }
    .container {
        margin: 20px;
    }

    #cart-title {
        margin-top: 5px;
        display: inline-block;
        color: red;
        font-weight: bold;
        border-bottom: red solid 2px;
    }

    .cart-head {
        height: 45px;
        line-height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        margin-top: 5px;
        background-color: #f0f0f0;
        outline: #E0E0E0 solid 1px;
        border-radius: 10px;
        overflow: hidden;
        min-width: 200px;
    }

    .cart-body {
        max-height: var(--height);
        overflow-y: auto;
    }

    /*购物车下方结算*/
    .cart-footer {
        display: flex;
        justify-content: space-between;
        height: 60px;
        line-height: 60px;
        margin-top: 20px;
        outline: #E0E0E0 solid 1px;
        border-radius: 10px;
        background-color: #f0f0f0;
    }

    /*购物车下方结算分左右div*/
    .cart-footer > div{
        display: inline-flex;
    }

    /*选中框*/
    .check {
        width: 10%;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    .check input:hover {
        transition: 0.2s;
        transform: scale(1.15);
    }

    /*商品*/
    .goods {
        width: 40%;
    }
    /*单价*/
    .price {
        width: 10%;
    }
    /*数量*/
    .number {
        width: 20%;
        display: flex;
        justify-content: center;
    }
    /*小计*/
    .sum-price {
        width: 15%;
    }
    /*操作*/
    .operation {
        width: 10%;
        margin-right: 20px;
        text-align: center;
    }

    .delete-goods {
        box-sizing: border-box;
        padding-left: 10px;
        padding-right: 10px;
        text-align: center;
        margin-left: 30px;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    .delete-goods:hover {
        background-color: #E0E0E0;
        border-radius: 5px;
        transform: scale(0.99);
        transition: 0.2s;
    }

    .clear-goods {
        width: fit-content;
        text-align: center;
        margin-left: 30px;
        padding-left: 10px;
        padding-right: 10px;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    .clear-goods:hover {
        background-color: #E0E0E0;
        border-radius: 5px;
        transform: scale(0.99);
        transition: 0.2s;
    }

    .choose-num {
        width: fit-content;
        text-align: center;
        margin-right: 30px;
    }

    .sum {
        width: fit-content;
        text-align: center;
        margin-right: 30px;
    }
    /*显示总价格*/
    .sum > span:last-child {
        color: red;
        font-weight: bolder;
        margin-left: 10px;
    }

    .payment {
        width: 150px;
        text-align: center;
        background-color: red;
        border-radius: 10px;
        color: white;
        font-weight: bolder;
        font-size: 20px;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    .payment:hover {
        transform: scale(1.05);
        transition: 0.5s;
        opacity: 0.9;
    }

    #goodsCount {
        color: red;
        font-weight: bolder;
        margin-left: 10px;
    }
</style>