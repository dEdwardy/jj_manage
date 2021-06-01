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
    <div class="editor">
      <quill-editor
        v-model:content="state.content"
        :toolbar="state.toolbar"
        content-type="html"
        style="height:400px"
        theme="snow"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, toRaw } from 'vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

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
  content: '',
})
const save = () => console.log(state.content)
const publish = () => console.log(state.content)
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