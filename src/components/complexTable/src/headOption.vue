<template>
  <div>
    <span v-for="item of btnOption" :key="item.text" class="inline-block f-left">
      <!-- 按钮 -->
      <el-button
        v-if="item.type==='button'" 
        :class="margin + (item.class ? item.class : '') "
        :type="item.btnType === undefined ? 'primary' : item.btnType"
        :size="item.size || 'small'"
        @click="item.click">
        <span v-if="item.iconClass">
          <i v-if="item.iconClass.indexOf('at')>-1" :class="item.iconClass"/>
          <svg-icon v-else :icon-class="item.iconClass" />
        </span>
        {{item.text}}
      </el-button>
      <!-- checkbox复选框 -->
      <el-checkbox-group v-if="item.type==='checkbox'" :class="'text-sm '  + margin + (item.class ? item.class : '') " v-model="item.selected" @change="item.change">
        <el-checkbox v-for="cols of item.checkbox" :key="cols.field" :label="cols.field">{{cols.title}}</el-checkbox>
      </el-checkbox-group>
      <!-- 自定义列表 -->
      <span v-if="item.type === 'defined'" :class="'inline-block '  + margin + (item.class ? item.class : '') ">
          <el-popover
            placement="right"
            width="226"
            ref="popover"
          >
            <el-checkbox-group v-model="item.selected" @change="item.change">
              <div class="pb1" v-for="cols of item.checkbox" :key="cols.field">
                <el-checkbox :label="cols.field">{{cols.title}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-popover>
          <el-button size="small" v-popover:popover>自定义列表</el-button>
      </span>
      <!-- 搜索框 -->
      <fd-search  v-if="item.type === 'search'"
                  :class="margin + (item.class ? item.class : '')"
                  @search="item.enter"
                  v-model="val"></fd-search>
      <!-- 文字说明 -->
      <span v-if="item.type === 'text'" :class="'inline-block text-sm ' + margin + (item.class ? item.class : '')">
          <span>
              {{item.text}}
          </span>
          <el-popover
              placement="top"
              width="310"
              trigger="hover"
              :content="item.content">
              <span slot="reference" v-if="item.iconClass">
                <i v-if="item.iconClass.indexOf('at')>-1" :class="item.iconClass + ' color-d9d9d9 pointer'"/>
                <svg-icon v-else :icon-class="item.iconClass" />
              </span>
          </el-popover>
      </span>
    </span>
  </div>
</template>

<script>
  export default {
    name: '',
    components: {},
    props: {
      btnOption: {
        type: Array
      },
      type: {
        type: String
      }
    },
    data() {
      return {
        classObj: {
          'left': 'btn-mr2',
          'right': 'btn-ml2'
        },
        val: '',
        checkedCols: []
      }
    },
    computed: {
      margin() {
        return this.classObj[this.type] + ' '
      }
    },
    mounted() {
    },
    methods: {
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .text-sm{
    height: 32px;
    line-height: 32px;
  }
</style>
