<template>
  <a-layout class="home">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
    >
      <div class="logo" />

      <a-menu
        theme="dark"
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        @select="jump"
      >
        <a-sub-menu v-for="(item,index) of info.menu" :key="index">
          <template #title>
            <div class="flex align-center">
              <!-- <MailOutlined /> -->
              <svg-icon v-if="item.icon" class="menu-icon" :name="item.icon" style="margin-right:14px"></svg-icon>
              <!-- <span v-text="item.icon"></span> -->
              <span>{{ item.text }}</span>
            </div>
          </template>
          <a-menu-item  v-for="i of item.children" :key="i.name">{{ i.text }}</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  QqOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MailOutlined
} from '@ant-design/icons-vue';
import { ref,reactive } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
const selectedKeys = ref([])
const collapsed = ref(false)
const info = reactive({
  menu:[
    {
      path:'user',
      name:'user',
      text:'用户管理',
      icon:'user-manage',
      children:[
        {
          path:'list',
          name:'user-list',
          text:'用户列表',
          icon:'',
        }
      ]
    },
    {
      path:'article',
      name:'article',
      text:'文章管理',
      icon:'article-manage',
      children:[
        {
          path:'list',
          name:'article-list',
          text:'文章列表',
          icon:'',
        }
      ]
    },
    {
      path:'category',
      name:'category',
      text:'分类管理',
      icon:'category-manage',
      children:[
        {
          path:'list',
          name:'category-list',
          text:'分类列表',
          icon:'',
        }
      ]
    },
    {
      path:'tag',
      name:'tag',
      text:'标签管理',
      icon:'tag-manage',
      children:[
        {
          path:'list',
          name:'tag-list',
          text:'标签列表',
          icon:'',
        }
      ]
    }
  ]
})
const jump = ({key}) => {
  // console.error(key)
  router.push({
    name:key
  })
}
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .menu-icon{
    width:18px;
    height:18px;
  }
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: #1890ff;
  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
  }

  .site-layout .site-layout-background {
    background: #fff;
  }
}
</style>