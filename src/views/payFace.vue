!<!-- 用户扫码支付页面 -->
<template>
  <div></div>
</template>

<script>
import { newGoToPayFace } from '@/api/api'
import { MessageBox } from 'mint-ui'
import { getToken, payFace } from '@/utils/auth'
export default {
  name: 'payFace',
  data () {
    return {
    }
  },

  components: {},

  computed: {},

  created () {
    this.payFace()
  },
  updated () { },
  mounted () {

  },
  methods: {
    payFace () {
      let params = {
        customerPid: getToken(),
        id: this.$route.query.i
      }
      newGoToPayFace(params).then(response => {
        if (response.Head.ErrorCode === 10000) {
          if (response.Body) {
            payFace(response.Body)
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
</style>
