<template>
  <a-layout class="home">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
    >
      <div class="logo">
        JJ Manage
      </div>

      <a-menu
        v-model:selectedKeys="state.selectedKeys"
        theme="dark"
        mode="inline"
        @select="jump"
      >
        <a-sub-menu
          v-for="(item,index) of state.menu"
          :key="index"
        >
          <template #title>
            <div class="flex align-center">
              <svg-icon
                v-if="item.icon"
                class="menu-icon"
                :name="item.icon"
              />
              <span
                v-if="!collapsed"
                style="margin-left:12px"
              >{{ item.text }}</span>
            </div>
          </template>
          <a-menu-item
            v-for="i of item.children"
            :key="i.name"
          >
            {{ i.text }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        class="flex align-center justify-between"
        style="background: #fff; padding: 0"
      >
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
        <div class="user">
          <a-dropdown @click.prevent>
            <img
              class="avatar"
              src="https://edw4rd.cn/assets/avatar.jpg"
              alt=""
            >
            <template #overlay>
              <a-menu @click="handleClickMenu">
                <a-menu-item key="a">
                  1st menu item
                </a-menu-item>
                <a-menu-item key="b">
                  2nd menu item
                </a-menu-item>
                <a-menu-item key="c">
                  退出
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff' ,'overflow-y':'scroll'}">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { ref, reactive, } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
const router = useRouter()
const collapsed = ref(false)
const state = reactive({
  selectedKeys: [],
  menu: [
    {
      path: 'user',
      name: 'user',
      text: '用户管理',
      icon: 'user-manage',
      children: [
        {
          path: 'list',
          name: 'user-list',
          text: '用户列表',
          icon: '',
        }
      ]
    },
    {
      path: 'article',
      name: 'article',
      text: '文章管理',
      icon: 'article-manage',
      children: [
        {
          path: 'list',
          name: 'article-list',
          text: '文章列表',
          icon: '',
        }
      ]
    },
    {
      path: 'category',
      name: 'category',
      text: '分类管理',
      icon: 'category-manage',
      children: [
        {
          path: 'list',
          name: 'category-list',
          text: '分类列表',
          icon: '',
        }
      ]
    },
    {
      path: 'tag',
      name: 'tag',
      text: '标签管理',
      icon: 'tag-manage',
      children: [
        {
          path: 'list',
          name: 'tag-list',
          text: '标签列表',
          icon: '',
        }
      ]
    },
    {
      path: 'ad',
      name: 'ad',
      text: '广告管理',
      icon: 'ad-manage',
      children: [
        {
          path: 'list',
          name: 'ad-list',
          text: '广告列表',
          icon: '',
        }
      ]
    }
  ]
})
const jump = ({ key }) => {
  // console.error(key)
  router.push({
    name: key
  })

}
const store  = useStore()
const handleLogOut = () => {
  store.commit('LOG_OUT')
  jump({key:'login' })
}
const handleClickMenu = ({ key }) => {
  switch (key) {
    case 'c':
      handleLogOut()
      break;
    default:
      break;
  }
}

</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .user {
    margin-right: 20px;
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  }
  .menu-icon {
    width: 18px;
    height: 18px;
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
    transition: all 0.3s ease-in-out;
    font-style: italic;
    flex-wrap: nowrap;
    overflow: hidden;
    letter-spacing: 4px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    color: #fff;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  .site-layout .site-layout-background {
    background: #fff;
  }
}
</style>