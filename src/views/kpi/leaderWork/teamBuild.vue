<template>
  <div class="app-container">
    <div class="bg-gray" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <teamBuildTop></teamBuildTop>
      <teamBuildBottom></teamBuildBottom>
    </div>
  </div>
</template>

<script>
  import teamBuildTop from './teamBuild/teamBuildTop.vue'
  import teamBuildBottom from './teamBuild/teamBuildBottom.vue'
  export default {
    name: 'teamOverview',
    components: { teamBuildTop, teamBuildBottom },
    props: {},
    data() {
      return {
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>

</style>
