<template>
  <div class="article-detail">
    article detail
    <div class="buttons">
      <div
        class="flex align-center"
        style="margin-right:12px"
      >
        预览
        <a-switch
          v-model:checked="state.preview"
          style="margin:0 4px"
        />
      </div>
      <a-button
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
        v-model:content="state.form.content"
        :toolbar="state.toolbar"
        content-type="html"
        style="height:400px"
        theme="snow"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, toRaw, watch } from 'vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useAxios } from '@vueuse/integrations';
import instance from '../../utils/service';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore()
const state = reactive({
  preview: false,
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['image'],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
  ],
  form: {
    title: '',
    brief_content: '',
    content: '',
    author: '',
    category: '',
    tag: [],
    author:store.state.uinfo.id
  },
  tagList: []
})
const categoryList = store.state.dict.category
watch(() => state.form.category, id => {
  console.error(id)
  state.form.tag = []
  state.tagList = categoryList.filter(i => i.id === id)[0]?.tag ?? []
})
const router = useRouter()
//默认 pulish false  (save)
const submit = (publish = false) => {
  const url = publish ? '/article/publish' : '/article/save'
  const { data,error } = useAxios(url, { method: 'post', data: state.form }, instance)
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