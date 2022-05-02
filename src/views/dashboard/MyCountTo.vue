<template>
  <div class="count-to-panel" @click="countToClick(countTitle)">
    <div class="count-to-content">
      <div class="count-to-title">
        {{ countTitle }}
      </div>
      <count-to
        :start-val="startVal"
        :end-val="endVal"
        :duration="duration"
        class="count-to-num"
      />
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  name: 'MyCountTo',
  components: { CountTo },
  props: {
    startVal: {
      type: Number,
      default: 0
    },
    endVal: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 3000
    },
    countTitle: {
      type: String,
      default: '计数'
    }
  },
  methods: {
    countToClick(countTitle) {
      this.$emit('click', countTitle)
    }
  }
}
</script>

<style lang="scss" scoped>
div:active {
  background-color: black;
}
.count-to-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);

  .count-to-content {
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;
    text-align: center;

    .count-to-title {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }

    .count-to-num {
      font-size: 20px;
    }
  }
}
</style>
