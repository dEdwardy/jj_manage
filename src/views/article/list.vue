<template>
  <div class="article-list">
    <div class="serch-panel">
      search
    </div>
    <div class="buttons">
      <a-button
        type="priamry"
        @click="handleCreate"
      >
        新建
      </a-button>
    </div>
    <a-table
      striped
      row-key="id"
      size="small"
      :pagination="{ total:state.total }"
      :data-source="state.list"
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
  </div>
</template>

<script setup>
import { useAxios } from "@vueuse/integrations"
import { onMounted, reactive, watch } from "vue"
import { useRouter } from "vue-router"
import instance from "../../utils/service"


const router = useRouter()
const state = reactive({
  list:[],
  total:0,
  columns:[
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '简介',
      dataIndex: 'brief_content',
      key: 'brief_content'
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag'
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: '创建日期',
      dataIndex: 'created',
      key: 'created'
    },
    {
      title: '更新日期',
      dataIndex: 'updated',
      key: 'updated'
    },
    {
      title: 'operation',
      width: 250,
      key: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
})
const getList =() => {
  const { data, error} = useAxios('article',{},instance)
  watch(data,(res) =>{
    if(!error.value){
      console.error(res)
      state.list = res.list
      state.total = res.total
    }
  })
}
onMounted(() => getList() )
const onView = record => console.error(record)
const onChange = record => console.error(record)
const onDelete = record => console.error(record)
const handleCreate = () => {
  router.push({
    name:'article-detail'
  })
}
</script>

<style lang="scss" scoped>
.article-list{
  .operation-btns {
    display: flex;
    justify-content: space-around;
  }
  .buttons{
    display: flex;
    justify-content: flex-end;
    align-items:center;
    button {
      margin-left:18px;
    }
  }
}
</style>