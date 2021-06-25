<template>
  <div class="ad-list">
    <div class="operation-btns">
      <a-button
        type="primary"
        @click="handleNew"
      >
        新建
      </a-button>
    </div>
    <a-table
      striped
      row-key="id"
      size="small"
      :loading="state.loading"
      :data-source="state.ads"
      :columns="state.columns"
      :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : '')"
    >
      <template #banner="{ record }">
        <div>
          <img
            style="width:60px;height:60px"
            :src="'http://localhost:3000/static/'+record.url"
            alt=""
          >
        </div>
      </template>
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
        <a-form-item label="Banner">
          <a-upload
            v-model:file-list="state.fileList"
            :before-upload="beforeUpload"
            list-type="picture-card"
            @preview="handlePreview"
          >
            <div v-if="state.fileList.length == 0">
              <plus-outlined />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="排序"
          v-bind="validateInfos.sort"
          name="name"
        >
          <a-input-number
            v-model:value="state.modal.sort"
            :min="0"
            :step="1"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :visible="state.previewVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <img
        alt="example"
        style="width: 100%"
        :src="state.previewImage"
      >
    </a-modal>
  </div>
</template>

<script setup>
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue'
import { useForm } from '@ant-design-vue/use';
import { useAxios } from '@vueuse/integrations'
import instance from '../../utils/service'
import { ref, toRaw, onMounted, watch, reactive } from 'vue'
const state = reactive({
  previewVisible: false,
  previewImage: '',
  fileList: [],
  ads: [],
  loading: false,
  btnLoading: false,
  modalBtnLoading: false,
  modal: {
    sort: null,
    url: null,
    id: null,
  },
  rules: {
    sort: [{ required: false,type:'number' }],
    url: [{ required: false }]
  },
  columns: [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: 'Banner',
      dataIndex: 'url',
      key: 'url',
      slots: { customRender: 'banner' }
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
const handleNew = () => {
  modal_title.value = '新建'
  resetFields()
  visible.value = true
}
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const beforeUpload = (file) => {
  state.fileList = [...state.fileList, file];
  return false;
};
const handleCancel = () => {
  state.previewVisible = false;
};
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  state.previewImage = file.url || file.preview;
  state.previewVisible = true;
};
const getList = () => {
  state.loading = true
  const { data } = useAxios('/ad', { method: "get" }, instance)
  watch(data, () => {
    state.ads = data.value
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
  if(item.url){
    state.fileList = [{ url:'http://localhost:3000/static/'+item.url   }]
  }
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
const uploadImg = (file) => {
  return new Promise((resovle, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data, error } = useAxios('/file/upload', {
      method: 'post', data: formData,
    }, instance)
    watch(data, (v) => {
      if (!error.value) {
        resovle(v[0])
      } else {
        reject(error.value)
      }
    })
  })
}
const addAd = ({ url, sort }) => {
  return new Promise((resolve, reject) => {
    const { data, error } = useAxios('/ad', { method: 'POST', data: { url, sort } },instance)
    watch(data, (v) => {
      if (!error.value) {
        resolve(v)
      }else{
        reject(error.value)
      }
    })
  })
}
const handleSure = () => {
  switch (modal_title.value) {
    case '新建':
      const file = state.fileList[0].originFileObj
      const sort = state.modal.sort
      validate().then(async () => {
        state.modalBtnLoading = true
        const { filename } = await uploadImg(file);
        const data = await addAd({ url: filename, sort })
        console.error(data)
        state.modalBtnLoading = false
        // watch(data, (res) => {
        //   if (!error.value) {
        //     state.modalBtnLoading = false
        //     visible.value = false
        //     message.success('新建成功')
        //     getList()
        //   } else {
        //     state.modalBtnLoading = false
        //     visible.value = false
        //     console.error(error)
        //   }

        // })
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
  const { data, error } = useAxios('/ad', { method: 'delete', data: { id: item.id } }, instance)
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
.ad-list {
  .operation-btns {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  .buttons {
    display: flex;
    button {
      margin-right: 18px;
    }
  }
}
</style>
