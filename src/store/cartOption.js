/**
 * 保存购物车信息
 * */

import loginOption from "@/store/loginOption";

export default {
    namespaced: true,
    state: {
        //是否全选
        isAllChecked: false,
        //商品的所有信息
        cartGoods: [],
        //已经选中的商品数量
        checkedCount: 0,
        readyToDeal: false,
        readyToLogin: false,
        //商品goodsId与价格的键值对
        goods: {}
    },

    actions: {
        //商品列表添加商品到购物车列表
        addGoodToCart(context, value) {
            if(!loginOption.state.isLogin) { //判断是否已经登录
                this._vm.$toast.warning("请先登录！")
                context.commit('updateReadyToLogin', true) //跳转到登录界面
                return
            }
            //判断是否有相同id的商品
            let find = context.state.cartGoods.find( (item)=> {
                return item.goodsId === value.goodsId
            })
            let price = parseFloat(context.state.goods[value.goodsId]), num = 0
            if(find !== undefined) {
                this._vm.$axios.get(`cart/deleteById?userId=${loginOption.state.userId}&cartId=${find.cardid}`).then(
                    response => {
                        price = value.num * parseFloat(context.state.goods[value.goodsId])
                        num = parseInt(value.num) + parseInt(find.num)
                        this._vm.$axios
                            .get(`cart/add?userId=${loginOption.state.userId}&goodsId=${value.goodsId}&num=${num}&price=${price}`)
                            .then(
                                response => {
                                   //商品还存在,修改指定信息即可
                                    let exit = response.data.find( (item) => {
                                        return item.goodsId === value.goodsId
                                    })
                                    let pre = context.state.cartGoods.find( (item) => {
                                        return item.goodsId === value.goodsId
                                    })
                                    pre.cardid = exit.cardid
                                    pre.price = parseFloat(exit.price)
                                    pre.num = parseInt(exit.num)
                                    if (pre.num === 0) pre.checked = false
                                    else pre.checked = context.state.isAllChecked
                                    if(value.tips) this._vm.$toast.success("添加成功！")
                                },
                                error => {
                                    if(value.tips) this._vm.$toast.error("网络错误!添加商品失败！")
                                    console.log(error)
                                })
                    }
                ) //删除已有商品
            } else num += value.num
            if(num > 0) {
                this._vm.$axios
                    .get(`cart/add?userId=${loginOption.state.userId}&goodsId=${value.goodsId}&num=${num}&price=${price}`)
                    .then(
                        response => {
                            context.commit('initGoods', response.data)
                            if(value.tips) this._vm.$toast.success("添加成功！")
                        },
                        error => {
                            if(value.tips) this._vm.$toast.error("网络错误!添加商品失败！")
                            console.log(error)
                        })
            }

        },
        //删除某商品
        deleteGoods(context, value) {
            let data = context.state.cartGoods.map( (item) => {
                return item.cardid
            })
            this._vm.$axios
                .get(`cart/deleteById?userId=${loginOption.state.userId}&cartId=${value}`)
                .then(
                    response => {
                        context.commit('initGoods', response.data)
                        let success = !data.every( (item)=> {
                            return response.data.some( (x)=> {
                                return x === item
                            })
                        })
                        if(success) {
                            this._vm.$toast.success("删除成功")
                        }
                        else {
                            this._vm.$toast.error("删除失败")
                        }
                    },
                    error => {
                        this._vm.$toast.error("网络错误，删除失败！")
                        console.log(error)
                    }
                )
        },
        //删除所选商品
        deleteCheckedGoods(context) {
            context.state.checkedCount = 0
            context.state.isAllChecked = false //因为删除了所选的，必定是没有全选
            context.state.cartGoods.forEach( (item)=> {
                if(item.checked) {
                    this._vm.$axios
                        .get(`cart/deleteById?userId=${loginOption.state.userId}&cartId=${item.cardid}`)
                        .then(
                            response => {
                                context.commit('initGoods', response.data)
                            },
                            error => {
                                this._vm.$toast.error("网络出错，删除失败")
                                console.log(error)
                            }
                        )
                }
            })
            this._vm.$toast.success("删除成功")
        },
        //删除所有商品
        deleteAllGoods(context) {
            let success = true
            context.state.cartGoods.forEach( (item)=> {
                this._vm.$axios
                    .get(`cart/deleteById?userId=${loginOption.state.userId}&cartId=${item.cardid}`)
                    .then(
                        response => {
                            context.commit('initGoods', response.data)
                        },
                        error => {
                            success = false
                            this._vm.$toast.error("网络出错!清空失败！")
                            console.log(error)
                        }
                    )
            })
            if (success) this._vm.$toast.success("清空成功")
        },

        //生成订单: 创建订单
        createDeal(context) {
            //需要把选中的商品删除，再根据改变的num添加商品
            let uncheckedGoods = []
            let preLen = context.state.cartGoods.length
            //已经选中的商品
            let map = context.state.cartGoods.map( async (item, i) => {
                //删除选中的商品
                await this._vm.$axios.get(`cart/deleteById?userId=${loginOption.state.userId}&cartId=${item.cardid}`)
                let total = (item.num * item.price).toFixed(2)
                let find = undefined
                //更新数据
                await this._vm.$axios
                    .get(`cart/add?userId=${loginOption.state.userId}&goodsId=${item.goodsId}&num=${item.num}&price=${total}`)
                    .then(
                        response => {
                            let index = response.data.find((curItem) => {
                                    //找到对应返回的数据
                                return curItem.goodsId === item.goodsId
                            })
                            //如果存在
                            if (index !== undefined) {
                                if (item.checked) find = index
                                else {
                                    index.checked = false
                                    uncheckedGoods.push(index)
                                }
                            } else {
                                uncheckedGoods.push(item)
                            }
                            if (i === preLen - 1) {
                                context.state.cartGoods = uncheckedGoods
                            } //最后一个元素添加时，替换现有数据
                        },
                        error => {
                            console.log(error)
                            // if (item.checked) find = item
                            // else uncheckedGoods.push(item)
                            if (i === preLen - 1) {
                                context.state.cartGoods = uncheckedGoods
                            } //最后一个元素添加时，替换现有数据
                        })
                return find
            })

            Promise.all(map).then(
                dealGoods => {
                    dealGoods = dealGoods.filter( (item) => {
                        return item !== undefined
                    })
                    let url = `order/addCastOrder?userId=${loginOption.state.userId}&cartList=`
                    //需要生成订单的商品数量
                    let len = dealGoods.length - 1
                    dealGoods.forEach( (item, index)=> {
                        url += item['cardid']
                        if(index !== len) url += ',' //拼接url
                    })
                    this._vm.$axios
                        .get(url)
                        .then( //创建订单成功后，购物车列表会删除该项，因此不需要亲自删除
                            response => {
                                this._vm.$toast.success("生成订单成功！跳转订单页面...")
                                context.commit('updateReadyToDeal', true)//跳转到订单页面

                            },
                            error => {
                                console.log(error)
                                this._vm.$toast.error("网络出错，生成订单失败!")
                            }
                        )
            })
        }
    },

    mutations: {
        //初始化商品信息
        initGoods(state, data) {
            state.checkedCount = 0
            state.isAllChecked = false
            state.cartGoods = data.map( (item)=>{
                item["checked"] = state.isAllChecked //为数据添加checked属性，为当前全选的状态
                return item;
            })
        },
        //更新全选状态
        updateAllChecked(state, value) {
            state.isAllChecked = value
            state.checkedCount = 0 //选中数量置零
            let allNotZero = true
            for(let i = 0; i < state.cartGoods.length; i ++) {
                let num = parseInt(state.cartGoods[i].num)
                if(value) state.checkedCount += num  //为选中时加上每件商品的数量
                if (num !== 0) {
                    state.cartGoods[i].checked = value
                } //改变值
                else {
                    allNotZero = false
                }
            }
            if (!allNotZero) state.isAllChecked = false
        },
        //更新指定的商品是否选中
        updateChecked(state, value) {
            state.cartGoods[value.index].checked = value.checked
            state.cartGoods[value.index].num = value.count
            let count = 0 //当前选中的个数
            let zeroCount = 0 //数量为零的个数
            state.checkedCount = 0 //重置为0
            state.cartGoods.forEach( (item)=> {
                if(item.checked) {
                    count ++
                    state.checkedCount += parseInt(item.num)
                }
                if(parseInt(item.num) === 0) {
                    zeroCount ++
                }
            })
            state.isAllChecked = count === state.cartGoods.length - zeroCount //更新是否全选的状态
        },
        //更新指定商品的数量
        updateCount(state, value) {
            let pre = state.cartGoods[value.index].num //先前的数量
            state.cartGoods[value.index].num = value.count
            if(state.cartGoods[value.index].checked) {
                state.checkedCount -= pre
                state.checkedCount += value.count
            }
        },
        //更新readyToDeal
        updateReadyToDeal(state, value) {
            state.readyToDeal = value
        },
        //更新readyToLogin
        updateReadyToLogin(state, value) {
            state.readyToLogin = value
        },

        updateGoodInfo(state, value) {
            state.goods[value.goodId] = value.price
        }
    },
}