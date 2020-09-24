<template>
  <div class="bg-gray pb2">
    <pre>{{des}}</pre>
    <div v-if="example.length > 0">
      <div class="pointer clipboard-item bd bg mt1 ml2 inline-block"
            @click="handleClipboard(item,$event)"
            :data-clipboard-text = "item"
            v-for="(item, index) of example"
            :key="index"
      >{{item}}</div>
    </div>
    <div class="pl1 mb2" v-if="example2.length > 0">
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
    name: 'FdFormulaDes',
    components: {},
    props: {
      des: {
        type: String,
        default: `公式示例: 80+(((个人指标值*10)-全院指标均值)/全院指标均值)*100+IF(部门指标值>0 AND
                部门指标值<100,90,0)+IF(全院指标值>部门指标均值 OR 全院指标值>0,90,0)
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用下列所示特殊中文指标值;
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`
      },
      example: {
        type: Array,
        default: () => {
          return ['个人指标值', '部门指标值', '部门指标均值', '业务线指标值', '业务线指标均值', '全院指标值', '全院指标均值']
        }
      },
      example2: {
        type: Array,
        default: () => {
          return ['+', '-', '*', '/', 'IF', 'AVERAGE', '(', ')', 'AND', 'OR', 'POWER', ',', '>', '<', '=', '>=', '<=']
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

