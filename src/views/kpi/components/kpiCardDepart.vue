<template>
    <div>
       <div class="new-card mb3" :class="isOpen?'active': ''">
            <div class="p2 newCard-title relative">
                <div class="color-title h18 bold">{{cardData.schemaName}}</div>
                <div class="mt2">
                    <el-row>
                        <el-col :span="8">
                            <div class="f-left pr1">考核周期：</div>
                            <div class="hidden text-indent0">{{cardData.startTime}}至{{cardData.endTime}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="f-left pr1">上报截止时间：</div>
                            <div class="hidden text-indent0">{{cardData.deadlineTime}}</div>
                        </el-col>
                    </el-row>
                </div>
                <i v-if="!isOpen" class="at icon-down h18 color-adadad absolute btn-div pointer" @click="openBody"/>
                <i v-if="isOpen" class="at icon-up h18 color-adadad absolute btn-div pointer" @click="closeBody"/>
            </div>
            <div v-show="isOpen" class="px2 pb2 newCard-body auto" :style="{'max-height': ($store.getters.globals.height - 550 + 'px')}">
                <!-- 综合绩效 -->
                <div v-if="cardData.synthesises&&cardData.synthesises.length>0">
                    <div class="h16 color-title mb1 bold pt3">{{typesMap.synthesises}}</div>
                    <div
                    v-for="(item, key) of cardData.synthesises"
                    :key="key"
                    class="relative height-normal line-height-normal">
                        <div class="full-div clearfix relative">
                            <div v-if="checkType === 'to_fill'" class="dot-hidden f-left color-blue pointer" @click="emitSeeRuleDetail(item, {schemaId:cardData.schemaId})">
                                {{item.blockName}}
                            </div>
                            <div v-else class="dot-hidden f-left color-blue pointer" @click="emitSeeCheckRuleDetail(item, {schemaId:cardData.schemaId})">
                                {{item.blockName}}
                            </div>
                            <div class="f-left absolute rate-div">({{item.complete}}/{{item.total}})</div>
                        </div>
                        <div class="absolute operate-div">
                            <el-button
                                v-for="it of option.btnTool"
                                :key="it.text"
                                :type="it.type"
                                size="small"
                                :show="it.show?item[it.show]:true"
                                :disabled="it.disabled?item[it.disabled]:false"
                                @click="it.click(item, {schemaId:cardData.schemaId})"
                            >{{it.text}}</el-button>
                        </div>
                    </div>
                </div>

                <!-- 审判绩效 -->
                <div v-if="cardData.judges&&cardData.judges.length>0">
                    <div class="h16 color-title mb1 bold pt3">{{typesMap.judges}}</div>
                    <div
                    v-for="(item, key) of cardData.judges"
                    :key="key"
                    class="relative height-normal line-height-normal">
                        <div class="full-div clearfix relative">
                            <div v-if="checkType === 'to_fill'" class="dot-hidden f-left color-blue pointer" @click="emitSeeRuleDetail(item, {schemaId:cardData.schemaId})">
                                {{item.blockName}}
                            </div>
                            <div v-else class="dot-hidden f-left color-blue pointer" @click="emitSeeCheckRuleDetail(item, {schemaId:cardData.schemaId})">
                                {{item.blockName}}
                            </div>
                            <div class="f-left absolute rate-div">({{item.complete}}/{{item.total}})</div>
                        </div>
                        <div class="absolute operate-div">
                            <el-button
                                v-for="it of option.btnTool"
                                :key="it.text"
                                size="small"
                                :type="it.type"
                                :show="it.show?item[it.show]:true"
                                :disabled="it.disabled?item[it.disabled]:false"
                                @click="it.click(item, {schemaId:cardData.schemaId})"
                            >{{it.text}}</el-button>
                        </div>
                    </div>
                </div>
                <!-- 民主测评 -->
                <div v-if="cardData.democracies&&cardData.democracies.length>0">
                    <div class="h16 color-title mb1 bold pt3">{{typesMap.democracies}}</div>
                    <div
                    v-for="(item, key) of cardData.democracies"
                    :key="key"
                    class="relative height-normal line-height-normal">
                        <div class="full-div clearfix relative">
                            <div v-if="checkType === 'to_fill'" class="dot-hidden f-left color-blue pointer" @click="emitSeeRuleDetail(item, {schemaId:cardData.schemaId})">
                                {{item.blockName}}
                            </div>
                            <div v-else class="dot-hidden f-left color-blue pointer" @click="emitSeeCheckRuleDetail(item, {schemaId:cardData.schemaId})">
                                {{item.blockName}}
                            </div>
                            <div class="f-left absolute rate-div">({{item.complete}}/{{item.total}})</div>
                        </div>
                        <div class="absolute operate-div">
                            <el-button
                                v-for="it of option.btnTool"
                                :key="it.text"
                                size="small"
                                :type="it.type"
                                :show="it.show?item[it.show]:true"
                                :disabled="it.disabled?item[it.disabled]:false"
                                @click="it.click(item, {schemaId:cardData.schemaId})"
                            >{{it.text}}</el-button>
                        </div>
                    </div>
                </div>
                <!-- 部门考核 -->
                <div v-if="cardData.departs&&cardData.departs.length>0">
                    <div class="h16 color-title mb2 bold pt3">{{typesMap.departs}}</div>
                    <div
                    v-for="(item, key) of cardData.departs"
                    :key="key"
                    class="relative height-normal line-height-normal">
                        <div class="full-div clearfix relative">
                            <div v-if="checkType === 'to_fill'" class="dot-hidden f-left color-blue pointer" @click="emitSeeRuleDetail(item, {schemaId:cardData.schemaId})">
                                {{item.blockName}}
                            </div>
                            <div v-else class="dot-hidden f-left color-blue pointer" @click="emitSeeCheckRuleDetail(item, {schemaId:cardData.schemaId})">
                                {{item.blockName}}
                            </div>
                            <div class="f-left absolute rate-div">({{item.complete}}/{{item.total}})</div>
                        </div>
                        <div class="absolute operate-div">
                            <el-button
                                v-for="it of option.btnTool"
                                :key="it.text"
                                :type="it.type"
                                :show="it.show?item[it.show]:true"
                                :disabled="it.disabled?item[it.disabled]:false"
                                @click="it.click(item, {schemaId:cardData.schemaId})"
                            >{{it.text}}</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { emitSeeRuleDetail, emitSeeCheckRuleDetail } from '@/api/kpi/onlineCheckDepart/reportingDepart'
    export default {
      name: 'kpiCard',
      data() {
        return {
          typesMap: {
            'synthesises': '综合绩效',
            'judges': '审判绩效',
            'democracies': '民主测评',
            'departs': '部门考核'
          },
          isOpen: false
        }
      },
      props: {
        option: {
          type: Object
        },
        cardData: {
          type: Object
        },
        index: {
          type: Number
        },
        checkType: {
          type: String
        }
      },
      components: {},
      methods: {
        emitSeeRuleDetail, emitSeeCheckRuleDetail,
        openBody() {
          this.isOpen = true
        },
        closeBody() {
          this.isOpen = false
        }
      },
      mounted() {
        this.isOpen = this.index === 0
      }
    }
</script>

<style lang="scss" scoped>
.new-card{
    .newCard-title{
        background-color: #FFF;
        border: solid 1px #d9d9d9;
    }
    .newCard-body{
        border: solid 1px #d9d9d9;
        border-top:none;
    }
    .full-div{
        padding-right:220px;
    }
    .operate-div{
        top:0;
        right:24px;
    }
    .rate-div{
        top:0;
        right:165px;
    }
    .btn-div{
        top:50%;
        margin-top:-10px;
        right:27px;
    }
}
.new-card:hover{
    .newCard-title{
        background-color: #edf6fd;
        border: solid 1px #1a95e7;
    }
}
.new-card.active{
    .newCard-title{
        background-color: #edf6fd;
        border: solid 1px #1a95e7;
    }
    .newCard-body{
        border: solid 1px #1a95e7;
        border-top:none;
    }
}
.color-adadad{
    color:#adadad;
}
</style>
