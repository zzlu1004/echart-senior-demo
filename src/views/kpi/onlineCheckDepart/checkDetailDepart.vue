<template>
<div class="app-container">
    <div class="bg-white container-inner clearfix h14 check-detail">
        <div v-if ="!targetCon.indexName">
            <FdNoContent class="mt10"></FdNoContent>
        </div>
        <div v-else>
            <div class="center">
                <span class="bold h20 color-title pr1 indexName-box">{{targetCon.indexName}}</span>
                <span class="inline-block">{{statusMap[targetCon.status]}}</span>
            </div>
            <div class="relative mt3">
                <div class="absolute menu-position">
                    <fd-menu :option = menuOpt v-on:menuClick = 'goAnchor' className="check-body"></fd-menu>
                </div>
                <div class="bd-dashed-left px3 check-body auto" :style="{'height': $store.getters.globals.height - 225 + 'px', 'margin-left': '180px','padding-bottom':'50px' }">
                    <!-- 填报node遍历 -->
                    <div class="line-height-27 pb2 bd-bottom mb3"
                    v-for="(item, index) of fillNodes"
                    :key="item.id"
                    :ref="'node_'+item.id">
                    <!-- 单填报流程显示填报，多填报流程显示填报1，填报2，。。。 -->
                        <div class="color-title bold h18 mb1" v-text="targetCon.fillType === 'k10036-01' ? '填报' : '填报' + (index + 1)"></div>
                        <div>
                          <!-- 如果还没进入填报阶段 -->
                          <el-row v-if="item.actions.length === 0" :gutter="16">
                            <el-col>
                              <div class="line-bottom row-box">
                                <div class="f-left pr-5px color-title bold">填报人：</div>
                                <div class="hidden text-indent0">{{item.roleName+'（'+(item.roleName || '')+'）'}}</div>
                              </div>
                              <div class="line-bottom row-box">
                                <div class="f-left pr-5px color-title bold">提交时间：</div>
                                <div class="hidden text-indent0">--</div>
                              </div>
                              <div class="line-bottom row-box">
                                <div class="f-left pr-5px color-title bold">填报分数：</div>
                                <div class="hidden text-indent0">--</div>
                              </div>
                              <div class="line-bottom row-box">
                                <div class="f-left pr-5px color-title bold">填报说明：</div>
                                <div class="hidden text-indent0">--</div>
                              </div>
                              <div class="line-bottom row-box">
                                <div class="f-left pr-5px color-title bold">附加材料：</div>
                              </div>
                            </el-col>
                          </el-row>
                          <div v-else>
                            <el-row v-for="(pItem, pIndex) of rowArr.slice(0,Math.ceil(item.actions.length/3))" :key="pIndex" class="mb2">
                              <el-row :gutter="16">
                                <el-col v-for="(info, i) of item.actions.slice(pIndex*3, pIndex*3+3)"
                                  :key="info.id"
                                  :span="item.actions.length >=3?8:(24/item.actions.length)">
                                  <div class="line-bottom row-box">
                                      <div v-if="i === 0 || (i+1)%3 === 1" class="f-left pr-5px color-title bold">填报人：</div>
                                      <div class="hidden text-indent0">{{(info.operatorName || item.roleName)+'（'+(item.roleName || '')+'）'}}</div>
                                  </div>
                                  <div class="line-bottom row-box">
                                      <div v-if="i === 0 || (i+1)%3 === 1" class="f-left pr-5px color-title bold">提交时间：</div>
                                      <div v-if="info.status === '1'" class="hidden text-indent0">{{info.operateTime}}</div>
                                      <div v-else>--</div>
                                  </div>
                                  <div class="line-bottom row-box">
                                      <div v-if="i === 0 || (i+1)%3 === 1" class="f-left pr-5px color-title bold">填报分数：</div>
                                      <div class="hidden text-indent0">
                                        <!-- 已经提交 -->
                                        <div v-if="fd.data.boolean(info.score) && info.status === '1'">
                                          <span class="h28 bold color-title">{{info.score}}</span>
                                          <span class="h18 bold color-title">分</span>
                                        </div>
                                        <div v-else>--</div>
                                      </div>
                                  </div>
                                </el-col>
                              </el-row>
                              <!-- 填报说明 -->
                              <el-row :gutter="16">
                                <el-col v-for="(info, i) of item.actions.slice(pIndex*3, pIndex*3+3)"
                                  :key="info.id"
                                  :span="item.actions.length >=3?8:(24/item.actions.length)">
                                  <div class="line-bottom row-box">
                                      <div v-if="i === 0 || (i+1)%3 === 1" class="f-left pr-5px color-title bold">填报说明：</div>
                                      <div class="hidden text-indent0">
                                        <el-tooltip v-if="info.content" placement="top">
                                          <div slot="content">{{info.content || '--'}}</div>
                                            <span>
                                              {{info.content.length > 50 ? info.content.substring(0,50) + '...' : info.content}}
                                            </span>
                                        </el-tooltip>
                                        <div v-else>--</div>
                                      </div>
                                  </div>
                                  </el-col>
                              </el-row>
                              <!-- 附件材料 -->
                              <el-row :gutter="16">
                                <el-col v-for="(info, i) of item.actions.slice(pIndex*3, pIndex*3+3)"
                                  :key="info.id"
                                  :span="item.actions.length >=3?8:(24/item.actions.length)">
                                  <div class="line-bottom row-box">
                                      <div v-if="i === 0 || (i+1)%3 === 1" class="f-left pr-5px color-title bold">附加材料：</div>
                                      <div v-if="info.attachments && info.attachments.length>0" class="hidden text-indent0 color-blue">
                                          <div class="pointer" v-for="info1 of info.attachments" :key="info1.id" @click="downloadFile(info1)">
                                              <i class="at icon-paperclip"/>
                                              <span>{{info1.attachmentName}}</span>
                                          </div>
                                      </div>
                                  </div>
                                  </el-col>
                              </el-row>
                            </el-row>
                          </div>
                          <div class="clearfix">
                            <div class="h18 f-left pr-5px color-title bold">填报平均分：</div>
                            <div class="hidden text-indent0">
                              <div v-if="fd.data.boolean(item.score)">
                                <span class="h28 bold color-title">{{item.score}}</span>
                                <span class="h18 bold color-title">分</span>
                              </div>
                              <div v-else  class="h28 bold color-title">--</div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <!-- 填报得分 -->
                    <div class="bd-bottom mb3">
                      <div class="line-bottom score-box">
                        <span class="h18 f-left pr-5px color-title bold">填报得分：</span>
                        <span v-if="targetCon.status !== '0'">
                          <span v-if="fd.data.boolean(targetCon.fillScore)" class="h28 bold color-title">{{targetCon.fillScore}}</span>
                          <span v-else class="h28 bold color-title">--</span>
                          <span class="h18 bold color-title">分</span>
                        </span>
                        <span v-else class="h28 bold color-title">
                          待定
                        </span>
                      </div>
                      <div v-if="targetCon.fillFormula" class="pb2">{{targetCon.fillFormula}}</div>
                    </div>
                    <!-- 审核node遍历 -->
                    <div class="line-height-27 pb2 bd-bottom mb3"
                    v-for="(item, index) of checkNodes"
                    :key="item.id"
                    :ref="'node_'+item.id">
                        <div class="color-title bold h18 mb1" v-text="'审核' + (index + 1)"></div>
                        <div>
                          <el-row v-if="item.actions.length  === 0" :gutter="16">
                            <!-- 如果还没进入审核阶段 -->
                            <el-col>
                              <div class="line-bottom row-box">
                                <div class="f-left pr-5px color-title bold">审核人：</div>
                                <div class="hidden text-indent0">{{item.roleName+'（'+(item.roleName || '')+'）'}}</div>
                              </div>
                              <div class="line-bottom row-box">
                                <div class="f-left pr-5px color-title bold">审核时间：</div>
                                <div class="hidden text-indent0">--</div>
                              </div>
                              <div class="line-bottom row-box">
                                <div class="f-left pr-5px color-title bold">审核分数：</div>
                                <div class="hidden text-indent0">
                                  <span>--</span>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                          <div v-else>
                            <el-row v-for="(pItem, pIndex) of rowArr.slice(0,Math.ceil(item.actions.length/3))" :key="pIndex" class="mb2">
                              <el-row :gutter="16">
                                <el-col v-for="(info, i) of item.actions.slice(pIndex*3, pIndex*3+3)"
                                  :key="info.id"
                                  :span="item.actions.length >=3?8:(24/item.actions.length)">
                                  <div class="line-bottom row-box">
                                      <div v-if="i === 0 || (i+1)%3 === 1" class="f-left pr-5px color-title bold">审核人:</div>
                                      <div class="hidden text-indent0">{{(info.operatorName || item.roleName)+'（'+(item.roleName || '')+'）'}}</div>
                                  </div>
                                  <div class="line-bottom row-box">
                                      <div v-if="i === 0 || (i+1)%3 === 1" class="f-left pr-5px color-title bold">审核时间:</div>
                                      <div v-if="info.status === '1'" class="hidden text-indent0">{{info.operateTime}}</div>
                                      <div v-else>--</div>
                                  </div>
                                  <div class="line-bottom row-box">
                                      <div v-if="i === 0 || (i+1)%3 === 1" class="f-left pr-5px color-title bold">审核分数:</div>
                                      <div class="hidden text-indent0">
                                        <div v-if="fd.data.boolean(info.score) && info.status === '1'">
                                          <span class="h28 bold color-title">{{info.score}}</span>
                                          <span class="h18 bold color-title">分</span>
                                        </div>
                                        <div v-else>--</div>
                                      </div>
                                  </div>
                                </el-col>
                              </el-row>
                            </el-row>
                          </div>
                          <div class="clearfix">
                            <div class="h18 f-left pr-5px color-title bold">审核平均分：</div>
                            <div class="hidden text-indent0">
                              <div v-if="fd.data.boolean(item.score)">
                                <span class="h28 bold color-title">{{item.score}}</span>
                                <span class="h18 bold color-title">分</span>
                              </div>
                              <div v-else class="h28 bold color-title">--</div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div ref="node_score">
                      <div class="line-bottom score-box">
                        <span class="h18 f-left pr-5px color-title bold">得分：</span>
                        <span v-if="targetCon.status === '2'">
                          <span v-if="fd.data.boolean(targetCon.score)" class="h28 bold color-title">{{targetCon.score}}</span>
                          <span v-else class="h28 bold color-title">--</span>
                          <span class="h18 bold color-title">分</span>
                        </span>
                        <span v-else class="h28 bold color-title">
                          待定
                        </span>
                      </div>
                      <div>{{targetCon.formula}}</div>
                    </div>
                </div>
            </div>
        </div>
      <div class="fixed-bottom">
        <div class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
    import fdMenu from 'fd/menu/fdMenu'
    import { goAnchor } from '@/api/kpi/record/personalDetail'
    import { getTargetConById } from '@/api/kpi/onlineCheckDepart/checkDetailDepart'
    import { downloadFile } from '@/api/kpi/onlineCheckDepart/checkListDepart'
    import { goBack } from '@/api/common'
    import FdNoContent from 'fd/noContent.vue'
    export default {
      name: '',
      data() {
        return {
          height: (this.$store.getters.globals.height - 100) + 'px',
          targetCon: {},
          userId: this.$store.getters.user.id,
          menuOpt: {
            menuList: [],
            event: 'goAnchor',
            position: 'left'
          },
          statusMap: {
            0: '待填报',
            1: '待审核',
            2: '已完成'
          },
          resource: '',
          id: '',
          rowArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          parentParams: {},
          fillNodes: [],
          checkNodes: []
        }
      },
      components: {
        fdMenu, FdNoContent
      },
      methods: {
        goAnchor, goBack, getTargetConById, downloadFile
      },
      mounted() {
        this.resource = this.$route.query.resource || ''
        this.id = this.$route.query.id || ''
        this.getTargetConById()
      }
    }
</script>

<style lang="scss" scoped>
.pr-5px{
  padding-right:5px;
}
.menu-position{
  padding-top:14px;
  padding-left: 40px;
}
.row-box{
  min-height: 27px;
}
.score-box{
  line-height: 32px;
}
.line-bottom{
  margin-bottom: 2px;
}
.indexName-box{
  display: inline-block;
  max-width: 500px;
}
</style>
