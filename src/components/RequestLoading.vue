<template>
  <transition name="fade-transform"
              mode="out-in">
    <div class="request-loading-component"
         v-if="requestLoading">
      <svg-icon icon-class="loading">
      </svg-icon>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import svgIcon from '@/components/SvgIcon.vue'
export default {
  name: 'RequestLoading',
  components: {
    svgIcon
  },
  computed: {
    ...mapGetters([
      'requestLoading'
    ])
  }
}
</script>

<style lang='scss' scoped>
.request-loading-component {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  // background-color: transparent;
  font-size: 150px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}
</style>
