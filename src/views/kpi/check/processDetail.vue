<template>
  <div class="app-container">
    <div class="bg-white container-inner has-fixed-bottom clearfix" :style="{'min-height': $store.getters.globals.height - 100 + 'px'}">
      <el-form :model="processForm" :rules="processRules" ref="processForm">
        <div v-if="page==='detail'" class="bg-gray center p2">
          <span class="bold h18 color-title pr2">{{processForm.name}}</span>
          <span v-show="processForm.statusId" class="inline-block label-box h14"
                :class="processForm.statusId === '1'?'green-box' : 'yellow-box'"
          >{{statusMap[processForm.statusId]}}</span>
        </div>
        <el-form-item v-else label="流程名称" prop="name">
          <el-input v-model="processForm.name" placeholder="请输入流程名称，不多于50个字"></el-input>
        </el-form-item>
        <el-form-item class="hide" label="流程ID" prop="id">
          <el-input v-model="processForm.id"></el-input>
        </el-form-item>
        <el-form-item label="详情描述" prop="content">
          <el-input type="textarea"
                    v-model="processForm.content"
                    :readonly="page==='detail'"
                    placeholder="请输入即将创建的流程的详细信息，不多于1000个字"
          ></el-input>
        </el-form-item>
      </el-form>
      <div>
        <div class="same-color-form-__label py2">流程设置</div>
        <div class="pb2">
          <el-radio :disabled="page==='detail'"  v-model="processForm.fillType" label="k10036-01">单填报流程</el-radio>
          <el-radio :disabled="page==='detail'"  v-model="processForm.fillType" label="k10036-02">多填报流程</el-radio>
        </div>
      </div>
      <!-- 单流程填报 -->
      <div v-show="processForm.fillType === 'k10036-01'">
        <div>
          <el-form :model="setForm" :rules="setRules" label-position="right" ref="setForm" label-width="70px">
            <el-form-item label="填报人" prop="reporters">
              <div v-if="setForm.reporters.length>0">
                <span
                  v-for="(item, index) of setForm.reporters"
                  :key="index">
                    <span
                      class="inline-block height-normal line-height-normal px2 bd tag-box width-300px" :class="page!=='detail'? 'pointer':''"
                      @click="editInformant(item, index)">
                        <!-- 考核对象本人 -->
                        <span v-if="item.staffType === '1'">{{staffTypeMap[item.staffType] || '--'}}</span>
                        <!-- 直属领导 -->
                        <span v-else-if="item.staffType === '2'">{{higherLevelMap[item.higherLevel] || '--'}}</span>
                        <!-- 指定团队 -->
                        <span v-if="item.staffType === '5'">{{teamMap[item.teamType] || '--'}}</span>
                        <!-- 指定成员，指定角色 -->
                        <span v-else-if="item.staffType === '3'||item.staffType === '4'">{{item[staffTypeMap[item.staffType]]}}</span>
                        <!-- 直属领导，指定角色，指定团队 显示会签或者或签 -->
                        <span v-if="item.staffType === '2'||item.staffType === '4'||item.staffType === '5'">{{item.approvalType === 'k10029-01' ? '(会签)' : '(或签)'}}</span>
                        <!-- 填报人删除按钮 -->
                        <i v-if="page!=='detail'"
                            class="f-right at icon-closecircle color-placeholder delete-btn"
                            @click.stop="deleteFlowPeople('reporters', index)"></i>
                    </span>
                    <span v-if="index!==setForm.reporters.length-1" class="px1">>></span>
                    <span v-else class="px1"></span>
                  </span>
              </div>
              <!-- 添加填报人按钮 -->
              <i v-else-if="setForm.reporters.length===0 && page!=='detail'"
                  @click="addInformant"
                  class="at icon-pluscircleo color-blue h24 pointer"></i>
            </el-form-item>
            <el-form-item label="审核人">
              <div>
                <span
                  v-for="(item, index) of setForm.checkers"
                  :key="index"
                  v-if="item.nodeType"
                >
                  <span class="inline-block height-normal line-height-normal pl2 pr5 bd tag-box relative mb1" :class="page!=='detail'? 'pointer':''"
                        @click="editAuditor(item, index)">
                    <span class="checkers-index">{{index + 1}}</span>
                    <span v-if="item.staffType === '1'">{{staffTypeMap[item.staffType] || '--'}}</span>
                    <span v-else-if="item.staffType === '2'">{{higherLevelMap[item.higherLevel] || '--'}}</span>
                    <span v-if="item.staffType === '5'">{{teamMap[item.teamType] || '--'}}</span>
                    <span v-else-if="item.staffType === '3'||item.staffType === '4'">{{item[staffTypeMap[item.staffType]]}}</span>
                    <span v-if="item.staffType === '2'||item.staffType === '4'||item.staffType === '5'">{{item.approvalType === 'k10029-01' ? '(会签)' : '(或签)'}}</span>
                    <i v-if="page!=='detail'" class="f-right at icon-closecircle color-placeholder absolute delete-btn"
                          @click.stop="deleteFlowPeople('checkers', index)"></i>
                  </span>
                  <span v-if="index!==setForm.checkers.length-1" class="px1">>></span>
                  <span v-else class="px1"></span>
                </span>
                <!-- 审核人少于10个才显示添加审核人按钮 -->
                <i v-show="setForm.checkers.length<10 && page!=='detail'" @click="addAuditor" class="at icon-pluscircleo color-blue h24 pointer"></i>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <div class="same-color-form-__label py2">指标分数设置</div>
          <div>
            <el-form :model="processForm" :rules="processRules" ref="processForm_2" label-position="left">
              <el-form-item class="inline-block full"
                            prop="formula"
                            label="审核指标的最终得分 = "
                            labelWidth="166px">
                <el-input :readonly="page==='detail'" v-model="processForm.formula"></el-input>
              </el-form-item>
              <fd-formula-des :des="singleFillDes" :example="[]" style="margin-left: 166px;" v-show="page==='edit' || page === 'add'"></fd-formula-des>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 多流程填报 -->
      <div v-show="processForm.fillType === 'k10036-02'">
        <div>
          <el-form :model="multipleSetForm" :rules="multipleSetRules" ref="multipleSetForm" label-width="80px">
            <el-form-item label="填报人：" prop="reporters">
              <div>
                <span
                  v-for="(item, index) of multipleSetForm.reporters"
                  :key="index"
                  @click="editInformant(item, index)">
                  <span class="inline-block height-normal line-height-normal pl2 pr5 bd tag-box relative mb1"
                  :class="page!=='detail'? 'pointer':''"
                  >
                    <span class="checkers-index">{{index + 1}}</span>
                    <span v-if="item.staffType === '1'">{{staffTypeMap[item.staffType] || '--'}}</span>
                    <span v-else-if="item.staffType === '2'">{{higherLevelMap[item.higherLevel] || '--'}}</span>
                    <span v-if="item.staffType === '5'">{{teamMap[item.teamType] || '--'}}</span>
                    <span v-else-if="item.staffType === '3'||item.staffType === '4'">{{item[staffTypeMap[item.staffType]]}}</span>
                    <span v-if="item.staffType === '2'||item.staffType === '4'||item.staffType === '5'">{{item.approvalType === 'k10029-01' ? '(会签)' : '(或签)'}}</span>
                    <i v-if="page!=='detail'"
                        class="f-right at icon-closecircle absolute color-placeholder delete-btn"
                        @click.stop="deleteFlowPeople('reporters', index)"></i>
                  </span>
                  <span v-if="index!==multipleSetForm.reporters.length-1" class="px1">>></span>
                  <span v-else class="px1"></span>
                </span>
                <!-- 填报人少于10个才显示添加审核人按钮 -->
                <i v-show="multipleSetForm.reporters.length<10 && page!=='detail'"
                    @click="addInformant"
                    class="at icon-pluscircleo color-blue h24 pointer"></i>
              </div>
            </el-form-item>
            <!-- multiForm多填报流程的填报公式校验 -->
            <div>
              <div class="same-color-form-__label py2">填报分数设置</div>
              <div>
                <el-form :model="multiForm" :rules="multiProcessRules" ref="processForm_3" label-position="left">
                  <el-form-item class="inline-block full"
                                prop="fillFormula"
                                label="填报指标的最终得分 = "
                                labelWidth="166px">
                    <el-input :readonly="page==='detail'" v-model="multiForm.fillFormula" @focus="showFillDes"></el-input>
                  </el-form-item>
                  <fd-formula-des :des="multipleFillDes" :example="[]" style="margin-left: 166px;" v-show="(page==='edit' || page === 'add') && fillShow"></fd-formula-des>
                </el-form>
              </div>
            </div>
            <el-form-item label="审核人：">
              <div>
                <span
                  v-for="(item, index) of multipleSetForm.checkers"
                  :key="index"
                  v-if="item.nodeType"
                >
                  <span class="inline-block height-normal line-height-normal pl2 pr5 bd tag-box relative mb1" :class="page!=='detail'? 'pointer':''"
                        @click="editAuditor(item, index)">
                    <span class="checkers-index">{{index + 1}}</span>
                    <span v-if="item.staffType === '1'">{{staffTypeMap[item.staffType] || '--'}}</span>
                    <span v-else-if="item.staffType === '2'">{{higherLevelMap[item.higherLevel] || '--'}}</span>
                    <span v-if="item.staffType === '5'">{{teamMap[item.teamType] || '--'}}</span>
                    <span v-else-if="item.staffType === '3'||item.staffType === '4'">{{item[staffTypeMap[item.staffType]]}}</span>
                    <span v-if="item.staffType === '2'||item.staffType === '4'||item.staffType === '5'">{{item.approvalType === 'k10029-01' ? '(会签)' : '(或签)'}}</span>
                    <i v-if="page!=='detail'" class="f-right at icon-closecircle color-placeholder absolute delete-btn"
                          @click.stop="deleteFlowPeople('checkers', index)"></i>
                  </span>
                  <span v-if="index!==multipleSetForm.checkers.length-1" class="px1">>></span>
                  <span v-else class="px1"></span>
                </span>
                <i v-show="multipleSetForm.checkers.length<10 && page!=='detail'" @click="addAuditor" class="at icon-pluscircleo color-blue h24 pointer"></i>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- multiForm多填报流程的审核公式校验 -->
        <div>
          <div class="same-color-form-__label py2">审核分数设置</div>
          <div>
            <el-form :model="multiForm" :rules="multiProcessRules" ref="processForm_4" label-position="left">
              <el-form-item class="inline-block full"
                            prop="formula"
                            label="审核指标的最终得分 = "
                            labelWidth="166px">
                <el-input :readonly="page==='detail'" v-model="multiForm.formula" @focus="showApproveDes"></el-input>
              </el-form-item>
              <fd-formula-des :des="multipleApproveDes" :example="[]" style="margin-left: 166px;" v-show="(page==='edit' || page === 'add') && approveShow"></fd-formula-des>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 页面底部操作按钮 -->
      <div class="fixed-bottom">
        <div v-if="page==='detail' || processForm.statusId==='1'" class="fixed-bottom-item" @click="goBack">
          <div class="fixed-bottom-item-text">返回</div>
        </div>
        <div class="fixed-bottom-item" v-if="page==='edit' || page === 'add'" @click="cancelOperate">
          <div class="fixed-bottom-item-text">取消</div>
        </div>
        <div class="fixed-bottom-item" v-if="page==='edit' || page === 'add'" @click="sureOperate('processForm')">
          <div class="fixed-bottom-item-text">确定</div>
        </div>
        <div class="fixed-bottom-item" v-if="processForm.statusId!=='1'&&page==='detail'" @click="page = 'edit'">
          <div class="fixed-bottom-item-text">编辑</div>
        </div>
      </div>
      <fd-dialog
        :title="modelTitle"
        :syncVisible="processVisible"
        @beforeClose="processVisible = false"
      >
        <div slot="fd-body">
          <el-row>
            <el-col :span="20">
              <el-form :model="peopleForm" ref="peopleForm" label-position="right" :rules="peopleFormRules" label-width="35%">
                <el-form-item :label="modelType" prop="staffType">
                  <el-select v-model="peopleForm.staffType" filterable placeholder="请选择类别">
                    <el-option
                      v-for="item of peopleType"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- 当填报人或者审核人类别为直属领导时，显示直属领导的下拉框 -->
                <el-form-item v-show="peopleForm.staffType==='2'" label="直属领导" prop="higherLevel">
                  <el-select v-model="peopleForm.higherLevel" filterable placeholder="请选择直属领导">
                    <el-option
                      v-for="item of higherLevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- 当填报人或者审核人类别为指定成员时，显示指定成员的下拉框 -->
                <el-form-item v-show="peopleForm.staffType==='3'" label="指定成员" prop="staffId">
                  <el-select v-model="peopleForm.staffId" filterable placeholder="请选择指定成员">
                    <el-option
                      v-for="item of allPerson"
                      :key="item.id"
                      :label="item.name + '（' + item.departName + '）'"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- 当填报人或者审核人类别为指定角色时，显示指定角色的下拉框树级结构 -->
                <el-form-item v-show="peopleForm.staffType === '4'" label="指定角色" prop="roleName">
                  <el-popover
                    ref="members"
                    placement="bottom-start"
                    v-model="personCompanyTree">
                    <el-tree :data="roles"
                             :props="departProps"
                             :accordion="accordion"
                             @node-click="roleSelect"></el-tree>
                  </el-popover>
                  <el-input
                    v-model="peopleForm.roleName"
                    readonly
                    placeholder="请选择指定角色"
                    v-popover:members>
                  </el-input>
                </el-form-item>
                <!-- 当填报人或者审核人类别为指定团队时，显示指定团队的下拉框 -->
                <el-form-item v-show="peopleForm.staffType==='5'" label="指定团队" prop="staffId">
                  <el-select v-model="peopleForm.teamType" filterable placeholder="请选择指定团队">
                    <el-option
                      v-for="item of teams"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!--1: 考核对象本人，3:指定成员-->
                <el-form-item prop="approvalType"  label="审核方式" v-show="peopleForm.staffType !== '1' && peopleForm.staffType !== '3' && peopleForm.staffType !== ''">
                  <el-radio-group v-model="peopleForm.approvalType">
                    <el-radio
                      v-for="item of approvals"
                      :key="item.id"
                      :label="item.id"
                    >{{item.text.replace(/填报/g, model)}}</el-radio>
                  </el-radio-group>
                  <div class="color-subTitle">
                    {{'「会签」与「或签」是多人填报时采用的填报方式，「会签」指须所有填报人填报，「或签」指一名填报人填报即可。'.replace(/填报/g, model) }}
                  </div>
                  <div v-show="peopleForm.staffType==='5'">
                  <span class="color-subTitle">{{'(选择的指定团队成员中,考核对象本人不参与填报)'.replace(/填报/g, model)}}</span>
                </div>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="4"></el-col>
          </el-row>
        </div>
        <div slot="fd-footer">
          <el-button size="small" @click="processVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="sureSave('peopleForm')">确定</el-button>
        </div>
      </fd-dialog>
    </div>
  </div>
