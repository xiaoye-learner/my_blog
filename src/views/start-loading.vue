<template>
    <transition name="fade">
        <div class="start-loading" v-if="show">
            <div id="spinner"></div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'StartLoading',
    data() {
        return {}
    },

    props: {      //接收父组件内容
        show: {
            type: Boolean,
            required: true,
        }
    },
}
</script>