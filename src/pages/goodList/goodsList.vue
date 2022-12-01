<template>
    <div id="container">
        <div id="goods-list-title">全部商品</div>
        <div class="body" :style="styleVar">
            <grid-layout
                :layout="layout"
                 :col-num="columnCount"
                 :col-width="200"
                 :row-height="200"
                 :autoSize="true"
                 :is-draggable="false"
                 :is-resizable="false"
                 :vertical-compact="true"
                 :use-css-transforms="true"
                 :margin="[20, 30]"
            >
                <grid-item
                    v-for="item in layout"
                    :static="false"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    :key="item.data.id">
                    <img :src="`http://202.193.52.185:8080/${item.data.pthumbnail}`" alt="商品图片">
                    <span id="name" v-text="item.data.name"></span>
                    <div id="bottom">
                        <span id="price">￥{{item.data.price1}}</span>
                        <button @click="addGoodToCart({'goodsId': item.data.id, 'num': 1, 'tips': true})">加入购物车</button>
                    </div>
                </grid-item>
            </grid-layout>
        </div>
    </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import {mapActions, mapMutations, mapState} from "vuex";

export default {
        name: "goodsList",

        components: {
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem
        },

        data() {
            return {
                goodsInfo: []
            }
        },
        computed: {
            ...mapState('sizeInfo', ['screenWidth', 'screenHeight']),

            columnCount() {
                return parseInt((this.screenWidth - 200)/ 300) //列数为屏幕宽度 / 子项宽度400
            },
            //瀑布流数据属性的生成
            layout: {
                get() {
                    let data = []
                    let len = this.goodsInfo.length //返回数据的长度
                    for(let i = 0; i < len; i ++) {
                        data.push({
                            "x": i % this.columnCount,
                            "y": parseInt(i / this.columnCount) * 2,
                            "w": 1,
                            "h": 2,
                            "i": i,
                            "data": this.goodsInfo[i]
                        })
                    }
                    return data
                }
            },

            styleVar() {
                return {
                    '--height': this.screenHeight - 150 + 'px',
                    '--width': this.screenWidth + 'px'
                }
            }
        },
        methods: {
            ...mapActions('cartInfo', ['addGoodToCart']),
            ...mapMutations('cartInfo', ['updateGoodInfo'])
        },
        //打开该页面时开始获取数据
        beforeCreate() {
            this.$axios
                .get("/goods/list")
                .then(
                    response => {
                        this.goodsInfo = response.data //更新返回的数据
                        this.goodsInfo.forEach( (item) => {
                            this.updateGoodInfo({
                                'goodId': item.id,
                                'price': item.price1
                            })
                        })
                    },
                    error => {
                        this.$toast.error("网络错误！")
                    }
                )
        },
        mounted() {

        }
    }
</script>

<style scoped>
#container {
    margin: 20px
}

.vue-grid-layout {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
}

.vue-grid-item {
    box-sizing: border-box;
    border: #fff 1px solid;
    padding: 3% 10px 5% 10px;
    overflow: hidden;
}

.vue-grid-item:hover {
    border-radius: 4px;
    z-index: 1;
    border: #e9e9e9 1px solid;
    box-shadow: #f8f8f8 2px 2px;
    transition: vertical-align;
}

#goods-list-title {
    margin-top: 5px;
    display: inline-block;
    color: red;
    font-weight: bold;
    border-bottom: red solid 2px;
}

#bottom {
    height: 50px;
    margin: 30px 30px 30px 30px;
    display: flex;
    justify-content: space-around;
}

#price {
    display: block;
    text-align: center;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    color: red;
}


#name {
    margin-top: 10px;
    display: block;
    line-height: 20px;
    size: 16px;
    text-align: center;
}

button {
    padding: 10px;
    text-align: center;
    font-size: 16px;
    background: #F2F4F4;
    border-radius: 5px;
    border: none;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}

button:hover {
    background-color: #f0f0f0;
    transition: 0.2s;
    transform: scale(1.1);
    border-radius: 5px;
}

img {
    max-width: 80%;
    max-height: 80%;
    overflow: hidden;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}

.body {
    height: var(--height);
    overflow-y: auto;
}
</style>