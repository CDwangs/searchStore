!<!--  -->
<template>
  <div class="storeMap">
    <div class="loading-box tc"
         v-if="loading">
      <mt-spinner type="snake"
                  class="loading-more"></mt-spinner>
      <span class="loading-more-txt">加载中...</span>
    </div>
    <el-amap vid="amapDemo"
             :zoom="zoom"
             :center="center"
             class="amap-demo"
             :plugin="plugin"
             v-if="showpath">
      <el-amap-marker vid="startMarker"
                      :position="startMarker.position"
                      v-if="showpath"></el-amap-marker>
      <el-amap-polyline vid="polyline"
                        :path="polyline.path"
                        :outlineColor="polyline.outlineColor"
                        :isOutline="polyline.isOutline"
                        :strokeColor="polyline.strokeColor"
                        :borderWeight="polyline.borderWeight"
                        :strokeWeight="polyline.strokeWeight"
                        :lineJoin="polyline.lineJoin"
                        v-if="showpath"></el-amap-polyline>
      <el-amap-marker vid="endMarker"
                      :position="endMarker.position"
                      v-if="showpath"></el-amap-marker>

    </el-amap>
    <div class="amap-wrapper">
      <el-amap vid="amap"
               :plugin="pluginA"
               class="amap">
      </el-amap>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
const exampleComponents = {
  props: ['text'],
  template: `<div>text from  parent: {{text}}</div>`
}
export default {
  name: 'storeMap',
  data () {
    return {
      startMarker: {
        position: [],
        contentRender: (h, instance) => h(exampleComponents, { style: { backgroundColor: '#fff' }, props: { text: 'father is here' } }, ['xxxxxxx'])
      },
      endMarker: {
        position: [],
        contentRender: (h, instance) => h(exampleComponents, { style: { backgroundColor: '#fff' }, props: { text: 'father is here' } }, ['xxxxxxx'])
      },
      polyline: {
        path: [],
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: '#0091ff',
        lineJoin: 'round'
      },
      zoom: 12,
      center: [],
      loading: true,
      showpath: false
    }
  },
  components: {},
  computed: {
    ...mapGetters([
      'coordinate'
    ]),
    plugin: function () {
      let that = this
      console.log(that.startMarker.position)
      console.log(that.endMarker.position)
      return [
        {
          pName: 'Driving',
          events: {
            init (o) {
              o.search(that.startMarker.position, that.endMarker.position, (status, result) => {
                console.log(result)
                if (result.routes && result.routes.length) {
                  console.log(result.routes[0])
                  that.drawRoute(result.routes[0])
                }
              })
            }
          }
        }
      ]
    },
    pluginA: function () {
      let that = this
      return [
        {
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
                    longitude: 30.6574200000,
                    latitude: 104.0658400000
                  }
                  that.changeCoordinate(newCoordinate)
                }
              })
            }
          }
        }
      ]
    }
  },
  created () {
  },
  updated () { },
  mounted () {
    if (this.coordinate.longitude.length > 0) {
      this.getPath()
      this.showpath = true
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      setCoordinate: 'SETCoordinate' // 将 `this.setCoordinate()` 映射为 `this.$store.dispatch('setCoordinate')`
    }),
    // 路径处理
    parseRouteToPath (route) {
      let path = []
      for (let i = 0, l = route.steps.length; i < l; i++) {
        let step = route.steps[i]
        for (let j = 0, n = step.path.length; j < n; j++) {
          path.push(step.path[j])
        }
      }
      return path
    },
    drawRoute (route) {
      let path = this.parseRouteToPath(route)
      this.polyline.path = path
    },
    changeCoordinate (newCoordinate) {
      // 修改vuex中的状态
      this.setCoordinate(newCoordinate)
      this.getPath()
      this.showpath = true
    },
    getPath () {
      this.startMarker.position = [this.coordinate.longitude, this.coordinate.latitude]
      this.endMarker.position = this.$route.query.location
      this.center = this.startMarker.position
    }
  }
}

</script>
<style lang='scss' scoped>
.storeMap {
  height: 100vh;
  width: 100vw;
}
</style>
