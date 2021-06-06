<template>
  <div class="article-detail">
    article detail
    <div class="buttons">
      <a-button
        size="small"
        style="margin-right:12px"
        @click="router.back"
      >
        返回
      </a-button>
      <!-- <div
        class="flex align-center"
        style="margin-right:12px"
      >
        预览
        <a-switch
          v-model:checked="state.preview"
          style="margin:0 4px"
        />
      </div> -->
      <a-button
        v-if="!state.form.id"
        size="small"
        style="margin-right:12px"
        @click="save"
      >
        保存
      </a-button>
      <a-button
        type="primary"
        size="small"
        @click="publish"
      >
        发布
      </a-button>
    </div>
    <div>
      <a-form layout="inline">
        <a-form-item label="标题">
          <a-input v-model:value="state.form.title" />
        </a-form-item>
        <a-form-item label="分类">
          <a-select
            v-model:value="state.form.category"
            style="width:200px"
            allow-clear
            @change="handleCategoryChange"
          >
            <a-select-option
              v-for="item of categoryList"
              :key="item.id"
              show-arrow
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标签">
          <a-select
            v-model:value="state.form.tag"
            mode="multiple"
            style="width:200px"
            allow-clear
          >
            <a-select-option
              v-for="item of state.tagList"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="简要内容">
          <a-textarea
            v-model:value="state.form.brief_content"
            placeholder="Brief Content"
            :rows="2"
            :maxlength="20"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="editor">
      <quill-editor
        ref="editor"
        v-model:content="state.form.content"
        :toolbar="state.toolbar"
        content-type="html"
        style="min-height:350px"
        theme="snow"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRaw, watch, nextTick } from 'vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useAxios } from '@vueuse/integrations';
import instance from '../../utils/service';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const editor = ref(null)
const route = useRoute()
const store = useStore()
const state = reactive({
  preview: false,
  toolbar: 'full',
  form: {
    id: '',
    title: '',
    brief_content: '',
    content: '',
    author: '',
    category: '',
    tag: [],
    author: store.state.uinfo.id
  },
  tagList: []
})
const categoryList = store.state.dict.category
const getDetail = (id) => {
  const { data, error } = useAxios(`/article/${id}`, instance)
  watch(data, (res) => {
    if (!error.value) {
      console.error(res)
      state.form.id = res.id
      state.form.title = res.title
      // state.form.content = res.content 
      // editor.value.getQuill().enable(false)
      editor.value.setHTML(res.content)
      nextTick(() => {
        editor.value.getQuill().enable(true)
        editor.value.getQuill().blur()
      })
      // console.error(toRaw(editor.value.getQuill().enable))
      // console.error(toRaw(editor.value.enable))
      state.form.brief_content = res.brief_content
      // state.form.author = res.brief_content
      state.form.category = res.category.id
      state.tagList = categoryList?.filter(i => i.id === state.form.category)[0]?.tag ?? []
      state.form.tag = res.tag.map(i => i.id)
    }
  })
}
onMounted(() => {
  if (route.params.id) {
    getDetail(route.params.id)
  }
})
const handleCategoryChange = id => {
  console.error(id)
  state.form.tag = []
  state.tagList = categoryList?.filter(i => i.id === id)[0]?.tag ?? []
}
// watch(() => state.form.category, id => {
//   console.error(id)
//   state.form.tag = []
//   console.error(store.state.dict.category)
//   console.error(store.state.dict)
//   console.error(store.state)
//   state.tagList = categoryList?.filter(i => i.id === id)[0]?.tag ?? []
// })
const router = useRouter()
//默认 pulish false  (save)
const submit = (publish = false) => {
  const url = publish ? '/article/publish' : '/article/save'
  const { data, error } = useAxios(url, { method: 'post', data: state.form }, instance)
  watch(data, () => {
    if (!error.value) {
      message.success('操作成功')
      if (publish) router.back()
      console.error(data.value)
      state.form.id = data.value.id
    } else {
      message.error('操作失败')
    }
  })
}
const save = () => submit()
const publish = () => submit(true)
</script>
<style lang="scss" scoped>
.article-detail {
  .buttons {
    padding: 18px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>