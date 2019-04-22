
 <template>
  <div class="commodityDetail">
    <div class="commodityImg">
      <img :src="productImg"
           alt="">
    </div>
    <div class="commodityInfo">
      <div class="infoPrice">
        <p>
          <span>￥</span>
          <span class="large">{{commodityInfo.SellPrice}}</span>
        </p>
        <p>
          <span>已售</span>
          <span>{{commodityInfo.TotalCount}}</span>
          <!-- <span>|</span>
          <span>剩余</span>
          <span class="orange">{{commodityInfo.Inventory}}</span> -->
        </p>
      </div>
      <p class="title">
        {{commodityInfo.ProductName}}
      </p>
      <p class="desc">
        {{commodityInfo.DescribeInfo}}
      </p>
      <!-- <div class="condition">
        <p class="conditionTitle">
          服务项目
        </p>
        <ul>
          <li v-for="(item,index) in commodityInfo.condition"
              :key="index">
            <p>{{item}}</p>
          </li>
        </ul>
      </div> -->
    </div>
    <!-- <div class="storeInfo">
      <p class="storeName">{{commodityInfo.storeName}}</p>
      <p>{{commodityInfo.address}}</p>
      <div class="navigation">
        <img :src="nav"
             alt="">
        <p>
          {{commodityInfo.distance}}
        </p>
      </div>
    </div> -->
    <div class="evaluation">
      <div class="title">
        <p>
          <span>商品评价</span>
          <!-- <span>(</span>
          <span>{{evaluation}}</span>
          <span>)</span> -->
        </p>
        <p @click="goMoreEvaluation">
          查看更多
        </p>
      </div>
      <evaluation :evaluationList="evaluationList">
      </evaluation>
    </div>
    <div class="requirement">
      <p class="requirementTitle">购买需知</p>
      <p>{{commodityInfo.BuyNotes}}</p>
      <!-- <ul>
        <li v-for="(item,index) in commodityInfo.requirement"
            :key="index">
          <p>{{item.title}}</p>
          <p>{{item.desc}}</p>
        </li>
      </ul> -->
    </div>
    <div class="payment">
      <div class="price">
        <p>
          <span>￥</span>
          <span class="large"> {{commodityInfo.SellPrice}}</span>
        </p>
        <p>￥{{commodityInfo.MarketPrice}}</p>
      </div>
      <div class="pay"
           @click="payMoney()">立即支付</div>
    </div>
  </div>
</template>

<script>
import evaluation from '@/components/evaluation.vue'
import navigation from '@/assets/navigation.png'
import { commodityDetail, getReviews, newGoToPay } from '@/api/api'
import { getToken, pay } from '@/utils/auth'
import { MessageBox } from 'mint-ui'
import photo from '@/assets/nophoto.jpg'
export default {
  name: 'commodityDetail',
  data () {
    return {
      nav: navigation,
      commodityInfo: {

      },
      evaluationList: [

      ],
      evaluation: 120
    }
  },
  components: {
    evaluation
  },
  computed: {
    telephone () {
      return 'tel:' + this.storeInfo.phone
    },
    productImg () {
      let result = []
      if (this.commodityInfo.ImagePath) {
        result = this.commodityInfo.ImagePath
      } else {
        result = photo
      }
      return result
    }
  },
  created () { },
  updated () { },
  mounted () {
    this.getCommodityDetail()
    this.getReviews()
  },
  methods: {
    payMoney () {
      let params = {
        productsid: this.commodityInfo.Pid,
        customerPid: getToken()
      }
      newGoToPay(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          if (response.Body) {
            pay(response.Body)
          }
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
    },
    goMoreEvaluation () {
      this.$router.push({ name: 'storeEvaluation', query: { storeId: this.$route.query.commodityInfo[0], commodityId: this.$route.query.commodityInfo[1] } })
    },
    getCommodityDetail () {
      let params = {
        storeId: this.$route.query.commodityInfo[0],
        commodityId: this.$route.query.commodityInfo[1]
      }
      commodityDetail(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          this.commodityInfo = response.Body
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
    },
    getReviews () {
      let params = {
        storeId: this.$route.query.commodityInfo[0],
        commodityId: this.$route.query.commodityInfo[1],
        page: 0,
        limit: 2,
        reviewType: 0
      }
      getReviews(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          if (response.Body) {
            this.evaluationList = response.Body
          } else {
            this.evaluationList = []
          }
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
    }
  }
}

</script>
 <style lang='scss' scoped>
.commodityDetail {
  text-align: left;
  background-color: #f0f4f7;
  padding-bottom: 60px;
}
.label {
  display: inline-block;
  margin-right: 10px;
  font-size: 12px;
}
.commodityImg {
  height: 140px;
  overflow: hidden;
  img {
    display: block;
    height: 100%;
    margin: 0 auto;
  }
}
.commodityInfo {
  background-color: #fff;

  padding: 20px 8px;
  border-bottom: #e1e1e1 solid 1px;
  .large {
    font-size: 26px;
  }
  .orange {
    color: #f56e4e;
  }
  .infoPrice {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 15px;
    p:nth-of-type(1) {
      color: #f01c31;
    }
    p:nth-of-type(2) {
      span {
        display: inline-block;
        margin-right: 5px;
      }
    }
  }
  .title {
    font-size: 14px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  .desc {
    color: #8b8b8b;
    margin-bottom: 12px;
  }
  .condition {
    .conditionTitle {
      font-size: 14px;
      margin-bottom: 12px;
    }
    ul {
      li {
        margin-bottom: 5px;
        p {
          padding-left: 20px;
          position: relative;
          &::before {
            content: "";
            position: absolute;
            top: 1px;
            left: 2px;
            width: 12px;
            height: 12px;
            background: url("../assets/right.png") no-repeat;
            background-size: contain;
          }
        }
      }
    }
  }
}
.storeInfo {
  padding: 15px 8px;
  background-color: #fff;
  position: relative;
  margin-bottom: 10px;
  .storeName {
    font-size: 14px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  .navigation {
    position: absolute;
    top: 13px;
    right: 20px;
    text-align: center;
    img {
      width: 15px;
    }
    p {
      margin-top: 10px;
    }
  }
}
.evaluation {
  background-color: #fff;
  margin-bottom: 12px;
  .title {
    padding: 18px 8px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    border-bottom: #e1e1e1 solid 1px;
    p:nth-of-type(1) {
      font-size: 14px;
    }
    p:nth-of-type(2) {
      position: relative;
      padding-right: 10px;
      &::after {
        content: "";
        position: absolute;
        top: 4px;
        right: 0px;
        width: 8px;
        height: 10px;
        background: url("../assets/rightArrow.png") no-repeat;
        background-size: contain;
      }
    }
  }
}
.requirement {
  padding: 18px 8px;
  background-color: #fff;
  .requirementTitle {
    font-size: 14px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  ul {
    font-size: 12px;
    li {
      margin-bottom: 12px;
      padding-left: 20px;
      p:nth-of-type(1) {
        font-weight: 600;
        margin-bottom: 4px;
      }
    }
  }
}
.payment {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  border-top: #e1e1e1 solid 1px;
  padding: 14px 6px;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  .price {
    p {
      display: inline-block;
      margin-right: 10px;
      line-height: 30px;
    }
    .large {
      font-size: 20px;
    }
    p:nth-of-type(1) {
      color: #f01c31;
    }
    p:nth-of-type(2) {
      color: #6d6f71;
      text-decoration: line-through;
    }
  }
  .pay {
    background-color: #f01c31;
    color: #fff;
    border-radius: 50px;
    padding: 6px 20px;
  }
}
</style>
