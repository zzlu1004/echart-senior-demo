<template>
  <div class="app-container">
    <div class="container-inner has-fixed-bottom bg-white" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div class="width-800px m0">
        <div class="notice-content">
          <div class="center bold h18 color-title mb3">{{noticeData.title}}</div>
          <div class="center mb6">
            <span class="mr3">
              <span>
                发布时间：
              </span>
              <span>
                {{noticeData.releaseDate}}
              </span>
            </span>
            <span>
              <span>
                发布者：
              </span>
              <span>
                {{noticeData.releaseName || '--'}}
              </span>
            </span>
          </div>
          <div class="body-panel">
            <div class="content-body" v-html="noticeData.content">
            </div>
            <div v-if="attachments&&attachments.length>0" class="mt2 mb4">
              <div class="color-blue mb2" v-for="(info, index) of attachments" :key="info.id" @click="downloadFile(info)">
                  <i class="at icon-paperclip"/>
                  <span class="pointer">{{'材料'+(index+1)+'：'+info.attachmentName}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix">
          <div v-show="this.params.limit !== 2" class="f-left pointer width-240px" @click="prevNotice(prev)">
            <div class="dot-hidden">
              <i class="at icon-doubleleft"/>
              上一篇：{{prev.title}}
            </div>
          </div>
          <div v-show="this.params.offset !== total-this.params.limit+1" class="f-right pointer width-240px" @click="nextNotice(next)">
            <div class="dot-hidden right-align">
              下一篇：{{next.title}}
              <i class="at icon-doubleright"/>
            </div>
          </div>
        </div>
        <div class="fixed-bottom">
          <div class="fixed-bottom-item" @click="goBack">
            <div class="fixed-bottom-item-text">返回</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { goBack } from '@/api/common'
  import { getDetail, getAttById, getNoticeList, prevNotice, nextNotice, getArr } from '@/api/kpi/center/noticeDetail'
  import { downloadFile } from '@/api/kpi/onlineCheck/checkList'
  export default {
    name: '',
    components: {},
    props: {},
    data() {
      return {
        noticeData: {},
        noticeId: '',
        attachments: [],
        type: '',
        noticeArr: [],
        index: 0,
        params: {
          keyword: '',
          limit: 2,
          offset: 0,
          type: 'bulletin',
          projectCode: 'kpi'
        },
        prev: {},
        next: {},
        total: 0
      }
    },
    computed: {
      // index: function() {
      //   return this.$route.query.index
      // }
    },
    mounted() {
      this.noticeId = this.$route.query.id || ''
      this.index = this.$route.query.index
      this.params.limit = (this.index - 0 === 0) ? 2 : 3
      this.params.offset = (this.index - 0 === 0) ? this.index : this.index - 1
      this.type = this.$route.query.type || ''
      this.getArr()
      this.getDetail()
      this.getAttById()
    },
    methods: {
      getDetail, goBack, downloadFile, getAttById, getNoticeList, prevNotice, nextNotice, getArr
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
.width-800px{
  width:800px;
}
.m0{
  margin:0 auto;
}
.content-body{
  text-indent:2em;
  line-height:27px;
}
.notice-content{
  min-height: 400px;
}
.width-240px{
  width:240px;
}
</style>
