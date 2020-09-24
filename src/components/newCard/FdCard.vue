<template>
  <div :class="'fd-new-card '+(options.border?'bd':'')" :style="{'width': width}">
    <div v-if="options.header" :class="'card-head bg '+(isCollapse?'bd-bottom':'')">
      <div v-if="options.header.left" class="f-left px1">
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
  import FdCardHeadItem from './headItem.vue'
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
    box-shadow: 0px 0px 5px #ddd;
  }
  .card-head{
    line-height: 48px;
    height: 50px;
  }
  .card-body{
    padding: 1rem;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.8;
    letter-spacing: normal;
    text-align: left;
    color: #666666;
  }
  .card-footer{
    padding: 1rem;
  }
</style>

