<template>
    <div>
        <h2>{{ article.title }}</h2>
        <p>编辑时间: {{ article.edited_time }}</p>
        <div v-html="compiledMarkdown"></div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
        article: {},
        };
    },
    created() {
        this.fetchArticle();
    },
    computed: {
        compiledMarkdown() {
        return this.article.content_md;
        }
    },
    methods: {
        fetchArticle() {
        const id = this.$route.params.id;
        axios.get(`api/articles/${id}/`)
            .then(response => {
            this.article = response.data;
            })
            .catch(error => console.error(error));
        }
    }
};
</script>