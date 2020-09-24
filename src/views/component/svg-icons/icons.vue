<template>
  <div class="icons-container">
    <p class="warn-content">
      <a href="https://panjiachen.github.io/vue-element-admin-site/#/icon" target="_blank">
        添加和使用方式: 下载svg图，保存在sqc/icons/svg目录下，className为文件名
      </a>
    </p>
    <div class="icons-wrapper f-left full">
      <div v-for="item of iconsMap" :key="item" @click="handleClipboard(generateIconCode(item),$event)">
        <el-tooltip placement="top">
          <div slot="content">
            {{generateIconCode(item)}}
          </div>
          <div class="icon-item">
            <svg-icon :icon-class="item" />
          </div>
          <div>
            {{generateIconCode(item)}}
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="f-left full">
      <div>引入字体文件的iconFont</div>
      <div v-for="item of fonts" :key="item.icons"  @click="handleClipboard(generateIconFont(item),$event)">
        <el-tooltip placement="top">
          <div slot="content">
            {{generateIconFont(item)}}
          </div>
          <div class="icon-item">
            <i :class="'at '+item.icons" />
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './generateIconsView'
import clipboard from '@/utils/clipboard'

export default {
  components: {}, name: 'icons',
  data() {
    return {
      iconsMap: [],
      fonts: [{ icons: 'icon-stepforward' },
        { icons: 'icon-stepbackward' },
        { icons: 'icon-forward' },
        { icons: 'icon-banckward' },
        { icons: 'icon-caretright' },
        { icons: 'icon-caretleft' },
        { icons: 'icon-caretdown' },
        { icons: 'icon-caretup' },
        { icons: 'icon-rightcircle' },
        { icons: 'icon-leftcircle' },
        { icons: 'icon-upcircle' },
        { icons: 'icon-downcircle' },
        { icons: 'icon-rightcircleo' },
        { icons: 'icon-leftcircleo' },
        { icons: 'icon-upcircleo' },
        { icons: 'icon-downcircleo' },
        { icons: 'icon-verticleleft' },
        { icons: 'icon-verticleright' },
        { icons: 'icon-back' },
        { icons: 'icon-retweet' },
        { icons: 'icon-shrink' },
        { icons: 'icon-arrowsalt' },
        { icons: 'icon-doubleright' },
        { icons: 'icon-doubleleft' },
        { icons: 'icon-arrowdown' },
        { icons: 'icon-arrowup' },
        { icons: 'icon-arrowright' },
        { icons: 'icon-arrowleft' },
        { icons: 'icon-down' },
        { icons: 'icon-up' },
        { icons: 'icon-right' },
        { icons: 'icon-left' },
        { icons: 'icon-minussquareo' },
        { icons: 'icon-minuscircle' },
        { icons: 'icon-minuscircleo' },
        { icons: 'icon-minus' },
        { icons: 'icon-pluscircleo' },
        { icons: 'icon-pluscircle' },
        { icons: 'icon-plus' },
        { icons: 'icon-infocirlce' },
        { icons: 'icon-infocirlceo' },
        { icons: 'icon-info' },
        { icons: 'icon-exclamation' },
        { icons: 'icon-exclamationcircle' },
        { icons: 'icon-exclamationcircleo' },
        { icons: 'icon-closecircle' },
        { icons: 'icon-closecircleo' },
        { icons: 'icon-checkcircle' },
        { icons: 'icon-checkcircleo' },
        { icons: 'icon-check' },
        { icons: 'icon-close' },
        { icons: 'icon-customerservice' },
        { icons: 'icon-creditcard' },
        { icons: 'icon-codesquareo' },
        { icons: 'icon-book' },
        { icons: 'icon-barschart' },
        { icons: 'icon-bars' },
        { icons: 'icon-question' },
        { icons: 'icon-questioncircle' },
        { icons: 'icon-questioncircleo' },
        { icons: 'icon-pause' },
        { icons: 'icon-pausecircle' },
        { icons: 'icon-pausecircleo' },
        { icons: 'icon-clockcircle' },
        { icons: 'icon-clockcircleo' },
        { icons: 'icon-swap' },
        { icons: 'icon-swapleft' },
        { icons: 'icon-swapright' },
        { icons: 'icon-plussquareo' },
        { icons: 'icon-frown' },
        { icons: 'icon-menufold' },
        { icons: 'icon-mail' },
        { icons: 'icon-link' },
        { icons: 'icon-areachart' },
        { icons: 'icon-linechart' },
        { icons: 'icon-home' },
        { icons: 'icon-laptop' },
        { icons: 'icon-star' },
        { icons: 'icon-staro' },
        { icons: 'icon-filter' },
        { icons: 'icon-meho' },
        { icons: 'icon-meh' },
        { icons: 'icon-shoppingcart' },
        { icons: 'icon-save' },
        { icons: 'icon-user' },
        { icons: 'icon-videocamera' },
        { icons: 'icon-totop' },
        { icons: 'icon-team' },
        { icons: 'icon-sharealt' },
        { icons: 'icon-setting' },
        { icons: 'icon-picture' },
        { icons: 'icon-phone' },
        { icons: 'icon-paperclip' },
        { icons: 'icon-notification' },
        { icons: 'icon-menuunfold' },
        { icons: 'icon-inbox' },
        { icons: 'icon-lock' },
        { icons: 'icon-qrcode' },
        { icons: 'icon-tags' },
        { icons: 'icon-tagso' },
        { icons: 'icon-cloudo' },
        { icons: 'icon-cloud' },
        { icons: 'icon-cloudupload' },
        { icons: 'icon-clouddownload' },
        { icons: 'icon-clouddownloado' },
        { icons: 'icon-clouduploado' },
        { icons: 'icon-enviroment' },
        { icons: 'icon-enviromento' },
        { icons: 'icon-eye' },
        { icons: 'icon-eyeo' },
        { icons: 'icon-camera' },
        { icons: 'icon-camerao' },
        { icons: 'icon-windows' },
        { icons: 'icon-export2' },
        { icons: 'icon-export' },
        { icons: 'icon-circledowno' },
        { icons: 'icon-circledown' },
        { icons: 'icon-hdd' },
        { icons: 'icon-ie' },
        { icons: 'icon-delete' },
        { icons: 'icon-enter' },
        { icons: 'icon-pushpino' },
        { icons: 'icon-pushpin' },
        { icons: 'icon-heart' },
        { icons: 'icon-hearto' },
        { icons: 'icon-smile-circle' },
        { icons: 'icon-smileo' },
        { icons: 'icon-frowno' },
        { icons: 'icon-calculator' },
        { icons: 'icon-chrome' },
        { icons: 'icon-github' },
        { icons: 'icon-iconfontdesktop' },
        { icons: 'icon-caretcircleoup' },
        { icons: 'icon-upload' },
        { icons: 'icon-download' },
        { icons: 'icon-piechart' },
        { icons: 'icon-lock1' },
        { icons: 'icon-unlock' },
        { icons: 'icon-windowso' },
        { icons: 'icon-dotchart' },
        { icons: 'icon-barchart' },
        { icons: 'icon-codesquare' },
        { icons: 'icon-plussquare' },
        { icons: 'icon-minussquare' },
        { icons: 'icon-closesquare' },
        { icons: 'icon-closesquareo' },
        { icons: 'icon-checksquare' },
        { icons: 'icon-checksquareo' },
        { icons: 'icon-fastbackward' },
        { icons: 'icon-fastforward' },
        { icons: 'icon-upsquare' },
        { icons: 'icon-downsquare' },
        { icons: 'icon-leftsquare' },
        { icons: 'icon-rightsquare' },
        { icons: 'icon-rightsquareo' },
        { icons: 'icon-leftsquareo' },
        { icons: 'icon-down-square-o' },
        { icons: 'icon-up-square-o' },
        { icons: 'icon-play' },
        { icons: 'icon-playcircleo' },
        { icons: 'icon-tag' },
        { icons: 'icon-tago' },
        { icons: 'icon-addfile' },
        { icons: 'icon-folder1' },
        { icons: 'icon-file1' },
        { icons: 'icon-switcher' },
        { icons: 'icon-addfolder' },
        { icons: 'icon-folderopen' },
        { icons: 'icon-search1' },
        { icons: 'icon-ellipsis1' },
        { icons: 'icon-calendar' },
        { icons: 'icon-filetext1' },
        { icons: 'icon-copy1' },
        { icons: 'icon-jpgfile1' },
        { icons: 'icon-pdffile1' },
        { icons: 'icon-exclefile1' },
        { icons: 'icon-pptfile1' },
        { icons: 'icon-unknowfile1' },
        { icons: 'icon-wordfile1' },
        { icons: 'icon-dingding' },
        { icons: 'icon-dingding-o' },
        { icons: 'icon-mobile1' },
        { icons: 'icon-tablet1' },
        { icons: 'icon-bells' },
        { icons: 'icon-disconnect' },
        { icons: 'icon-database' },
        { icons: 'icon-barcode' },
        { icons: 'icon-hourglass' },
        { icons: 'icon-key' },
        { icons: 'icon-flag' },
        { icons: 'icon-layout' },
        { icons: 'icon-printer' },
        { icons: 'icon-USB' },
        { icons: 'icon-skin' },
        { icons: 'icon-tool' },
        { icons: 'icon-car' },
        { icons: 'icon-addusergroup' },
        { icons: 'icon-carryout' },
        { icons: 'icon-deleteuser' },
        { icons: 'icon-deleteusergroup' },
        { icons: 'icon-man' },
        { icons: 'icon-isv' },
        { icons: 'icon-gift' },
        { icons: 'icon-idcard' },
        { icons: 'icon-medicinebox' },
        { icons: 'icon-redenvelopes' },
        { icons: 'icon-rest' },
        { icons: 'icon-Safety' },
        { icons: 'icon-wallet' },
        { icons: 'icon-woman' },
        { icons: 'icon-adduser' },
        { icons: 'icon-bank' },
        { icons: 'icon-Trophy' },
        { icons: 'icon-loading1' },
        { icons: 'icon-loading2' },
        { icons: 'icon-like2' },
        { icons: 'icon-dislike2' },
        { icons: 'icon-like1' },
        { icons: 'icon-dislike1' },
        { icons: 'icon-bulb1' },
        { icons: 'icon-rocket1' },
        { icons: 'icon-select1' },
        { icons: 'icon-apple1' },
        { icons: 'icon-apple-o' },
        { icons: 'icon-android1' },
        { icons: 'icon-android' },
        { icons: 'icon-aliwangwang-o1' },
        { icons: 'icon-aliwangwang' },
        { icons: 'icon-pay-circle1' },
        { icons: 'icon-pay-circle-o1' },
        { icons: 'icon-poweroff' },
        { icons: 'icon-trademark' },
        { icons: 'icon-find' },
        { icons: 'icon-copyright' },
        { icons: 'icon-sound' },
        { icons: 'icon-earth' },
        { icons: 'icon-wifi' },
        { icons: 'icon-sync' },
        { icons: 'icon-login' },
        { icons: 'icon-logout' },
        { icons: 'icon-reload1' },
        { icons: 'icon-message1' },
        { icons: 'icon-shake' },
        { icons: 'icon-API' },
        { icons: 'icon-appstore-o' },
        { icons: 'icon-appstore1' },
        { icons: 'icon-scan1' },
        { icons: 'icon-exception1' },
        { icons: 'icon-contacts' },
        { icons: 'icon-solution1' },
        { icons: 'icon-fork' },
        { icons: 'icon-edit' },
        { icons: 'icon-form' },
        { icons: 'icon-warning' },
        { icons: 'icon-table' },
        { icons: 'icon-profile' },
        { icons: 'icon-dashboard' },
        { icons: 'icon-indent-left' },
        { icons: 'icon-indent-right' },
        { icons: 'icon-menu-unfold' },
        { icons: 'icon-menu-fold' },
        { icons: 'icon-antdesign' },
        { icons: 'icon-alipay-square' },
        { icons: 'icon-codepen-circle' },
        { icons: 'icon-google' },
        { icons: 'icon-amazon' },
        { icons: 'icon-codepen' },
        { icons: 'icon-facebook-square' },
        { icons: 'icon-dropbox' },
        { icons: 'icon-googleplus' },
        { icons: 'icon-linkedin-square' },
        { icons: 'icon-medium-monogram' },
        { icons: 'icon-gitlab' },
        { icons: 'icon-medium-wordmark' },
        { icons: 'icon-QQ' },
        { icons: 'icon-skype' },
        { icons: 'icon-taobao-square' },
        { icons: 'icon-alipay-circle' },
        { icons: 'icon-youtube' },
        { icons: 'icon-wechat' },
        { icons: 'icon-twitter' },
        { icons: 'icon-weibo' },
        { icons: 'icon-HTML' },
        { icons: 'icon-taobao-circle' },
        { icons: 'icon-weibo-circle' },
        { icons: 'icon-weibo-square' },
        { icons: 'icon-CodeSandbox' },
        { icons: 'icon-aliyun' },
        { icons: 'icon-zhihu' },
        { icons: 'icon-behance' },
        { icons: 'icon-dribbble' },
        { icons: 'icon-dribbble-square' },
        { icons: 'icon-behance-square' },
        { icons: 'icon-file-markdown' },
        { icons: 'icon-instagram' },
        { icons: 'icon-yuque' },
        { icons: 'icon-slack' },
        { icons: 'icon-slack-square' }]
    }
  },
  mounted() {
    const iconsMap = icons.state.iconsMap.map((i) => {
      return i.default.id.split('-')[1]
    })
    this.iconsMap = iconsMap
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateIconFont(symbol) {
      return `<i class="at ${symbol.icons}"/>`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 20px;
    height: 50px;
    text-align: center;
    width: 50px;
    float: left;
    font-size: 40px;
    color: #24292e;
    cursor: pointer;
    i {
      font-size: 40px;
    }
  }
  span {
    display: block;
    font-size: 24px;
    margin-top: 10px;
  }
}
</style>
