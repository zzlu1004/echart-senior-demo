<template>
  <div :class="'fd-new-card '+(options.border?'bd':'')" :style="{'width': width}">
    <div v-if="options.header" :class="'card-head bg '+(isCollapse?'bd-bottom':'')">
      <div v-if="options.header.left" class="f-left px1">
      <svg-icon class="h30 f-left help_svg" :icon-class="this.indexModels === 'manual'?'help_manual':'help_video'" />
        <fd-card-head-item
          v-for="(item, index) of options.header.left"
          :key="index"
          :data="data"
          :option="item"
          v-on:eventEmit="eventEmit"></fd-card-head-item>
      </div>
      <div v-if="options.header.right" class="f-right px1">
        <fd-card-head-item
          v-for="(item, index) of options.header.right"
          :key="index"
          :data="data"
          :option="item"
          v-on:eventEmit="eventEmit"></fd-card-head-item>
      </div>
    </div>
    <div v-if="options.body" v-show="isCollapse" :class="'card-body '+(options.footer?'bd-bottom':'')">
      <slot name="body" slot-data="data"></slot>
    </div>
    <div v-if="options.footer" v-show="isCollapse" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  import FdCardHeadItem from './helpHeadItem.vue'
  export default {
    name: 'FdNewCard',
    components: { FdCardHeadItem },
    props: {
      data: {
        type: Object,
        default: {}
      },
      options: {
        type: Object,
        default: {}
      },
      width: {
        type: String,
        default: '100%'
      }
    },
    data() {
      return {
        indexModels: '',
        isCollapse: true
      }
    },
    computed: {},
    mounted() {
      for (const name of this.options.eventNames) {
        this[name] = (data) => {
          this.$emit(name, data)
        }
      }
      this.indexModels = this.$route.query.indexModels || ''
    },
    methods: {
      changeCollapse(flag) {
        this.isCollapse = flag
      },
      eventEmit(data) {
        this[data.eventName](data.data)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fd-new-card{
    box-shadow: 0px 5px 5px #ddd;
    border-radius:10px;
  }
  .fd-new-card .bg{
    background: none;
  }
  .fd-new-card .bd-bottom{
    border-bottom-style: none;
  }
  .card-head{
    line-height: 48px;
    height: 50px;
  }
  .card-body{
    padding: 10px;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.8;
    letter-spacing: normal;
    text-align: left;
    color: #666666;
    margin-left: 47px;
  }
  .card-footer{
    padding: 1rem;
  }
  .help_svg{
    height: 49px;
    width: 17px;
    margin-left: 15px;
    margin-right: 10px;
  }
  .f-left {
    font-weight: 800;
  }
</style>

