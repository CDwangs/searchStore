 !<!--  -->
 <template>
  <div class="storeEvaluation">
    <!-- <div class="overview">
      <div class="score">
        <span class="label">总评分</span>
        <start size="normal"
               :score="score"></start>
      </div>
      <p class="degree">
        <span class="label">好评度</span>
        <span>{{degree}}</span>
      </p>
    </div> -->
    <div class="condition">
      <p v-for="(item,index) in condition"
         :key="item.type"
         :class="[selected == index ? 'active' :'']"
         @click="selectType(item.type)">
        {{item.typeName}}
      </p>
    </div>
    <div class="evaluation"
         v-infinite-scroll="shopLoadMore"
         infinite-scroll-disabled="shopLoading"
         infinite-scroll-distance="20">
      <evaluation :evaluationList="evaluationList">
      </evaluation>
      <div class="loading-box"
           v-if="isLoading">
        <span class="loading-more-txt">加载数据中...</span>
      </div>
      <div class="no-more"
           v-if="noMore">没有更多了~
      </div>
    </div>

  </div>
</template>

<script>
import start from '@/components/start.vue'
import evaluation from '@/components/evaluation.vue'
import { getReviews } from '@/api/api'
import { MessageBox } from 'mint-ui'
export default {
  name: 'storeEvaluation',
  data () {
    return {
      condition: [
        {
          type: 0,
          typeName: '全部'
        },
        {
          type: 1,
          typeName: '好评'
        },
        {
          type: 2,
          typeName: '中评'
        },
        {
          type: 3,
          typeName: '差评'
        },
        {
          type: 4,
          typeName: '有图'
        }
      ],
      evaluationList: [
      ],
      score: 3.8,
      degree: '98%',
      selected: '0',
      shopLoading: false,
      isLoading: false,
      noMore: false,
      page: 0,
      morePage: '',
      activeCondition: {}
    }
  },
  components: {
    start,
    evaluation
  },
  computed: {},
  created () { },
  updated () { },
  mounted () {
    this.getReviews()
  },
  methods: {
    getReviews () {
      let params = {
        storeId: this.$route.query.storeId,
        page: this.page,
        limit: 10,
        commodityId: this.$route.query.commodityId,
        reviewType: this.selected
      }
      getReviews(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          if (response.Body && response.Body.length > 0) {
            this.evaluationList = this.evaluationList.concat(response.Body)
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
        this.getReviews()
      }, 500)
    },
    selectType (n) {
      this.selected = n
    }
  },
  watch: {
    selected (val) {
      this.morePage = ''
      this.page = 0
      this.evaluationList = []
      this.getReviews()
    }
  }
}

</script>
<style lang='scss' scoped>
.storeEvaluation {
  text-align: left;
  background-color: #f0f4f7;
  font-size: 12px;
  .label {
    display: inline-block;
    margin-right: 5px;
    line-height: 18px;
    vertical-align: middle;
  }
  .overview {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 10px;
    background-color: #fff;
    font-weight: 600;
  }
  .condition {
    padding: 15px 10px 15px 10px;
    margin-bottom: 12px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      font-size: 10px;
      border-radius: 40px;
      border: #f8b892 solid 1px;
      padding: 5px 15px;
      background-color: #f5e7de;
    }
    .active {
      background-color: #e74c3c;
      color: #ecf0f1;
    }
  }
  .evaluation {
    background-color: #fff;
  }
  .loading-box {
    display: flex;
    justify-content: center;
  }
  .loading-more-txt {
    text-align: center;
  }
  .no-more {
    padding: 10px;
    text-align: center;
  }
}
</style>
