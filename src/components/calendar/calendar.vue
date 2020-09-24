<template>
  <div class="fd-calendar-box bd">
    <div v-if="showMonth">
      <div class="t-center p2 bg bd-bottom">
        <div class="inline-block relative" style="width: 200px">
          <span class="fd-calendar-arrow left-0" @click="changeMonths(months.month, prevMonth)">
            <i class="at icon-left"/>
          </span>
          <span class="title h18">{{months.month | parseTime("{y}-{m}")}}</span>
          <span class="fd-calendar-arrow right-0" @click="changeMonths(months.month, nextMonth)">
            <i class="at icon-right"/>
          </span>
        </div>
      </div>
      <div class="t-center bd-bottom" style="height: 48px;">
        <div v-for="(item, index) in week" class="p2 f-left" :style="{'width':(index%7 === 0 ?'16%':'14%')}">{{item}}</div>
      </div>
      <div class="t-center">
        <div v-for="(item, index) in months.days"
             @click="selectOneDay(item)"
             :class="'fd-calendar-day bd-bottom p2 relative '+
             (index%7 === 0 ?'':'bd-left') +
             (parseTime(item,'{y}-{m}') === months.month ? '':' color-forbid') +
             (today.getTime() === item.getTime()?' today':'')"
             :style="{'width':(index%7 === 0 ?'16%':'14%')}">
          {{item | parseTime("{d}")}}
          <div v-html="showNotices(item)"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="t-center p2 bg bd-bottom relative">
        <span class="pointer absolute px3 left-0" @click="showMonths">
          <i class="at icon-calendar"/>日历
        </span>
        <span class="title h18">{{weeks.day | parseTime("{y}-{m}")}}</span>
      </div>
      <div class="px2 relative bd-bottom">
        <span class="fd-calendar-arrow left-0" @click="changeWeeks(weeks.day, prevWeeks)">
          <i class="at icon-left"/>
        </span>
        <div style="height: 80px;">
          <div v-for="item in weeks.weeks"
               @click="selectWeekDay(item)"
               :class="'fd-calendar-day weekday'+(today.getTime() === item.getTime()?' today':'')">
            <div>周{{item | parseTime("{a}")}}</div>
            <div :class="'fd-calendar-weekday'+(time.getTime() === item.getTime() ?' select':'')">
              {{item | parseTime("{d}")}}
              <div v-html="showNotices(item)"></div>
            </div>
          </div>
        </div>
        <span class="fd-calendar-arrow right-0" @click="changeWeeks(weeks.day, nextWeeks)">
          <i class="at icon-right"/>
        </span>
      </div>
      <div class="px3 py2 auto" style="height: 260px">
        <slot name="notice" slot-data="option.data" ></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getMonths,
    getWeeks,
    getToday,
    prevMonth,
    nextMonth,
    prevWeeks,
    nextWeeks } from './date'
  import { parseTime } from '@/utils/filters'
  export default {
    name: 'FdCalendar',
    components: {},
    props: {
      getNoticeCount: {
        type: Function
      },
      getNoticeDetail: {
        type: Function
      },
      daysMap: {
        type: Object
      }
    },
    data() {
      return {
        today: this.getToday(),
        time: this.getToday(),
        showMonth: false,
        weeks: {
          day: '',
          weeks: []
        },
        months: {
          month: '',
          days: []
        },
        week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    },
    computed: {},
    mounted() {
      this.weeks = this.getWeeks()
      this.getNoticeCount(this.weeks.weeks)
      this.getNoticeDetail(parseTime(this.today, '{y}-{m}-{d}'))
    },
    watch: {

    },
    methods: {
      changeWeeks(day, fun) {
        this.weeks = fun(day)
        this.getNoticeCount(this.weeks.weeks)
      },
      changeMonths(day, fun) {
        this.months = fun(day)
        this.getNoticeCount(this.months.days)
      },
      showNotices(item) {
        const color = this.daysMap[this.parseTime(item, '{y}-{m}-{d}')]
        return '<div class="fd-calendar-notice ' + color + '"></div>'
      },
      showMonths() {
        this.showMonth = true
        this.months = this.getMonths(this.weeks.day)
        this.getNoticeCount(this.months.days)
      },
      selectOneDay(item) {
        this.showMonth = false
        this.weeks = this.getWeeks(item)
        this.selectWeekDay(item)
      },
      selectWeekDay(item) {
        this.time = item
        this.getNoticeDetail(item)
      },
      getMonths,
      getWeeks,
      getToday,
      prevMonth,
      nextMonth,
      prevWeeks,
      nextWeeks,
      parseTime
    }
  }
</script>

<style>
  .fd-calendar-box{
    height:394px;
    width: 100%;
    font-size: 14px;
  }
  .fd-calendar-day{
    text-align: center;
    float: left;
    width: 14%;
    cursor: pointer;
  }
  .fd-calendar-day.weekday{
    padding: 1rem 0.5rem;
    height: 80px;
  }
  .fd-calendar-day.today{
    color: #1b95e7;
    font-weight: 600;
  }
  .fd-calendar-day:hover{
    background-color: #f5f5f5;
  }
  .fd-calendar-arrow{
    position: absolute;
    top:50%;
    margin-top: -7px;
    cursor: pointer;
  }
  .fd-calendar-arrow:hover{
    color: #177dc9;
  }
  .fd-calendar-notice{
    width: 4px;
    height: 4px;
    border-radius: 15px;
    position: absolute;
    bottom: 3px;
    left: 46%;
  }
  .fd-calendar-weekday{
    display: inline-block;
    margin-top: 10px;
    padding: 8px;
    width: 30px;
    height: 30px;
    font-size: 12px;
    position: relative;
    border-radius: 30px;
  }
  .fd-calendar-weekday.select{
    background-color: #1b95e7;
    color: #fff;
  }
</style>

