<template>
  <el-table-column
    v-if="data.field"
    :prop="data.menuId"
    :label="data[this.label]?data[this.label]:label">
  </el-table-column>
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
      :edit="edit"
      :indexs="indexs"
      :isactive="isactive"
      :gearChooseArr="gearChooseArr"
      @showbox="toshow"
    ></fd-columns>
    <template v-if="!data[childKey]&&!data.field" slot-scope="scope">
      <!-- 查看页面 -->
      <div v-if="!edit">
        <span v-for="(items, index) of scope.row.indexes" v-if="getTargetData(items, data)" :key="items.id">
         <span v-for="(item,index) in items.gears" :key="item.id">
           <span :class="lookClass(item, items)" class="gear-name">{{item.gearName}}</span>
         </span>
        </span>
      </div>
      <!-- 编辑页面 -->
      <div v-else>
        <span v-for="(items, index) of scope.row.indexes" v-if="getTargetData(items, data)" :key="items.id">
         <span v-for="(item,index) in items.gears" :key="item.id" @click="chooseGear(item, items)">
           <span :class="toggleClass(item, items)" @click='changeClass(item, items)' class="gears">
             <span >
               {{item.gearName}}
             </span>
           </span>
         </span>
        </span>
      </div>
    </template>
  </el-table-column>
</template>

<script>
  import { noString } from '@/utils/filters'
  import { chooseGear } from '@/api/kpi/onlineCheck/mzReportList'
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
      isactive: {
        type: Array,
        default: () => {
          return []
        }
      },
      gearChooseArr: {
        type: Array,
        default: () => {
          return []
        }
      },
      keyName: {
        type: String,
        default: 'menuId'
      },
      label: {
        type: String,
        default: 'menuName'
      },
      edit: {
        type: Boolean
      },
      indexs: {
        type: Array
      }
    },
    data() {
      return {
        indexObj: {},
        score: '',
        obj: {}
      }
    },
    computed: {},
    mounted() {
    },
    methods: {
      chooseGear,
      noString,
      lookClass(item, items) {
        if (items.gearName === item.gearName) {
          // 0:草稿状态 1：提交状态 2：撤回状态
          if (items.status === 1) {
            return 'gear-active'
          } else if (items.status === 2) {
            return 'gear-withdraw'
          } else if (items.status === 0) {
            return 'gear-withdraw'
          }
        }
      },
      toggleClass(item, items) {
        this.aaa = 4
        this.isactive.forEach((some) => {
          if (some.flowNodeActionId === items.flowNodeActionId && some.gearName === item.gearName) {
            if (some.status === 1) {
              this.aaa = 1
            } else if (some.status === 2) {
              this.aaa = 2
            } else if (some.status === 0) {
              this.aaa = 0
            }
          }
        })
        if (this.aaa === 1) {
          return 'gear-active'
        } else if (this.aaa === 2) {
          return 'gear-withdraw'
        } else if (this.aaa === 0) {
          return 'gear-withdraw'
        } else {
          return 'gear-class'
        }
      },
      changeClass(item, items) {
        // 先获取到父组件接口中选中的档位放到isactive，通过点击，添加新选中的档位进去。
        if (this.isactive.length === 0) {
          this.isactive.push({
            flowNodeActionId: items.flowNodeActionId,
            gearName: item.gearName,
            status: 1
          })
        } else {
          this.isactive.forEach((some, i) => {
            if (some.flowNodeActionId === items.flowNodeActionId) {
              this.isactive.splice(i, 1)
            }
          })
          this.isactive.push({
            flowNodeActionId: items.flowNodeActionId,
            gearName: item.gearName,
            status: 1
          })
        }
      },
      getTargetData(val, menu) {
        // 双重匹配，档位的collectionId和目录中档位集合的id，并且档位的indexId和目录中档位集合的pid（pid就是档位集合对应的指标）相匹配
        if (val.indexId === menu.pid && val.collectionId === menu.id) {
          return true
        } else {
          return false
        }
      },
      toshow(msg) {
        this.gearChooseArr = msg
        this.$emit('showbox', this.gearChooseArr)
      }
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
    color: #ff9b00;
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

