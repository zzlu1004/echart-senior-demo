<template>
  <div>
    <div class="relative mt2 height-normal">
      <div class="ages-title f-left t-right" style="padding-right: 50px;">{{$store.getters.globals.year}}年结构（人）</div>
      <div class="absolute t-center" style="width:120px;height:40px;left: 50%;margin-left: -70px;"></div>
      <div class="f-left ages-title t-left" style="padding-left: 52px">2024年预测（人）</div>
    </div>
    <div class="ages-item" v-for="(item, index) of data" :key="index">
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover">
        <div class="popoverClass">{{item.name}}:{{item.value || '--'}}人/占比：{{item.rate || '--'}}%</div>
        <div class="f-left" :style="{width: (itemWidth +10+ 'px')} "  slot="reference">
          <div class="area-age p f-right" :style="{'width': (barWidth*item.value/max)+'px'}"></div>
          <span class="f-right mr1">{{item.value || '--'}}</span>
        </div>
      </el-popover>
      <div class="center">{{item.name}}</div>
      <el-popover
        placement="top-start"
        width="200"
        popper-class="popperClass"
        trigger="hover">
        <div class="popoverClass">{{item.name}}:{{item.forecast || '--'}}人/占比：{{item.yoy || '--'}}%</div>
        <div class="f-right" :style="{width: (itemWidth + +33+'px')}"   slot="reference">
          <div class="area-age y f-left" :style="{'width': (barWidth*item.forecast/max)+'px'}"></div>
          <span class="f-left ml1">{{item.forecast || '--'}}</span>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgeForecast',
  mixins: [],
  components: {},
  data() {
    return {
      max: 0
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [{
          name: '30岁及以下',
          value: 13,
          forecast: 34
        }, {
          name: '30岁及以下',
          value: 46,
          forecast: 14
        }, {
          name: '30岁及以下',
          value: 33,
          forecast: 54
        }]
      }
    },
    really: {
      type: String,
      default: 'value'
    },
    forecast: {
      type: String,
      default: 'forecast'
    },
    width: {
      type: [Number, String],
      default: 500
    }
  },
  watch: {
    data(data) {
      this.max = this.getMax(data)
    }
  },
  hooks() {
  },
  computed: {
    itemWidth() {
      return this.width / 2 - 88
    },
    barWidth() {
      return this.width / 1.7 - 190
    }
  },
  mounted() {
    this.max = this.getMax(this.data)
  },
  methods: {
    getMax(data) {
      let max = 1 // max需要做分母，不能为0
      data.forEach((item) => {
        if (max < item[this.really]) {
          max = item[this.really]
        }
        if (max < item[this.forecast]) {
          max = item[this.forecast]
        }
      })
      return max
    }
  }
}
</script>

<style lang="scss" scoped>
  .popoverClass{
    position: absolute;
    background-color: #343434;
    /*min-width: 150px;*/
    width: 200px;
    border: none;
    padding: 6px;
    z-index: 2000;
    color: #ffffff;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    top: 0;
    left: 0;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .ages-title{
    width: 50%;
    font-size: 20px;
    font-weight: 500;
  }
  .ages-item{
    position: relative;
    line-height: 30px;
    height: 35px;
    .area-age{
      border-radius: 10px;//调整横柱的圆角
      height: 15px;  //调整横柱的高度
      margin: 10px 0;
    }
     .f-left .area-age{
      background: #02cff7
    }
     .f-right .area-age{
      background: #3c8ff7
    }
    /*<!--.f-left{-->*/
      /*<!--margin-left: -60px;-->*/
    /*<!--}-->*/
    /*<!--.f-right{-->*/
      /*<!--margin-right: -60px;-->*/
    /*<!--}-->*/
    .center{
      position: absolute;
      text-align: center;
      line-height: 40px;
      height: 40px;
      width: 120px;
      left: 50%;
      margin-left: -70px;
    }
  }
</style>
