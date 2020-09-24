<template>
  <div>
    <el-dialog
      :title="title"
      :slotTitle="slotTitle"
      :visible.sync="syncVisible"
      :width="width"
      :top="top"
      :modal="modal"
      :show-close="showClose"
      :before-close="beforeClose"
      :close-on-click-modal=false>
      <div v-if="slotTitle" slot="title">
        <slot name="fd-title"></slot>
      </div>
      <div class="dialog-body" :style="{'max-height': maxHeight?maxHeight:normalHeight, 'overflow-y': 'auto', 'overflow-x': 'hidden'}">
        <slot name="fd-body"></slot>
      </div>
      <div slot="footer">
        <slot name="fd-footer">
          <el-button v-for="item of btnOption"
            :key="item.text"
            size="small"
            :type="item.type || ''"
            @click.stop="item.click?item.click():buttonClick()">{{item.text}}</el-button>
        </slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: 'FdDialog',
      props: {
        // Dialog 的标题
        title: {
          type: String
        },
        // Dialog 的宽度，最小宽度50%
        width: {
          type: String,
          default: '50%'
        },
        // Dialog CSS 中的 margin-top 值
        top: {
          type: String,
          default: '15vh'
        },
        // 是否需要遮罩层
        modal: {
          type: Boolean,
          default: true
        },
        // 是否标题需要用slot插槽
        slotTitle: {
          type: Boolean,
          default: false
        },
        // 是否显示关闭x按钮
        showClose: {
          type: Boolean,
          default: true
        },
        // 是否显示 Dialog，支持.sync修饰符
        syncVisible: {
          type: Boolean,
          default: false
        },
        maxHeight: {
          type: String,
          default: ''
        },
        // 底部按钮
        btnOption: {
          type: Array
        }
      },
      data() {
        return {
          normalHeight: '',
          clientHeight: window.screen.height,
          innerHeight: this.$store.getters.globals.height
        }
      },
      methods: {
        buttonClick() {
          this.$emit('buttonClick')
        },
        beforeClose() {
          this.$emit('beforeClose')
        },
        getHeight() {
          if (this.top.indexOf('px') > -1) {
            this.normalHeight = (this.innerHeight - (parseFloat(this.top.replace('px', '')) * 2) - 150) + 'px'
          } else if (this.top.indexOf('vh') > -1) {
            this.normalHeight = (this.clientHeight * (1 - parseFloat(this.top.replace('vh', '')) / 100 * 2) - 220) + 'px'
          } else if (this.top.indexOf('%') > -1) {
            this.normalHeight = (this.innerHeight * (1 - parseFloat(this.top.replace('%', '')) / 100 * 2) - 150) + 'px'
          } else {
            this.normalHeight = (this.innerHeight - (parseFloat(this.top) * 2) - 150) + 'px'
          }
        }
      },
      mounted() {
        this.getHeight()
      }
    }
</script>

<style>

</style>
