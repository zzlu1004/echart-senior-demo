<template>
  <div class="inline-block relative pop-btn">
    <el-button :size="size" :type="type" :disabled="disabled">
      {{text}}
    </el-button>
    <el-popover
      placement="top"
      width="130"
      trigger="hover"
      :content="content">
      <i slot="reference" :class="iconClass + ' color-d9d9d9 pointer absolute pop-icon'"></i>
    </el-popover>
  </div>
</template>

<script>
    export default {
      name: 'popBtn',
      props: {
        text: {
          type: String,
          default: '保存草稿'
        },
        type: {
          type: String,
          default: 'primary'
        },
        size: {
          type: String,
          default: 'small'
        },
        iconClass: {
          type: String,
          default: 'at icon-questioncircle'
        },
        content: {
          type: String
        },
        disabled: {
          type: Boolean
        }
      },
      data() {
        return {}
      },
      methods: {
      },
      mounted() {
      }
    }
</script>

<style lang="scss">
.pop-btn{
  .pop-icon{
    top: 8px;
    right:4px;
  }
  .el-button--small {
    padding: 8px 20px 8px 15px;
  }
}
</style>
