<template>
  <div>
    <div class="px3 case-menus-tab bg-white">
      <el-menu :default-active="page"
               @select="handleSelect"
               class="el-menu-demo"
               mode="horizontal"
               text-color="#666"
               active-text-color="#1b95e7">
        <el-menu-item v-if="elements.workQuality" index="workQuality">办案公正</el-menu-item>
        <el-menu-item v-if="elements.workEfficiency" index="workEfficiency">办案效率</el-menu-item>
        <el-menu-item v-if="elements.workEffect" index="workEffect">办案效果</el-menu-item>
        <el-menu-item v-if="elements.judicialOpen" index="judicialOpen">司法公开</el-menu-item>
      </el-menu>
    </div>
    <div :class="isComponent?'':'app-container'">
      <div
        class="bg-white work-result"
        :class="isComponent?'pt2':'container-inner'"
        :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
        <work-target
          v-show="elements.workQuality && page === 'workQuality'"
          page='workQuality'
          :active="page"
          :userId="userId"
          :userName="userName"
          :elements="elements"
        >
        </work-target>
        <work-target
          v-show="elements.workEfficiency && page === 'workEfficiency'"
          page='workEfficiency'
          :active="page"
          :userId="userId"
          :userName="userName"
          :elements="elements"
        >
        </work-target >
        <work-target
          v-show="elements.workEffect && page === 'workEffect'"
          page='workEffect'
          :active="page"
          :userId="userId"
          :userName="userName"
          :elements="elements"
        >
        </work-target>
        <work-target
          v-show="elements.judicialOpen && page === 'judicialOpen'"
          page='judicialOpen'
          :active="page"
          :userId="userId"
          :userName="userName"
          :elements="elements"
        >
        </work-target>
        <!-- <FdNoContent v-show="elements.judicialOpen && page === 'judicialOpen'"></FdNoContent> -->
      </div>
    </div>
  </div>
</template>

<script>
  import workTarget from '../components/qualityEfficiency/workTarget.vue'
  import FdNoContent from 'fd/noContent'
  import { handleSelect } from '@/api/kpi/newRecord/workQE'
  export default {
    name: 'workQE',
    components: {
      workTarget, FdNoContent
    },
    props: {
      isComponent: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
        default: ''
      },
      userName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 'workQuality',
        pageMap: {
          'workQuality': '办案公正',
          'workEfficiency': '办案效率',
          'workEffect': '办案效果',
          'judicialOpen': '司法公开'
        }
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.workQE || {}
      }
    },
    mounted() {
      // 如果没有给这个用户配置
      if (this.elements.workQuality) {
        this.page = 'workQuality'
      } else if (this.elements.workEfficiency) {
        this.page = 'workEfficiency'
      } else if (this.elements.workEffect) {
        this.page = 'workEffect'
      } else if (this.elements.judicialOpen) {
        this.page = 'judicialOpen'
      }
    },
    methods: {
      handleSelect
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.page-inner{
  padding: 24px 0;
}
</style>
