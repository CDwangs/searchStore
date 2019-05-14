!<!--  -->
<template>
  <div>
    <div class="amap-wrapper">
      <el-amap vid="amap"
               :plugin="plugin"
               class="amap">
      </el-amap>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'coordinate',
  props: {
    show: {
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  components: {},
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
  created () {

  },
  updated () { },
  mounted () { },
  methods: {
    ...mapActions({
      setCoordinate: 'SETCoordinate' // 将 `this.setCoordinate()` 映射为 `this.$store.dispatch('setCoordinate')`
    }),
    changeCoordinate (newCoordinate) {
      // 修改vuex中的状态
      this.setCoordinate(newCoordinate)
      this.$emit('method')
      this.$emit('update:show', true)
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
