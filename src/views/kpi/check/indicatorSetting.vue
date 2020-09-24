<template>
<div class="app-container">
    <div class="bg-white container-inner clearfix h14 target indicatorSetting" :style="{'min-height': height - 80 + 'px'}">
      <el-form
        v-loading="loading"
        :rules="newSystemRules"
        ref="targetForm"
        :model="targetForm"
        label-position="right"
        label-width="110px">
        <!--基础值-->
        <div >
          <b class="h16">基础值</b>
          <div class="clearfix pt1">
            <el-form-item class="hide" label="指标类别id" prop="pid">
              <el-input :readonly="targetForm.modelTitle == '指标详情'" v-model="targetForm.pid"></el-input>
            </el-form-item>
            <el-form-item class="hide" label="isLeaf">
              <el-input :readonly="targetForm.modelTitle == '指标详情'" v-model="targetForm.isLeaf"></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="指标名称" prop="name">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" v-model="targetForm.name" placeholder="请输入指标名称，不多于50个字"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="指标方向" prop="isPositive">
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.isPositive" placeholder="请选择指标方向">
                    <el-option label="正向" :value=1></el-option>
                    <el-option label="负向" :value=0></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="详情描述" prop="content">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.content" placeholder="请输入描述性信息，不多于1000个字"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="指标层级" prop="indexLevel">
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.indexLevel" placeholder="请选择指标层级">
                    <el-option
                      v-for="item in indexLevels" v-if="item.id !== 'k10032-00'"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否参与考核" prop="isAccess">
                  <label slot="label" style="line-height:24px;">是否参与考核</label>
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.isAccess" placeholder="请选择是否参与考核">
                    <el-option
                      v-for="item in isAccesses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="指标范围" prop="indexScope" v-if="targetForm.indexLevel !== 'k10032-02'">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.indexScope" placeholder="请输入指标范围"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="指标规则" prop="indexExpression">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.indexExpression" placeholder="请输入指标规则"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--个人指标值-->
        <div>
          <b class="h16">个人指标值</b>
          <div class="clearfix pt1">
            <div v-if="targetForm.indexLevel!== 'k10032-02'">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="个人指标值范围" prop="personalScope">
                    <el-input :readonly="targetForm.modelTitle == '指标详情'" v-model="targetForm.personalScope" placeholder="请输入个人指标值范围"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="反查类型" prop="dataDetail">
                    <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.dataDetail" placeholder="请选择反查类型">
                      <el-option
                        v-for="item in dataDetails"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="no-personal center" v-else>
              因【基础值】页面「指标层级」选择为“二级”。所以此栏不需要填写
            </div>
          </div>
        </div>
        <!--分数换算-->
        <div>
          <b class="h16">分数换算</b>
          <div class="clearfix  pt1 pb2">
            <!--部门值-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="部门值规则" prop="departExpression">
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.departExpression" placeholder="请选择部门值规则">
                    <el-option
                      v-for="item in departExpressions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- 新系统测算中新增二级指标，在二级指标的分数换算中，部门值规则选择按基础值计算，当部门值规则选择按照基础值计算时，【部门值范围】的输入框不显示 -->
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.departExpression === 'k10034-01')" label="部门值范围" prop="departScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.departScope" placeholder="请输入部门值范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="部门均值分子规则" prop="departAvgNumeratorExpression">
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.departAvgNumeratorExpression" placeholder="请选择部门均值分子规则">
                    <el-option
                      v-for="item in departExpressions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.departAvgNumeratorExpression === 'k10034-01')" label="部门均值分子范围" prop="departAvgNumeratorScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'"  :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.departAvgNumeratorScope" placeholder="请输入部门均值分子范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="部门均值分母规则" prop="departAvgDenominatorExpression">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.departAvgDenominatorExpression" placeholder="请输入部门均值分母规则"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门均值分母范围" prop="departAvgDenominatorScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.departAvgDenominatorScope" placeholder="请输入部门均值分母范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="slice-line"></div>
            <!--业务线-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="业务线值规则" prop="businessExpression">
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.businessExpression" placeholder="请选择业务线值规则">
                    <el-option
                      v-for="item in businessExpression"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- 新系统测算中新增二级指标，在二级指标的分数换算中，部门值规则选择按基础值计算，当部门值规则选择按照基础值计算时，【部门值范围】的输入框不显示 -->
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.businessExpression === 'k10037-01')" label="业务线值范围" prop="businessScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.businessScope" placeholder="请输入业务线值范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="业务线均值分子规则" prop="businessAvgNumeratorExpression">
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.businessAvgNumeratorExpression" placeholder="请选择业务线均值分子规则">
                    <el-option
                      v-for="item in businessExpression"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.businessAvgNumeratorExpression === 'k10037-01')" label="业务线均值分子范围" prop="businessAvgNumeratorScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.businessAvgNumeratorScope" placeholder="请输入业务线均值分子范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="业务线均值分母规则" prop="businessAvgDenominatorExpression">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.businessAvgDenominatorExpression" placeholder="请输入业务线均值分母规则"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业务线均值分母范围" prop="businessAvgDenominatorScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.businessAvgDenominatorScope" placeholder="请输入业务线均值分母范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="slice-line"></div>
            <!--全院值-->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="全院值规则" prop="courtExpression">
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.courtExpression" placeholder="请选择全院值规则">
                    <el-option
                      v-for="item in courtExpressions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.courtExpression === 'k10035-01')" label="全院值范围" prop="courtScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.courtScope" placeholder="请输入全院值范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="全院均值分子规则" prop="courtAvgNumeratorExpression">
                  <el-select :disabled="targetForm.modelTitle == '指标详情'" v-model="targetForm.courtAvgNumeratorExpression" placeholder="请选择全院均值分子规则">
                    <el-option
                      v-for="item in courtExpressions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  v-if="!(targetForm.indexLevel=== 'k10032-02' && targetForm.courtAvgNumeratorExpression === 'k10035-01')" label="全院均值分子范围" prop="courtAvgNumeratorScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.courtAvgNumeratorScope" placeholder="请输入全院均值分子范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="全院均值分母规则" prop="courtAvgDenominatorExpression">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.courtAvgDenominatorExpression" placeholder="请输入全院均值分母规则"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="全院均值分母范围" prop="courtAvgDenominatorScope">
                  <el-input :readonly="targetForm.modelTitle == '指标详情'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="targetForm.courtAvgDenominatorScope" placeholder="请输入全院均值分母范围"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <div class="fixed-bottom pt2" style="bottom: 0px">
        <el-button v-if="targetForm.modelTitle != '指标详情'" size="small" @click="goBack">取消</el-button>
        <el-button v-if="targetForm.modelTitle != '指标详情'" size="small" type="primary" @click="sureSave">确定</el-button>
        <el-button v-if="targetForm.modelTitle == '指标详情'" size="small" @click="goBack">关闭</el-button>
      </div>
    </div>
