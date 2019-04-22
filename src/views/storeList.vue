 !<!--  -->
 <template>
  <div class="storeList">
    <div class="loading-box tc"
         v-if="loading">
      <mt-spinner type="snake"
                  class="loading-more"></mt-spinner>
      <span class="loading-more-txt">加载中...</span>
      <coordinate v-if="showMap"
                  :show.sync="loading"
                  @method="getDate"></coordinate>
    </div>
    <div v-else>
      <div class="searchWrap"
           :class="[showSearch ?'blackbg':'']"
           @click="closeBox()">
        <div class="search">
          <div class="project"
               @click="searchBox(projectList)">
            <span>{{project.Name}}</span>
            <img :src="imgList.arrowImg"
                 alt="">
          </div>
          <div class="sort"
               @click="searchBox(sortList)">
            <span>{{sort.Name}}</span>
            <img :src="imgList.arrowImg"
                 alt="">
          </div>

        </div>
        <transition name="fade">
          <div class="searchBox"
               v-if="showSearch">
            <ul class="">
              <li v-for="item in searchBoxList"
                  :key="item.Name"
                  @click="selectCondition(item)"
                  :class="{'active':item.Pid === project.Pid || item.Pid === sort.Pid}">
                <p>{{item.Name}}</p>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="shopList">
        <ul v-infinite-scroll="shopLoadMore"
            infinite-scroll-disabled="shopLoading"
            infinite-scroll-distance="10">
          <li v-for="item in shopList"
              :key="item.Pid">
            <img class="shop-img"
                 :src="item.ShopImages[0].ImagePath"
                 alt="">
            <div class="shop-info">
              <div @click="storeDetail(item.Pid)">
                <p class="shop-title">{{item.ShopName}}</p>
                <div class="shop-landscape">
                  <p>
                    <span class="label">评价</span>
                    <start size="small"
                           :score="item.TotalScore"></start>
                  </p>
                  <p>
                    <span class="label">总订单</span>
                    <span>{{item.TotalCount}}</span>
                  </p>
                </div>
                <div class="shop-landscape line">
                  <p>
                    <span>{{item.Address}}</span>
                  </p>
                  <p>
                    <span>{{item.Distance | storeDistance}}</span>
                  </p>

                </div>
                <div class="checkService"
                     v-show="item.regular">
                  <img :src="checkService.imgSrc"
                       alt="">
                  <p>{{checkService.title}}</p>
                </div>
              </div>
              <div class="service"
                   v-for="kind in item.ShopKinds"
                   :key="kind.$index">
                <div v-for="product in kind.ShopProducts"
                     :key="product.Pid"
                     @click="goCommodity(item.Pid,product.Pid)">
                  <p>{{product.ProductName}}</p>
                  <p class="red">
                    <span>￥</span>
                    <span>{{product.SellPrice}}</span>
                  </p>
                </div>
              </div>
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
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import check from '@/assets/check.png'
import coordinate from '@/components/userCoordinate.vue'
import filterImg from '@/assets/filter.png'
import arrowImg from '@/assets/searchArrow.png'
import start from '@/components/start.vue'
import { getKind, searchStore } from '@/api/api'
import { MessageBox } from 'mint-ui'
export default {
  name: 'storeList',
  data () {
    return {
      showSearch: false,
      searchBoxList: [],
      imgList: {
        filterImg: filterImg,
        arrowImg: arrowImg
      },
      sort: {
        Name: '距离最近',
        Pid: 0,
        type: 'sort'
      },
      sortList: [
        {
          Name: '距离最近',
          Pid: 0,
          type: 'sort'
        },
        {
          Name: '订单最多',
          Pid: 2,
          type: 'sort'
        },
        {
          Name: '评价最高',
          Pid: 1,
          type: 'sort'
        }
      ],
      project: {
      },
      projectList: [],
      showMap: false,
      loading: true,
      shopLoading: false,
      isLoading: false,
      noMore: false,
      page: 0,
      checkService: {
        imgSrc: check,
        title: '免费常规检查'
      },
      shopList: []
    }
  },
  components: {
    start,
    coordinate
  },
  computed: {
    ...mapGetters([
      'coordinate'
    ])
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
    if (this.coordinate.longitude.length === 0) {
      this.showMap = true
    } else {
      this.getDate()
    }
  },
  updated () { },
  mounted () {
  },
  methods: {
    async getDate () {
      const kind = await getKind({})
      if (kind.Head.ErrorCode === 10000) {
        this.projectList = kind.Body
        let index = this.projectList.findIndex((value) => {
          return value.Pid === this.$route.query.kindId
        })
        this.project = this.projectList[index]
      } else {
        MessageBox.alert(kind.Head.Msg, '提示')
      }
      this.searchShop()
    },
    goCommodity (storeid, productid) {
      let info = [
        storeid,
        productid
      ]
      this.$router.push({ name: 'commodityDetail', query: { commodityInfo: info } })
    },
    storeDetail (id) {
      this.$router.push({ name: 'storeDetail', query: { storeId: id } })
    },
    searchShop () {
      this.isLoading = true
      let params = {
        kind: this.project.Pid,
        longitude: this.coordinate.longitude,
        latitude: this.coordinate.latitude,
        page: this.page,
        limit: 10,
        orderby: this.sort.Pid
      }
      searchStore(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          if (response.Body && response.Body.length > 0) {
            this.shopList = this.shopList.concat(response.Body)
          } else {
            this.morePage = 0
            this.noMore = true
          }
          this.isLoading = false
          this.loading = false
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
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
        console.log(1)
        this.searchShop()
      }, 500)
    },
    searchBox (list) {
      event.stopPropagation()
      if (JSON.stringify(this.searchBoxList) === JSON.stringify(list)) {
        this.showSearch = !this.showSearch
        return false
      }
      if (this.showSearch) {
      } else {
        this.showSearch = !this.showSearch
      }
      this.searchBoxList = list
    },
    closeBox () {
      this.showSearch = false
    },
    selectCondition (item) {
      if (item.type && item.type === 'sort') {
        this.sort = item
      } else {
        this.project = item
      }
      this.page = 0
      this.shopList = []
      this.searchShop()
    }
  }
}

