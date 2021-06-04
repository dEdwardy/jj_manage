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


const router = useRouter()
const state = reactive({
  list: [],
  total: 0,
  columns: [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
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
      slots: { customRender: 'category' }
    },
    {
      title: '标签',
      ellipsis: true,
      dataIndex: 'tag',
      key: 'tag',
      slots: { customRender: 'tag' }
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      slots: { customRender: 'state' }

    },
    {
      title: '创建日期',
      dataIndex: 'created',
      key: 'created',
      customRender: ({ record }) => {
        //utc => paseISO => format
        return format(parseISO(record.created), "yyyy-MM-dd kk:mm:ss")
      }
    },
    {
      title: '更新日期',
      dataIndex: 'updated',
      key: 'updated',
      customRender: ({ record }) => {
        //utc => paseISO => format
        return format(parseISO(record.updated), "yyyy-MM-dd kk:mm:ss")
      }
    },
    {
      title: 'operation',
      width: 250,
      key: 'operation',
      slots: { customRender: 'operation' }
    }
  ],
})
const getList = () => {
  const { data, error } = useAxios('article', {}, instance)
  watch(data, (res) => {
    if (!error.value) {
      console.error(res)
      state.list = res.list
      state.total = res.total
    }
  })
}
onMounted(() => getList())
const onView = record => {
  console.error(record)
  router.push({
    name:'article-detail',
    params:{
      id:record.id
    }
  })
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