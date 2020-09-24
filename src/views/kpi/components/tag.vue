<template>
  <div class="fd-tag" :class="className">
    <div v-for="(list, index) of tagData"
         class="px1 bd-tag-left f-left mb2"
         :class="size"
         :style="{width: (inline ? (100 / tagData.length + '%') : '100%')}"
         :key="index">
      <div v-for="(item, i) of list" :key="i" class="inline-span">
        <span v-show="item.name" class="name" :title="item.name">{{item.name}}</span>
        <span v-show="item.value" class="value">{{item.value}}</span>
        <span v-show="item.unit" class="unit">{{item.unit}}</span>
        <span v-show="item.rate" class="rate">
          占比 <fd-rise-down2 :data="item.rate"></fd-rise-down2>
        </span>
        <span v-show="item.yoy" class="yoy">
          同比: <fd-rise-down :data="item.yoy"></fd-rise-down>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import FdRiseDown from '../../../components/riseDown/riseDown.vue'
import FdRiseDown2 from '../../../components/riseDown/riseDown2.vue'
export default {
  name: 'FdTag',
  mixins: [],
  components: { FdRiseDown, FdRiseDown2 },
  data() {
    return {}
  },
  props: {
    className: [String],
    // 是否横向布局
    inline: {
      type: Boolean,
      default: true
    },
    // 显示的数据
    tagData: {
      type: Array,
      default() {
        return []
      }
    },
    size: {
      type: String,
      default: 'normal' // normal, big
    }
  },
  watch: {},
  hooks() {
  },
  computed: {},
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  @import '../../../styles/variables';
.fd-tag{
  .bd-tag-left{
    border-left: 4px solid #3ca4eb;
  }
  .normal{
    font-size: 12px;
    line-height: 32px;
    .name{
      font-size: 16px;
      color: #666;
    }
    .value{
      font-size: 26px;
      font-weight: bold;
    }
  }
  .big{
    font-size: 18px;
    line-height: 40px;
    .name{
      font-size: 14px;
      color: #666;
    }
    .value{
      font-size: 26px;
      color: #404040;
      font-weight: bold;
    }
  }
  .inline-span:nth-child(1){
    margin-right: 4px;
    min-width: 120px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .inline-span:nth-child(2){
    margin-right: 4px;
  }
}
</style>
