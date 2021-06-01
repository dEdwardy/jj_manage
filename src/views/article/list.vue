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
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()
const handleCreate = () => {
  router.push({
    name:'article-detail'
  })
}
</script>

<style lang="scss" scoped>
.article-list{
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