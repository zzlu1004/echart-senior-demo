<!-- by your name -->
<template>
  <div>
    <span v-if="$store.getters.globals.isIE">
      <el-date-picker
        type="month"
        :size="size"
        :value-format="format"
        :clearable="clearable"
        v-model="val[0]"
        class="mr1"></el-date-picker>
        -
      <el-date-picker
      type="month"
      :size="size"
      :value-format="format"
      v-model="val[1]"
      :clearable="clearable"
      class="ml1"
      ></el-date-picker>
    </span>
    <span v-else>
      <el-date-picker
        type="month"
        :size="size"
        :value-format="format"
        :clearable="clearable"
        placeholder="选择日期"
        v-model="val[0]"
        class="mr1"></el-date-picker>
        -
      <el-date-picker
        type="month"
        :size="size"
        :value-format="format"
        :clearable="clearable"
        placeholder="选择日期"
        v-model="val[1]"
        class="ml1"
        ></el-date-picker>
    </span>
  </div>
</template>

<script>
export default {
  name: 'datePickerMonth',
  data() {
    return {
    }
  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    format: {
      type: String,
      default: 'yyyy-MM'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: []
    }
  },
  components: {
  },
  computed: {
    val() {
      return this.value
    }
  },
  methods: {
  },
  watch: {
    val(val) {
      console.log(val)
    }
  }
}

</script>
<style lang='scss' scoped>
.fd-input{
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    min-height: 20px;
    height: 100%;
    line-height: 1;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
}
.fd-focus{
 outline: none;
 border-color: #409eff;
}
.fd-icon{
    position: absolute;
    top: 50%;
    margin-top: -20px;
    right: 5px;
    color: #dcdfe6;
}
.isChoose{
     background: gainsboro;
     border-radius: 4px;
}
</style>