<template>
  <div ref="myChart" :style="{height:height,width:width,margin:margin}" />
</template>

<script>
import echarts from 'echarts'
import debounce from 'lodash/debounce'
import { addListener, removeListener } from 'resize-detector'

const Count = 0

export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    margin: {
      type: String,
      default: '0px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null,
      resizeCount: Count
    }
  },
  watch: {
    option: {
      deep: true,
      handler(val) {
        this.chart.setOption(val)
      }
    }
  },
  created() {
    // 防抖处理
    this.resize = debounce(this.resize, 300)
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    removeListener(this.$refs.myChart, this.resize)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.myChart)
      addListener(this.$refs.myChart, this.resize)
      this.chart.setOption(this.option)
    },

    resize() {
      console.log('resize', ++this.resizeCount)
      this.chart.resize()
    }
  }
}
</script>

