<template>
  <div>
    <el-card class="el-card-d" shadow="always">
      <el-timeline infinite-scroll-disabled="disabled">
        <div v-if="pagemessages.length > 0">
          <el-timeline-item
            v-for="(item, index) in pagemessages"
            :key="index"
            :timestamp="item.createDate"
            placement="top"
          >
            <el-card class="el-card-m">
              <span class="el-card-m-content">{{ item.content }}</span>
              <div />
              <span class="el-card-m-nick-name">{{ item.nickName }} 提交于 {{ item.createTime }}</span>
            </el-card>
          </el-timeline-item>
        </div>
        <div v-else>
          <el-timeline-item placement="top">
            <el-card class="el-card-m">
              <p class="el-card-m-nick-name">  没有任何留言</p>
            </el-card>
          </el-timeline-item>
        </div>
      </el-timeline>
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pagesize"
        layout="prev, pager, next"
        :total="allmessages.length"
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
      />

    </el-card>
    <div class="el-card-messages">
      <el-input v-model="nickName" size="mini" class="message-nick-name">
        <template slot="prepend">昵称：</template>
      </el-input>
      <el-input
        slot="prepend"
        v-model="message"
        type="textarea"
        :rows="2"
        class="message-text"
        placeholder="输入留言"
        maxlength="200"
      />

      <el-button
        type="info"
        round
        class="submit-message"
        size="mini"
        @click="submitMessage"
      >留言</el-button>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      nickName: '',
      message: '',
      pagesize: 3,
      currentPage: 1,
      pagemessages: [],
      allmessages: []
    }
  },
  created() {
    this.doQuery()
  },
  methods: {
    // 模拟后台查询
    doQuery() {
      const start = (this.currentPage - 1) * this.pagesize
      const end = start + this.pagesize
      for (var i = start; i < end; i++) {
        if (i < this.allmessages.length) {
          this.pagemessages.push(this.allmessages[i])
        }
      }
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val
      this.pagemessages = []
      this.doQuery()
    },
    // 提交留言
    submitMessage() {
      if (this.nickName === '' || this.nickName.replace(/(^\s*)|(\s*$)/g, '') === '') {
        this.$message('请输入昵称')
        return
      }
      if (this.message === '' || this.message.replace(/(^\s*)|(\s*$)/g, '') === '') {
        this.$message('留言不能为空')
        return
      }
      //  模拟保存数据
      var timestamp = Date.parse(new Date())
      this.allmessages.push({ createTime: parseTime(timestamp), createDate: parseTime(timestamp, '{y}-{m}-{d}'), nickName: this.nickName, content: this.message })
      this.nickName = ''
      this.message = ''
      // 翻页到最后一页
      this.currentPage = Math.ceil(this.allmessages.length / this.pagesize, 0)
      this.handleCurrentChange(this.currentPage)
    }
  }

}
</script>

<style scoped>
.el-card-d {
  float: left;
  margin-top: 20px;
  margin-left: 10%;
  width: 80%;
  height: 500px;
  background: rgb(252, 250, 250);
}

.el-card-m{
    height: 100px;
}

.el-card-m-content{
    display: block;
    font-weight: bold;
}

.el-card-m-nick-name{
    display: block;
    font-size: x-small;
    margin-top: 15px;
    color: gray;
}

.el-card-messages {
  float: left;
  margin-top: 20px;
  margin-left: 10%;
  width: 70%;
}

.message-nick-name {
  width: 50%;
}
.message-text {
  margin-top: 10px;
  display: block;
  width: 50%;
}

.submit-message {
  margin-top: 10px;
  width: 80px;
  background: rgb(235, 245, 247);
  color: cadetblue;
  text-align: center;
  letter-spacing: 20px;
}
</style>
