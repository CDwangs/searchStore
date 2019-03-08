<template>
  <div class="home">
    <mt-swipe :show-indicators="false">
      <mt-swipe-item>1</mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
// @ is an alias to /src
import { getCarousel } from '@/api/api'
import store from '@/store'
export default {
  name: 'home',
  data () {
    return {
      carouselList: {

      }
    }
  },
  mounted () {
    this.getCarousel()
  },
  created () { },
  updated () { },
  methods: {
    getCarousel () {
      getCarousel({}).then(response => {
        if (response.Head.ErrorCode === 10000) {
          console.log(response)
        } else {
          console.log(response)
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.home {
  .mint-swipe {
    height: 140px;
  }
}
</style>
