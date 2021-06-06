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
      :loading="state.loading"
      row-key="id"
      size="small"
      :pagination="{ total:state.total }"
      :data-source="state.list"
      :columns="state.columns"
      :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      @change="handleTableChange"
    >
      <template #category="{ record }">
        <div>
          {{ record.category.name }}
        </div>
      </template>
      <template #tag="{ record }">
        <div>
          {{ record.tag.map(i => i.name).join(',') }}
        </div>
      </template>
      <template #state="{ record }">
        <div v-if="record.state === 0">
          Draft
        </div>
        <div v-else-if="record.state === 1">
          Publish
        </div>
        <div v-else-if="record.state === 2">
          Hidden
        </div>
        <div v-else>
          Unknown
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
  </div>
</template>

<script setup>
import { useAxios } from "@vueuse/integrations"
import { onMounted, reactive, watch, toRaw } from "vue"
import { useRouter } from "vue-router"
import instance from "../../utils/service"
import { format, parseISO } from 'date-fns'
import { useStore } from "vuex"


const router = useRouter()
const store = useStore()
const tagList = Object.keys(store.state.dict.articleState).map(value => ({ value,text:store.state.dict.articleState[value] }))
const state = reactive({
  list: [],
  // categoryFilters:store.state.dict.category.map(({ name,id }) => ({ text:name,value:id })),
  // tagFilters:store.state.dict.tag,
  total: 0,
  loading: false,
  columns: [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: '简介',
      dataIndex: 'brief_content',
      key: 'brief_content',
      ellipsis: true
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      slots: { customRender: 'category' },
      filters:store.state.dict.category.map(({ name,id }) => ({ text:name,value:id }))
    },
    {
      title: '标签',
      ellipsis: true,
      dataIndex: 'tag',
      key: 'tag',
      slots: { customRender: 'tag' },
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      slots: { customRender: 'state' },
      filters:tagList

    },
    {
      title: '创建日期',
      dataIndex: 'created',
      key: 'created',
      customRender: ({ record }) => {
        //utc => paseISO => format
        return format(parseISO(record.created), "yyyy-MM-dd kk:mm:ss")
      },
      sorter:true
    },
    {
      title: '更新日期',
      dataIndex: 'updated',
      key: 'updated',
      customRender: ({ record }) => {
        //utc => paseISO => format
        return format(parseISO(record.updated), "yyyy-MM-dd kk:mm:ss")
      },
      sorter:true
    },
    {
      title: 'operation',
      width: 250,
      key: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
})
const getList = (options = { }) => {
  state.loading = true;
  const { data, error } = useAxios('article', { method:'post',data: options }, instance)
  watch(data, (res) => {
    if (!error.value) {
      console.error(res)
      state.list = res.list
      state.total = res.total
    }
    state.loading = false;
  })
}
onMounted(() => getList())
const onView = record => {
  console.error(record)
  router.push({
    name: 'article-detail',
    params: {
      id: record.id
    }
  })
}
const handleTableChange = (pagination, filters, sorter) => {
   console.log(pagination, filters, sorter);
  let options = {}
  let { columnKey, order }  = sorter
  let { category }  = filters
  if(order)options = { ...options, sortBy: { sortKey: columnKey, sortValue: order === 'ascend' ? 'ASC' :'DESC'  }}
  if(category) options = { ...options, category }
  getList(options)
}
const onChange = record => console.error(record)
const onDelete = record => console.error(record)
const handleCreate = () => {
  router.push({
    name: 'article-detail'
  })
}
</script>

<style lang="scss" scoped>
.article-list {
  .operation-btns {
    display: flex;
    justify-content: space-around;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      margin-left: 18px;
    }
  }
}
</style>