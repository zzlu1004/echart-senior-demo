<template>
  <span class="ml1">
    <el-tooltip v-model="show[id]" :manual=true class="item" effect="dark" content="复制成功" placement="top">
      <span name="emailClipboard" :class="email?'color-link pointer bd-none':'bd-none'"
            :data-clipboard-text = "email">
        {{email | noString}}
      </span>
    </el-tooltip>
  </span>
</template>

<script>
  import Clipboard from 'clipboard'
  export default {
    name: 'FdEmail',
    components: { Clipboard },
    props: {
      email: {
        type: String
      }
    },
    data() {
      return {
        show: {}
      }
    },
    computed: {
      id() {
        return this.fd.tools.getId()
      }
    },
    mounted() {
      this.$set(this.show, this.id, false)
      const clipboard = new Clipboard('[name="' + this.id + '"]')
      // 使用箭头函数保证函数体内的this指向不变
      clipboard.on('success', e => {
        this.show[this.id] = true
        setTimeout(() => {
          this.show[this.id] = false
        }, 2500)
      })
    },
    methods: {}
  }
</script>

<style scoped>
</style>

