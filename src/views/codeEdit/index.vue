<template>
    <div style="min-width: 1440px">
        <page-header title="代码编辑">
            <template #buttonContent>
                <el-button size="mini" type="primary" @click="openDialog('add')">新增</el-button>
            </template>
        </page-header>
        <div class="container">
            <div id="monaco" class="monaco-box"> </div>
        </div>
    </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js'
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';

export default {
    name: "codeEdit",
    // 加载的组件
    components: {},
    data() {
        return {
            sourceCode: '123123123',
            editor: null,
        }
    },
    created() {
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.editor = monaco.editor.create(document.getElementById("monaco"), {
                value: `console.log("hello,world")`,
                language: "javascript"
            })
        }
    },
    onChange(value) {
        console.log(value);
    }
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #ffffff;
    padding: 8px 12px;
}

.monaco-box {
    height: 800px;
}

/deep/ .el-dialog .el-dialog__body {
    height: auto;
}
</style>
