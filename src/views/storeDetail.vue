
 <template>
  <div class="storeDetail">
    <div class="loading-box tc"
         v-if="loading">
      <mt-spinner type="snake"
                  class="loading-more"></mt-spinner>
      <span class="loading-more-txt">加载中...</span>
      <coordinate v-if="showMap"
                  :show.sync="loading"
                  @method="getStoreDetail"></coordinate>
    </div>
    <div v-else>
      <div class="storeImg">
        <img :src="storeInfo.ShopImages[0].ImagePath"
             alt="">
      </div>
      <div class="storeInfo">
        <p class="title">{{storeInfo.ShopName}}</p>
        <div class="landscape">
          <p>
            <span class="label">总评分</span>
            <start size="normal"
                   :score="storeInfo.TotalScore"></start>
          </p>
          <p>
            <span class="label">总订单</span>
            <span>{{storeInfo.TotalCount}}</span>
          </p>
        </div>
        <div class="businessHours">
          <p class="label">营业时间</p>
          <p class="time">{{storeInfo.BusinessHours}}</p>
          <p>(节假日营业时间,请咨询店家)</p>
        </div>
        <div class="contact">
          <p>
            <span class="label">商家电话</span>
            <span>{{storeInfo.Tel}}</span>
          </p>
          <a :href="telephone">
            拨打
          </a>
        </div>
        <div class="navigation">
          <p @click="goStoreMap (storeInfo.Longitude,storeInfo.Latitude)">导航</p>
          <p>
            <span>距离</span>
            <span>{{storeInfo.Distance | storeDistance}}</span>
          </p>
        </div>
      </div>
      <div class="storeService">
        <p class="title">
          服务产品
        </p>
        <ul v-if="showProduct.length>0">
          <li v-for="(item,index) in showProduct"
              :key="index">
            <div class="serviceWrap"
                 @click="selectService(item,index)">
              <i :class="[index === isActive? 'active' : 'normail']"></i>
              <p class="serviceName">{{item.ProductName}}</p>
              <p class="serviceDesc">
                <span>评分</span>
                <span>{{item.TotalScore}}</span>
                <span>|</span>
                <span>已售</span>
                <span>{{item.TotalCount}}</span>
              </p>
            </div>
            <div class="priceWrap"
                 @click="goCommodity(item.Pid)">
              <p class="servicePrice">
                <span>￥</span>
                <span>{{item.SellPrice}}</span>
              </p>
              <p class="originalPrice">
                <span>￥</span>
                <span>{{item.MarketPrice}}</span>
              </p>
            </div>
          </li>
        </ul>
        <p class="noProduct"
           v-else>暂无产品</p>
      </div>
      <!-- <div class="storeProduct">
        <p class="title">
          推荐商品
        </p>
        <ul>
          <li v-for="(item,index) in showProduct"
              :key="index"
              @click="goCommodity(1)">
            <div class="productImg">
              <img :src="item.imgSrc"
                   alt="">
            </div>
            <p class="title">
              {{item.name}}
            </p>
            <p class="price">
              <span>￥</span>
              <span>{{item.price}}</span>
            </p>
          </li>
        </ul>
      </div> -->
      <div class="evaluation">
        <div class="title">
          <p>
            <span>门店评价</span>
            <!-- <span>(</span>
            <span>{{totalEvaluations}}</span>
            <span>)</span> -->
          </p>
          <p @click="goMoreEvaluation">
            查看更多
          </p>
        </div>
        <evaluation :evaluationList="evaluationList">
        </evaluation>
      </div>
      <transition name="fade">
        <div class="payment"
             v-show="showPay">
          <div class="price">
            <p>
              <span>￥</span>
              <span class="large"> {{activeService.SellPrice}}</span>
            </p>
            <p>￥{{activeService.MarketPrice}}</p>
          </div>
          <div class="pay"
               @click="payMoney">立即支付</div>
        </div>
      </transition>
    </div>

  </div>
</template>

