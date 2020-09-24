<template>
  <div class = "relative ">
    <div :class="className" :option = "option" :style="{height:height,width:width}" ref="chart"></div>
    <div class = "map-path absolute top-0 right-0 mg-1-2"
         ref = "path"
         v-show="option.type === 'map' && option.showItem === true">
      <div class = "inline-block" v-for="(key, index) in address" :key="key.code">
        <span class="p1" v-show="index !== 0">>></span>
        <el-button type="text" v-text="key.name" @click="pathChange(key.code)"></el-button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
require('echarts-wordcloud')
import store from '@/store'
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'FdEchart',
  props: {
    option: {
      type: Object,
      default: {
        data: [], // 生成图标的数据
        type: 'vbar', // 图标类型
        stack: true, // 堆积图
        dataZoom: true, // 显示拖动
        chartOption: {}, // 全量的默认配置
        chart: null, // echart.init后生成的echart对象
        opt: {} // 覆盖默认配置，规则参照echart官网
      }
    },
    className: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  data() {
    return {
      store,
      address: [],
      departId: ''
    }
  },
  mounted() {
    this.departId = this.option.mapCode || store.getters.user.departId || '34'
    this.initChart()
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  beforeDestroy() {
    if (!this.option.chart) {
      return
    }
    this.option.chart.dispose()
    this.option.chart = null
  },
  methods: {
    initChart() {
      this.option.chartOption = this.fd.echart.getDefaultOption(this.option.type, this.option.opt, this.option.mapCode)
      this.option.chart = echarts.init(this.$refs.chart)
      if (this.option.type === 'map') {
        const url = './static/geoJson/' + this.departId + '.json'
        axios.get(url).then(result => {
          echarts.registerMap(this.departId, result.data)
          this.option.chart.setOption(this.option.chartOption)
          this.showPath(this.departId)
        })
        if (this.option.selectChanged) {
          this.option.chart.on('mapselectchanged', this.mapselectchanged)
        }
      } else if (this.option.type === 'scatter_map') {
        const url = './static/geoJson/' + this.option.code + '.json'
        const _this = this
        axios.get(url).then(function(result) {
          echarts.registerMap(_this.option.code, result.data)
          _this.option.chart.setOption(_this.option.chartOption)
        })
      } else {
        this.fd.echart.refreshOption(this.option, this.option.chartOption, this.option.chart)
        this.option.chart.setOption(this.option.chartOption)
      }
    },
    mapselectchanged(params) {
      const name = params.batch[0].name
      const selected = params.batch[0].selected[name]
      const cityCode = this.fd.echart.getCityCode(name)
      this.showPath(cityCode, selected)
      if (selected) {
        this.option.selectName = name
      } else {
        this.option.selectName = ''
      }
      if (this.option.showItem && cityCode.length < 6) {
        const url = './static/geoJson/' + cityCode + '.json'
        this.option.chartOption.series.map = cityCode
        this.option.chartOption.series.name = name
        const _this = this
        axios.get(url).then(function(result) {
          echarts.registerMap(cityCode, result.data)
          _this.option.chart.setOption(_this.option.chartOption)
          _this.option.selectChanged(cityCode, selected)
        })
      } else {
        this.option.selectChanged(cityCode, selected)
      }
    },
    pathChange(cityCode) {
      this.showPath(cityCode, true)
      this.option.chartOption.series.map = cityCode
      this.option.chartOption.series.name = this.fd.echart.getCityName(cityCode)
      this.option.selectChanged(cityCode, true)
    },
    showPath(cityCode, selected) {
      if (!selected) {
        cityCode = this.fd.echart.getPrevCode(cityCode)
      }
      this.address = this.fd.echart.getCityPath(cityCode)
    }
  },
  watch: {
    'option.data'() {
      this.fd.echart.refreshOption(this.option, this.option.chartOption, this.option.chart)
      this.option.chart.clear()
      this.option.chart.setOption(this.option.chartOption, true)
    },
    'option.type'() {
      this.option.chartOption = this.fd.echart.getDefaultOption(this.option.type, this.option.opt)
    },
    'option.opt': {
      handler(val, oldVal) {
        this.option.chartOption = this.fd.echart.getDefaultOption(this.option.type, this.option.opt)
        this.fd.echart.refreshOption(this.option, this.option.chartOption, this.option.chart)
        this.option.chart.setOption(this.option.chartOption, true)
      },
      deep: true
    },
    'store.getters.size'() {
      this.option.chart.resize()
    },
    'sidebar.opened'() {
      this.option.chart.resize()
    }
  }
}
</script>
