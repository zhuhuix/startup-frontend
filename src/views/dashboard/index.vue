<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div> -->
    <el-row :gutter="36">
      <el-col :xs="12" :sm="8" :lg="8">
        <my-count-to :start-val="0" :end-val="101" :duration="3000" :count-title="'江苏'" @click="setLineChartData" />
      </el-col>
      <el-col :xs="12" :sm="8" :lg="8">
        <my-count-to :start-val="0" :end-val="43" :duration="3000" :count-title="'浙江'" @click="setLineChartData" />
      </el-col>
      <el-col :xs="12" :sm="8" :lg="8">
        <my-count-to :start-val="0" :end-val="11149" :duration="3000" :count-title="'上海'" @click="setLineChartData" />
      </el-col>
    </el-row>
    <my-line-chart v-if="option!=null" :option="option" />

  </div>
</template>

<script>
import MyLineChart from '@/components/Echarts/MyLineChart'
import MyCountTo from './MyCountTo.vue'

export default {
  name: 'Dashboard',
  components: { MyLineChart, MyCountTo },
  data() {
    return {
      option: null,
      lineChartOption1: {
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
      },
      lineChartOption2: {
        xAxis: {
          name: '日期',
          data: ['4/20', '4/21', '4/22', '4/23'],
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
              color: '#00FF60',
              lineStyle: {
                color: '#00FF60',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: [6, 15, 10, 12],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      },
      lineChartOption3: {
        xAxis: {
          name: '日期',
          data: ['4/26', '4/27', '4/28', '4/29', '4/30', '5/01'],
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
              color: '#000000',
              lineStyle: {
                color: '#000000',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: [1606, 1292, 5487, 1249, 788, 727],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
    }
  },

  methods: {
    setLineChartData(countTitle) {
      switch (countTitle) {
        case '江苏':
          this.option = this.lineChartOption1
          break
        case '浙江':
          this.option = this.lineChartOption2
          break
        case '上海':
          this.option = this.lineChartOption3
          break
      }
    }
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
