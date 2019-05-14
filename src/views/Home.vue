<template>
  <div class="home">
    <div class="swipe">
      <mt-swipe>
        <mt-swipe-item v-for="item in carouselList"
                       :key="item.imgSrc"
                       @click.native="goCarousel(item.linkAddress)">
          <img :src="item.imgSrc"
               alt="">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="nav">
      <div class="nav-item"
           v-for="item in navList"
           :key="item.Pid"
           @click="selectPro(item.Pid)">
        <img :src="item.LogoImg"
             alt="">
        <p>{{item.Name}}</p>
      </div>
    </div>
    <div class="nearbyShop">
      <p class="title">附近门店</p>
      <ul v-infinite-scroll="shopLoadMore"
          infinite-scroll-disabled="shopLoading"
          infinite-scroll-distance="50">
        <li v-for="item in shopList"
            :key="item.$index"
            @click="storeDetail(item.storeId)">
          <img class="shop-img"
               :src="item.imgsSrc"
               alt="">
          <div class="shop-info">
            <p class="shop-title">{{item.title}}</p>
            <div class="shop-landscape">
              <p>
                <span class="label">评价</span>
                <start size="normal"
                       :score="item.score"></start>
              </p>
              <p>
                <span class="label">总订单</span>
                <span>{{item.bills}}</span>
              </p>
            </div>
            <div class="shop-landscape line">
              <p>
                <span>{{item.address}}</span>
              </p>
              <p>
                <span>{{item.distance | storeDistance}}</span>
              </p>
            </div>
            <!-- <div class="checkService"
                 v-show="item.regular">
              <img :src="checkService.imgSrc"
                   alt="">
              <p>{{checkService.title}}</p>
            </div> -->
          </div>
        </li>
      </ul>
      <div class="loading-box"
           v-if="isLoading">
        <mt-spinner type="snake"
                    class="loading-more"></mt-spinner>
        <span class="loading-more-txt">加载中...</span>
      </div>

      <div class="no-more"
           v-if="noMore">没有更多了~
      </div>

    </div>
    <div class="amap-wrapper">
      <el-amap vid="amap"
               :plugin="plugin"
               class="amap">
      </el-amap>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from 'vuex'
