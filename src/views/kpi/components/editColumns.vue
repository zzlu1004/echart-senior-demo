<template>
<div class="edit-col">
  <el-table-column :prop="data[childKey]? '':id" :label="data[this.label]?data[this.label]:label">
    <EditColumns 
        v-if="data[childKey]" 
        v-for="item of data[childKey]" 
        :key="item[keyName]" 
        :data="item"
        :indexs="indexs"
        ></EditColumns>
    <template v-if="!data[childKey]" slot-scope="scope">
      <el-input
              v-if="getInput(scope.row, data.menuId)"
              v-model="score" 
              :placeholder="(scope.row.valueMax||scope.row.valueMin)?scope.row.valueMin+'-'+scope.row.valueMax:''"
              @change="checkApproveScore(item, 'report')"
              ></el-input>
      <div v-else v-html="getTargetData(scope.row, data.menuId)"></div>
    </template>
  </el-table-column>
</div>
</template>

<script>
  import { checkApproveScore } from '@/api/kpi/onlineCheck/checkList'
  export default {
    name: 'EditColumns',
    components: {},
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      childKey: {
        type: String,
        default: 'children'
      },
      id: {
        type: String,
        default: 'firstScore'
      },
      keyName: {

        type: String,
        default: 'menuId'
      },
      label: {
        type: String,
        default: 'menuName'
      },
      from: {
        type: String,
        default: ''
      },
      edit: {
        type: Boolean,
        default: true
      },
      indexs: {
        type: Array
      }
    },
    data() {
      return {
        auth: {
          'report': 'first',
          'check': 'next'
        },
        score: '',
        resource: ''
      }
    },
    computed: {},
    mounted() {
      this.resource = this.$route.query.resource || ''
    },
    methods: {
      checkApproveScore,
      getInput(row, indexId) {
        for (const item in row.indexVal) {
          if (item === 'index' + indexId) {
            const flag = (row.indexVal['index' + indexId] && row.indexVal['index' + indexId][this.auth[this.resource] + 'Edit'])
            return flag
          }
        }
      },
      getTargetData(row, indexId) {
        for (const item in row.indexVal) {
          if (item === 'index' + indexId) {
            this.score = (row.indexVal['index' + indexId]) ? row.indexVal['index' + indexId][this.auth[this.resource] + 'Score'] : ''
            return (row.indexVal['index' + indexId]) ? row.indexVal['index' + indexId][this.auth[this.resource] + 'Score'] : ''
          }
        }
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
</style>

