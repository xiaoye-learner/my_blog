<template>
    <transition name="fade">
        <div class="start-loading" v-if="show">
            <div class="spinner-wrapper">
                <div class="spinner-rect outer"></div>
                <div class="spinner-rect inner"></div>
                <div class="center-dot"></div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'startLoading',
    data() {
        return {}
    },
    props: {       // 接收父容器内容
        show: {
            type: Boolean,
            required: true,
        },
        progress: {     // 接收进度
            type: Number,
            default: 0
        }
    },
    watch: {     // 监听 show 的变化来控制滚动条 
        show: {
            handler(val) {
                if (val) {     // 显示加载页时：禁止页面滚动
                    
                    document.body.style.overflow = 'hidden';
                } else {       // 隐藏加载页时：恢复页面滚动
                    document.body.style.overflow = '';
                }
            },    
            immediate: true      // immediate: true 确保组件刚加载且 show 为 true 时也能立即锁住滚动条
        }
    },
    beforeUnmount() {
        // 防止组件销毁后（如路由跳转）页面依然被锁死
        document.body.style.overflow = '';
    }
}
</script>
