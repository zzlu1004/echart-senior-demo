<template>
  <div class="app-container">
    <div class="bg-gray" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
        <teamOverviewTop></teamOverviewTop>
        <teamOverviewCenter></teamOverviewCenter>
        <teamOverviewBottom></teamOverviewBottom>
    </div>
  </div>
</template>

<script>
  import teamOverviewTop from './teamOverview/teamOverviewTop.vue'
  import teamOverviewCenter from './teamOverview/teamOverviewCenter.vue'
  import teamOverviewBottom from './teamOverview/teamOverviewBottom.vue'
  export default {
    name: 'teamOverview',
    components: { teamOverviewTop, teamOverviewCenter, teamOverviewBottom },
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
