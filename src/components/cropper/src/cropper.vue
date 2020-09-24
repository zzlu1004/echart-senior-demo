<template>
  <div>
    <div v-if="noChange">
      <el-row>
        <el-col :span="4" :offset="7">头像</el-col>
        <el-col :span="9">
          <div class="userPhoto" @click="noChange=false"><img :src="photo"/></div>
          <div class="pt1">仅支持png, jpeg, gif, jpg四种类型图片</div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row>
        <el-col :span="16">
          <div class="wrapper">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixedBox="option.fixedBox"
              @realTime="realTime"
            ></vueCropper>
          </div>
          <div class="py1">
            <label class="btn btn-primary" for="uploads">上传</label>
            <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
            <span @click="rotateRight" class="btn btn-primary ml1"><i class="at icon-reload1"/></span>
            <span class="btn btn-primary ml1" @click="finish">确认</span>
            <span class="btn btn-primary ml1" @click="noChange = true">取消</span>
          </div>
        </el-col>
        <el-col :span="8" class="p2">
          <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden'}">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
          <div class="show-preview mt2" :style="{'width': previews.w + 'px', 'height': previews.w + 'px',  'overflow': 'hidden', 'borderRadius': previews.w + 'px'}">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import vueCropper from 'vue-cropper'
  import head from '@/assets/user.jpg'
  import { getUserInfo } from '@/api/login'
  import { setLocalStorage } from '@/utils/auth'
  export default {
    name: 'FdCropper',
    components: {
      vueCropper
    },
    props: {
      userId: {
        type: String
      }
    },
    data() {
      return {
        noChange: true,
        photo: this.$store.getters.user.userPhoto || head,
        option: {
          img: '',
          autoCrop: true,
          size: 1,
          outputType: 'png',
          autoCropWidth: 120,
          autoCropHeight: 168,
          fixedBox: true
        },
        previews: {},
        downImg: '#'
      }
    },
    mounted() {
      this.option.img = this.photo
    },
    watch: {
      noChange() {},
      photo() {}
    },
    methods: {
      changeImg() {
        this.option.img = this.photo
      },
      startCrop() {
        // start
        this.crap = true
        this.$refs.cropper.startCrop()
      },
      stopCrop() {
        //  stop
        this.crap = false
        this.$refs.cropper.stopCrop()
      },
      clearCrop() {
        // clear
        this.$refs.cropper.clearCrop()
      },
      refreshCrop() {
        // clear
        this.$refs.cropper.refresh()
      },
      changeScale(num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },
      rotateRight() {
        this.$refs.cropper.rotateRight()
      },
      finish() {
        // 生成base64
        this.$refs.cropper.getCropData((data) => {
          this.noChange = true
          this.photo = data
          this.saveUserPhoto()
        })
      },
      // 实时预览函数
      realTime(data) {
        this.previews = data
      },
      finish2(type) {
        this.$refs.cropper2.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      },
      finish3(type) {
        this.$refs.cropper3.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      },
      down(type) {
        // event.preventDefault()
        var aLink = document.createElement('a')
        aLink.download = 'demo'
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.downImg = window.URL.createObjectURL(data)
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.downImg = data
            aLink.href = data
            aLink.click()
          })
        }
      },

      uploadImg(e, num) {
        // 上传图片
        // this.option.img
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          this.$message({
            type: 'warning',
            message: '图片类型必须是.gif,jpeg,jpg,png,bmp中的一种'
          })
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          } else if (num === 2) {
            this.option.img = data
          }
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file)
      },
      imgLoad(msg) {
      },
      getUserInfo,
      saveUserPhoto() {
        this.fd.req({
          type: 'put',
          url: 'api/users/' + this.userId + '/photo',
          data: {
            userPhoto: this.photo
          }
        }, 'uaa_url').then(response => {
          setLocalStorage('user', '')
          this.$store.dispatch('GetUserInfo')
        }).catch(error => {
          console.log('saveUserPhoto', error)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .userPhoto{
    width: 120px;
    height: 168px;
    overflow: hidden;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .wrapper{
    height: 400px;
    width: 100%;
  }
</style>
<style>
  .wrapper .vue-cropper{
    background-image: none;
    background-color: transparent;
  }
</style>
