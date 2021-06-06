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
              <a-input v-model:value="state.form.username" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话">
              <a-input v-model:value="state.form.phone" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="用户状态">
              <a-input v-model:value="state.form.status" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="创建时间">
              <a-input v-model:value="state.form.created" />
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
      :loading="state.loading"
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
      :title="modal_title"
      ok-text="确认"
      cancel-text="取消"
      @ok="hideModal"
    >
      <a-form
        style="width:100%"
        :label-col="{ style:'width:80px;margin-right:12px' }"
        :wrapper-col="{ style:'flex:1' }"
        :model="state.modal"
      >
        <a-form-item label="用户名">
          <a-input v-model:value="state.modal.username" />
        </a-form-item>
        <a-form-item label="状态">
          <a-input v-model:value="state.modal.status" />
        </a-form-item>
        <a-form-item label="所属公司">
          <a-input v-model:value="state.modal.company" />
        </a-form-item>
        <a-form-item label="所在职位">
          <a-input v-model:value="state.modal.position" />
        </a-form-item>
        <a-form-item label="简介">
          <a-input v-model:value="state.modal.desc" />
        </a-form-item>
        <a-form-item label="创建日期">
          <a-input v-model:value="state.modal.created" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { useAxios } from '@vueuse/integrations'
import instance from '../../utils/service'
import { ref, toRaw, onMounted, watch, reactive } from 'vue'
const state = reactive({
  users: [],
  loading:false,
  form: {
    username: '',
    phone: '',
    created: '',
    status: ''
  },
  modal: {
    username: '',
    company:'',
    position:'',
    desc:'',
    created: '',
    status: ''
  },
  total: 0,
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
const getList = () => {
 state.loading = true
  const { data } = useAxios('/user', {}, instance)
  watch(data, res => {
    state.users = res.list
    state.total = res.total
    state.loading = false
  })
}
onMounted(() => {
 getList()
})
// Modal
const visible = ref(false)
const modal_title = ref('')
const onView = item => {
  console.log(toRaw(item))
  modal_title.value = '查看'
  state.modal = item
  visible.value = true

}
const onChange = item => {
  console.log(item)
  modal_title.value = '修改'
  state.modal = item
  visible.value = true

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
