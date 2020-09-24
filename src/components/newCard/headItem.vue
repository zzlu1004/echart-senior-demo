<template>
  <div v-show="option.show === undefined && !data[option.show]"
       :class="'headItem '+(option.disable != undefined && !data[option.disable])"
       @click.stop="eventEmit(option.event, data)">
    <div v-if="option.type === 'img'"
         :style="{backgroundImage: 'url(' + option.map[data[option.field]] + ')' }"></div>

    <span v-else-if="option.type === 'checkbox'"
          :class="'' + option.class"></span>

    <i v-else-if="option.type === 'collapse'"
       :class="'at pointer ' + collapse + ' ' + option.class"
       @click.stop="changeCollapse"></i>

    <div v-else-if="option.type === 'html'">
      <span v-if="option.tooltip === undefined && !data[option.tooltip]"
            :class="'f-left dot-hidden ' + option.class"
            :style="{'width': option.width}"
            v-html="option.map[data[option.field]]"></span>
      <!--添加tooltip提示-->
      <fd-tooltip
        v-if="option.tooltip !== undefined || data[option.tooltip]"
        effect="dark"
        :placement="option.placement"
        :content="this.fd.tools.type(option.tooltip) === 'String' ? option.tooltip : option.tooltip[data[option.field]]">
        <span :class="'f-left dot-hidden ' + option.class"
              :style="{'width': option.width}"
              v-html="option.map[data[option.field]]"></span>
      </fd-tooltip>
    </div>

    <div v-else-if="option.type === 'text'">
      <span v-if="option.tooltip === undefined && !data[option.tooltip]"
            :class="'f-left dot-hidden ' + option.class"
            :style="{'width': option.width}">{{ data[option.field] }}</span>
      <!--添加tooltip提示-->
      <fd-tooltip
        v-if="option.tooltip !== undefined || data[option.tooltip]"
        effect="dark"
        :placement="option.placement"
        :content="this.fd.tools.type(option.tooltip) === 'String' ? option.tooltip : option.tooltip[data[option.field]]">
        <span :class="'f-left dot-hidden ' + option.class"
              :style="{'width': option.width}">{{ data[option.field] }}</span>
      </fd-tooltip>
    </div>

    <span v-else-if="option.type === 'fixedText'"
          :class="'f-left dot-hidden ' + option.class"
          :style="{'width': option.width}"
          v-text="option.text"></span>

    <span v-else-if="option.type === 'time'"
          :class="'f-left dot-hidden ' + option.class"
          :style="{'width': option.width}">{{ data[option.field] | parseTime(option.format) }}</span>

    <span v-else-if="option.type === 'switch'">
      <span v-text="option.text"></span>
      <el-switch
        v-model="data[option.field]"
        @change="eventEmit('switchChange', data)">
      </el-switch>
    </span>

    <div v-else-if="option.type === 'button'">
      <span v-for="item of buttons"
            :key="item.type"
            @click.stop="eventEmit(item.event, data)"
            :class="((item.class || 'mx1') + ((item.disable === undefined || data[item.disable])?' pointer color-link': ' color-forbid'))">{{item.text}}</span>
      <el-dropdown
        @command="handleCommand"
        class="headItem-dropdown"
        v-if="moreButtons.length > 0"
        trigger="click">
        <span class="pointer mx1 color-link">更多</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="it of moreButtons"
                            :command="{event: it.event, data: data}"
                            :key="it.type">
            <div :class="((it.class || 'mx1') + ((it.disable === undefined || data[it.disable])?' color-link': ' color-forbid'))">{{it.text}}</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import { parseTime } from '@/utils/filters'
  import FdTooltip from 'fd/toolTip'
  export default {
    name: 'FdCardHeadItem',
    components: { FdTooltip },
    props: {
      data: {
        type: Object,
        default: {}
      },
      option: {
        type: Object,
        default: {}
      },
      width: {
        type: String,
        default: '100%'
      }
    },
    data() {
      return {
        collapse: 'icon-down',
        buttons: [],
        moreButtons: [],
        // 配置示例
        des: {
          type: 'img', // checkbox: 选中, collapse: 收起展开, html: html片段, text: 内容, switch: 开关, bottom: 开关, fixedText: 固定文本展示, img：图片, time: 日期或时间；
          format: '{y}-{m}-{d} {h}:{i}:{s}', // 日期或时间格式，type: 'time'时可添加该属性；
          field: 'status', // data对应的key值；
          class: 'h14', // 额外的className,有点击效果的时候需要增加pointer的class；
          // 不同值显示不同样式 一般对状态有效，不同的状态值给不同的效果
          map: {
            '开启': ''
          },
          text: '', // 显示的固定文字内容；
          html: '<i class="at icon-down">', // 显示的固定html内容，主要是图标按钮；
          show: 'status', // data.status为false的时候不显示，不配值的时候默认显示；
          disable: 'status', // data.status为false的时候置灰不可用，不配值的时候默认显示；
          // 点击触发的方法
          event: '',
          tooltip: false, // tooltip类型有三种：boolean/String/Object；是否显示悬浮提示，默认不显示！若为字符串，则提示内容为该字符串内容，例如：tooltip: '我是标题'；若为对象，则提示内容为对应内容，例如：tooltip: {'true': '取消标记','false': '标记线索'}；
          placement: 'top', // tooltip 的出现位置，当设置tooltip的时候可以设置此属性，然则不建议设置；
          scroll: true, // 鼠标移入出现滚动效果，默认没有滚动；
          child: [{ // 配置参考des；
          }] // 类型为bottom的时候配置操作按钮；
        }
      }
    },
    computed: {},
    mounted() {
      this.showButtons(this.data)
    },
    methods: {
      parseTime,
      handleCommand(command) {
        this.eventEmit(command.event, command.data)
      },
      changeCollapse() {
        this.collapse = this.collapse === 'icon-down' ? 'icon-right' : 'icon-down'
        this.$emit('eventEmit', { eventName: 'changeCollapse', data: this.collapse === 'icon-down' })
      },
      eventEmit(event, data) {
        if (event && (this.option.disable === undefined || !this.data[this.option.disable])) {
          this.$emit('eventEmit', { eventName: event, data: data })
        }
      },
      showButtons(data) {
        const child = this.option.child
        if (!child) {
          return
        }
        let count = 0
        const shows = []
        const more = []
        for (const item of child) {
          // 配置show属性的时候data的值为true的时候可以显示，没有配置show属性默认显示
          if ((item.show && data[item.show]) || item.show === undefined) {
            if (count < 2) {
              shows.push(item)
              count++
            } else {
              more.push(item)
            }
          }
        }
        if (more.length === 1) {
          shows.push(more.splice(0, 1)[0])
        }
        this.buttons = shows
        this.moreButtons = more
      }
    },
    watch: {
      data(data) {
        this.showButtons(data)
      }
    }
  }
</script>

<style scoped>
  .headItem{
    float: left;
    /*建议不给外边距，用户可根据需要自行添加*/
    /*margin: auto 8px;*/
  }
</style>

