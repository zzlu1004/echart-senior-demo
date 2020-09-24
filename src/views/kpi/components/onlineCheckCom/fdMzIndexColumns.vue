<template>
  <el-table-column class="report-list"
                   v-else
                   :prop="data[childKey]? '':id"
                   :label="data[this.label]?data[this.label]:label"
                   :align="data[childKey] ? 'center' : 'left'"
  >
    <fd-columns
      v-if="data[childKey]"
      v-for="item of data[childKey]"
      :key="item[keyName]"
      :data="item"
      :indexs="indexs"
    ></fd-columns>
    <template v-if="!data[childKey]" slot-scope="scope">
      <span v-for="(items, index) of scope.row.scores" v-if="getTargetData(items, data)" :key="items.id">
        <span>{{items.total}}</span>
      </span>
    </template>
  </el-table-column>
</template>

<script>
  import { noString } from '@/utils/filters'
  export default {
    name: 'FdColumns',
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
        default: 'gears'
      },
      keyName: {
        type: String,
        default: 'menuId'
      },
      label: {
        type: String,
        default: 'menuName'
      },
      indexs: {
        type: Array
      }
    },
    data() {
      return {
        indexObj: {},
        score: '',
        obj: {},
        indexName: ''
      }
    },
    computed: {},
    mounted() {
    },
    methods: {
      getTargetData(val, menu) {
        if (val.gear_id === menu.id) {
          return true
        } else {
          return false
        }
      },
      noString
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .gears:hover{
    border: 1px solid #66b1ff;
    cursor: pointer;
  }
  .gear-class{
    float: left;
    font-weight: 500;
    background-color: #e8f4fd;
    padding: 2px 10px;
    margin-right: 16px;
    color: #1b95e7;
    margin-bottom: 8px;
    border: 1px solid #e8f4fd;
  }
  .gear-active{
    float: left;
    font-weight: 500;
    background-color: #66b1ff;
    padding: 2px 10px;
    margin-right: 16px;
    color: #fff;
    margin-bottom: 8px;
    border: 1px solid #66b1ff;
  }
  .gear-withdraw{
    float: left;
    font-weight: 500;
    background-color: #F6D269;
    padding: 2px 10px;
    margin-right: 16px;
    color: #fff;
    margin-bottom: 8px;
    border: 1px solid #F6D269;
  }
  .gear-name{
    float: left;
    border: 1px solid #ebeef5;
    padding: 2px 10px;
    margin-right: 8px;
    margin-bottom: 2px;
    border-radius: 2px;
  }
  .score-popover.el-popover--plain{
    padding: 10px;
  }
  .score-popover.el-popover{
    min-width: 80px;
  }
  .space-font{
    display: inline-block;
    width: 100%;
    height: 18px;
  }
</style>

