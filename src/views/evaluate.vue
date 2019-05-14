!<!--  -->
<template>
  <div class="evaluate">
    <div class="score">
      <span class="lable">评分</span>
      <start size="large"
             :score.sync="score"
             :isEvaluate="isEvaluate"></start>
    </div>
    <div class="evaluateText">
      <textarea v-model="remark"
                name=""
                id=""
                placeholder="亲，请评写服务体验，不超过500个字符"
                rows="6">
        </textarea>
    </div>
    <div class="uploadImg">
      <p class="title">上传图片</p>
      <div class="content">
        <img-load :pic.sync="pictureOne"
                  :imgLoading.sync="imgLoading"></img-load>
        <img-load :pic.sync="pictureTwo"
                  :imgLoading.sync="imgLoading"></img-load>
        <img-load :pic.sync="pictureThree"
                  :imgLoading.sync="imgLoading"></img-load>
      </div>
    </div>
    <p :class="[{'gay':imgLoading },'release']"
       @click="release()">
      发布评论
    </p>
  </div>
</template>

<script>
import start from '@/components/start.vue'
import imgLoad from '@/components/imgLoad.vue'
import { submitReviews } from '@/api/api'
import { getToken } from '@/utils/auth'
import { MessageBox } from 'mint-ui'
export default {
  name: '',
  data () {
    return {
      score: 0,
      isEvaluate: true,
      imgLoading: false,
      remark: '',
      pictureOne: {
        ImagePath: '',
        SuffixName: '',
        show: false
      },
      pictureTwo: {
        ImagePath: '',
        SuffixName: '',
        show: false
      },
      pictureThree: {
        ImagePath: '',
        SuffixName: '',
        show: false
      },
      uploadImg: []
    }
  },

  components: {
    start,
    imgLoad
  },

  computed: {},

  created () { },
  updated () { },
  mounted () { },

  methods: {
    release () {
      if (this.imgLoading) {
        return false
      }
      if (this.score < 1) {
        MessageBox.alert('请对本次服务进行评星操作', '提示')
        return false
      }
      if (this.remark.length < 1) {
        MessageBox.alert('请对本次服务进行评价', '提示')
        return false
      }
      if (this.remark.length > 500) {
        MessageBox.alert('评价不能超过500个字符，您已经输入了' + this.remark.length + '个字符', '提示')
        return false
      }
      this.dealImg(this.pictureOne)
      this.dealImg(this.pictureTwo)
      this.dealImg(this.pictureThree)
      let ccmodel = {
        ProductPid: this.$route.query.info[0],
        OrderDetailPid: this.$route.query.info[1],
        CustomerPid: getToken(),
        Star: this.score,
        CommentRemark: this.remark,
        Images: this.uploadImg
      }
      submitReviews({ ccmodel }).then(response => {
        if (response.Head.ErrorCode === 10000) {
          MessageBox.alert('评价成功', '提示')
          this.$router.push({ name: 'orderList' })
        } else {
          MessageBox.alert(response.Head.Msg, '提示')
        }
      })
    },
    dealImg (item) {
      if (item.ImagePath) {
        this.uploadImg.push({
          ImagePath: item.ImagePath,
          SuffixName: ''
        })
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.evaluate {
  background-color: #f0f4f7;
  text-align: left;
  height: 100vh;
  .score {
    background-color: #fff;
    padding: 10px 10px 30px 10px;
    .lable {
      font-size: 14px;
      display: inline-block;
      margin-right: 10px;
      vertical-align: middle;
    }
  }
  .evaluateText {
    background-color: #fff;
    padding: 10px;
    margin-bottom: 10px;
    textarea {
      width: 100%;
      overflow: auto;
      word-break: break-all; //解决兼容问题
      border: none;
      font-size: 12px;
    }
  }
  .uploadImg {
    padding: 20px 10px 0 10px;
    background-color: #fff;
    margin-bottom: 42px;
    .title {
      font-size: 14px;
      margin-bottom: 15px;
    }
    .content {
      overflow: hidden;
    }
  }
  .release {
    text-align: center;
    margin: 0 auto;
    width: 60%;
    background-color: #f56e4e;
    color: #fff;
    font-size: 14px;
    padding: 8px;
  }
  .gay {
    background-color: #cdcdcd;
  }
}
</style>
