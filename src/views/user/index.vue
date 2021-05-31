<template>
  <div class="user-list">
    <div class="search-panel">
      <a-row>
        <a-form
          style="width:100%"
          layout="inline"
          :label-col="{ style:'width:80px;margin-right:12px' }"
          :wrapper-col="{ style:'flex:1' }"
          :model="form"
        >
          <a-col :span="8">
            <a-form-item label="用户名">
              <a-input v-model:value="form.username" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话">
              <a-input v-model:value="form.phone" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="用户状态">
              <a-input v-model:value="form.status" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="创建时间">
              <a-input v-model:value="form.created" />
            </a-form-item>
          </a-col>
          <a-col
            :span="16"
            class="buttons flex align-center justify-end"
          >
            <a-button
              size="small"
              type="primary"
            >
              搜索
            </a-button>
            <a-button size="small">
              重置
            </a-button>
          </a-col>
        </a-form>
      </a-row>
    </div>
    <a-table
      striped
      row-key="id" 
      :pagination="{ total:state.total }"
      :data-source="state.users"
      :columns="state.columns"
      :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    >
      <template #operation="{ record }">
        <div class="operation-btns">
          <a-button
            size="small"
            type="primary"
            @click="() => onView(record)"
          >
            查看
          </a-button>
          <a-button
            size="small"
            icon=""
            @click="() => onChange(record)"
          >
            修改
          </a-button>
          <a-popconfirm
            v-if="state.users.length"
            title="Sure to Disable?"
            @confirm="onDisable(record)"
          >
            <a>禁用</a>
          </a-popconfirm>
          <a-popconfirm
            v-if="state.users.length"
            title="Sure to delete?"
            @confirm="onDelete(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      title="Modal"
      ok-text="确认"
      cancel-text="取消"
      @ok="hideModal"
    >
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </a-modal>
  </div>
</template>

<script setup>
import { useAxios } from '@vueuse/integrations'
import instance from '../../utils/service'
import { ref, toRaw, onMounted, watch, reactive } from 'vue'
const state = reactive({
  users: [],
  total:0,
  columns: [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'operation',
      width: 220,
      key: 'operation',
      slots: { customRender: 'operation' }
    }
  ]
})
onMounted(() => {
  const { data } = useAxios('/user', {}, instance)
  watch(data, () => {
    state.users = data.value.list
    state.total = data.value.total
    console.error(data.value)
  })
})
const visible = ref(false)
const onView = item => {
  console.log(toRaw(item))
}
const onChange = item => {
  console.log(item)
}
const onDisable = item => {
  console.log(item)
}
const hideModal = () => {
  visible.value = false
}
const onDelete = item => {
  console.log(item)
}
const form = ref({
  username: '',
  phone: '',
  created: '',
  status: ''
})
</script>

<style lang="scss" scoped>
.user-list {
  .operation-btns {
    display: flex;
    justify-content: space-around;
  }
  .buttons {
    display: flex;
    button {
      margin-right: 18px;
    }
  }
}
</style>
