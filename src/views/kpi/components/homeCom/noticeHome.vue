<template>
  <div class="bg-white">
    <div class="bd-dashed-bottom title-panel px3">
      <div class="f-left color-title h16 bold">通知公告</div>
      <div class="f-right pointer sub-panel" @click="goPage('notice')">
        <i class="at icon-doubleright"/>
      </div>
    </div>
    <div class="px3 pb2">
      <div class="pt1">
        <div class="pl3 pt1" style="height:184px; overflow-y:auto;">
          <div>
            <div v-for="(item, index) of notices" :key="item.id"
              :class="(index === notices.length-1 ? '':'mb3')+' relative pointer'"
              >
              <div class="absolute">
                <span v-if="item.readFlag !== '1'" class="inline-block dot-icon dot-icon-unread absolute"></span>
                <span class="inline-block notice-date">{{item.releaseDate}}</span>
                <div class="inline-block relative">
                  <span v-if="index !== notices.length-1" class="inline-block notice-line absolute"></span>
                  <span class="inline-block dot-icon dot-icon-gray"></span>
                </div>
              </div>
              <div class="dot-hidden notice-title">
                <span class="notice-name" @click="seeNoticeDetail(item)">{{item.title}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { goPage, seeNoticeDetail, getNotice } from '@/api/kpi/homeNew'
  export default {
    name: 'noticeHome',
    components: {},
    props: {},
    data() {
      return {
        notices: []
      }
    },
    computed: {
    },
    mounted() {
      this.getNotice()
    },
    methods: {
      goPage, seeNoticeDetail, getNotice
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.dot-icon{
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
.dot-icon-gray{
  background-color: #bcbcbc;
}
.dot-icon-unread{
  background-color: #ff7577;
  top: 4px;
  left: -14px;
}
.notice-line{
  height: 34px;
  width: 2px;
  background-color: #bcbcbc;
  top: 12px;
  right: 3px;
}
.notice-date{
  width: 124px;
}
.notice-title{
  padding-left: 150px;
}
.notice-name:hover {
  color: #1b95e7;
}
</style>
