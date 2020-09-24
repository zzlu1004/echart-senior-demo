<template>
  <div :class=className>
    <el-input v-model="currentValue"
              v-if="$store.getters.globals.IE9"
              @keyup.enter.native="search"
              @clear="search"
              size="small">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-input v-model="currentValue"
              v-else
              @keyup.enter.native="search"
              @clear="search"
              size="small"
              placeholder="搜索"
              :clearable=true>
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
  </div>
</template>

<script>
  export default {
    name: 'FdSearch',
    components: {},
    props: {
      value: [String, Number],
      className: {
        type: String,
        default: 'inline-block fd-search width-300px'
      }
    },
    data() {
      return {
        currentValue: this.value || ''
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
      search() {
        this.$emit('search', this.currentValue)
      }
    },
    watch: {
      currentValue() {
        this.$emit('input', this.currentValue)
      }
    }
  }
</script>

<style scoped>
</style>
