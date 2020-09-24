<template>
    <div class="tag-container">
      <div class="total-data-item" v-for="tag in tagData" v-bind:style="{ height: tag.thirdContent !== undefined ? '100px' : '80px' }">
        <p v-bind:style="{ fontSize: tag.fontSize + 'px' }">{{tag.title}}</p>
        <p>
          <span v-bind:style="{ fontSize: tag.secondContent.totalFontSize + 'px' }">{{tag.secondContent.total}}</span>&nbsp;
          <span v-bind:style="{ fontSize: tag.secondContent.otherFontSize + 'px' }">{{tag.secondContent.unit}}</span>&nbsp;&nbsp;
          <span v-bind:style="{ fontSize: tag.secondContent.otherFontSize + 'px' }">{{tag.secondContent.statistics}}&nbsp;</span>
          <span v-bind:style="{ fontSize: tag.secondContent.otherFontSize + 'px', color: tag.secondContent.color  }">{{tag.secondContent.percent}}</span>
        </p>
        <p v-if="tag.thirdContent !== undefined">
          <span v-bind:style="{ fontSize: tag.thirdContent.otherFontSize + 'px' }">{{tag.thirdContent.statistics}}&nbsp;</span>
          <span v-bind:style="{ fontSize: tag.thirdContent.otherFontSize + 'px', color: tag.thirdContent.color }">{{tag.thirdContent.percent}}</span>
        </p>
      </div>
      <!--<div class="total-data-item">
        <p class="font22">安徽省高级人民法院</p>
        <p class="font22"><span class="font32">418</span>&nbsp;
          <span class="font18">人&nbsp;&nbsp;占比&nbsp;36%</span>
        </p>
      </div>
      <div class="total-data-item">
        <p class="font22">安徽省高级人民法院</p>
        <p class="font22">
          <span class="font32">418</span>&nbsp;
          <span class="font18">人&nbsp;&nbsp;&nbsp;占比&nbsp;&nbsp;36%</span>
        </p>

      </div>-->
    </div>
</template>

<script>
    export default {
      name: 'fdtag',
      data() {
        return {
          // tags: [
          //   {
          //     title: '安徽省高级人民法院',
          //     fontSize: '22',
          //     secondContent: {
          //       total: 148,
          //       totalFontSize: '32',
          //       unit: '人',
          //       otherFontSize: '18',
          //       statistics: '占比',
          //       percent: '36%',
          //       color: '#ff0071'
          //     },
          //     thirdContent: {
          //       statistics: '占比',
          //       percent: '36%',
          //       otherFontSize: '18',
          //       color: '#ffffff'
          //     }
          //   },
          //   {
          //     title: '安徽省高级人民法院2',
          //     fontSize: '22',
          //     secondContent: {
          //       total: 148,
          //       totalFontSize: '32',
          //       unit: '人',
          //       otherFontSize: '18',
          //       statistics: '占比',
          //       percent: '36%',
          //       color: '#2cd78e'
          //     }
          //   },
          //   {
          //     title: '安徽省高级人民法院3',
          //     fontSize: '22',
          //     secondContent: {
          //       total: 148,
          //       totalFontSize: '32',
          //       unit: '人',
          //       otherFontSize: '18',
          //       statistics: '占比',
          //       percent: '36%'
          //     }
          //   }
          // ]

        }
      },
      props: {
        tagData: {
          type: Array,
          default() {
            return []
          }
        }
      }
    }
</script>

<style scoped lang="scss">
  .tag-container {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .total-data-item {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    padding-left: 15px;
    height: 80px;
    border-left: 6px solid #4461ea;

    p {
      margin: 0;
      padding: 0;
      /*line-height: 40px;*/
    }
  }

  .font22 {
    font-size: 22px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #e5f3ff;
  }

  .font32 {
    font-size: 32px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 25px;
    letter-spacing: 0px;
    color: #e5f3ff;
  }
  .font18 {
    font-size: 18px;
  }
</style>
