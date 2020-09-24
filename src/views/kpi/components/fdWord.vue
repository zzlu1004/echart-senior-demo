<template>
<div class="fd-word">
  <div class="fd-menu-table">
    <h1 class="table-tit">干 部 任 免 审 批 表</h1>
    <div class="table-fa">
      <table class="table-class">
        <tbody>
        <!--撑开14列-->
        <tr style="height: 0">
          <td style="max-width: 35px"></td>
          <td style="max-width: 35px"></td>
          <td style="max-width: 40px"></td>
          <td style="max-width: 40px"></td>
          <td style="max-width: 40px"></td>
          <td style="max-width: 45px"></td>
          <td style="max-width: 45px"></td>
          <td style="max-width: 45px"></td>
          <td style="max-width: 50px"></td>
          <td style="max-width: 45px"></td>
          <td style="max-width: 45px"></td>
          <td style="max-width: 45px"></td>
          <td style="max-width: 55px"></td>
          <td style="max-width: 65px"></td>
        </tr>
        <tr>
          <td :colspan="2" class="text-justify">姓名</td>
          <td :colspan="2" class="center">{{data.name ||'&nbsp;&nbsp;&nbsp;'}}</td>
          <td :colspan="2" class="text-justify">性别</td>
          <td :colspan="2" class="center">{{data.sex ||'&nbsp;&nbsp;&nbsp;'}}</td>
          <td :colspan="2" class="text-justify" style="padding-top:7px ">
            <div>出生年月</div>
            <div class="mt1">（岁）</div>
          </td>
          <td :colspan="2" class="center">
            <div>{{data.birthday ||'&nbsp;&nbsp;&nbsp;&nbsp;'}}</div>
            <div class="mt1">{{data.age ||'&nbsp;&nbsp;&nbsp;&nbsp;'}}</div>
          </td>
          <td :colspan="2" :rowspan="4">
            <img v-if="data.avatar" class="img-box" :src="data.avatar ||' '"/>
            <div v-else class="img-box">&nbsp;</div>
            <!-- <div class="img-box" :style="{ backgroundImage:'url('+(data.avatar || '')+')' }"></div> -->
          </td>
        </tr>
        <tr>
          <td :colspan="2" class="text-justify">民族</td>
          <td :colspan="2" class="center">{{data.nation ||'&nbsp;&nbsp;&nbsp;'}}</td>
          <td :colspan="2" class="text-justify">籍贯</td>
          <td :colspan="2" class="center">{{data.nativePlace ||'&nbsp;&nbsp;&nbsp;'}}</td>
          <td :colspan="2" class="text-justify">出生地</td>
          <td :colspan="2" class="center">{{data.birthPlace ||'&nbsp;&nbsp;&nbsp;'}}</td>
        </tr>
        <tr>
          <td :colspan="2" class="text-justify ">入党 时间</td>
          <td :colspan="2" class="center">{{data.partyTime ||'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}}</td>
          <td :colspan="2" class="text-justify text-double3">参加工作时间</td>
          <td :colspan="2" class="center">{{data.startWorkTime ||'&nbsp;'}}</td>
          <td :colspan="2" class="text-justify health-cla" >健康状况</td>
          <td :colspan="2" >{{data.healthStatus ||'&nbsp;'}}</td>
        </tr>
        <tr>
          <td :colspan="2" class="text-justify">专业技术职务</td>
          <td :colspan="4" class="center">&nbsp; </td>
          <td  :colspan="2" class="text-justify text-double4 long-cla" >熟悉专业有何专长</td>
          <td :colspan="4" class="center"> &nbsp;</td>
        </tr>
        <tr>
          <td :colspan="2" :rowspan="2" class="text-justify" >学历 学位</td>
          <td :colspan="2" class="text-justify text-double3">全日制教育</td>
          <td :colspan="4" class="center">
            <div>{{data.fulltimeEdu ||'&nbsp;'}}</div>
            <div class="mt1">{{data.fulltimeDegree ||'&nbsp;'}}</div>
          </td>
          <td :colspan="2" class="text-justify">毕业院校系及专业</td>
          <td :colspan="4">{{data.school ||'&nbsp;'}}</td>
        </tr>
        <tr>
          <td :colspan="2" class="text-justify text-double6">在职 教育</td>
          <td :colspan="4" class="center">
            <div>{{data.inServiceEdu ||'&nbsp;'}}</div>
            <div class="mt1">{{data.inServiceDegree ||'&nbsp;'}}</div>
          </td>
          <td :colspan="2" class="text-justify">毕业院校系及专业</td>
          <td :colspan="4">{{data.inServiceSchool ||'&nbsp;'}}</td>
        </tr>
        <tr>
          <td :colspan="4" class="text-justify">现任职务</td>
          <td :colspan="10">{{data.presentOccupation ||'&nbsp;'}}</td>
        </tr>
        <tr>
          <td :colspan="4" class="text-justify">拟任职务</td>
          <td :colspan="10">&nbsp;</td>
        </tr>
        <tr>
          <td :colspan="4" class="text-justify">拟免职务</td>
          <td :colspan="10">&nbsp;</td>
        </tr>
        <tr>
          <td :colspan="1" class="text-justify">简<br><br><br><br><br><br><br><br><br>历</td>
          <td :colspan="13" style="height: 550px; padding-top: 10px;vertical-align: top" >
            <div class="height-panel" style="vertical-align: top">
              <div v-for="item of data.resumes" :key="item" class="mb2 jianli-height" >
                <div style="float: left;width: 26%">{{item.startDate ||'--'}}—{{item.endDate ||'--'}}</div>
                <div style="float: left;width: 74%">{{item.companyName}}{{item.departName}}{{item.level}}{{item.position}}<br/>{{item.comments}}</div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td  class="text-justify" style="width: 20px">奖惩情况</td>
          <td :colspan="13">
            <div class="height-panel">&nbsp;</div>
          </td>
        </tr>
        <tr>
          <td :colspan="1" class="text-justify text-double shupai"  >年度考核结果</td>
          <td :colspan="13">
            <div class="height-panel">&nbsp;</div>
          </td>
        </tr>
        <tr>
          <td :colspan="1" class="text-justify">任免理由</td>
          <td :colspan="13">
            <div class="height-panel">&nbsp;</div>
          </td>
        </tr>
        <tr>
          <td :colspan="1" :rowspan="8" class="text-justify">家庭主要成员及重要社会关系</td>
          <td :colspan="2" class="text-justify">称谓</td>
          <td :colspan="2" class="text-justify">姓名</td>
          <td :colspan="1" class="text-justify">年龄</td>
          <td :colspan="2" class="text-justify text-double6">政治 面貌</td>
          <td :colspan="6" style="text-align: center;letter-spacing: 10px">工作单位及职务</td>
        </tr>
        <tr v-for="item of data.families" :key="item.id">
          <td :colspan="2" class="center" style="padding: 4px 4px">{{item.relationship||'&nbsp;'}}</td>
          <td :colspan="2" class="center" style="padding: 4px 4px">{{item.name||'&nbsp;'}}</td>
          <td :colspan="1" class="center" style="padding: 4px 4px">{{item.age||'&nbsp;'}}</td>
          <td :colspan="2" class="center" style="padding: 4px 4px">{{item.politicalStatus||'&nbsp;'}}</td>
          <td :colspan="6" style="padding: 4px 4px">{{item.companyName||'&nbsp;'}}</td>
        </tr>
        <tr>
          <td :colspan="1" class="text-justify" style="height: 80px">呈报 单位</td>
          <td :colspan="13">
            <div class="height-panel">&nbsp;</div>
            <div class="right-align">年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日</div>
          </td>
        </tr>
        <tr>
          <td :colspan="1" class="text-justify text-double" style="height: 130px">审批机关意见</td>
          <td :colspan="7">
            <div class="height-panel">&nbsp;</div>
            <div class="right-align pb1">（ 盖章 ）</div>
            <div class="right-align">年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日</div>
          </td>
          <td :colspan="1"  class="text-justify text-double2 text-double4" style="height: 130px">行政机关任免意见</td>
          <td :colspan="5">
            <div class="height-panel">&nbsp;</div>
            <div class="right-align pb1">（ 盖章 ）</div>
            <div class="right-align">年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="pl4 py2">填表人：</div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'fdWord',
    components: {},
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        photo: '',
        wordObj: []
      }
    },
    computed: {},
    mounted() {
    },
    methods: {
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>
  .text-double6{
    padding: 4px 6px!important;
    letter-spacing:4px;
  }
  .fd-word {
    .height-panel{
      min-height: 100px;
    }
    .fd-menu-table td{
      width:45px;
      font-size: 18px;
      font-family: '宋体';
      /*text-align: center;*/
    }
    .img-box{
      margin: 0 auto;
      display: inline-block;
      height: 120px!important;
      width: 120px!important;
    }
    .fd-menu-table td, .fd-menu-table th {
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
      padding: 4px 7px;
    }
    .fd-menu-table .text-justify{
      text-align-last:justify;
      text-align:justify;
      text-justify:distribute-all-lines;
    }
    .mb2{
      font-size: 16px;
    }
    .title-hide{
      display:none;
    }
  }
  /*.fd-menu-table thead, .fd-menu-table table {*/
    /*border-top: 2px solid #000;*/
    /*border-left: 2px solid #000;*/
    /*border-bottom: 2px solid #000;*/
    /*border-right: 1px solid #000;*/
  /*}*/
  .table-fa{
    width: 100%;
    border: 2px solid #000;
    height: auto;
    overflow: hidden;
  }
  .table-tit{
    text-align: center;
    font-weight: 500;
    font-family: '宋体';
    font-size: 30px;
  }
  .table-class{
    width: 100%;
    margin-top: -10px;
  }
  .text-double{
    padding: 0!important;
    letter-spacing:-1px;
  }
  .text-double4{
    letter-spacing:-3px;
  }
  /*.text-double5{*/
    /*letter-spacing:10px;*/
  /*}*/
  .health-cla{
    min-width: 94px!important;
  }
  .long-cla{
    width: 90px
  }
  .jianli-height{
    width: 100%;
    height: auto;
    line-height: 20px;
    overflow: hidden;
    margin-bottom: 2px;
  }
  .shupai{
    writing-mode: vertical-lr!important;
    -webkit-writing-mode: vertical-lr!important;
    -ms-writing-mode: vertical-lr!important;
  }

</style>

