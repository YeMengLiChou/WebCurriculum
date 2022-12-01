<template>
    <div class="cart-row">
        <div class="check">
            <input
                ref="allChecked"
                type="checkbox"
                v-model="checked"
                :value="checked">
        </div>
        <div class="goods">
            <img :src="'http://202.193.52.185:8080/' + imgUrl" alt="pic">
            <span v-text="goodName"></span>
        </div>
        <div class="price">
            <span>￥{{singlePrice}}</span>
        </div>
        <div class="number">
            <div class="count-minus" @click="countDecrement">-</div>
            <div class="value"
                 ref="value"
                 contenteditable="true"
                 v-text="count"
                 @focus="focused = true"
                 @keydown.enter.prevent="focused = false"
                 @focusout="focused = false">
            </div><!--回车和失去焦点时更新数据--->

            <div class="count-add" @click="countIncrement">+</div>
        </div>
        <div class="sum-price">
            <span>￥{{sumPrice}}</span>
        </div>
        <div class="operation">
            <button @click="deleteGoods(cartId)">删除</button>
        </div>
    </div>

</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex';

export default {
        name: "cart-row",
        props: {
            'cartId': {
                type: String,
                required: true
            },
            'goodId': {
                type: String,
                required: true,
            },
            'imgUrl': {
                type: String,
                required: true,
            },
            'goodName': {
                type: String,
                required: true,
            },
            'price': {
                type: Number,
                required: true,
            },
            'num': {
                type: Number,
                required: true,
            },
            'index': {
                type: Number,
                required: true,
            }
        }, //传入参数

        data() {
            return {
                //商品数量
                count: this.num,
                //是否编辑ing
                focused: false,
            }
        },
        computed: {
            ...mapState('cartInfo', ['goods','cartGoods', "isAllChecked"]),
            //当前商品的总价格
            sumPrice() {
                return (parseFloat(this.count) * parseFloat(this.singlePrice)).toFixed(2)
            },
            //当前商品价格
            singlePrice() {
                return this.goods[this.goodId]
            },
            //选中状态
            checked: {
                get() {
                    return this.cartGoods[this.index].checked
                },
                set(newValue) {
                    if (newValue && this.count === 0) {
                        this.$refs.allChecked.checked = false
                        this.$toast.warning("数量为0的商品无法选中!")
                        return false
                    }
                    this.updateChecked({"checked": newValue, "index": this.index, "count": this.count})
                }
            }
        },
        watch: {
            //监视 `focused` 变量： 若为false，代表失去焦点或者按下回车，内容进行修改
            focused() {
                if (!this.focused) {
                    this.updateInputCount()
                }
            },

            //监视商品的数量
            count(newValue) {
                this.updateCount({"count": newValue, "index": this.index})
            }
        },
        methods: {
            //数量加
            countIncrement() {
                this.addGoodToCart({'goodsId': this.goodId, 'num': 1, 'tips': false})
            },
            //数量减
            countDecrement() {
                if(this.count > 0) {
                    this.addGoodToCart({'goodsId': this.goodId, 'num': -1, 'tips': false})
                }
            },
            //更新输入框数字
            updateInputCount() {
                let content = this.$refs.value.innerHTML.replace('<br>', ''); //回车的时候会输入一个 <br>
                let newValue = Number(content)
                if (isNaN(newValue)) {
                    this.$refs.value.innerHTML = this.count
                    this.$toast.warning('请确保输入内容为数字！')
                }
                else if(newValue < 0) {
                    this.$refs.value.innerHTML = this.count
                    this.$toast.warning('请勿输入负数', )
                } else {
                    this.count = newValue
                }
            },
            ...mapActions('cartInfo', ['deleteGoods', 'addGoodToCart']),
            ...mapMutations('cartInfo', ['updateChecked', 'updateCount'])
        }
    }
</script>

<style scoped>
    div {
        box-sizing: border-box;
    }

    .cart-row {
        height: 150px;
        text-align: center;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        align-items: center;
        overflow: hidden;
    }

    .cart-row:hover {
        border-radius: 10px;
        background-color: #F9F9F9;
    }

    .check {
        width: 10%;
    }

    .check:hover {
        transition: 0.2s;
        transform: scale(1.15);
    }

    .goods {
        width: 40%;
        display: flex;
        justify-content: center;
    }

    .goods > img {
        max-height: 80px;
        max-width: 80px;
    }

    .goods > span {
        width: 60%;
        text-align: center;
        height: 80px;
        line-height: 80px;
    }

    .price {
        width: 10%;
    }

    .number {
        width: 20%;
        align-items: center;
        display: flex;
        justify-content: center;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    .sum-price {
        width: 15%;
    }

    .operation {
        width: 10%;
        display: flex;
        justify-content: center;
    }

    .count-add, .count-minus {
        width: 30px;
        line-height: 30px;
        height: 30px;
        border: #b0b0b0 solid 1px;
    }

    .count-add:hover, .count-minus:hover {
        background-color: #E0E0E0;
    }

    .value {
        display: inline;
        box-sizing: border-box;
        width: 50px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-top: #b0b0b0 solid 1px;
        border-bottom: #b0b0b0 solid 1px;
        overflow: hidden;
    }

    .operation button {
        color: dodgerblue;
        background: none;
        border: none;
        padding: 10px;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    .operation button:hover {
        background-color: #f0f0f0;
        border-radius: 6px;
        transform: scale(1.1);
        transition: 0.2s;
        color: darkblue;
    }


</style>