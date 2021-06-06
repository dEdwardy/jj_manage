<template>
  <div
    ref="loginRef"
    class="login"
  >
    <div class="login-form">
      <p class="title">
        JJ Manage
      </p>
      <a-form>
        <a-form-item>
          <a-input
            v-model:value="state.form.username"
            :autocomplete="false"
            placeholder="用户名"
            style="width:250px"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            v-model:value="state.form.password"
            :autocomplete="false"
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
            @click="showVerify"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      <!-- <div style="user-select:none"> -->
      <a-modal
        v-model:visible="state.visible"
        centered
        :get-container="loginRef"
        wrap-class-name="verify-modal"
        :mask-closable="false"
        :body-style="{ background:'rgba(0,0,0,.2)'}"
        :footer="null"
      >
        <div class="flex justify-center align-center verify-wrapper">
          <drag-verify-img-rotate
            ref="verify"
            v-model:isPassing="state.pass"
            :width="220"
            imgsrc="https://edw4rd.cn/assets/avatar.jpg"
            text="请按住滑块拖动"
            success-text="验证通过"
            handler-icon="el-icon-d-arrow-right"
            success-icon="el-icon-circle-check"
            @refresh="reimg"
            @passcallback="handlePass"
          />
        </div>
      </a-modal>
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup>
import DragVerifyImgRotate from '@/components/DragVerifyImgRotate.vue'
import { message } from "ant-design-vue";
import { nextTick, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'
const loginRef = ref(null)
const password = ref('')
const { dispatch } = useStore()
const router = useRouter()
const state = reactive({
  form: {
    username: '',
    password: ''
  },
  visible: false,
  pass: false,
  loading: false
})
const verify = ref(null)

const login = async () => {
  state.loading = true
  const data = await dispatch('login', state.form)
  console.error(data)
  if (data.error) {
    state.loading = false
    message.error(data.error)
  } else {
    await dispatch('getDict')
    state.loading = false
    router.push({
      name: 'home'
    })
  }
}
const reimg = () => {
  console.error('reimg')
}
const handlePass = () => {
  console.error('pass')
  state.visible = false
  login()

}
const showVerify = () => {
  // if(!state.pass)state.pass = false
  state.visible = true
  nextTick(() => {
    verify.value.reset()
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
  .verify-wrapper .ant-modal-close-x {
    color: #fff;
  }

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
    input:-webkit-autofill {
      // box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.3) inset !important;
      box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.2) inset !important;
      color: #fff !important;
    }
    // input:-internal-autofill-selected {
    //   background: rgba(0, 0, 0, 0.3) !important;
    //   color: #fff !important;
    //   // box-shadow: inset 0 0 0 1000px white !important;
    // }
    // input:-webkit-autofill:focus {
    //   color: #fff !important;
    //   box-shadow: 0 0 0px 1000px white inset !important;
    // }
    // ::v-deep(.ant-input:hover) {
    //   border: 1px solid #fff !important;
    //   box-shadow: none;
    // }
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