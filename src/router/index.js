import { createRouter, createWebHistory } from 'vue-router'
import '../common/nprogress.css'
import { useNProgress } from '@vueuse/integrations'
import Home from '@/views/home/index.vue'
const { progress } = useNProgress()
const routes= [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index.vue')
  },
  {
    path: '/',
    name: 'home',
    component:Home,
    children:[
      {
        path:'user-list',
        name:'user-list',
        component: () => import(/* webpackChunkName: "user-list" */ '../views/user/index.vue')
      },
      {
        path:'article-list',
        name:'article-list',
        component: () => import(/* webpackChunkName: "article-list" */ '../views/article/list.vue')
      },
      {
        path:'article-detail/:id?',
        name:'article-detail',
        component: () => import(/* webpackChunkName: "article-detail" */ '../views/article/index.vue')
      },
      {
        path:'tag-list',
        name:'tag-list',
        component: () => import(/* webpackChunkName: "tag-list" */ '../views/tag/index.vue')
      },
      {
        path:'category-list',
        name:'category-list',
        component: () => import(/* webpackChunkName: "category-list" */ '../views/category/index.vue')
      }, {
        path:'ad-list',
        name:'ad-list',
        component: () => import(/* webpackChunkName: "ad-list" */ '../views/ad/list.vue')
      },
    ]
  },
]
const start = () => {
  progress.value = 0
}
const done = () => {
  progress.value = 1.0
}
const router = createRouter({
  history: createWebHistory('/juejin_manage'),
  routes
})
const whiteList = ['/','/login']
router.beforeEach((to, from, next) => {
  // console.error('start')
  // console.warn(to)
  next()
  // if (whiteList.some((i) => to.path=== i)) {
  //   console.error('white')
  //   start()
  //   next()
  // } else {
  //   const token = localStorage.getItem('token')
  //   if (!token) {
  //     console.error('home')
  //     next({ path: '/login' })
  //   } else {
  //     console.error('continus')
  //     start()
  //     next()
  //   }
  // }
})
router.afterEach(() => {
  // console.error('end')
  done()
})
router.onError((err) => alert(err))
export default router
