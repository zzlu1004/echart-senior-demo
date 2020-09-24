<template>
  <div :class="name">
    <div class="bd-bottom py1 bd-color-divider">
      <span class="h20 color-blue title-box pl1 bold">
        {{name === 'null'? '--' : name}}
      </span>
      <span class="f-right" @click="foldCard">
        <i v-if="isOpen" class="h20 at icon-down color-blue pointer"/>
        <i v-else class="h20 at icon-up color-blue pointer"/>
      </span>
    </div>
    <div v-show="isOpen" class="clearfix py2">
      <div
        v-for="(item, index) of data"
        :key="item.id"
        v-if="index<limit"
        class="f-left card-box pointer mr3 mb3">
        <!-- 部门人数==10个 -->
        <div v-if="data.length==10">
          <div  class="photoHidden"
                style="width: 168px;height:96px; position:relative;"
                :staffId="item.id"
                @click="gotoPeg(item)">
            <div class="card-photo f-left">
              <img :src="photo"/>
            </div>
            <div v-if="item.chairId" class="pl2 f-left absolute text-box-chair">
              <div class="color-title bold name-box dot-hidden">{{item.name}}</div>
              <div class="chair-box pt1">{{item.chairId}}</div>
            </div>
            <div v-else class="pl2 f-left absolute text-box">
              <div class="color-title bold name-box dot-hidden">{{item.name}}</div>
            </div>
          </div>
        </div>
        <!-- 部门人数不等于限制值 -->
        <div v-else-if="data.length!=limit">
          <!-- 前9个 -->
          <div v-if="index<limit-1"
                class="photoHidden"
                style="width: 168px;height:96px; position:relative;"
                :staffId="item.id"
                @click="gotoPeg(item)">
            <div class="card-photo f-left">
              <img :src="photo"/>
            </div>
            <div v-if="item.chairId" class="pl2 f-left absolute text-box-chair">
              <div class="color-title bold name-box dot-hidden">{{item.name}}</div>
              <div class="chair-box pt1">{{item.chairId}}</div>
            </div>
            <div v-else class="pl2 f-left absolute text-box">
              <div class="color-title bold name-box dot-hidden">{{item.name}}</div>
            </div>
          </div>
          <!-- 更多 -->
          <div v-if="index===limit-1"
                class="show-more color-title center"
                @click="showMore(data)">
            查看更多...
          </div>
        </div>
        <div v-else>
          <div :class="(index>moreStart?'photo-' + name:'photoHidden')"
            style="width: 168px;height:96px; position:relative;"
            :staffId="item.id"
            @click="gotoPeg(item)">
            <div class="card-photo f-left">
              <img :src="photo"/>
            </div>
            <div v-if="item.chairId" class="pl2 f-left absolute text-box-chair">
              <div class="color-title bold name-box dot-hidden">{{item.name}}</div>
              <div class="chair-box pt1">{{item.chairId}}</div>
            </div>
            <div v-else class="pl2 f-left absolute text-box">
              <div class="color-title bold name-box dot-hidden">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { foldCard, gotoPeg, showMore, getStaffPhoto, getMorePhoto } from '@/api/kpi/record/recordQuery'
  import head from '@/assets/defaultPhoto.png'
  export default {
    name: 'staffCard',
    components: {},
    props: {
      data: {
        type: Array
      },
      name: {
        type: String
      },
      isOpen: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        photo: head,
        limit: 10,
        moreStart: 8
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
      foldCard, gotoPeg, showMore, getStaffPhoto, getMorePhoto
    },
    watch: {
      limit() {
        this.$nextTick(() => {
          this.getMorePhoto('photo-' + this.name)
        })
      },
      'data.length'() {
        this.limit = 10
      }
    }
  }
</script>

<style lang="scss">
  .show-more{
    line-height: 96px;
    margin: 0 auto;
  }
  .chair-box{
    color: #8b8b8b;
  }
</style>
