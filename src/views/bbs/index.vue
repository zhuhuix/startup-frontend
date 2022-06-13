<template>
  <div>
    <el-card class="el-card-d" shadow="always">
      <el-timeline infinite-scroll-disabled="disabled">
        <div v-if="pagemessages.length > 0">
          <el-timeline-item
            v-for="(item, index) in pagemessages"
            :key="index"
            :timestamp="parseTime(item.createTime, '{y}-{m}-{d}')"
            placement="top"
          >
            <el-card class="el-card-m">
              <span class="el-card-m-content">{{ item.content }}</span>
              <div />
              <span class="el-card-m-nick-name">{{ item.nickName }} 提交于 {{ parseTime(item.createTime) }}  </span>
              <div />
              <span v-if="item.replyContent" class="el-card-m-reply">{{ item.replyName }}回复：{{ item.replyContent }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ {{ parseTime(item.replyTime) }}] </span>
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
        :total="total"
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
import { createBbs, getBbsPageList } from '@/api/bbs'
export default {
  data() {
    return {
      nickName: '',
      message: '',
      pagesize: 3,
      currentPage: 1,
      total: 0,
      pagemessages: []
    }
  },
  created() {
    this.doQuery()
  },
  methods: {
    parseTime,
    // 后台查询
    doQuery() {
      this.pagemessages = []
      var param = { userName: '' }
      param.pageSize = this.pagesize
      param.currentPage = this.currentPage
      getBbsPageList(param).then(res => {
        if (res) {
          this.total = res.total
          this.currentPage = res.currentPage
          this.pagemessages = res.bbsList
        }
      })
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
      //  保存数据
      const param = { nickName: this.nickName, content: this.message }
      createBbs(param).then((res) => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        if (res) {
          this.nickName = ''
          this.message = ''
          this.handleCurrentChange(1)
        }
      })
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

.el-card-m-reply{
    display: block;
    font-size: xx-small;
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
