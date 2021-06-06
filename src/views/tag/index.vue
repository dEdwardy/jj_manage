<template>
  <div class="tag-list">
    <div class="search-panel">
      <a-row>
        <a-form
          style="width:100%"
          layout="inline"
          :label-col="{ style:'margin:0 8px' }"
          :wrapper-col="{ style:'flex:1' }"
          :model="form"
        >
          <a-col :span="16">
            <a-form-item label="标签名">
              <a-input v-model:value="state.form.name" />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
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
            <a-button
              size="small"
              @click="addtag"
            >
              新建
            </a-button>
          </a-col>
        </a-form>
      </a-row>
    </div>
    <a-table
      striped
      row-key="id"
      :loading="state.loading"
      size="small"
      :pagination="{ total:state.total }"
      :data-source="state.tags"
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
            title="Sure to delete?"
            @confirm="onDelete(record)"
          >
            <a-button
              size="small"
              type="danger"
            >
              删除
            </a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      :title="modal_title"
    >
      <template #footer>
        <div class="buttons flex align-center justify-end">
          <a-button
            :loading="state.modalBtnLoading"
            @click="handleCancel"
          >
            取消
          </a-button>
          <a-button
            v-if="modal_title != '查看'"
            type="primary"
            :loading="state.modalBtnLoading"
            @click="handleSure"
          >
            确认
          </a-button>
        </div>
      </template>
      <a-form
        style="width:100%"
        :label-col="{ style:'width:80px;margin-right:12px' }"
        :wrapper-col="{ style:'flex:1' }"
      >
        <a-form-item
          label="标签名"
          v-bind="validateInfos.name"
          name="name"
        >
          <a-input v-model:value="state.modal.name" />
        </a-form-item>
        <a-form-item
          label="类目"
          v-bind="validateInfos.category"
          name="category"
        >
          <a-select
            v-model:value="state.modal.category"
            style="width: 100%"
          >
            <a-select-option
              v-for="item of state.categoryList"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { useForm } from '@ant-design-vue/use';
import { useAxios } from '@vueuse/integrations'
import instance from '../../utils/service'
import { ref, toRaw, onMounted, watch, reactive } from 'vue'
const state = reactive({
  tags: [],
  loading: false,
  categoryList: [],
  btnLoading: false,
  modalBtnLoading: false,
  form: {
    name: '',
  },
  rules: {
    name: [{ required: true, message: '请输入标签名', trigger: 'change' }],
    category: [{ required: true, message: '请选择类目名', trigger: 'change', type: 'number' }]
  },
  modal: {
    name: '',
    category: '',
    id: ''
  },
  total: 0,
  columns: [
    {
      title: '标签',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'operation',
      width: 250,
      key: 'operation',
      slots: { customRender: 'operation' }
    }
  ]
})
const { resetFields, validate, validateInfos } = useForm(state.modal, state.rules)
const getList = () => {
  state.loading = true
  const { data } = useAxios('/tag/list', {}, instance)
  watch(data, res => {
    state.tags = res.list
    state.total = res.total
    state.loading = false
  })
}
onMounted(() => {
  getCategoryList()
  getList()
})
// Modal
const visible = ref(false)
const modal_title = ref('')

const getCategoryList = () => {
  const { data, error } = useAxios('/category', {}, instance)
  watch(data, res => {
    if (!error.value) {
      state.categoryList = res
    }
  })
}
const addtag = () => {
  modal_title.value = '新建标签'
  resetFields()
  visible.value = true
}
const onView = item => {
  resetFields()
  console.log(toRaw(item))
  modal_title.value = '查看'
  state.modal.name = item.name
  state.modal.category = item.category.id
  visible.value = true

}
const onChange = item => {
  console.log(item)
  modal_title.value = '修改标签'
  state.modal.name = item.name
  state.modal.id = item.id
  state.modal.category = item.category.id
  visible.value = true

}
const onDisable = item => {
  console.log(item)
}
const handleSure = () => {
  switch (modal_title.value) {
    case '新建标签':
      validate().then(() => {
        state.modalBtnLoading = true
        const { data, error, isLoading } = useAxios('/tag', {
          method: 'post', data: {
            name: state.modal.name,
            category: state.modal.category
          }
        }, instance)
        watch(data, (res) => {
          if (!error.value) {
            state.modalBtnLoading = false
            visible.value = false
            message.success('新建成功')
            getList()
          } else {
            state.modalBtnLoading = false
            visible.value = false
            console.error(error)
          }

        })
      }).catch(e => {
        console.log(e)
      })
      break;
    case '修改标签':
      validate().then(() => {
        state.modalBtnLoading = true
        const { data, error, isLoading } = useAxios('/tag', {
          method: 'put', data: {
            id: state.modal.id,
            name: state.modal.name,
            category: state.modal.category
          }
        }, instance)
        watch(data, (res) => {
          if (!error.value) {
            state.modalBtnLoading = false
            visible.value = false
            message.success('修改成功')
            getList()
          } else {
            state.modalBtnLoading = false
            visible.value = false
            console.error(error)
          }

        })
      }).catch(e => {
        console.log(e)
      })
      break;
    default:
      break;
  }
}
const handleCancel = () => {
  resetFields()
  visible.value = false
}
const onDelete = item => {
  state.btnLoading = true
  const { data, error } = useAxios('/tag', { method: 'delete', data: { id: item.id } }, instance)
  watch(data, () => {
    if (!error.value) {
      message.success('删除成功！')
      getList()
    } else {
      message.error('删除失败')
    }
    state.btnLoading = false
  })
}
</script>

<style lang="scss" scoped>
.tag-list {
  ::v-deep(.ant-modal-body) {
    padding: 24px 24px 16px;
  }
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
