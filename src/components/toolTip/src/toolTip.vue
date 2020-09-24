<!-- by your name -->
<template>
  <div class = ''>
     <el-tooltip class="item" :effect="effect" :content="content" :placement="placement">
        <div slot="content" v-if="content == ''">
           <slot name='content'></slot>
        </div>
         <slot></slot>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'FdTooltip',
  data() {
    return {
    }
  },
  props: {
    effect: {
      type: String,
      default: 'light'
    },
    placement: {
      type: String,
      default: 'top'
    },
    content: {
      type: String,
      default: ''
    }
  },
  components: {},
  computed: {},
  methods: {}
}

</script>
<style lang='scss' scoped>
</style>