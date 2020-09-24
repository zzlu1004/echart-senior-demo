<template>
  <div class="bg-gray pb2 ">
    <div class="rule-class px2 py1 mt2">
      <p style="margin-bottom: 8px">公式示例: A*10+B*5</p>
      <p> 注意: 1、输入公式仅使用以下16种的半角符号才有效;</p>
      <p style="margin-left: 42px">2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;</p>
      <p style="margin-left: 42px">3、输入公式除数值和16种符号外仅可使用档位集合中档位名称。</p>
    </div>
    <div v-if="example.length > 0">
      <div class="pointer clipboard-item bd bg mt1 ml2 inline-block"
            @click="handleClipboard(item,$event)"
            :data-clipboard-text = "item"
            v-for="(item, index) of example"
            :key="index"
      >{{item}}</div>
    </div>
    <div class="pl1" v-if="example2.length > 0">
      <div class="pointer clipboard-item bd bg mt1 ml1 inline-block"
            @click="handleClipboard(item,$event)"
            :data-clipboard-text = "item"
            v-for="(item, index) of example2"
            :key="index"
      >{{item}}</div>
    </div>
  </div>
</template>

<script>
  import clipboard from '@/utils/clipboard'
  export default {
    name: 'mzFormulaDes',
    components: {},
    props: {
      des: {
        type: String,
        default: `公式示例: A*10+B*5
        注意: 1、输入公式仅使用以下16种的半角符号才有效;
              2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
              3、输入公式除数值和16种符号外仅可使用档位集合中文档位名称。`
      },
      example: {
        type: Array,
        default: () => {
          return ['个人指标值']
        }
      },
      example2: {
        type: Array,
        default: () => {
          return ['+', '-', '*', '/', 'IF', 'AVERAGE', '(', ')', 'AND', 'OR', ',', '>', '<', '=', '>=', '<=']
        }
      }
    },
    data() {
      return {}
    },
    computed: {},
    mounted() {},
    methods: {
      handleClipboard(text, event) {
        clipboard(text, event)
      }
    },
    watch: {}
  }
</script>

<style scoped>
  .rule-class>p{
    font-weight: normal;
    font-family: 宋体;
    color: #606266;
    margin: 0;
  }
  .bg-gray{
    line-height: 1.8;
  }
  pre{
    background-color: transparent;
    padding-bottom: 0;
  }
  .clipboard-item{
    padding: 2px 8px;
  }
</style>