</div>
</template>

<script>
  import { getTargetList, searchByKeyword, addTargetType, orderTargetType,
    orderTarget, sureSave, addTarget, editTarget, copyTarget, deleteTarget, getTargetCount, getAllProcess,
    saveSort, seeTarget, downloadTable } from '@/api/kpi/check/target'
  import { goBack } from '@/api/common'
  export default {
    name: 'indicatorSetting',
    components: {
    },
    data() {
      return {
        loading: false,
        height: this.$store.getters.globals.height,
        targetForm: {
          name: '',
          content: '',
          isLeaf: 1,
          pid: '',
          isPositive: '',
          valueMin: '',
          valueMax: '',
          flowIds: []
        },
        params: {
          indexType: 'newSystem'
        },
        valObj: {
          'report': 'searchVal1',
          'system': 'searchVal2',
          'newSystem': 'searchVal3'
        },
        // 参与考核
        checkMap: this.fd.tools.mapSelects('k10004'),
        // 指标层级
        indexLevelMap: this.fd.tools.mapSelects('k10032'),
        // 反查类型
        dataDetailMap: this.fd.tools.mapSelects('k10033'),
        newSystemRules: {
          name: [
            { required: true, message: '请输入指标名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }
          ],
          content: [
            { max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }
          ],
          isPositive: [
            { required: true, message: '请选择指标方向', trigger: 'change' }
          ],
          indexLevel: [
            { required: true, message: '请选择指标层级', trigger: 'change' }
          ],
          isAccess: [
            { required: true, message: '请选择是否参与考核', trigger: 'change' }
          ],
          dataDetail: [
            { required: true, message: '请选择反查类型', trigger: 'change' }
          ],
          indexScope: [
            { required: true, message: '请输入指标范围', trigger: 'blur' }
          ],
          indexExpression: [
            { required: true, message: '请输入指标规则', trigger: 'blur' }
          ],
          departExpression: [
            { required: true, message: '请选择部门值规则', trigger: 'change' }
          ],
          departAvgNumeratorExpression: [
            { required: true, message: '请选择部门均值分子规则', trigger: 'change' }
          ],
          departAvgDenominatorExpression: [
            { required: true, message: '请输入部门均值分母规则', trigger: 'blur' }
          ],
          businessExpression: [
            { required: true, message: '请选择业务线值规则', trigger: 'change' }
          ],
          businessAvgNumeratorExpression: [
            { required: true, message: '请选择业务线均值分子规则', trigger: 'change' }
          ],
          businessAvgDenominatorExpression: [
            { required: true, message: '请输入业务线均值分母规则', trigger: 'blur' }
          ],
          courtExpression: [
            { required: true, message: '请选择全院值规则', trigger: 'change' }
          ],
          courtAvgNumeratorExpression: [
            { required: true, message: '请选择全院均值分子规则', trigger: 'change' }
          ],
          courtAvgDenominatorExpression: [
            { required: true, message: '请输入全院均值分母规则', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      goBack, getTargetList, searchByKeyword, addTargetType, orderTargetType,
      orderTarget, sureSave, addTarget, editTarget, copyTarget, deleteTarget, getTargetCount, getAllProcess,
      saveSort, seeTarget, downloadTable
    },
    mounted() {
      this.targetForm = this.$route.query
    },
    computed: {
      elements() {
        return this.$store.getters.elements.target || {}
      },
      // 参与考核
      isAccesses() {
        return this.$store.getters.selects['k10004']
      },
      // 指标层级
      indexLevels() {
        return this.$store.getters.selects['k10032']
      },
      // 反查类型
      dataDetails() {
        return this.$store.getters.selects['k10033']
      },
      // 部门指标规则
      departExpressions() {
        return this.$store.getters.selects['k10034']
      },
      // 法院指标规则
      courtExpressions() {
        return this.$store.getters.selects['k10035']
      },
      // 业务线指标规则
      businessExpression() {
        return this.$store.getters.selects['k10037']
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .indicatorSetting{
    .slice-line{
      margin-bottom: 16px;
      border-bottom: 1px dashed #dcdfe6;
      width: 100%;
    }
    .el-form-item__label{
      font-weight: normal!important;
      line-height: 16px!important;
    }
    .el-form-item {
      margin-bottom: 16px!important;
    }
    .el-input__inner {
      height: 32px!important;
      line-height: 32px!important;
    }
    .el-textarea__inner {
      padding: 2px 15px!important;
      line-height: 1!important;
    }
    .el-form-item__content {
      line-height: 30px!important;
    }
  }
</style>
