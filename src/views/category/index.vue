<template>
  <div class="category-list">
    <div
      :loading="true"
      class="search-panel"
    >
      <a-row>
        <a-form
          style="width:100%"
          layout="inline"
          :label-col="{ style:'margin:0 8px' }"
          :wrapper-col="{ style:'flex:1' }"
          :model="form"
        >
          <a-col :span="16">
            <a-form-item label="类目名">
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
              @click="addCategory"
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
      size="small"
      :loading="state.loading"
      :pagination="{ total:state.total }"
      :data-source="state.categorys"
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
      :confirm-loading="state.modalBtnLoading"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleSure"
    >
      <a-form
        style="width:100%"
        :label-col="{ style:'width:80px;margin-right:12px' }"
        :wrapper-col="{ style:'flex:1' }"
      >
        <a-form-item
          label="类目名"
          v-bind="validateInfos.name"
          name="name"
        >
          <a-input v-model:value="state.modal.name" />
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
  categorys: [],
  loading:false,
  btnLoading: false,
  modalBtnLoading: false,
  form: {
    name: '',
  },
  rules: {
    name: [{ required: true, message: '请输入类目名', trigger: 'change' }]
  },
  modal: {
    name: '',
  },
  total: 0,
  columns: [
    {
      title: '类目',
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
  const { data } = useAxios('/category/list', {}, instance)
  watch(data, () => {
    state.categorys = data.value.list
    state.total = data.value.total
    console.error(data.value)
  state.loading = false
  })
}
onMounted(() => {
  getList()
})
// Modal
const visible = ref(false)
const modal_title = ref('')
const addCategory = () => {
  modal_title.value = '新建类目'
  resetFields()
  visible.value = true
}
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
const handleSure = () => {
  switch (modal_title.value) {
    case '新建类目':
      validate().then(() => {
        state.modalBtnLoading = true
        const { data, error, isLoading } = useAxios('/category', {
          method: 'post', data: {
            name: state.modal.name
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
    case '查看':

      break;
    default:
      break;
  }
}
const onDelete = item => {
  state.btnLoading = true
  const { data, error} =  useAxios('/category',{ method:'delete' ,data: { id: item.id}},instance)
  watch(data,() => {
    if(!error.value){
      message.success('删除成功！')
      getList()
    }else{
      message.error('删除失败')
    }
    state.btnLoading = false
  })
}
</script>

<style lang="scss" scoped>
.category-list {
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
