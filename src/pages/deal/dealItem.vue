<template>
    <div id="container" ref="container" @click="isListShow = true" >
        <div id="total">
            <div id="index"><span v-text="`${deal.id}`"></span></div>
            <div id="time"><span v-text="deal.orderTime"></span><br/></div>
            <div id="price"><span v-text="`￥${sumPrice}`" ></span></div>
        </div>
        <transition name="drop-down">
            <div class="list" v-show="isListShow" ref="dropDown" :style="styleVar">
                <div class="list-header">
                    <div>商品名称</div>
                    <div>商品价格</div>
                    <div>商品数量</div>
                </div>
                <ul class="goods-list">
                    <good-detail
                        v-for="(good, index) in details"
                        :goods-id="good.goodsId"
                        :index="index + 1"
                        :goods-name="good.goodsName"
                        :num="good.nums"
                        :price="good.price"
                        :key="index">
                    </good-detail>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
import GoodsList from "@/pages/goodList/goodsList";
import GoodDetail from "@/pages/deal/goodDetail";
import {mapState} from "vuex";

export default {
    name: "dealItem",
    components: {GoodsList, GoodDetail},
    props: {
        //传入进来的主要数据
        "deal": {
            required: true
        },
        //订单的次序号
        "index": {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            //订单里面商品的信息
            details: [],
            isListShow: false
        }
    },
    computed: {
        ...mapState('cartInfo', ['goods']),
        //计算该订单的总价格
        sumPrice() {
            let sum = 0
            this.details.forEach( (item) => {
                sum += parseFloat(this.goods[item.goodsId]) * parseInt(item.nums)
            })
            return sum.toFixed(2)
        },
        ...mapState('sizeInfo', ['screenWidth', 'screenHeight']),
        styleVar() {
            return {
                '--height': this.screenHeight - 250 + 'px',
                '--width': (this.screenWidth / 3 * 2).toFixed(0) +  'px'
            }
        }
    },

    methods: {
    },
    //创建时解析传入数据
    mounted() {
        this.details = this.deal.orderDetail.map( (item)=> {
            let strings = item.nums.split(",")
            let nums = parseInt(strings[0])
            let price = parseFloat(strings[1].split("=")[1])
            return  {
                "detailId": item.OrderDetailid,
                "goodsId": item.goodsId,
                "goodsName": item.goodsName,
                "nums": nums,
                "price": price
            }
        })
        //添加事件，只有在上面的时候才会在展示数据
        let _this = this
        document.addEventListener("mouseover", function( e ){
            if(_this.$refs.container) {
                if ((!!_this.$refs.container.contains(e.target) || !!_this.$refs.dropDown.contains(e.target) ))
                   return
                else
                    _this.isListShow = false;
            }
        })
    }
}
</script>

<style scoped>
#container {
    box-sizing: border-box;
    height: 100px;
    line-height: 100px;
    width: 100%;
    margin-top: 30px;
    font-size: 20px;
}

#container:hover {
    border-radius: 10px;
    background-color: #F9F9F9;
    box-shadow: #747474;
    transition: 0.2s;
    transform: translateX(-10px);
}

#total {
    width: 100%;
    height: 100%;
    display: flex;
}

#total > div {
    height: 100%;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    overflow: hidden;
}

#index {
    width: 40%;
    text-align: center;
    color: cornflowerblue;
}

#time {
    width: 40%;
    color: deepskyblue;
    font-size: 20px;
    text-align: center;
}

#price {
    width: 20%;
    color: red;
    font-size: 20px;
    text-align: center;
}


.drop-down-enter {
    opacity: 0;
    transform:translate(0px, -80px) scaleY(0.2);
}
.drop-down-leave-to {
    opacity: 0;
    transform:translate(0px, -80px) scaleY(0.2);
}
.drop-down-enter-active {
    transition: all 0.3s ease-in;
}
.drop-down-leave-active {
    transition: all 0.3s ease;
}

.list {
    width: var(--width);
    margin-top: 0;
    z-index: 10;
    background-color: white;
}

.goods-list {
    border-radius: 5px;
    border: 1px solid #E4E7ED;
    max-height: 300px;
    padding: 5px 0;
    margin: 0;
    overflow-y: auto;
}
.list-header {
    display: flex;
    background-color: #f0f0f0;
}

.list-header > div{
    width: 33%;
    text-align: center;
    height: 25px;
    line-height: 25px;
    font-size: 16px;

}
</style>