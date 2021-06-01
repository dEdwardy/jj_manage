<template>
  <div class="article-list">
    <div class="serch-panel">
      search
    </div>
    <div class="buttons">
      <a-button
        type="priamry"
        @click="handle"
      >
        新建
      </a-button>
    </div>
  </div>
</template>

<script>
export default {

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