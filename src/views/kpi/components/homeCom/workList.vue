<template>
  <div class="bg-white">
    <div class="bd-dashed-bottom title-panel px3">
      <span class="h16 color-title bold">工作概览</span>
      <span class="sub-panel">（{{new Date(this.fd.tools.getNowTime())|parseTime("{y}年")}}累计）</span>
    </div>
    <div class="px3 py2">
      <work-list-judge
        v-if="elements.judge"
        :class="((elements.assistant)? 'bd-dashed-bottom' : '') + ' mb2 list-height'"
        :elements="elements.judge"></work-list-judge>
      <work-list-assistant 
        v-if="elements.assistant" 
        :class="((elements.clerk)? 'bd-dashed-bottom' : '') + ' mb2 list-height'"
        :elements="elements.assistant"></work-list-assistant>
      <work-list-clerk 
        v-if="elements.clerk" 
        :class="((elements.other)? 'bd-dashed-bottom' : '') + ' mb2 list-height'"
        :elements="elements.clerk"></work-list-clerk>
      <work-list-other 
        v-if="elements.other" 
        class="list-height" 
        :elements="elements.other"></work-list-other>
    </div>
  </div>
</template>

<script>
  import workListJudge from './workListJudge.vue'
  import workListAssistant from './workListAssistant.vue'
  import workListClerk from './workListClerk.vue'
  import workListOther from './workListOther.vue'
  export default {
    name: 'workList',
    components: {
      workListJudge, workListAssistant, workListClerk, workListOther
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
.list-height{
  min-height: 355px;
}
</style>
