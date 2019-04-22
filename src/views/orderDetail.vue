!<!--  -->
<template>
  <div class="orderDetail">
    <p class="store">{{orderDetail.ShopName}}</p>
    <p class="price">
      <span>-</span>
      <span>{{orderDetail.OrderAmount}}</span>
    </p>
    <p class="orderType">{{orderDetail.StatusName}}</p>
    <div class="info">
      <p>
        <span>创建时间</span>
        <span>{{orderDetail.AddDate}}</span>
      </p>
      <p>
        <span>商品说明</span>
        <span>{{orderInfo.ProductName}}</span>
      </p>
      <p>
        <span>订单号</span>
        <span>{{orderDetail.OrderCode}}</span>
      </p>
    </div>
    <div class="operating">
      <div class="pay"
           v-if="orderDetail.Status == 1">
        <div @click="payMoney">立即支付</div>
      </div>
      <div class="unused"
           v-else-if="orderDetail.Status == 2">
        <img v-gallery:groupName
             :src="orderInfo.CheckCode">
        <p>点击图片，展示给商家</p>
        <div class="refund"
             @click="refund">订单退款</div>
      </div>
      <div class="finish"
           v-else-if="orderDetail.Status == 3">
        <div v-if="orderDetail.CommentCount == 0"
             @click="evaluate()">立即评价</div>
        <div v-else>已评价</div>
      </div>
    </div>
    <p class="advisory">如果您对订单有任何疑问,请拨打400-0606-899咨询。</p>
  </div>
</template>

<script>
import { getOrderDetail, CustomerBackMoney } from '@/api/api'
import { MessageBox } from 'mint-ui'
import { getToken, pay, refundOrder } from '@/utils/auth'
export default {
  name: 'orderDetail',
  data () {
    return {
      orderDetail: {
      },
      orderInfo: {

      }
    }
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
  components: {},

  computed: {},

  created () { },
  updated () { },
  mounted () {
    this.getOrderDetail()
  },

  methods: {
    payMoney () {
      pay(this.orderDetail.PayOrderCode)
    },
    getOrderDetail () {
      let params = {
        customerId: getToken(),
        orderId: this.$route.query.orderId
      }
      getOrderDetail(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          this.orderDetail = response.Body
          this.orderInfo = this.orderDetail.Details[0]
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
    },
    refund () {
      MessageBox.confirm('确定要进行退款吗?').then(action => {
        let params = {
          c: getToken(),
          o: this.orderDetail.Pid,
          b: ''
        }
        CustomerBackMoney(params).then(response => {
          if (response.Head.ErrorCode === 10000) {
            MessageBox.alert('退款成功', '提示')
            this.getOrderDetail()
          } else {
            MessageBox.alert(response.Head.Msg, '提示')
          }
        })
      }).catch(function (reason) {
      })
    },
    evaluate () {
      let info = [
        this.orderInfo.ProductPid,
        this.orderInfo.Pid
      ]
      this.$router.push({ name: 'evaluate', query: { info: info } })
    }
  }
}

</script>
<style lang='scss' scoped>
.orderDetail {
  .store {
    font-size: 14px;
    margin-top: 25px;
    margin-bottom: 25px;
  }
  .price {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .orderType {
    color: #7a8a9a;
    font-size: 12px;
    margin-bottom: 40px;
  }
  .info {
    color: #7a8a9a;
    text-align: left;
    padding: 10px;
    font-size: 12px;
    border-bottom: #dcdcdc solid 1px;
    p {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
    }
  }
  .operating {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    .pay {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60%;
      font-size: 12px;
      div {
        padding: 10px 20px;
        border-radius: 5px;
      }
      div:nth-of-type(1) {
        background-color: #e67e22;
        color: #fff;
      }
    }
    .unused {
      img {
        display: block;
        margin: 0 auto;
        width: 80px;
      }
      p {
        margin-top: 10px;
        color: #e67e22;
      }
      .refund {
        color: #7a8a9a;
        margin-top: 10px;
        padding: 5px;
      }
    }
    .finish {
      div {
        padding: 10px 20px;
        border-radius: 5px;
        background-color: #e67e22;
        color: #fff;
        margin: 0 auto;
      }
    }
  }
  .advisory {
    margin-top: 20px;
    color: #7a8a9a;
  }
}
</style>
