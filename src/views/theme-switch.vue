<template>
    <el-switch
        v-model="switchValue"
        style="--el-switch-on-color: #85bae3; --el-switch-off-color: #31333a;"
        @change="handleThemeChange"
        class="theme-switcher"
    >
        <template #active-action>
            <el-icon><Sunny /></el-icon>
        </template>
        <template #inactive-action>
            <el-icon><Moon /></el-icon>
        </template>
    </el-switch>
</template>

<script>
import { Moon, Sunny } from '@element-plus/icons-vue'  //element-plus图标库

export default {
    name: 'ThemeSwitch',
    components: {
        Moon, Sunny,   // 主题图标
    },

    data() {
        return {
            switchValue: true,   // 切换主题色
        }
    },

    mounted() {
        const savedTheme = localStorage.getItem('theme-mode');
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        const isLight = savedTheme ? savedTheme !== 'dark' : !prefersDark;

        this.switchValue = isLight;
        this.applyTheme(isLight);
    },

    methods: {
        handleThemeChange(val) {
            const updateTheme = () => {
                // 应用主题
                this.applyTheme(val);
            };

            document.body.classList.add('theme-transitioning');

            if (document.startViewTransition) {
                const transition = document.startViewTransition(updateTheme);
                transition.finished.finally(() => {
                    document.body.classList.remove('theme-transitioning');
                });
            } else {
                updateTheme();
                window.setTimeout(() => {
                    document.body.classList.remove('theme-transitioning');
                }, 640);
            }
        },

        applyTheme(isLight) {
            if (isLight) {
                document.body.classList.remove('dark-mode')
                localStorage.setItem('theme-mode', 'light')
            } else {
                document.body.classList.add('dark-mode')
                localStorage.setItem('theme-mode', 'dark')
            }
        },
    }
}
</script>
