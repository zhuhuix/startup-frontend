<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div> -->

    <my-line-chart :option="lineChartOption" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MyLineChart from '@/components/Echarts/MyLineChart'

export default {
  name: 'Dashboard',
  components: { MyLineChart },
  data() {
    return {
      lineChartOption: {
        xAxis: {
          name: '日期',
          data: ['4/1', '4/2', '4/3', '4/4', '4/5', '4/6', '4/7', '4/8', '4/9', '4/10', '4/11', '4/12', '4/13', '4/14', '4/15', '4/16'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          name: '人数',
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['新增本土']
        },
        series: [{
          name: '新增本土', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: [12, 5, 10, 7, 3, 3, 13, 5, 7, 14, 4, 3, 2, 4, 2, 7],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