</template>

<script>
  import { goBack } from '@/api/common'
  import { resetForm } from '@/api/kpi/record'
  import { getFlowById, cancelOperate, sureOperate, addInformant, roleSelect, editAuditor, editInformant,
    addAuditor, sureSave, deleteFlowPeople, showBtn, departSelect, clearForm, getAllPerson,
    showApproveDes, showFillDes } from '@/api/kpi/check/processDetail'
  import { getRoles } from '@/api/kpi/record/roles'
  import FdFormulaDes from '../components/formulaDes'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: 'processDetail',
    data() {
      const validateHigherLevel = (rule, value, callback) => {
        if (this.peopleForm.staffType === '2' && this.peopleForm.higherLevel === '') {
          callback(new Error('请选择直属领导'))
        } else {
          callback()
        }
      }
      const validateStaffId = (rule, value, callback) => {
        if (this.peopleForm.staffType === '3' && this.peopleForm.staffId === '') {
          callback(new Error('请选择指定成员'))
        } else {
          callback()
        }
      }
      const validateRoleName = (rule, value, callback) => {
        if (this.peopleForm.staffType === '4' && this.peopleForm.roleName === '') {
          callback(new Error('请选择指定角色'))
        } else {
          callback()
        }
      }
      // 单流程填报-指标分数设置
      const validateFormula = (rule, value, callback) => {
        value = value || ''
        const left = value.match(/\(/g)
        const right = value.match(/\)/g)
        if (left && right && left.length !== right.length) {
          callback(new Error('()需要成对出现'))
        }
        const error = []
        const regs = [
          /填报/g,
          /审核/g,
          /IF/g,
          /AVERAGE/g,
          /AND/g,
          /OR/g,
          /\=/g,
          /\<\=/g,
          /\>\=/g,
          /[\+\-\*\/\(\)\,\<\>\s]/g
        ]
        if (value.indexOf('、') > -1) {
          error.push(...value.match(/、/g))
        }
        // 校验审核1，审核2.。。。
        const shenhe = new Set(value.match(/审核\d*/g))
        const hefa = this.setForm.checkers.map((item, i) => {
          return '审核' + (i + 1)
        })
        // 校验填报，非法字符包括填报1，填报2
        const tianbao = new Set(value.match(/填报\d*/g))
        const hefaFill = this.setForm.reporters.map((item, i) => {
          return '填报'
        })
        tianbao.forEach((item, i) => {
          if (hefaFill.indexOf(item) < 0) {
            error.push(item)
          }
        })
        shenhe.forEach((item, i) => {
          if (hefa.indexOf(item) < 0) {
            error.push(item)
          }
        })
        // 数字[-10000, 10000]之间
        const ints = value.match(/-?\d+\.*\d*/g) || []
        value = value.replace(/-?\d+\.*\d*/g, '')
        for (const item of ints) {
          if (!(/^-?\d{1,4}(\.\d{1,4})?$/g.test(item))) {
            error.push(item)
          }
        }
        for (const reg of regs) {
          value = value.replace(reg, '、')
        }
        if (value !== '' || error.length > 0) {
          error.push(...value.split(/、/g))
          const total = []
          for (const item of error) {
            if (item !== '') {
              total.push(item)
            }
          }
          if (total.length > 0) {
            callback(new Error('存在不支持的字符: ' + total.join()))
          } else {
            callback()
          }
        }
        callback()
      }
      // 多填报流程-审核分数设置校验
      const validateCheckFormula = (rule, value, callback) => {
        value = value || ''
        const left = value.match(/\(/g)
        const right = value.match(/\)/g)
        if (left && right && left.length !== right.length) {
          callback(new Error('()需要成对出现'))
        }
        const error = []
        const regs = [
          /填报/g,
          /审核/g,
          /IF/g,
          /AVERAGE/g,
          /AND/g,
          /OR/g,
          /\=/g,
          /\<\=/g,
          /\>\=/g,
          /[\+\-\*\/\(\)\,\<\>\s]/g
        ]
        if (value.indexOf('、') > -1) {
          error.push(...value.match(/、/g))
        }
        // 校验审核1，审核2.。。。
        const shenhe = new Set(value.match(/审核\d*/g))
        const hefa = this.multipleSetForm.checkers.map((item, i) => {
          return '审核' + (i + 1)
        })
        // 校验填报，非法字符包括填报1，填报2
        const tianbao = new Set(value.match(/填报\d*/g))
        const hefaFill = this.multipleSetForm.reporters.map((item, i) => {
          return '填报'
        })
        tianbao.forEach((item, i) => {
          if (hefaFill.indexOf(item) < 0) {
            error.push(item)
          }
        })
        shenhe.forEach((item, i) => {
          if (hefa.indexOf(item) < 0) {
            error.push(item)
          }
        })
        // 数字[-10000, 10000]之间
        const ints = value.match(/-?\d+\.*\d*/g) || []
        value = value.replace(/-?\d+\.*\d*/g, '')
        for (const item of ints) {
          if (!(/^-?\d{1,4}(\.\d{1,4})?$/g.test(item))) {
            error.push(item)
          }
        }
        for (const reg of regs) {
          value = value.replace(reg, '、')
        }
        if (value !== '' || error.length > 0) {
          error.push(...value.split(/、/g))
          const total = []
          for (const item of error) {
            if (item !== '') {
              total.push(item)
            }
          }
          if (total.length > 0) {
            callback(new Error('存在不支持的字符: ' + total.join()))
          } else {
            callback()
          }
        }
        callback()
      }
      // 多填报流程-填报分数设置校验
      const validateFillFormula = (rule, value, callback) => {
        value = value || ''
        const left = value.match(/\(/g)
        const right = value.match(/\)/g)
        if (left && right && left.length !== right.length) {
          callback(new Error('()需要成对出现'))
        }
        const error = []
        const regs = [
          /填报/g,
          /审核/g,
          /IF/g,
          /AVERAGE/g,
          /AND/g,
          /OR/g,
          /\=/g,
          /\<\=/g,
          /\>\=/g,
          /[\+\-\*\/\(\)\,\<\>\s]/g
        ]
        if (value.indexOf('、') > -1) {
          error.push(...value.match(/、/g))
        }
        // 校验审核1，审核2.。。。
        const shenhe = new Set(value.match(/审核\d*/g))
        const hefaCheck = [].map((item, i) => {
          return '审核' + (i + 1)
        })
        shenhe.forEach((item, i) => {
          if (hefaCheck.indexOf(item) < 0) {
            error.push(item)
          }
        })
        const tianbao = new Set(value.match(/填报\d*/g))
        // 校验填报人有几个节点，三个节点的话 就不能出现填报4
        const hefa = this.multipleSetForm.reporters.map((item, i) => {
          return '填报' + (i + 1)
        })
        tianbao.forEach((item, i) => {
          if (hefa.indexOf(item) < 0) {
            error.push(item)
          }
        })
        // 数字[-10000, 10000]之间
        const ints = value.match(/-?\d+\.*\d*/g) || []
        value = value.replace(/-?\d+\.*\d*/g, '')
        for (const item of ints) {
          if (!(/^-?\d{1,4}(\.\d{1,4})?$/g.test(item))) {
            error.push(item)
          }
        }
        for (const reg of regs) {
          value = value.replace(reg, '、')
        }
        if (value !== '' || error.length > 0) {
          error.push(...value.split(/、/g))
          const total = []
          for (const item of error) {
            if (item !== '') {
              total.push(item)
            }
          }
          if (total.length > 0) {
            callback(new Error('存在不支持的字符: ' + total.join()))
          } else {
            callback()
          }
        }
        callback()
      }
      const requiredFormula = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('换算公式不能为空'))
        }
        validateFormula(rule, value, callback)
      }
      const requiredFillFormula = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('换算公式不能为空'))
        }
        validateFillFormula(rule, value, callback)
      }
      const requiredCheckFormula = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('换算公式不能为空'))
        }
        validateCheckFormula(rule, value, callback)
      }
      return {
        singleFillDes: `公式示例: 填报*0.2 + 审核1*0.4 + 审核2*0.4
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用"填报"和"审核1","审核2"...等变量;
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`,
        multipleFillDes: `公式示例: 填报1*0.4 + 填报2*0.6
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用"填报1","填报2"...等变量;
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`,
        multipleApproveDes: `公式示例: 填报*0.2 + 审核1*0.4 + 审核2*0.4
      注意: 1、输入公式仅使用以下16种的半角符号才有效;
            2、输入公式可以输入任意数字值,范围在[-10000,10000]间,且小数点不超过4位;
            3、输入公式除数值和16种符号外仅可使用"填报"和"审核1","审核2"...等变量;
            4、点击下方对应指标值或符号后在公式输入框中粘贴(Ctrl+V)即可复制。`,
        processVisible: false,
        visible: {},
        modelTitle: '',
        modelType: '',
        model: '填报',
        page: '',
        personMap: {},
        allPerson: [],
        editItem: {},
        editIndex: 0,
        departProps: {
          children: 'children',
          label: 'label'
        }, // 指定成员数据获取
        accordion: true,
        personCompanyTree: false,
        peopleType: [
          { id: '1', text: '考核对象本人' },
          { id: '2', text: '直属领导' },
          { id: '3', text: '指定成员' },
          { id: '4', text: '指定角色' },
          { id: '5', text: '指定团队' }
        ],
        approvals: [{
          id: 'k10029-01',
          text: `会签`
        }, {
          id: 'k10029-02',
          text: `或签`
        }],
        staffTypeMap: {
          '1': '考核对象本人',
          '2': '直属领导',
          '3': 'staffName',
          '4': 'roleName',
          '5': '指定团队'
        },
        statusMap: {
          '1': '已生效',
          '0': '未生效'
        },
        processForm: {
          content: '',
          id: '',
          name: '',
          status: '',
          formula: '',
          fillType: 'k10036-01'
        },
        multiForm: {
          fillFormula: '',
          formula: ''
        },
        processRules: {
          name: [
            { required: true, message: '请输入流程名称', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }
          ],
          content: [
            { max: 1000, message: '长度不超过1000个字符', trigger: 'blur' }
          ],
          formula: [{ required: true, validator: requiredFormula, trigger: 'blur' }]
        },
        multiProcessRules: {
          formula: [{ required: true, validator: requiredCheckFormula, trigger: 'blur' }],
          fillFormula: [{ required: true, validator: requiredFillFormula, trigger: 'blur' }]
        },
        peopleFormRules: {
          staffType: [
            { required: true, message: '请选择类别', trigger: 'change' }
          ],
          higherLevel: [{ required: true, validator: validateHigherLevel, trigger: 'change' }],
          staffId: [{ required: true, validator: validateStaffId, trigger: 'change' }],
          roleName: [{ required: true, validator: validateRoleName, trigger: 'change' }]
        },
        setForm: {
          reporters: [],
          checkers: []
        },
        multipleSetForm: {
          reporters: [],
          checkers: []
        },
        setRules: {
          reporters: [
            { required: true, message: '请选择填报人', trigger: 'change' }
          ]
        },
        multipleSetRules: {
          reporters: [
            { required: true, message: '请选择填报人', trigger: 'change' }
          ]
        },
        peopleForm: {
          staffType: '',
          roleName: '',
          roleId: '',
          staffId: '',
          higherLevel: 'k10028-01',
          approvalType: 'k10029-02',
          teamType: 'k10031-01'
        },
        flowId: '',
        roles: [],
        teamMap: this.fd.tools.mapSelects('k10031'), // 指定团队
        higherLevelMap: this.fd.tools.mapSelects('k10028'), // 直属等级
        fillType: 'k10036-01', // 填报类型
        formMap: {
          'k10036-01': 'setForm',
          'k10036-02': 'multipleSetForm'
        },
        formulaMap: {
          'k10036-01': 'processForm',
          'k10036-02': 'multiForm'
        },
        fillShow: true,
        approveShow: false
      }
    },
    components: { FdFormulaDes, fdDialog },
    methods: {
      getFlowById, cancelOperate, sureOperate, addInformant, addAuditor, sureSave, resetForm, editInformant,
      deleteFlowPeople, showBtn, departSelect, getAllPerson, getRoles, roleSelect, clearForm, editAuditor,
      goBack, showApproveDes, showFillDes
    },
    computed: {
      // 指定团队
      teams() {
        return this.$store.getters.selects['k10031'] || []
      },
      // 直属等级
      higherLevels() {
        return this.$store.getters.selects['k10028'] || []
      }
    },
    mounted() {
      this.page = this.$route.query.page || 'add'
      this.flowId = this.$route.query.id || ''
      if (this.flowId) {
        this.getFlowById(this.flowId)
      }
      this.getAllPerson()
      this.getRoles()
    }
  }
</script>

<style lang="scss" scoped>
  .tag-box{
    border-radius: 2px;
  }
  .tag-box:hover{
    border-color:#66b1ff;
  }
  .tag-box:hover .delete-btn{
    display:inline-block;
  }
  .tag-box .delete-btn{
    display:none;
  }
  .delete-btn{
    top:0;
    right:16px;
  }
  .label-box {
    padding: 4px 16px;
    border-radius: 100px;
  }
  .green-box{
    background-color: #ebf8f2;
    border: solid 1px #00924b;
    color: #00924c;
  }
  .yellow-box{
    border: solid 1px #ffcd3c;
    background-color: #fffaeb;
    color: #e09a00;
  }
  .same-color-form-__label{
    color: #404040;
    font-weight: 700;
  }
  .checkers-index{
    background-color: #d9d9d9;
    border-radius: 20px;
    text-align: center;
    line-height: 20px;
    height: 20px;
    width: 20px;
    color: #fff;
    margin-right: 4px;
    display: inline-block;
  }
  .tag-box:hover .checkers-index{
    background-color: #66b1ff;
    color: #fff;
  }
  .multiple-fill-form {
    .el-form--label-right .el-form-item__label:after {
      content: '';
    }
  }
</style>
