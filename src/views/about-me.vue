<template>
    <div class="blog-about-me">
        <el-card class="about-me-card" @click="goToMarkdown('2')" style="cursor: pointer;">  <!-- 点击后传文件名，以cursor提示用户可以点击 -->
            点击我查看Markdown文件
        </el-card>
  </div>
</template>

<script>
export default {
    data() {

    },

    methods: {
        goToMarkdown(id) {
            this.$router.push({ name: 'Article', params: { id } });
        }
    }
}
</script>