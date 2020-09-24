<template>
  <el-collapse v-model="option.activeName" :accordion = "option.accordion" @change = "handleChange">
    <el-collapse-item v-for = "item of option.data"
                      :key = "item.id"
                      :title="item.title"
                      :name="item.name">
      <div v-text = "item.content"></div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
    export default {
      name: 'FdCollapse',
      props: {
        option: {
          type: Object
        },
        data: {
          type: Array
        },
        id: [String],
        name: [String],
        title: [String],
        content: [String]
      },
      data() {
        return {}
      },
      methods: {
        handleChange(val) {
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