</script>
 <style lang='scss' scoped>
.storeList {
  .searchWrap {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2;
    background-color: #fff;
  }
  .blackbg {
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.5s linear;
    height: 100vh;
  }
  .search {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 12px;
    padding: 12px 15px;
    background-color: #fff;
    border-bottom: #dcdcdc solid 1px;
    position: relative;
    z-index: 5;
    div {
      vertical-align: middle;
      span {
        display: inline-block;
        margin-right: 5px;
      }
      img {
        display: inline-block;
        width: 10px;
      }
    }
  }
  .shopList {
    padding: 40px 0 0 0;
    ul {
      li {
        text-align: left;
        background-color: #fff;
        padding: 10px 0 0 10px;
        font-size: 12px;
        display: flex;
        position: relative;
        border-bottom: #f0f4f7 solid 4px;
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
            border-bottom: #dcdcdc solid 1px;
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
              position: relative;
              padding-right: 10px;
              .red {
                color: #f53406;
              }
              &::after {
                content: "";
                position: absolute;
                top: 5px;
                right: 0;
                width: 6px;
                height: 8px;
                background: url("../assets/rightArrow.png") no-repeat;
                background-size: contain;
              }
            }
          }
        }
      }
    }
    .no-more {
      background-color: #fff;
      padding: 20px 0;
    }
  }
  .searchBox {
    background-color: #fff;
    z-index: 5;
    margin-top: 0;

    ul {
      padding: 0 20px;
      li {
        padding: 4px 10px;
        margin-bottom: 7px;
        border-bottom: #dcdcdc solid 1px;
        text-align: left;
      }
    }
    .active {
      color: #f53406;
      border-bottom: #f53406 solid 1px;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s linear;
  }
  .fade-enter,
  .fade-leave-to {
    margin-top: -100px;
  }
}
</style>
