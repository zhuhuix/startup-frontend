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
                      ? baseApi + '/file/' + user.avatarUrl
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
                  <i class="el-icon-user" /> 登录账号
                  <div class="user-right">{{ user.userName }}</div>
                </div>
              </li>
              <li>
                <i class="el-icon-picture-outline-round" /> 用户昵称
                <div class="user-right">{{ user.nickName }}</div>
              </li>
              <li v-if="user.dept!=null"><svg-icon icon-class="dept" /> 公司名称 <div class="user-right"> {{ user.dept.name }}</div></li>
              <li>
                <i class="el-icon-mobile-phone" /> 电话号码
                <div class="user-right">{{ user.phone }}</div>
              </li>
              <li>
                <i class="el-icon-location-information" /> 所在地区
                <div class="user-right">{{ user.province }} {{ user.city }} {{ user.country }}</div>
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
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="城市" prop="city" size="mini">
                  <el-cascader
                    v-model="selectedOptions"
                    size="mini"
                    :options="options"
                    filterable
                    clearable
                    style="width: 250px"
                    @change="handleChange"
                  />
                </el-form-item>
                <el-form-item label="">
                  <el-button
                    :loading="saveLoading"
                    size="mini"
                    type="primary"
                    @click="doSubmit"
                  >更新信息</el-button>
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
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
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
      options: regionData,
      selectedOptions: [],
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
      this.form = { id: this.user.id, nickName: this.user.nickName, gender: this.user.gender, phone: this.user.phone,
        province: this.user.province, city: this.user.city, country: this.user.country }
      if (this.form.country !== '') {
        this.selectedOptions = [TextToCode[this.form.province].code, TextToCode[this.form.province][this.form.city].code, TextToCode[this.form.province][this.form.city][this.form.country].code]
      } else {
        this.selectedOptions = [TextToCode[this.form.province].code, TextToCode[this.form.province][this.form.city].code]
      }
    })
  },
  methods: {
    handleChange(value) {
      this.form.province = ''
      this.form.city = ''
      this.form.country = ''
      for (let i = 0; i < this.selectedOptions.length; i++) {
        if (i === 0) { this.form.province = CodeToText[this.selectedOptions[i]] }
        if (i === 1) { this.form.city = CodeToText[this.selectedOptions[i]] }
        if (i === 2) { this.form.country = CodeToText[this.selectedOptions[i]] }
      }
    },
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
              this.$notify({
                title: '更新成功',
                type: 'success',
                duration: 2500
              })
              store.dispatch('getInfo').then(() => { })
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