import { MessageBox } from 'mint-ui'
import { getNearbyStores, getKind } from '@/api/api'
import start from '@/components/start.vue'
import maintenance from '@/assets/home/nav/maintenance.png'
import beauty from '@/assets/home/nav/beauty.png'
import sheetMetal from '@/assets/home/nav/sheetMetal.png'
import wash from '@/assets/home/nav/wash.png'
import activity from '@/assets/home/nav/activity.png'
import carouseWash from '@/assets/home/carousel/wash.jpg'
import insurance from '@/assets/home/nav/insurance.png'
import recharge from '@/assets/home/nav/recharge.png'
import phone from '@/assets/home/nav/phone.png'
import check from '@/assets/check.png'
export default {
  name: 'home',
  data () {
    return {
      carouselList: [
        {
          imgSrc: carouseWash,
          linkAddress: 'http://weixinweb.auto11.com/Double11/washcarorder/webchatwashcar.aspx'
        }
      ],
      navList: [
        {
          imgSrc: maintenance,
          title: '机油保养',
          certificate: 1
        },
        {
          imgSrc: beauty,
          title: '汽车美容',
          certificate: 1
        },
        {
          imgSrc: sheetMetal,
          title: '汽车钣金',
          certificate: 1
        },
        {
          imgSrc: wash,
          title: '标准洗车',
          certificate: 1
        },
        {
          imgSrc: activity,
          title: '优惠活动',
          certificate: 1
        },
        {
          imgSrc: insurance,
          title: '汽车保险',
          certificate: 1
        },
        {
          imgSrc: recharge,
          title: '油卡充值',
          certificate: 1
        },
        {
          imgSrc: phone,
          title: '话费充值',
          certificate: 1
        }

      ],
      shopLoading: false,
      isLoading: false,
      noMore: false,
      checkService: {
        imgSrc: check,
        title: '免费常规检查'
      },
      shopList: [
      ],
      evaluation: 0,
      page: 0,
      morePage: ''
    }
  },
  computed: {
    ...mapGetters([
      'coordinate'
    ]),
    plugin: function () {
      let that = this
      return [{
        pName: 'Geolocation',
        events: {
          init (o) {
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                let newCoordinate = {
                  longitude: result.position.lng,
                  latitude: result.position.lat
                }
                that.changeCoordinate(newCoordinate)
              } else {
                let newCoordinate = {
                  longitude: 104.0658400000,
                  latitude: 30.6574200000
                }
                that.changeCoordinate(newCoordinate)
              }
            })
          }
        }
      }]
    }
  },
  mounted () {
    this.getKind()
  },
  components: {
    start
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
  created () {
  },
  updated () { },
  methods: {
    ...mapActions({
      setCoordinate: 'SETCoordinate' // 将 `this.setCoordinate()` 映射为 `this.$store.dispatch('setCoordinate')`
    }),
    changeCoordinate (newCoordinate) {
      // 修改vuex中的状态
      this.setCoordinate(newCoordinate)
      // 重新获取最近列表
      this.page = 0
      this.getNearbyStores()
    },
    getKind () {
      getKind({}).then(response => {
        if (response.Head.ErrorCode === 10000) {
          this.navList = response.Body
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
    },
    getNearbyStores () {
      this.isLoading = true
      let parmas = {
        page: this.page,
        limit: 10,
        longitude: this.coordinate.longitude,
        latitude: this.coordinate.latitude
      }
      if (this.coordinate.longitude.length === 0) {
        this.morePage = 0
        this.isLoading = false
        return false
      }
      getNearbyStores(parmas).then(response => {
        if (response.Head.ErrorCode === 10000) {
          if (response.Body.length > 0) {
            this.shopList = this.shopList.concat(response.Body)
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
    goCarousel (link) {
      window.location.href = link
    },
    selectPro (id) {
      this.$router.push({ name: 'storeList', query: { kindId: id } })
    },
    storeDetail (id) {
      this.$router.push({ name: 'storeDetail', query: { storeId: id } })
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
        this.getNearbyStores()
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background: #f0f4f7;
  .swipe {
    padding: 18px 8px;
    background-color: #f0f4f7;
    .mint-swipe {
      height: 140px;
      border-radius: 5px;
      .mint-swipe-item {
        img {
          width: 100%;
        }
      }
    }
  }
  .nav {
    display: flex;
    flex-wrap: wrap;
    padding: 8px 8px 38px 8px;
    background-color: #fff;
    .nav-item {
      width: 76px;
      padding: 10px 0;
      img {
        display: block;
        margin: 0 auto;
        height: 25px;
      }
      p {
        margin-top: 20px;
        font-size: 12px;
      }
    }
  }
  .nearbyShop {
    background-color: #f0f4f7;
    padding: 0;
    .title {
      font-size: 16px;
      font-weight: 600;
      padding: 15px;
      text-align: left;
    }
    ul {
      padding: 0 10px;
      li {
        text-align: left;
        background-color: #fff;
        padding: 10px 0 0 10px;
        font-size: 12px;
        margin-bottom: 7px;
        display: flex;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 16px;
          right: 20px;
          width: 8px;
          height: 10px;
          background: url("../assets/rightArrow.png") no-repeat;
          background-size: contain;
        }
        .shop-img {
          display: inline-block;
          width: 75px;
          height: 65px;
          margin-right: 13px;
        }
        .shop-info {
          flex: 1;
          margin-right: 10px;
          .line {
            // border-bottom: #dcdcdc solid 1px;
          }
          .shop-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 14px;
            width: 170px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .shop-landscape {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 14px;
            text-align: left;
            p:nth-of-type(1) {
              width: 130px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .label {
              font-size: 12px;
              display: inline-block;
              margin-right: 4px;
            }
          }
          .checkService {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 10px 0;
            img {
              display: block;
              width: 14px;
              margin-right: 8px;
            }
            p {
              color: #5e90b7;
              font-size: 11px;
            }
          }
          .service {
            padding: 10px 0 0 0;
            div {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
  .mint-spinner-snake {
    margin: 0 auto;
  }
  .no-more {
    padding: 15px 0;
  }
}
</style>
