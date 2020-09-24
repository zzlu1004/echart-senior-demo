<template>
  <div class="user-select">
    <el-dropdown trigger="click">
      <el-input class="input-select el-dropdown-link" v-model = option.inputVal placeholder="请选择"></el-input>
      <el-dropdown-menu slot="dropdown">
        <el-tree class="filter-tree"
                 :data=option.trees
                 :props=option.defaultProps
                 :node-key=option.property
                 :default-expand-all =option.expand
                 :filter-node-method="filterNode"
                 :accordion = option.accordion
                 :highlight-current = option.highlight
                 :show-checkbox = option.checkbox
                 :expand-on-click-node = false
                 :check-strictly = true
                 @node-click = nodeClick
        >
          <!--check-strictly在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false，这里设为true-->
        </el-tree>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
  export default {
    name: 'FdTree',
    props: {
      option: {
        type: Object,
        default: {
          expand: false,
          accordion: true,
          highlight: true,
          checkbox: false
        }
      },
      nodeClick: {
        type: Function,
        default: function() {}
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      }
    },
    data() {
      return {
      }
    }
  }
</script>

<style>
  .input-select{
    width:300px;
  }
  .filter-tree{
    min-width:300px;
  }
</style>
