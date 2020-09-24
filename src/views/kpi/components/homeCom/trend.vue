<template>
  <div class="bg-white">
    <div class="bd-dashed-bottom title-panel px3">
      <span class="h16 color-title bold">业绩趋势</span>
      <span class="sub-panel">（{{new Date(this.fd.tools.getNowTime())|parseTime("{y}年")}}累计）</span>
    </div>
    <div class="px3 py2">
      <trend-judge 
        v-if="elements.judge" 
        :elements="elements.judge" 
        :class="((elements.assistant)? 'bd-dashed-bottom' : '') + ' mb2 trend-height'"></trend-judge>
      <trend-assistant 
        v-if="elements.assistant" 
        :elements="elements.assistant" 
        :class="((elements.clerk)? 'bd-dashed-bottom' : '') + ' mb2 trend-height'"></trend-assistant>
      <trend-clerk 
        v-if="elements.clerk" 
        :elements="elements.clerk" 
        :class="((elements.other)? 'bd-dashed-bottom' : '') + ' mb2 trend-height'"></trend-clerk>
      <trend-other 
        v-if="elements.other" 
        :elements="elements.other" 
        class="trend-height"></trend-other>
    </div>
  </div>
</template>

<script>
  import trendJudge from './trendJudge.vue'
  import trendAssistant from './trendAssistant.vue'
  import trendClerk from './trendClerk.vue'
  import trendOther from './trendOther.vue'
  export default {
    name: 'trend',
    components: {
      trendJudge, trendAssistant, trendClerk, trendOther
    },
    props: {
      elements: {
        type: Object
      }
    },
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

<style lang="scss">
.trend-height{
  min-height: 355px;
}
</style>
