import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'reset.css'
import '@/common/index.scss'
import useAntd from '@/plugins/antd-vue'
import SvgIcon from '@/components/SvgIcon.vue'

const app = createApp(App)
useAntd(app)
app.use(router).use(store).component('svg-icon', SvgIcon).mount('#app')
