!<!--  -->
<template>
  <div class="imgLoadWrap">
    <div class="imgLoad">
      <img v-if="showPic.show"
           v-gallery:groupName
           :src="showPic.ImagePath">
      <input v-else
             @change="upload($event,showPic)"
             type="file"
             accept="image/*"
             capture
             multiple="">
      <div class="load"
           v-show="loadShow">
        <mt-spinner type="fading-circle"
                    :size="30"
                    color="#f56e4e"></mt-spinner>
      </div>

    </div>
    <div class="delete">
      <p @click="deleteImg()"
         v-if="showPic.show">删除图片</p>
    </div>

  </div>

</template>

<script>
export default {
  name: 'imgLoad',
  props: {
    pic: {
      type: Object
    },
    imgLoading: {
      type: Boolean
    }
  },
  data () {
    return {
      loadShow: false
    }
  },
  components: {},

  computed: {
    showPic () {
      return Object.assign(this.pic)
    }
  },
  created () { },
  updated () { },
  mounted () {
    let inPutFile = document.querySelectorAll('input')
    if (this.getIos()) {
      for (let item of inPutFile) {
        if (item.getAttribute('type') === 'file') {
          item.removeAttribute('capture')
        }
      }
    }
  },

  methods: {
    upload (e, item) {
      this.loadShow = true
      this.$emit('update:imgLoading', true)
      let src
      let url = window.URL || window.webkitURL || window.mozURL
      let files = e.target.files
      for (let i = 0, len = files.length; i < len; ++i) {
        let file = files[i]
        if (url) {
          src = url.createObjectURL(file)
        } else {
          src = e.target.result
        }
        var fileTypeName = file.name + ''
        item.SuffixName = fileTypeName.substr(
          fileTypeName.lastIndexOf('.'),
          fileTypeName.length - fileTypeName.lastIndexOf('.')
        )
        // 图片转化base64
        let image = new Image()
        console.log(src)
        image.src = src
        image.onload = () => {
          let ext = src.substring(src.lastIndexOf('.') + 1) // 获取扩展名
          this.loadShow = false
          this.$emit('update:imgLoading', false)
          item.show = true
          return (item.ImagePath = this.getBase64Image(image, ext))
        }
      }
    },
    // 图片base64转码格式
    getBase64Image (image, ext) {
      let quality = 0.2 // 比率（压缩比）
      let canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      let context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      let base64 = canvas.toDataURL('image/' + ext, quality) // 需要文件扩展名
      return base64
    },
    getIos () {
      var ua = navigator.userAgent.toLowerCase()
      if (ua.match(/iPhone\sOS/i) === 'iphone os') {
        return true
      } else {
        return false
      }
    },
    deleteImg () {
      let air = {
        ImagePath: '',
        SuffixName: '',
        show: false
      }
      this.$emit('update:pic', Object.assign(air))
    }
  }
}

</script>
<style lang='scss' scoped>
.imgLoadWrap {
  width: 70px;
  margin-right: 20px;
  float: left;
}
.imgLoad {
  width: 70px;
  height: 70px;
  background: url("../assets/load-bg.png") no-repeat;
  background-size: contain;
  position: relative;
  .load {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  input {
    display: block;
    height: 70px;
    width: 70px;
    opacity: 0;
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
    margin: 0 auto;
  }
}
.delete {
  height: 40px;
  padding-top: 10px;
  p {
    position: relative;
    width: 50px;
    text-align: center;
    padding: 5px 0;
    border-radius: 5px;
    margin: 0 auto;
    background-color: #ecf0f1;
  }
}
</style>
