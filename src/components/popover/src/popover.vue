<template>
  <div>
    <el-popover
      ref = "popover4"
      class = "popover"
      :placement = option.placement
      :width = option.width
      :disabled = option.disabled
      :trigger = option.trigger
      :value = option.value
      :offset = option.offset
      :transition = option.transition
      :visible-arrow = option.visibleArrow
      :popper-options = option.popperOptions
      :open-delay = option.openDelay
    >
      <slot name="popover"></slot>
    </el-popover>

    <div v-popover:popover4 class="inline-block">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'FdPopover',
      props: {
        option: {
          type: Object,
          default: {
            title: '',
            content: '',
            width: '150px',
            placement: 'bottom',
            disabled: false,
            value: false,
            offset: 0,
            trigger: 'click',
            transition: 'fade-in-linear',
            visibleArrow: true,
            popperOptions: {},
            openDelay: 200
          }
        }
      },
      data() {
        return {}
      },
      methods: {},
      mounted() {
        // $refs.reference = el;
        // var el = document.querySelector('#id')
        // this.$refs[this.option.ref].$refs.reference = el
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
