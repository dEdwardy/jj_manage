<template>
  <div class="login">
    <div class="login-form">
      <p class="title">
        JJ Manage
      </p>
      <a-form>
        <a-form-item>
          <a-input
            v-model:value="state.form.username"
            placeholder="用户名"
            style="width:250px"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            v-model:value="state.form.password"
            placeholder="密码"
            style="width:250px"
            type="password"
          />
        </a-form-item>
        <a-form-item class="flex justify-center align-center">
          <a-button
            type="ghost"
            :loading="state.loading"
            style="background:#000;color:#fff"
            @click="login"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'
const { dispatch } = useStore()
const router = useRouter()
const state = reactive({
  form: {
    username: '',
    password: ''
  },
  loading: false
})
const login = () => {
  state.loading = true
  dispatch('login', state.form).then(() => {
    state.loading = false
    router.push({
      name:'home'
    })
  })
}
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-image: url('../../assets/img/bg.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .login-form {
    border-radius: 12px;
    padding: 20px 60px 0px;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ::v-deep(.ant-input) {
      color: #fff;
      background-color: transparent;
    }
    ::v-deep(.ant-input:hover) {
      border: 1px solid #fff !important;
      box-shadow: none;
    }
    ::v-deep(.ant-input::placeholder) {
      color: #fff !important;
    }
    // ::v-deep(.ant-input:active) {
    //   border: 1px solid #fff !important;
    //   box-shadow: none;
    // }
    ::v-deep(.ant-input:focus) {
      border: 1px solid #fff !important;
      box-shadow: none;
      border-color: #fff !important;
    }
    ::v-deep(.ant-btn) {
      border: 1px solid #fff !important;
      color: #fff;
      box-shadow: none;
    }
    ::v-deep(.ant-btn:hover) {
      border: 1px solid #fff !important;
      color: #fff;
      box-shadow: none;
    }

    ::v-deep(.ant-btn:focus) {
      border: 1px solid #fff !important;
      color: #fff;
      box-shadow: none;
    }
    // ::v-deep(.ant-input:visited) {
    //   border: 1px solid #fff !important;
    //   box-shadow: none;
    // }
    .title {
      font-style: italic;
      letter-spacing: 8px;
      text-shadow: 2px 4px 5px #fff;
      color: #fff;
      text-shadow: rgba(10, 10, 10, 0.4);
      text-align: center;
      font-size: 36px;
      height: 44px;
      line-height: 44px;
      font-weight: 500;
      margin-bottom: 20px;
    }
  }
}
</style>