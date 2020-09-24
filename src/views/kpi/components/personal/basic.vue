<template>
  <div class="px2 pt2">
    <div class="mb2 height-normal line-height-normal">
      <span class="color-title h16 f-left bold">基本信息</span>
      <span class="f-right">
        <el-button size="small" @click="seeCadres">干部任免表</el-button>
        <el-button size="small" v-if="elements.edit && edit" @click="editBasicInfo">编辑</el-button>
      </span>
    </div>
    <div class="h14 p2 bd relative">
      <div class="img-box" :style="{ backgroundImage:'url('+(photoUrl || photo)+')' }"></div>
      <div v-if="edit" class="basic-row">
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">ID:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.id" placement="top-start">
                <div class="dot-hidden">{{userInfo.id}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">数据来源:</div>
            <div class="hidden text-indent0 ">
              {{userInfo.source === 'system' ? '系统内' : '系统外'}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">参与考核:</div>
            <div class="hidden text-indent0 ">
              {{checkMap[userInfo.isAccess]}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">姓名:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.name" placement="top-start">
                <div class="dot-hidden">{{userInfo.name}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">部门正副职:</div>
            <div class="hidden text-indent0 ">
              {{chairMap[userInfo.chairId]}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">性别:</div>
            <div class="hidden text-indent0 ">
              {{sexMap[userInfo.sexId]}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">单位:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.companyName" placement="top-start">
                <div class="dot-hidden">{{userInfo.companyName}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">部门:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.departName" placement="top-start">
                <div class="dot-hidden">{{userInfo.departName}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">民族:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.nationId" placement="top-start">
                <div class="dot-hidden">{{userInfo.nationId}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">籍贯:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.addressShort" placement="top-start">
                <div class="dot-hidden">{{userInfo.addressShort}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">出生地:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.birthAddress" placement="top-start">
                <div class="dot-hidden">{{userInfo.birthAddress}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">出生日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.birthDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.birthDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">身份证号:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.idCard" placement="top-start">
                <div class="dot-hidden">{{userInfo.idCard}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">健康状况:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.healthMsg" placement="top-start">
                <div class="dot-hidden">{{userInfo.healthMsg}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">婚姻状况:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.marriageMsg" placement="top-start">
                <div class="dot-hidden">{{userInfo.marriageMsg}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">参加工作日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.hcStartWorkDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.hcStartWorkDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进本院日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.hcCompanyDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.hcCompanyDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">政治面貌:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.politicalOutlook" placement="top-start">
                <div class="dot-hidden">{{userInfo.politicalOutlook}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">政治面貌加入日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.politicalOutlookDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.politicalOutlookDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">行政职务:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.administrativeDuties" placement="top-start">
                <div class="dot-hidden">{{userInfo.administrativeDuties}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">行政职务任职日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.administrativeDutiesDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.administrativeDutiesDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">法律职务:</div>
            <div class="hidden text-indent0 ">
              {{workMap[userInfo.legalPositionId]}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">法律职务任职日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.legalPositionDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.legalPositionDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="f-left label-left pr-8px">学历:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.degreeId" placement="top-start">
                <div class="dot-hidden">{{userInfo.degreeId}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">专业:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.major" placement="top-start">
                <div class="dot-hidden">{{userInfo.major}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">学位:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.degree" placement="top-start">
                <div class="dot-hidden">{{userInfo.degree}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">获得学位日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.degreeDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.degreeDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">职级:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.levelId" placement="top-start">
                <div class="dot-hidden">{{userInfo.levelId}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">职级日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.levelDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.levelDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">等级:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.grade" placement="top-start">
                <div class="dot-hidden">{{userInfo.grade}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">等级日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.gradeDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.gradeDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">编制:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.organization" placement="top-start">
                <div class="dot-hidden">{{userInfo.organization}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">职务类别:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.jobCategory" placement="top-start">
                <div class="dot-hidden">{{userInfo.jobCategory}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">职务类别时间:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.jobCategoryDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.jobCategoryDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">人员分类:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.classify" placement="top-start">
                <div class="dot-hidden">{{userInfo.classify}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">工作岗位:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.post" placement="top-start">
                <div class="dot-hidden">{{userInfo.post}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">法官资格日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.judgeQualificationDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.judgeQualificationDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">取得法官资格证书时间:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.judgeQualificationCertificateDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.judgeQualificationCertificateDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">政法工作日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.politicalWorkDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.politicalWorkDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">任用方式:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.appointment" placement="top-start">
                <div class="dot-hidden">{{userInfo.appointment}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">是否兼任庭长:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.servingAsPresident" placement="top-start">
                <div class="dot-hidden">{{userInfo.servingAsPresident}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">补充工龄:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.addWorkYear" placement="top-start">
                <div class="dot-hidden">{{userInfo.addWorkYear}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">扣减工龄:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.minusWorkYear" placement="top-start">
                <div class="dot-hidden">{{userInfo.minusWorkYear}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进入途径:</div>
            <div class="hidden text-indent0 ">
              {{resourceMap[userInfo.resourceId]}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进院审核日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.companyCheckDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.companyCheckDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进来源:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.companyResource" placement="top-start">
                <div class="dot-hidden">{{userInfo.companyResource}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">原单位:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.preCompany" placement="top-start">
                <div class="dot-hidden">{{userInfo.preCompany}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">原职务:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.preDuty" placement="top-start">
                <div class="dot-hidden">{{userInfo.preDuty}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">原职级:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.preLevel" placement="top-start">
                <div class="dot-hidden">{{userInfo.preLevel}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">公务员级别:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.civilServiceRank" placement="top-start">
                <div class="dot-hidden">{{userInfo.civilServiceRank}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">公务员级别起算日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.civilServiceRankDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.civilServiceRankDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进院前法院工作年限:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.serviceBeforeCompany" placement="top-start">
                <div class="dot-hidden">{{userInfo.serviceBeforeCompany}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">人员类型:</div>
            <div class="hidden text-indent0 ">
              {{typeMap[userInfo.typeId]}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">正式干警:</div>
            <div class="hidden text-indent0 ">
              {{officePoliceMap[userInfo.officialPolice]}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">出日期:</div>
            <div class="hidden text-indent0 ">
              {{userInfo.hcLeaveDate}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">出原因:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.hcLeaveReason" placement="top-start">
                <div class="dot-hidden">{{userInfo.hcLeaveReason}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="basic-row" v-else>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">姓名:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.name" placement="top-start">
                <div class="dot-hidden">{{userInfo.name}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">部门正副职:</div>
            <div class="hidden text-indent0 ">
              {{chairMap[userInfo.chairId]}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">性别:</div>
            <div class="hidden text-indent0 ">
              {{sexMap[userInfo.sexId]}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">单位:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.companyName" placement="top-start">
                <div class="dot-hidden">{{userInfo.companyName}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">部门:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.departName" placement="top-start">
                <div class="dot-hidden">{{userInfo.departName}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">民族:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.nationId" placement="top-start">
                <div class="dot-hidden">{{userInfo.nationId}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">籍贯:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.addressShort" placement="top-start">
                <div class="dot-hidden">{{userInfo.addressShort}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">出生地:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.birthAddress" placement="top-start">
                <div class="dot-hidden">{{userInfo.birthAddress}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">出生日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.birthDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.birthDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">身份证号:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.idCard" placement="top-start">
                <div class="dot-hidden">{{userInfo.idCard}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">健康状况:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.healthMsg" placement="top-start">
                <div class="dot-hidden">{{userInfo.healthMsg}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">婚姻状况:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.marriageMsg" placement="top-start">
                <div class="dot-hidden">{{userInfo.marriageMsg}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <div class="f-left label-left pr-8px">参加工作日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.hcStartWorkDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.hcStartWorkDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进本院日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.hcCompanyDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.hcCompanyDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">政治面貌:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.politicalOutlook" placement="top-start">
                <div class="dot-hidden">{{userInfo.politicalOutlook}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">政治面貌加入日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.politicalOutlookDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.politicalOutlookDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">行政职务:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.administrativeDuties" placement="top-start">
                <div class="dot-hidden">{{userInfo.administrativeDuties}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">行政职务任职日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.administrativeDutiesDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.administrativeDutiesDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">法律职务:</div>
            <div class="hidden text-indent0 ">
              {{workMap[userInfo.legalPositionId]}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">法律职务任职日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.legalPositionDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.legalPositionDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6"><div class="f-left label-left pr-8px">学历:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.degreeId" placement="top-start">
                <div class="dot-hidden">{{userInfo.degreeId}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">专业:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.major" placement="top-start">
                <div class="dot-hidden">{{userInfo.major}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">学位:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.major" placement="top-start">
                <div class="dot-hidden">{{userInfo.degree}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">获得学位日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.degreeDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.degreeDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">职级:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.levelId" placement="top-start">
                <div class="dot-hidden">{{userInfo.levelId}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">职级日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.levelDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.levelDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">等级:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.grade" placement="top-start">
                <div class="dot-hidden">{{userInfo.grade}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">等级日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.gradeDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.gradeDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">编制:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.organization" placement="top-start">
                <div class="dot-hidden">{{userInfo.organization}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">职务类别:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.jobCategory" placement="top-start">
                <div class="dot-hidden">{{userInfo.jobCategory}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">职务类别时间:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.jobCategoryDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.jobCategoryDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">人员分类:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.classify" placement="top-start">
                <div class="dot-hidden">{{userInfo.classify}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">工作岗位:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.post" placement="top-start">
                <div class="dot-hidden">{{userInfo.post}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">法官资格日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.judgeQualificationDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.judgeQualificationDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">取得法官资格证书时间:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.judgeQualificationCertificateDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.judgeQualificationCertificateDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">政法工作日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.politicalWorkDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.politicalWorkDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">任用方式:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.appointment" placement="top-start">
                <div class="dot-hidden">{{userInfo.appointment}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">是否兼任庭长:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.servingAsPresident" placement="top-start">
                <div class="dot-hidden">{{userInfo.servingAsPresident}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">补充工龄:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.addWorkYear" placement="top-start">
                <div class="dot-hidden">{{userInfo.addWorkYear}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">扣减工龄:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.minusWorkYear" placement="top-start">
                <div class="dot-hidden">{{userInfo.minusWorkYear}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进入途径:</div>
            <div class="hidden text-indent0 ">
              {{resourceMap[userInfo.resourceId]}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进院审核日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.companyCheckDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.companyCheckDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进来源:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.companyResource" placement="top-start">
                <div class="dot-hidden">{{userInfo.companyResource}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">原单位:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.preCompany" placement="top-start">
                <div class="dot-hidden">{{userInfo.preCompany}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">原职务:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.preDuty" placement="top-start">
                <div class="dot-hidden">{{userInfo.preDuty}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">原职级:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.preLevel" placement="top-start">
                <div class="dot-hidden">{{userInfo.preLevel}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">公务员级别:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.civilServiceRank" placement="top-start">
                <div class="dot-hidden">{{userInfo.civilServiceRank}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">公务员级别起算日期:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.civilServiceRankDate" placement="top-start">
                <div class="dot-hidden">{{userInfo.civilServiceRankDate}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">进院前法院工作年限:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.serviceBeforeCompany" placement="top-start">
                <div class="dot-hidden">{{userInfo.serviceBeforeCompany}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">人员类型:</div>
            <div class="hidden text-indent0 ">
              {{typeMap[userInfo.typeId]}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">参与考核:</div>
            <div class="hidden text-indent0 ">
              {{checkMap[userInfo.isAccess]}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">出日期:</div>
            <div class="hidden text-indent0 ">
              {{userInfo.hcLeaveDate}}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">出原因:</div>
            <div class="hidden text-indent0 ">
              <el-tooltip class="item" effect="dark" :content="userInfo.hcLeaveReason" placement="top-start">
                <div class="dot-hidden">{{userInfo.hcLeaveReason}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="f-left label-left pr-8px">正式干警:</div>
            <div class="hidden text-indent0 ">
              {{officePoliceMap[userInfo.officialPolice]}}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      class="cadres"
      title="干部任免表"
      :visible.sync="cadres"
      :close-on-click-modal=false
      width="1000px"
    >
      <slot></slot>
        <div slot="title" class="relative">
          <div class="absolute title-button">
            <el-button size="small" @click="printCadres">打印</el-button>
            <el-button size="small" @click="downloadCadres">下载</el-button>
          </div>
        </div>
      <div v-if="loading" style="min-height:600px"
           v-loading="loading"
           element-loading-text="数据正在加载中"
      >
      </div>
      <div v-else id="cadre" style="width:100%; margin: 0 auto;overflow: hidden;">
        <img :src="item" v-for="(item, index) in leaderUrl" v-bind:key="index" alt="" class="img-size">
      </div>
      <!--<fd-word id="cadre" :data="cadreData"></fd-word>-->
    </el-dialog>
    <fd-dialog
      :title="modelTitle"
      :syncVisible="addPersonDialog"
      @beforeClose="cancelBasicInfo"
    >
      <div slot="fd-body">
        <el-form
          class="px1"
          :rules="rules"
          ref="personForm"
          :model="personForm"
          label-position="right"
          label-width="100px">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="参与考核" prop="isAccess">
                <el-select :disabled="hasActive" v-model="personForm.isAccess" placeholder="请选择">
                  <el-option
                    v-for="item in check"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input :disabled="personForm.source !== 'system' || hasActive" v-model="personForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门正副职" prop="chairId">
                <el-select :disabled="hasActive" v-model="personForm.chairId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in chair"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="人员类型" prop="typeId">
                <el-select :disabled="hasActive" v-model="personForm.typeId" placeholder="请选择">
                  <el-option
                    v-for="item in types"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="正式干警" prop="officialPolice" >
                <el-select :disabled="hasActive" placeholder="请选择" v-model="personForm.officialPolice">
                  <el-option
                    v-for="item in officialPoliceCheck"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位" prop="companyName">
                <el-popover
                  ref="companyId"
                  placement="bottom-start"
                  v-model="personCompanyTree">
                  <div style="max-height: 20rem;" class="auto">
                    <el-tree :data="departs" :props="companyProps" :accordion="accordion" @node-click="companyNodeClick"></el-tree>
                  </div>
                </el-popover>
                <el-input
                  v-if="!hasActive"
                  v-model="personForm.companyName"
                  readonly
                  placeholder="请选择"
                  v-popover:companyId>
                </el-input>
                <el-input
                  v-else
                  v-model="personForm.companyName"
                  :disabled="hasActive"
                  placeholder="请选择">
                </el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="部门" prop="departName">
                <el-popover
                  ref="departPid"
                  placement="bottom-start"
                  v-if="!hasActive && personForm.source === 'system'"
                  v-model="personDepartTree">
                  <div style="max-height: 20rem;" class="auto">
                    <el-tree :data="treeDepart" :props="defaultProps" :accordion="accordion" @node-click="personNodeClick"></el-tree>
                  </div>
                  <el-input
                    v-model="personForm.departName"
                    :readonly=true
                    placeholder="请选择"
                    slot="reference">
                  </el-input>
                </el-popover>
                <el-input
                  v-else
                  v-model="personForm.departName"
                  :readonly=true
                  :disabled="hasActive || personForm.source !== 'system'"
                  placeholder="请选择">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="sexId">
                <el-select v-model="personForm.sexId" placeholder="请选择">
                  <el-option
                    v-for="item in sex"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族" prop="nationId">
                <el-input v-model="personForm.nationId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="籍贯" prop="addressShort">
                <el-input v-model="personForm.addressShort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生地" prop="birthAddress">
                <el-input v-model="personForm.birthAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期" prop="birthDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.birthDate"
                  type="date"
                  style="width:100%"
                  :editable=false
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="出生日期" prop="birthDate" v-else>
                <el-date-picker
                  v-model="personForm.birthDate"
                  type="date"
                  style="width:100%"
                  :editable=false
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="personForm.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="健康状况" prop="healthMsg">
                <el-input v-model="personForm.healthMsg"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况" prop="marriageMsg">
                <el-input v-model="personForm.marriageMsg"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="参加工作日期" prop="hcStartWorkDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.hcStartWorkDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="参加工作日期" prop="hcStartWorkDate" v-else>
                <el-date-picker
                  v-model="personForm.hcStartWorkDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="进本院日期" prop="hcCompanyDate" v-if="$store.getters.globals.isIE">
              <el-date-picker
                v-model="personForm.hcCompanyDate"
                type="date"
                :editable=false
                style="width:100%"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="进本院日期" prop="hcCompanyDate" v-else>
              <el-date-picker
                v-model="personForm.hcCompanyDate"
                type="date"
                :editable=false
                style="width:100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择">
              </el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政治面貌" prop="politicalOutlook">
                <el-input v-model="personForm.politicalOutlook"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8" class="label-long">
              <el-form-item label="政治面貌加入日期" prop="politicalOutlookDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.politicalOutlookDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="政治面貌加入日期" prop="politicalOutlookDate" v-else>
                <el-date-picker
                  v-model="personForm.politicalOutlookDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="行政职务" prop="administrativeDuties">
                <el-input v-model="personForm.administrativeDuties"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="label-long">
              <el-form-item label="行政职务任职日期" prop="administrativeDutiesDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.administrativeDutiesDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="行政职务任职日期" prop="administrativeDutiesDate" v-else>
                <el-date-picker
                  v-model="personForm.administrativeDutiesDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="法律职务" prop="legalPositionId">
                <el-select v-model="personForm.legalPositionId" placeholder="请选择">
                  <el-option
                    v-for="item in work"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="label-long">
              <el-form-item label="法律职务任职日期" prop="legalPositionDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.legalPositionDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="法律职务任职日期" prop="legalPositionDate" v-else>
                <el-date-picker
                  v-model="personForm.legalPositionDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学历" prop="degreeId">
                <el-input v-model="personForm.degreeId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="专业" prop="major">
                <el-input v-model="personForm.major"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学位" prop="degree">
                <el-input v-model="personForm.degree"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="获得学位日期" prop="degreeDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.degreeDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="获得学位日期" prop="degreeDate" v-else>
                <el-date-picker
                  v-model="personForm.degreeDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="职级" prop="levelId">
                <el-input v-model="personForm.levelId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职级日期" prop="levelDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.levelDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="职级日期" prop="levelDate" v-else>
                <el-date-picker
                  v-model="personForm.levelDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="等级" prop="grade">
                <el-input v-model="personForm.grade"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="等级日期" prop="gradeDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.gradeDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="等级日期" prop="gradeDate" v-else>
                <el-date-picker
                  v-model="personForm.gradeDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编制" prop="organization">
                <el-input v-model="personForm.organization"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务类别" prop="jobCategory">
                <el-input v-model="personForm.jobCategory"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="职务类别时间" prop="jobCategoryDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.jobCategoryDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="职务类别时间" prop="jobCategoryDate" v-else>
                <el-date-picker
                  v-model="personForm.jobCategoryDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="人员分类" prop="classify">
                <el-input v-model="personForm.classify"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作岗位" prop="post">
                <el-input v-model="personForm.post"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="法官资格日期" prop="judgeQualificationDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.judgeQualificationDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="法官资格日期" prop="judgeQualificationDate" v-else>
                <el-date-picker
                  v-model="personForm.judgeQualificationDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="label-long">
              <el-form-item label="取得法官资格证书时间" prop="judgeQualificationCertificateDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.judgeQualificationCertificateDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="取得法官资格证书时间" prop="judgeQualificationCertificateDate" v-else>
                <el-date-picker
                  v-model="personForm.judgeQualificationCertificateDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政法工作日期" prop="politicalWorkDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.politicalWorkDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="政法工作日期" prop="politicalWorkDate" v-else>
                <el-date-picker
                  v-model="personForm.politicalWorkDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="任用方式" prop="appointment">
                <el-input v-model="personForm.appointment"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否兼任庭长" prop="servingAsPresident">
                <el-input v-model="personForm.servingAsPresident"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="补充工龄" prop="addWorkYear">
                <el-input v-model="personForm.addWorkYear"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="扣减工龄" prop="minusWorkYear">
                <el-input v-model="personForm.minusWorkYear"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="进入途径" prop="resourceId">
                <el-select v-model="personForm.resourceId" placeholder="请选择">
                  <el-option
                    v-for="item in resource"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="进院审核日期" prop="companyCheckDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.companyCheckDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="进院审核日期" prop="companyCheckDate" v-else>
                <el-date-picker
                  v-model="personForm.companyCheckDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="进来源" prop="companyResource">
                <el-input v-model="personForm.companyResource"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原单位" prop="preCompany">
                <el-input v-model="personForm.preCompany"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原职务" prop="preDuty">
                <el-input v-model="personForm.preDuty"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="原职级" prop="preLevel">
                <el-input v-model="personForm.preLevel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公务员级别" prop="civilServiceRank">
                <el-input v-model="personForm.civilServiceRank"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="label-long">
              <el-form-item label="公务员级别起算日期" prop="civilServiceRankDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.civilServiceRankDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="公务员级别起算日期" prop="civilServiceRankDate" v-else>
                <el-date-picker
                  v-model="personForm.civilServiceRankDate"
                  type="date"
                  :editable=false
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8" class="label-long">
              <el-form-item label="进院前法院工作年限" prop="serviceBeforeCompany">
                <el-input v-model="personForm.serviceBeforeCompany"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出日期" prop="hcLeaveDate" v-if="$store.getters.globals.isIE">
                <el-date-picker
                  v-model="personForm.hcLeaveDate"
                  type="date"
                  style="width:100%"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="出日期" prop="hcLeaveDate" v-else>
                <el-date-picker
                  v-model="personForm.hcLeaveDate"
                  type="date"
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出原因" prop="hcLeaveReason">
                <el-input v-model="personForm.hcLeaveReason"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="fd-footer">
        <el-button size="small" @click="cancelBasicInfo">取消</el-button>
        <el-button size="small" type="primary" @click="saveBasicInfo">确定</el-button>
      </div>
    </fd-dialog>
  </div>
</template>

<script>
  import { getDepartData, resetForm } from '@/api/kpi/record'
  import { companyNodeClick, personNodeClick, getDepartMembers } from '@/api/kpi/record/personal'
  import { changeStartPeo, changeEndPeo, saveBasicInfo, editBasicInfo, cancelBasicInfo, getBasicInfo,
    getUserPhoto, getLeaderPhoto, seeCadres, printCadres, downloadCadres } from '@/api/kpi/record/personalDetail'
  import { isIDCard } from '@/utils/validate'
  import head from '@/assets/defaultPhoto.png'
  import fdWord from '../fdWord.vue'
  import fdDialog from 'fd/dialog/src/dialog.vue'
  export default {
    name: 'FdPersonalBasic',
    components: { fdWord, fdDialog },
    props: {
      edit: {
        type: Boolean,
        default: true
      },
      hasActive: {
        type: Boolean,
        default: true
      },
      userMsg: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        leaderUrl1: '',
        leaderUrl2: '',
        leaderUrl: [],
        loading: false,
        photo: head,
        photoUrl: '',
        userInfo: {},
        cadres: false, // 控制干部任免表的模态框的显示
        cadreData: {},
        modelTitle: '设置基本信息',
        personForm: {
          source: '',
          name: '',
          idCard: '',
          sexId: '',
          nationId: '',
          companyName: '',
          companyId: '',
          departName: '',
          departId: '',
          typeId: '',
          officialPolice: '',
          isAccess: '',
          resourceId: '',
          legalPositionId: '',
          chairId: '',
          levelId: '',
          judgeLevelId: '',
          addressShort: '',
          degreeId: '',
          leaveDate: '',
          birthAddress: '',
          birthDate: '',
          healthMsg: '',
          marriageMsg: '',
          hcStartWorkDate: '',
          hcCompanyDate: '',
          politicalOutlook: '',
          politicalOutlookDate: '',
          administrativeDuties: '',
          administrativeDutiesDate: '',
          legalPositionDate: '',
          major: '',
          degree: '',
          degreeDate: '',
          levelDate: '',
          grade: '',
          gradeDate: '',
          organization: '',
          jobCategory: '',
          jobCategoryDate: '',
          classify: '',
          post: '',
          judgeQualificationDate: '',
          judgeQualificationCertificateDate: '',
          politicalWorkDate: '',
          appointment: '',
          servingAsPresident: '',
          addWorkYear: '',
          minusWorkYear: '',
          companyCheckDate: '',
          companyResource: '',
          preCompany: '',
          preDuty: '',
          preLevel: '',
          civilServiceRank: '',
          civilServiceRankDate: '',
          serviceBeforeCompany: '',
          partyDate: '',
          startWorkDate: '',
          companyDate: '',
          hcLeaveReason: '',
          hcLeaveDate: ''
        },
        addPersonDialog: false,
        personCompanyTree: false,
        personDepartTree: false,
        // 人员信息进时间
        startDatePeopleOpt: {},
        endDatePeopleOpt: {},
        rules: {
          departName: [{ required: true, message: '请选择部门', trigger: 'change' }],
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' },
            { max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          idCard: [{ validator: (rule, value, callback) => {
            if (this.isIDCard(value) || !value) {
              callback()
            } else {
              callback(new Error('请输入合法的身份证号'))
            }
          }, trigger: 'blur' }],
          levelId: [{ max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
          nationId: [{ max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
          addressShort: [{ max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
          companyName: [{ required: true, message: '请选择单位', trigger: 'change' }],
          typeId: [{ required: true, message: '请选择人员类型', trigger: 'change' }],
          isAccess: [{ required: true, message: '请选择是否参与考核', trigger: 'change' }],
          birthAddress: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          healthMsg: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          marriageMsg: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          politicalOutlook: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          administrativeDuties: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          major: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          degree: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          grade: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          organization: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          jobCategory: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          classify: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          post: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          appointment: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          servingAsPresident: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          addWorkYear: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          minusWorkYear: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          companyResource: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          preCompany: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          preDuty: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          preLevel: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          civilServiceRank: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          serviceBeforeCompany: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          degreeId: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
          hcLeaveReason: [{ max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
        },
        // 部门结构
        departData: [],
        accordion: true,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        companyProps: {
          children: 'children',
          label: 'label'
        },
        // 性别
        sexMap: this.fd.tools.mapSelects('k10012'),
        // 人员类型
        typeMap: this.fd.tools.mapSelects('k10003'),
        // 考核
        checkMap: this.fd.tools.mapSelects('k10004'),
        // 进入途径
        resourceMap: this.fd.tools.mapSelects('k10005'),
        // 法律职务
        workMap: this.fd.tools.mapSelects('k10009'),
        // 部门正副职
        chairMap: this.fd.tools.mapSelects('k10010'),
        // 民族
        nationMap: this.fd.tools.mapSelects('1001'),
        // 等级
        judgeLevelMap: this.fd.tools.mapSelects('k10011'),
        // 正式干警
        officePoliceMap: this.fd.tools.mapSelects('k10038'),
        treeDepart: []
      }
    },
    computed: {
      elements() {
        return this.$store.getters.elements.personal || {}
      },
      actionPath() {
        return process.env.BASE_API + window.config.project_url + 'api/staff/importExcel'
      },
      // 性别
      sex() {
        return this.$store.getters.selects['k10012']
      },
      // 人员类别
      types() {
        return this.$store.getters.selects['k10003']
      },
      // 参与考核
      check() {
        return this.$store.getters.selects['k10004']
      },
      // 进入途径
      resource() {
        return this.$store.getters.selects['k10005']
      },
      // 法律职务
      work() {
        return this.$store.getters.selects['k10009']
      },
      // 民族
      nation() {
        return this.$store.getters.selects['1001']
      },
      // 职级
      // level() {
      //   return this.$store.getters.selects['职级']
      // },
      // 等级
      judgeLevel() {
        return this.$store.getters.selects['k10011']
      },
      departs() {
        return this.fd.data.changeToTree(this.$store.getters.allCourt, 'id', 'parentId')
      },
      // 部门正副职
      chair() {
        return this.$store.getters.selects['k10010']
      },
      // 正式干警
      officialPoliceCheck() {
        return this.$store.getters.selects['k10038']
      }
    },
    mounted() {
      this.userInfo = this.fd.tools.merge(true, {}, this.userMsg)
      this.getUserPhoto()
      this.getDepartData()
    },
    methods: {
      companyNodeClick, personNodeClick, isIDCard, seeCadres, printCadres, downloadCadres,
      saveBasicInfo, editBasicInfo, cancelBasicInfo, getBasicInfo,
      getDepartData, resetForm, getDepartMembers, getUserPhoto, getLeaderPhoto,
      changeStartPeo, changeEndPeo
    },
    watch: {
      departData(data) {
        this.treeDepart = this.fd.data.changeToTree(data, 'id', 'pid')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .img-size{
    width: 1000px;
    height: auto;
    padding: 0;
    margin: 0;
  }
  .img-box{
    left: 16px;
    top: 16px;
    width: 143px;
    height: 200px;
    position: absolute;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 2;
  }
  .basic-row{
    .el-row{
      line-height: 40px;
    }
    .el-row:nth-child(2n){
      background-color: #fafafa;
    }
  }
  .label-left{
    padding-left: 16px;
  }

</style>
<style lang="scss">
  .label-long .el-form-item__label{
    line-height: 20px;
  }
  .cadres{
    .el-dialog__header{
      text-align:center;
      height: 55px;
      line-height: 30px;
    }
    .el-dialog__body {
       padding:0;
       color:#000;
     }
    .title-button{
      top: -8px;
      left: 40px;
    }
  }
</style>
