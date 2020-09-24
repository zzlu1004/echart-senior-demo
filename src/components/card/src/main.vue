<!-- by your name -->
<template>
  <div>
    <div>
      <slot name="header" v-if="(option&&option.header)">
        <div :class="'fd_title '+(option.header.class||'bg')">
        <span class="title f-left width-rate40 dot-hidden pointer"
              v-if="option.header.title"
              @click="option.header.title.click(data)">
          <span v-if="option.header.title.text&&(option.header.title.text !=='')"
                v-text="option.header.title.text"
          ></span>
          <el-tooltip :open-delay = 300 class="item" effect="dark" :content="data[option.header.title['field']]" placement="top-start">
            <span v-text="data[option.header.title['field']]"></span>
          </el-tooltip>
        </span>
          <span class="subtitle f-left" v-if="option.header.subTitle">
          <span v-if="option.header.subTitle.text&&(option.header.subTitle.text !='')"
                v-text="option.header.subTitle.text"></span>
          <span v-text="data[option.header.subTitle['field']]"></span>
        </span>
          <span class="status" v-if="option.header.status&&data[option.header.status.field]">
          <el-button size="mini"
                     :type="option.header.status.conds[data[option.header.status.field]]"
                     round
                     v-if="option.header.status">
            {{data[option.header.status.field]}}
          </el-button>
        </span>

          <div class="tool">
            <div class="switch inline-block mr4" v-if="option.header.custom">
              <span v-text="option.header.custom.text"></span>
              <el-switch
                v-model="data[option.header.custom['field']]"
                @change="option.header.custom.click(cardData)"
              >
              </el-switch>
            </div>
            <div class="inline-block mr4 pointer h14 "
                 v-if="option.header.iconButton&&option.header.iconButton.field&&option.header.iconButton.click"
                 @click="option.header.iconButton.click(cardData)">
              <div class="color-blue"
                   v-if="data[option.header.iconButton['field']]">
                <span v-text="'已'+option.header.iconButton.text"></span>
                <svg-icon :icon-class="option.header.iconButton.icon" />
              </div>
              <div v-else>
                <span v-text="option.header.iconButton.text"></span>
                <svg-icon :icon-class="option.header.iconButton.icon" />
              </div>
            </div>
            <el-button type="text"
                       v-for="item of option.header.bottoms"
                       @click="item.click(item,cardData)"
                       :key="item.field"
                       :class = "item.class"
            >
              {{item.text}}
          </el-button>
            <el-dropdown v-if="moreTool.length!=0" trigger="click">
            <span class="el-dropdown-link" style="padding-left:10px;border-left: 1px solid #ebebeb">
                    更多
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="it in moreTool"
                                  :key="it.field">
                  <el-button type="text" @click="it.click(it,cardData)"
                  >{{it.text}}
                </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </slot>
      <div class="cardBody">
        <slot name="body" slot-data="option.data" ></slot>
      </div>
      <div class="cardfooter">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FdCard',
    data() {
      return {
        data: []
      }
    },
    props: {
      option: {
        type: Object
      },
      cardData: {
        type: Object
      }
    },
    components: {},
    computed: {
      moreTool() {
        var flag = (this.option.header.bottoms &&
        this.option.header.bottoms.length > 2) ? this.option.header.bottoms.splice(2) : []
        return flag
      }
    },
    methods: {},
    mounted() {
      if (this.option.data) {
        this.data = this.option.data
      } else {
        this.data = this.cardData
      }
    },
    watch: {
      cardData: {
        handler(val, oldVal) {
          this.data = val
        },
        deep: true
      }
    }
  }
</script>
<style scoped>
  .fd_title {
    height: 50px;
    line-height: 48px;
    padding: 0 2rem;
    position: relative;
    border-bottom: 0;
    border-top-left-radius:2px;
    border-top-right-radius:2px;
  }

  .fd_title .title {
    font-size: 1rem;
    font-weight: 600;
  }

  .fd_title > span {
    margin-right: 15px;
  }

  .fd_title .width-rate40 {
    width:25%;
  }

  .fd_title .subtitle {
    font-size: 12px;
    color: #666;
  }

  .fd_title .tool {
    float: right;
  }

  .el-dropdown {
    margin-left: 10px;
  }

  .el-dropdown span {
    color: #409eff;
    cursor: pointer;
  }z

  .switch {
    margin-right: 10px;
    float: left;
  }
  .cardBody{
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.8;
    letter-spacing: normal;
    text-align: left;
    color: #666666;
  }
</style>
