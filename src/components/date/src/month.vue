<!-- by your name -->
<template>
  <div class = '' style="height:100%">
   
        <el-popover
          placement="bottom"
          v-model="isShow"
          width="226"
          ref="popover5"        
        >
        <div>
           <span class="f-left center pointer month" v-for="(item,key) in months" :key="key" @click='getMonth(item,key)' :class="{isChoose:data[item] == value }" style='width:50px;line-height:50px'>
           
             <a href="#javascript" class="color-link" >{{item}}</a>
             </span>

        </div>
          
        </el-popover>
         
         <div class="relative" style="height:100%">
            <input type="text"   v-bind:value="value" class="fd-input" :class="{'fd-focus':isfocus}" ref='input' v-popover:popover5  @input="input" @focus="focus" @blur="blur">
            <span class="fd-icon" @click='clearValue' v-show='iconShow'><i  class="el-input__icon el-icon-circle-close el-input__clear"></i></span>  
          
         </div>
  </div>
</template>

<script>
export default {
  name: 'FdMonth',
  data() {
    return {
      isShow: false,
      isfocus: false,
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      data: {
        '一月': '01',
        '二月': '02',
        '三月': '03',
        '四月': '04',
        '五月': '05',
        '六月': '06',
        '七月': '07',
        '八月': '08',
        '九月': '09',
        '十月': '10',
        '十一月': '11',
        '十二月': '12'

      }
    }
  },
  components: {
  },
  props: ['value'],
  computed: {
    iconShow() {
      return this.value !== ''
    }
  },
  methods: {
    getMonth(val, key) {
      this.$emit('input', this.data[val])
      this.isShow = false
    },
    input(val) {
      this.$refs.input.$el.value = val
    },
    focus() {
      this.isfocus = true
    },
    blur() {
      this.isfocus = false
    },
    clearValue() {
      this.$emit('input', '')
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