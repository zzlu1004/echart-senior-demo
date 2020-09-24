<template>
  <div class="fd-calendar-box">
    <div>
      <div class="t-center p3">
        <div class="inline-block relative h20" style="width: 100%">
          <span class="fd-calendar-arrow left-4" @click="changeMonths(months.month, prevMonth)">
            <i class="at icon-left"/>
          </span>
          <span>{{months.month | parseTime("{y}年{m}月")}}</span>
          <span class="fd-calendar-arrow right-4" @click="changeMonths(months.month, nextMonth)">
            <i class="at icon-right"/>
          </span>
        </div>
      </div>
      <div class="t-center" style="height: 48px;">
        <div class="f-left" style="width: 4.5%">&nbsp;</div>
        <div v-for="(item, index) in week" class="p2 f-left"
             style="width:13%">{{item}}</div>
        <div class="f-left" style="width: 4.5%">&nbsp;</div>
      </div>
      <div class="t-center">
        <div v-for="(item, index) in months.days"
             :class="'fd-calendar-day relative '+
             isInTimeRange(item) +
             (parseTime(item,'{y}-{m}') === months.month ? '':' color-forbid') +
             (today.getTime() === item.getTime()?' today':'')"
             :style="index%7 === 6 ? {marginRight: '4.5%'} : (index%7 === 0 ? {marginLeft: '4.5%'} : '')">
          <span class="inline-block">{{item | parseTime("{d}")}}</span>
        </div>
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
    nextWeeks } from 'fd/calendar/date'
  import { parseTime } from '@/utils/filters'
  export default {
    name: 'FdCalendar',
    components: {},
    props: {
      dateRange: {
        type: Array
      }
    },
    data() {
      return {
        today: this.getToday(),
        time: this.getToday(),
        weeks: {
          day: '',
          weeks: []
        },
        months: {
          month: '',
          days: []
        },
        week: ['一', '二', '三', '四', '五', '六', '日']
      }
    },
    computed: {},
    mounted() {
      this.months = this.getMonths()
    },
    watch: {

    },
    methods: {
      changeWeeks(day, fun) {
        this.weeks = fun(day)
      },
      changeMonths(day, fun) {
        this.months = fun(day)
      },
      showMonths() {
        this.showMonth = true
        this.months = this.getMonths(this.weeks.day)
      },
      selectOneDay(item) {
        this.showMonth = false
        this.weeks = this.getWeeks(item)
        this.selectWeekDay(item)
      },
      selectWeekDay(item) {
        this.time = item
      },
      isInTimeRange(date) {
        const time = date.getTime()
        if (this.dateRange.length === 0) {
          return ''
        }
        const start = new Date(this.dateRange[0]).getTime()
        const end = new Date(this.dateRange[1]).getTime()
        if (time === start) {
          return 'start-timerange'
        } else if (time === end) {
          return 'end-timerange'
        } else if (time > start && time < end) {
          return 'in-timerange'
        }
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
    height:440px;
    width: 100%;
    font-size: 14px;
    background-color: #6f7ad5;
    color: #fff;
  }
  .fd-calendar-day{
    text-align: center;
    float: left;
    width: 13%;
    cursor: pointer;
    margin: 8px 0;
    padding: 2px 10px;
  }
  .fd-calendar-day span{
    height:30px;
    width: 30px;
    padding: 7px 0;
  }
  .in-timerange{
    background-color: #636cbf;
  }
  .start-timerange{
    background-color: #636cbf;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
  }
  .end-timerange{
    background-color: #636cbf;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
  }
  .fd-calendar-day.weekday{
    padding: 1rem 0.5rem;
    height: 80px;
  }
  .fd-calendar-day.today span{
    color: #646dbf;
    font-weight: 600;
    background-color: #ffbf00;
    border-radius: 100px;
  }
  .fd-calendar-arrow{
    position: absolute;
    top:50%;
    margin-top: -10px;
    cursor: pointer;
  }
</style>

