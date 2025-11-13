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
    
    methods: {
        handleThemeChange(val) {
            // 应用主题
            this.applyTheme(val);
        },

        applyTheme(isLight) {
            if (isLight) {
                document.body.classList.remove('dark-mode')
            } else {
                document.body.classList.add('dark-mode')
            }
        },
    }
}
</script>