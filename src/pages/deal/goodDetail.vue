<template>
    <div class="container">
        <span v-text="goodsName"></span>
        <span class="price">￥{{(price * num).toFixed(2)}}</span>
        <span v-text="num"></span>
    </div>
</template>

<script>
export default {
    name: "goodDetail",
    props: {
        'goodsId': {
            type: String,
            required: true
        },
        'goodsName': {
            type: String,
            required: true
        },
        'num': {
            type: Number,
            required: true,
        },
        'price': {
            type: Number,
            required: true
        }
    }
}
</script>

<style scoped>
    .container {
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
        font-size: 14px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        border-radius: 10px;
    }

    .container:hover {
        background-color: #F9F9F9;
        transition: 0.2s;
        transform: translateX(-10px);
    }

    span {
        width: 33%;
        text-align: center;
        display: inline-block;
    }

    .price {
        color: #FB3939;
    }

</style>