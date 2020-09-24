<template>
  <div class="bg-white">
    <div class="bd-dashed-bottom title-panel px3">
      <div class="f-left color-title h16 bold">考核流程</div>
    </div>
    <div class="p3" style="min-height: 208px;">
      <div class="mb2">
        <div class="color-title bold">考核对象</div>
        <div>
          <div class="inline-block relative pointer node-normal" 
              v-for="(item, index) of processObj" 
              :key="item.name"
              :class="'node-'+index"
              >
              <!-- <i :class="'h48 fd-icon '+(index === 0 ? 'icon-liuchengjiantou1':'icon-jiantouliuchengzhongjian')+
                ' color-'+index"/> -->
              <svg-icon class="process-normal" :icon-class="'process'+(index+1)" style="width:100%;height:48px;"/>
              <span class="h12 absolute node-name" :style="{'margin-left': -(item.name.length*12/2)+'px'}">{{item.name}}</span>
          </div>
        </div>
      </div>
      <!-- 注释代码为：考核流程hover效果，后期可能开放 -->
      <!-- <div>
        <div class="color-title bold">考核主体</div>
        <div>
          <div class="inline-block relative pointer node-normal" 
              v-for="(item, index) of processBody" 
              :key="item.name"
              :class="'node-'+index"
              @mouseover="selectStyle (item) "
              @mouseout="outStyle(item)">
              <svg-icon class="process-normal" :icon-class="item.active ? 'process'+(index+1)+'-active':'process'+(index+1)" style="width:100%;height:48px;"/>
              <span class="h12 absolute node-name">{{item.name}}</span>
          </div>
        </div>
      </div> -->
      <div>
        <div class="color-title bold">考核主体</div>
        <div>
          <div class="inline-block relative pointer node-normal" 
              v-for="(item, index) of processBody" 
              :key="item.name"
              :class="'node-'+index">
              <svg-icon class="process-normal" :icon-class="'process'+(index+1)" style="width:100%;height:48px;"/>
              <span class="h12 absolute node-name"
                :style="{'margin-left': item.name === '点击“填报/审核”' ? -(7*12/2)+'px' : -(item.name.length*12/2)+'px'}">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import {} from ''
  export default {
    name: 'checkProcessHome',
    components: {},
    props: {},
    data() {
      return {
        processObj: [
          { name: '查看我的考核', active: false },
          { name: '点击“填报”', active: false },
          { name: '填写内容', active: false },
          { name: '点击“提交”', active: false },
          { name: '完成填报', active: false }
        ],
        processBody: [
          { name: '查看其他考核', active: false },
          { name: '点击“填报/审核”', active: false },
          { name: '填写内容', active: false },
          { name: '点击“提交”', active: false },
          { name: '完成填报/审核', active: false }
        ],
        colorClass: []
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
      // selectStyle(item) {
      //   this.$set(item, 'active', true)
      // },
      // outStyle(item) {
      //   this.$set(item, 'active', false)
      // }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
.process-normal{
  width: 100%;
}
.color-0{
  color: #d7dbee;
}
.node-0:hover{
  .fd-icon{
    color: #3949AB;
  }
  // .node-name{
  //   color: #fff;
  // }
}
.color-1{
  color: #cde2ff;
}
.node-1:hover{
  .fd-icon{
    color: #29B6F6;
  }
  // .node-name{
  //   color: #fff;
  // }
}
.color-2{
  color: #e7d9f9;
}
.node-2:hover{
  .fd-icon{
    color: #8543E0;
  }
  // .node-name{
  //   color: #fff;
  // }
}
.color-3{
  color: #fcdae0;
}
.node-3:hover{
  .fd-icon{
    color: #F04864;
  }
  // .node-name{
  //   color: #fff;
  // }
}
.color-4{
  color: #ffeccc;
}
.node-4:hover{
  .fd-icon{
    color: #FFA000;
  }
  // .node-name{
  //   color: #fff;
  // }
}
.h48{
  font-size: 48px;
}
.node-name{
  top: 19px;
  left: 50%;
}
.node-normal{
  width: 19%;
}
</style>
