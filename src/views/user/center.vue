<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="24"
        :md="10"
        :lg="9"
        :xl="8"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <myUpload

                  v-model="showDialog"
                  :headers="headers"
                  :url="baseApi+'/api/user/updateAvatar'"
                  @crop-upload-success="cropUploadSuccess"
                />
                <img
                  :src="
                    user.avatarUrl
                      ? baseApi + '/avatar/' + user.avatarUrl
                      : Avatar
                  "
                  title="点击上传头像"
                  class="avatar"
                  @click="toggleShow"
                >

              </div>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login" /> 登录账号
                  <div class="user-right">{{ user.userName }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 用户昵称
                <div class="user-right">{{ user.nickName }}</div>
              </li>
              <li v-if="user.dept!=null"><svg-icon icon-class="dept" /> 公司名称 <div class="user-right"> {{ user.dept.name }}</div></li>
              <li>
                <svg-icon icon-class="phone" /> 电话号码
                <div class="user-right">{{ user.phone }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="13" :lg="14" :xl="15">
        <!--    用户资料更新    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="资料更新" name="first">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                style="margin-top: 10px"
                size="small"
                label-width="65px"
              >
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="form.nickName" style="width: 35%" />
                  <span
                    style="color: #c0c0c0; margin-left: 10px"
                  >用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%" />
                  <span
                    style="color: #c0c0c0; margin-left: 10px"
                  >电话号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.gender" style="width: 178px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button
                    :loading="saveLoading"
                    size="mini"
                    type="primary"
                    @click="doSubmit"
                  >保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { saveUser } from '@/api/user'
import Avatar from '@/assets/images/avatar.png'
export default {
  name: 'Center',
  components: { myUpload },
  data() {
    return {
      showDialog: false,
      Avatar: Avatar,
      activeName: 'first',
      saveLoading: false,
      headers: {
        'Authorization': getToken()
      },
      form: {},
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi'
    ])
  },
  created() {
    store.dispatch('getInfo').then(() => {
      this.form = { id: this.user.id, nickName: this.user.nickName, gender: this.user.gender, phone: this.user.phone }
    })
  },
  methods: {
    toggleShow() {
      this.showDialog = !this.showDialog
    },
    cropUploadSuccess(jsonData, field) {
      store.dispatch('getInfo').then(() => { })
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            saveUser(this.form).then(() => {
              this.editSuccessNotify()
              store.dispatch('user/getInfo').then(() => { })
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    width: 250px;
    float: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;
  }
}
</style>
