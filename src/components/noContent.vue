<template>
  <div class="py3">
    <p class="center mb2">
      <svg-icon icon-class="noContent" :style="{'font-size': size}"/>
    </p>
    <p class="center color-subTitle h14">{{tip}}</p>
  </div>
</template>

<script>
export default {
  name: 'FdNoContent',
  props: {
    size: {
      type: String,
      default: () => {
        return '12rem'
      }
    },
    tip: {
      type: String,
      default: () => {
        return '暂无相关信息~'
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
