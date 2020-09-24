<template>
  <div class="fd-menu" style="color: #999;">
    <div v-for="(item, index) of option.menuList"
         :key="item.id"
         class="menuList"
         :class="{'active':menu===item.id,'right-align':option.position === 'left','left-align':option.position === 'right'}"
         :style="{width: option.width?option.width:'100%'}"
         >
         <div v-if="option.position === 'right'">
             <div>
                <i class="fd-icon icon-gerenxinxijiedianweidianji mr-5px" style="font-size:12px;"/>
                <span>
                    <a href="javascript:void(0)" @click="eventEmit(item)">{{item.text}}</a>
                </span>
            </div>
            <div v-if="index!==option.menuList.length-1" class="step-bottom-left"></div>
         </div>
         <div v-if="option.position === 'left'">
             <div>
                <span>
                    <a href="javascript:void(0)" @click="eventEmit(item)">{{item.text}}</a>
                </span>
                <i class="fd-icon icon-gerenxinxijiedianweidianji ml-5px" style="font-size:12px;"/>
            </div>
            <div v-if="index!==option.menuList.length-1" class="step-bottom-right"></div>
         </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'fdMenu',
    data() {
      return {
        menu: '',
        dom: ''
      }
    },
    props: {
      option: {
        type: Object,
        default: {}
      },
      className: {
        type: String,
        default: 'personal-msg'
      }
    },
    components: {},
    methods: {
      eventEmit(d) {
        this.menu = d.id
        const data = { ...d, dom: this.dom }
        this.$emit('menuClick', data)
      }
    },
    mounted() {
      if (this.option.menuList.length > 0) {
        this.menu = this.option.menuList[0].id
      }
      this.dom = document.getElementsByClassName(this.className)[0]
    },
    watch: {
      'option.menuList'() {
        if (this.option.menuList.length > 0) {
          this.menu = this.option.menuList[0].id
        }
      }
    }
  }
</script>

<style lang="scss">
  .step-bottom-right{
    border-right:1px dashed #ebebeb;
    height: 60px;
    margin-right: 6px;
  }
  .step-bottom-left{
    border-left:1px dashed #ebebeb;
    height: 60px;
    margin-left: 5px;
  }
  .menuList.active,
  .menuList.active .fd-icon{
    color:#409EFF;
  }
  .pr-8px{
    padding-right:8px;
  }
  .mr-5px{
    margin-right:5px;
  }
  .ml-5px{
    margin-left:5px;
  }
</style>
