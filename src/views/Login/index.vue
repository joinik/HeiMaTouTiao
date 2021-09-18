<template>
  <div class="login">
    <!-- NavBar 组件：只需提供 title 标题 -->
    <van-nav-bar title="黑马头条 - 登录" fixed />
    <!-- 登录的表单 -->
    <van-form>
      <van-field
        v-model="form.mobile"
        type="tel"
        label="手机号码"
        placeholder="请输入手机号码"
        required
        :rules="rules.mobile"
      ></van-field>
      <van-field
        v-model="form.code"
        type="password"
        label="登录密码"
        placeholder="请输入登录密码"
        required
        :rules="rules.code"
      ></van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  // name是当前组件的名称(建议为每个组件都指定唯一的name名称)
  name: 'Login',
  data () {
    return {
      // 登录表单的数据，最终要双向绑定到 form 这个数据对象上
      form: {
        // 用户的手机号
        mobile: '13888888123',
        // 登录的密码
        code: '123456'
      },
      // 表单的校验规则对象
      rules: {
        // 手机号的校验规则
        mobile: [{ pattern: /^1\d{10}$/, message: '请填写您的手机号', trigger: 'onBlur' }],
        // 密码的校验规则
        code: [{ required: true, message: '请填写您的密码', trigger: 'onBlur' }]
      }
    }
  }
}
</script>

<style>
.login {
  padding-top: 46px;
}

.login .van-nav-bar {
  background-color: #007bff;
}

.van-nav-bar .van-nav-bar__title {
  color: white;
  font-size: 16px;
}
</style>
