<template>
  <div>
    <el-badge
      :value=option.value
      class="item"
      :max = option.max
      :is-dot = option.isDot
      :hidden = option.hidden>
      <slot name = "badgeParent"></slot>
    </el-badge>
  </div>
</template>

<script>
    export default {
      name: 'FdBadge',
      props: {
        option: {
          default: {}
        }
      },
      data() {
        return {}
      },
      methods: {}
    }
</script>

<style>

</style>
