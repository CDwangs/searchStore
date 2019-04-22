!<!--  -->
<template>
  <div class="orderList">
    <mt-navbar v-model="selected">
      <mt-tab-item id="0">全部订单</mt-tab-item>
      <mt-tab-item id="1">待支付</mt-tab-item>
      <mt-tab-item id="2">已支付</mt-tab-item>
      <mt-tab-item id="3">已完成</mt-tab-item>
      <mt-tab-item id="4">已退款</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <ul class="list"
          v-infinite-scroll="shopLoadMore"
          infinite-scroll-disabled="shopLoading"
          infinite-scroll-distance="20">
        <li v-for="item in orderList"
            :key="item.Pid"
            @click="orderDetail(item.Pid)">
          <div class="price">
            <p>{{item.ProductShopName}}</p>
            <p :class="[item.Status == 1 ? 'pay':''  ]">
              <span>{{item.OrderAmount}}</span>
              <span>元</span>
            </p>
          </div>
          <div class="info">
            <div>
              <p>
                <span>订单编号：</span>
                <span>{{item.OrderCode}}</span>
              </p>
              <p>
                <span>订单日期：</span>
                <span>{{item.AddDate}}</span>
              </p>
            </div>
            <div class="operating"
                 :class="[item.Status!= 1 ? 'finish':''  ]"
                 @click="payMoney (item.PayOrderCode,item.Status)">
              {{item.StatusName}}
            </div>
          </div>
        </li>
      </ul>
    </mt-tab-container>
    <div class="loading-box"
         v-if="isLoading">
      <span class="loading-more-txt">加载数据中...</span>
    </div>
    <div class="no-more"
         v-if="noMore">没有更多了~
    </div>
  </div>
</template>

<script>
import { getOrderList } from '@/api/api'
import { MessageBox } from 'mint-ui'
import { getToken, pay } from '@/utils/auth'
export default {
  name: 'orderList',
  data () {
    return {
      selected: '0',
      shopLoading: false,
      isLoading: false,
      noMore: false,
      page: 0,
      morePage: '',
      orderList: [
      ]
    }
  },
  components: {
  },
  filters: {
    orderType (type) {
      let typeName = ''
      switch (type) {
        case 1:
          typeName = '待支付'
          break
        case 2:
          typeName = '已支付'
          break
        case 3:
          typeName = '已完成'
          break
        case 4:
          typeName = '已取消'
          break
      }
      return typeName
    }
  },
  computed: {},
  created () { },
  updated () { },
  mounted () {
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      this.isLoading = true
      let orderType = null
      if (this.selected !== '0') {
        orderType = parseInt(this.selected)
      }
      let params = {
        customerid: getToken(),
        page: this.page,
        limit: 10,
        orderType: orderType
      }
      getOrderList(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          if (response.Body && response.Body.length > 0) {
            this.orderList = this.orderList.concat(response.Body)
          } else {
            this.morePage = 0
            this.noMore = true
          }
          this.isLoading = false
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
    },
    payMoney (PayOrderCode, status) {
      if (status !== 1) {
        return false
      }
      event.stopPropagation()
      pay(PayOrderCode)
    },
    orderDetail (id) {
      this.$router.push({ name: 'orderDetail', query: { orderId: id } })
    },
    shopLoadMore () {
      if (this.isLoading) {
        return false
      }
      if (this.morePage === 0) {
        this.noMore = true
        this.isLoading = false
        return false
      }
      this.page++
      this.isMoreLoading = true // 设置加载更多中
      this.isLoading = true // 加载中
      setTimeout(() => {
        this.getOrderList()
      }, 500)
    }
  },
  watch: {
    selected (val) {
      this.morePage = ''
      this.page = 0
      this.orderList = []
      this.getOrderList()
    }
  }
}

</script>
<style lang='scss' scoped>
.orderList {
  .list {
    margin-top: 5px;

    width: 100%;
    background: #f0f4f7;
    li {
      background: #fff;
      padding: 10px 30px 10px 10px;
      margin: 5px 5px 5px 5px;
      border-radius: 5px;
      text-align: left;
      // margin-bottom: 2px;
      position: relative;
      color: #1a2a3a;
      &::after {
        content: "";
        position: absolute;
        top: 16px;
        right: 15px;
        width: 8px;
        height: 10px;
        background: url("../assets/rightArrow.png") no-repeat;
        background-size: contain;
      }
      .price {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: #ddd dashed 1px;
        .pay {
          color: #ff6666;
        }
      }
      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #7a8a9a;
        padding: 10px 0;
      }
      .operating {
        padding: 5px 10px;
        background-color: #e67e22;
        color: #fff;
        border-radius: 5px;
      }
      .finish {
        background-color: #dddddd;
        color: #2a3a4a;
      }
    }
  }
}
</style>