<script>
import start from '@/components/start.vue'
import evaluation from '@/components/evaluation.vue'
import coordinate from '@/components/userCoordinate.vue'
import { getStoreDetail, getReviews, newGoToPay } from '@/api/api'
import { getToken, pay } from '@/utils/auth'
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'storeDetail',
  data () {
    return {
      showMap: false,
      loading: true,
      isActive: '',
      activeService: {},
      storeInfo: {

      },
      evaluationList: [

      ],
      totalEvaluations: 120
    }
  },
  components: {
    start,
    evaluation,
    coordinate
  },
  computed: {
    ...mapGetters([
      'coordinate'
    ]),
    telephone () {
      return 'tel:' + this.storeInfo.Tel
    },
    showProduct () {
      let result = []
      if (this.storeInfo.ShopKinds.length > 0) {
        this.storeInfo.ShopKinds.forEach((item, index) => {
          if (item.ShopProducts.length > 0) {
            result = result.concat(item.ShopProducts)
          }
        })
      }
      return result
    },
    showPay () {
      if (this.isActive === 0) {
        return true
      } else if (this.isActive) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    if (this.coordinate.longitude.length === 0) {
      this.showMap = true
    } else {
      this.getStoreDetail()
    }
    this.getReviews()
  },
  filters: {
    storeDistance: function (value) {
      let result = ''
      if (value < 1000) {
        result = value + 'm'
      } else {
        result = (value / 1000).toFixed(2) + 'km'
      }
      return result
    }
  },
  updated () { },
  mounted () {

  },
  methods: {
    selectService (item, index) {
      this.isActive = index
      this.activeService = item
    },
    payMoney () {
      let params = {
        productsid: this.activeService.Pid,
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
    goCommodity (id) {
      let info = [
        this.$route.query.storeId,
        id
      ]
      this.$router.push({ name: 'commodityDetail', query: { commodityInfo: info } })
    },
    goStoreMap (Latitude, Longitude) {
      let location = [Latitude, Longitude]
      this.$router.push({ name: 'storeMap', query: { location: location } })
    },
    goMoreEvaluation () {
      this.$router.push({ name: 'storeEvaluation', query: { storeId: this.$route.query.storeId, commodityId: '' } })
    },
    getStoreDetail () {
      let params = {
        storeId: this.$route.query.storeId,
        longitude: this.coordinate.longitude,
        latitude: this.coordinate.latitude
      }
      getStoreDetail(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          this.loading = false
          this.storeInfo = response.Body
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
    },
    getReviews () {
      let params = {
        storeId: this.$route.query.storeId,
        page: 0,
        limit: 2,
        commodityId: null,
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
.storeDetail {
  text-align: left;
  background-color: #f0f4f7;
  padding-bottom: 60px;
  min-height: 100vh;
}
.label {
  display: inline-block;
  margin-right: 10px;
  font-size: 12px;
}
.storeImg {
  height: 140px;
  overflow: hidden;
  img {
    display: block;
    height: 100%;
    margin: 0 auto;
  }
}
.storeInfo {
  background-color: #fff;
  padding: 15px 8px;
  font-size: 12px;
  position: relative;
  margin-bottom: 12px;
  .title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .landscape {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    p {
      margin-right: 20px;
    }
  }
  .businessHours {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
    font-size: 10px;
    p {
      margin-right: 6px;
    }
    .time {
      color: #f0691d;
      border: #f0691d solid 1px;
      border-radius: 20px;
      padding: 2px 8px;
    }
  }
  .contact {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      display: block;
      padding-left: 20px;
      position: relative;
      margin-right: 20px;
      font-weight: 600;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 15px;
        height: 15px;
        background: url("../assets/phone.png") no-repeat;
        background-size: contain;
      }
    }
  }
  .navigation {
    position: absolute;
    top: 15px;
    right: 15px;
    text-align: center;
    p:nth-of-type(1) {
      background-color: #2726eb;
      color: #fff;
      padding: 3px 5px;
      border-radius: 20px;
      margin-bottom: 8px;
    }
  }
}
.storeService {
  padding: 13px 8px;
  background-color: #fff;
  margin-bottom: 20px;
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  ul {
    padding: 0 10px;
    font-size: 12px;
    li {
      display: flex;
      justify-content: space-between;
      padding: 14px 15px;
      border-bottom: #e1e1e1 solid 1px;
      position: relative;
      .serviceWrap {
        position: relative;
        i {
          display: block;
          position: absolute;
          top: 6px;
          left: -20px;
          width: 14px;
          height: 14px;
        }
        .normail {
          background: url("../assets/radio.png") no-repeat;
          background-size: contain;
        }
        .active {
          background: url("../assets/radioActive.png") no-repeat;
          background-size: contain;
        }
      }
      .serviceName {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 14px;
      }
      .serviceDesc {
        color: #a2a2a2;
        span {
          display: inline-block;
          margin-right: 6px;
        }
      }
      .priceWrap {
        text-align: right;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 7px;
          right: -15px;
          width: 8px;
          height: 10px;
          background: url("../assets/rightArrow.png") no-repeat;
          background-size: contain;
        }
      }
      .servicePrice {
        font-size: 14px;
        margin-bottom: 10px;
      }
      .originalPrice {
        font-size: 10px;
        text-decoration: line-through;
        color: #a2a2a2;
      }
    }
  }
  .noProduct {
    padding: 10px;
    text-align: center;
  }
}
.storeProduct {
  padding: 13px 8px;
  background-color: #fff;
  margin-bottom: 20px;
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    li {
      display: block;
      margin: 10px 8px;
      .productImg {
        width: 90px;
        height: 92px;
        overflow: hidden;
        border: #e1e1e1 solid 1px;
        margin-bottom: 8px;
        img {
          width: 100%;
        }
      }
      .title {
        font-size: 10px;
        color: #808080;
        margin-bottom: 10px;
      }
      .price {
        font-size: 10px;
      }
    }
  }
}
.evaluation {
  background-color: #fff;
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
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s linear;
}
.fade-enter,
.fade-leave-to {
  transform: translateY(50px);
}
</style>
