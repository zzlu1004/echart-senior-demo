<template>
  <div class="full relative color-text-bg fd-panel">
    <div class="panel-title"
         :class="name ? 'pointer': ''"
         @click="headClick">
      <div v-if="title.length === 1" class="panel-title-line bd-x">
        <div class="f-left leader-tit">{{title[0]}}</div>
        <div v-if="subTitle.length > 0" class="f-right mr2">
          <div v-for="(item,index) of subTitle"
               class="f-left subTitle-div"
               :class="{ active: activePanel === ('panel-' + (index + 1)) }"
               :key="index"
               @click="activePanel = ('panel-' + (index + 1))"
          >{{item}}</div>
        </div>
      </div>
      <div v-else class="panel-title-line bd-right">
        <div class="panel-title-left f-left">
          <div class="f-left title-bd-top z-high"
               @click="activePanel = 'panel-1'"
               :class="activePanel === 'panel-1' ? 'fjactive':'inactive'">
            <div class="f-left bd-line-left"></div>
            <div class="f-left px2">{{title[0]}}</div>
            <div class="f-left bd-left-left"></div>
          </div>
          <div class="f-left bd-dialog transform" style="margin-left: -14px;z-index: 2;"></div>
          <div class="f-left"
               style="margin-left: -14px;"
               :class="activePanel === 'panel-2' ? 'fjactive':'inactive'"
               @click="activePanel = 'panel-2'">
            <div class="f-left bd-left-right"></div>
            <div class="f-left px1 title-bd-top" style="margin-top: -1px">{{title[1]}}</div>
            <div class="f-left bd-left-left"></div>
          </div>
          <div class="f-left bd-dialog transform" style="margin-left: -14px;z-index: 2;"></div>
          <div class="f-left bd-left-right" style="margin-left: -14px;"></div>
        </div>
      </div>
    </div>
    <div class="py1 full panel-body center-height" style="margin-top: 40px;">
      <div class="relative  full panel-body">
        <div class="slot-panel panel-1" :class="activePanel === 'panel-1' ? 'activePanel':'hidePanel'">
          <slot name="panel-1"></slot>
        </div>
        <div class="slot-panel panel-2" :class="activePanel === 'panel-2' ? 'activePanel':'hidePanel'">
          <slot name="panel-2"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FdPanel',
    mixins: [],
    components: {},
    data() {
      return {
        activePanel: 'panel-1',
        interval: null
      }
    },
    props: {
      title: {
        type: Array,
        default() {
          return []
        }
      },
      subTitle: {
        type: Array,
        default() {
          return []
        }
      },
      name: [String]
    },
    watch: {},
    hooks() {
    },
    computed: {},
    mounted() {
      // if (this.title.length > 1 || this.subTitle.length > 0) {
      //   this.interval = setInterval(() => {
      //     this.activePanel = this.activePanel === 'panel-1' ? 'panel-2' : 'panel-1'
      //   }, 4000)
      // }
    },
    beforeDestroy() {
      window.clearInterval(this.interval)
    },
    methods: {
      headClick() {
        this.$emit('headClick', this.name)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fd-panel{
    .leader-tit{
      font-size: 16px;
      color: #666;
      font-weight: bold;
      text-align: left;
    }
    background-color: #fff;
    height: auto;
    overflow: hidden;
    .panel-title{
      border-bottom: 1px solid #ebebeb;
      padding: 16px;
      font-size: 18px;
      height: 48px;
      width: 100%;
      position: absolute;
      z-index: 10;
      /*.panel-title-line{*/
        /*border-image: url('~@/assets/png/line.png') 0 1 repeat;*/
        /*height: 38px;*/
      /*}*/
      .panel-title-left, .panel-title-right{
        height: 44px;
        margin-top: -1px;
        /*border-top: 1px solid #0b236d;*/
        /*border-bottom: 1px solid #0b236d;*/
        .inactive{
          opacity: 0.5;
          filter: opacity(50);
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          text-align: left;
        }
        .fjactive{
          height: 32px;
          border-bottom: 2px solid #1b95e7;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          text-align: left;
        }
      }
      .subTitle-div{
        border: 1px solid #d0cccc;
        border-radius: 2px 0 0 2px;
        padding: 8px 20px;
        line-height: 14px;
        /* height: 14px; */
        cursor: pointer;
        text-align: center;
        color: #666;
        font-weight: 500;
        margin: -8px 0;
        background-color: white;
        font-size: 14px;
        /* width: 28px; */
      }
      .subTitle-div:hover{
        color: #1b95e7;
      }
      .subTitle-div.active{
        border-color: #1b95e7;
        color: #666;
        border-radius: 2px 0 0 2px;
      }
    }
    .panel-body{
      height:auto;
      width: 100%;
      height: auto;
      background: #fff;
    }
    .title-bd-top{
      /*border-top: 1px solid #5fbcdb;*/
    }
    .title-bd-bottom{
      /*border-bottom: 1px solid #032d80;*/
    }
    .bd-line-left,
    .bd-line-right{
      /*background-image: url('~@/assets/png/line.png');*/
      width: 1px;
      height: 44px;
    }
    .bd-left-left{
      /*background-image: url('~@/assets/png/right-right.png');*/
      transform: rotateY(180deg);
    }
    .bd-left-right{
      /*background-image: url('~@/assets/png/right-left.png');*/
      transform: rotateY(180deg);
    }
    .bd-right-left{
      /*background-image: url('~@/assets/png/right-left.png');*/
    }
    .bd-right-right{
      /*background-image: url('~@/assets/png/right-right.png');*/
    }
    .bd-dialog{
      /*background-image: url('~@/assets/png/space.png');*/
      width: 24px;
      height: 44px;
      margin-top: -1px;
    }
    .bd-left-left, .bd-left-right, .bd-right-left, .bd-right-right{
      margin-top: -1px;
      width: 15px;
      height: 44px;
    }
    .transform{
      transform:rotateY(180deg);
    }
    .slot-panel{
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .activePanel{
      z-index: 100;
    }
    .hidePanel{
      opacity: 0;
      filter: opacity(0);
    }
  }
  .center-container .center-height{
    width: 100%;
    height: 286px;
  }
  .center-container2 .center-height{
    width: 100%;
    height: 352px;
  }
  .center-container4 .center-height{
    width: 100%;
    height: 351px;
  }
  .center-container3 .center-height{
    width: 100%;
    height: 500px;
  }
  .center-container5 .center-height{
    width: 100%;
    height: 419px;
  }
  .center-container6 .center-height{
    width: 100%;
    height: 500px;
  }
</style>
