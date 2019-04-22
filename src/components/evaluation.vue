!<!--  -->
<template>
  <div class="evaluation">
    <ul v-if="evaluationList.length > 0">
      <li v-for="(item,index) in evaluationList"
          :key="index">
        <div class="info">
          <div class="user">
            <img class="avatar"
                 :src="item.avatar ? item.avatar : userImg"
                 alt="">
            <div class="phone">
              <p>{{item.CustomerName}}</p>
              <start size="small"
                     :score="item.Star"></start>
            </div>
          </div>
          <p>
            {{item.AddDate}}
          </p>
        </div>
        <p class="desc">
          {{item.CommentRemark}}
        </p>
        <div class="showPic"
             v-show="item.Images">
          <div class="showPicItme"
               v-for="(pic,index ) in item.Images"
               :key="index">
            <img v-gallery:groupName
                 :src="pic.ImagePath">
          </div>

        </div>
        <p class="title">
          {{item.title}}
        </p>
      </li>
    </ul>
    <p class="noEvaluation"
       v-else>暂无评价</p>
  </div>
</template>

<script>
import start from '@/components/start.vue'
import user from '@/assets/user.png'
export default {
  name: 'evaluation',
  props: {
    evaluationList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      userImg: user
    }
  },

  components: {
    start
  },

  computed: {},

  created () { },
  updated () { },
  mounted () { },

  methods: {}
}

</script>
<style lang='scss' scoped>
.evaluation {
  ul {
    li {
      padding: 17px 9px;
      border-bottom: #e1e1e1 solid 1px;
      .info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .user {
        display: flex;
        justify-content: flex-start;
        .avatar {
          display: block;
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        .phone {
          p {
            margin-bottom: 7px;
          }
        }
      }
      .desc {
        margin-bottom: 12px;
      }
      .showPic {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        .showPicItme {
          width: 95px;
          height: 95px;
          margin-right: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .title {
        color: #969696;
      }
    }
  }
  .noEvaluation {
    text-align: center;
    padding: 40px;
  }
}
</style>
