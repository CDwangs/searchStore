<!--  -->
import { nsend } from 'q';
<template>
  <div class="start">
    <span v-for="(item ,index) in startList"
          :key="item+index"
          :class="[startType
          ,item]"
          @click="evaluate(index+1)"></span>
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'start-on'
const CLS_HALF = 'start-half'
const CLS_OFF = 'start-off'

export default {
  name: 'start',
  props: {
    score: {
      type: Number,
      default: 0
    },
    size: {
      validator: function (value) {
        return ['normal', 'large', 'small'].indexOf(value) !== -1
      },
      default: 'normal'
    },
    isEvaluate: {
      type: Boolean,
      default: false
    }

  },
  data () {
    return {
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    startList () {
      let result = []
      let integer = Math.floor(this.score)
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      if (this.score > integer && this.score < 5) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    },
    startType () {
      return 'start-' + this.size
    }
  },
  methods: {
    evaluate (n) {
      if (!this.isEvaluate) return false
      this.$emit('update:score', n)
    }
  }
}

</script>
<style lang='scss' scoped>
.start {
  display: inline-block;
  vertical-align: middle;
  .start-small {
    display: inline-block;
    width: 10px;
    height: 10px;
  }
  .start-normal {
    display: inline-block;
    width: 15px;
    height: 15px;
  }
  .start-large {
    display: inline-block;
    width: 25px;
    height: 25px;
  }
  .start-on {
    background: url("../assets/start/on.png") no-repeat;
    background-size: contain;
  }
  .start-half {
    background: url("../assets/start/half.png") no-repeat;
    background-size: contain;
  }
  .start-off {
    background: url("../assets/start/off.png") no-repeat;
    background-size: contain;
  }
}
</style>
