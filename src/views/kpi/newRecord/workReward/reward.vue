<template>
  <div class="app-container">
    <div class="container-inner bg-white other-work" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <div>
        <gy-study-com page='reward' :elements="elements"></gy-study-com>
      </div>
    </div>
  </div>
</template>

<script>
  import gyStudyCom from '../../components/gyStudyCom.vue'
  export default {
    name: 'reward',
    components: {
      gyStudyCom
    },
    props: {},
    data() {
      return {
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.reward || {}
      }
    },
    mounted() {
    },
    methods: {
    },
    watch: {}
  }
</script>

<style lang="scss">
</style>
