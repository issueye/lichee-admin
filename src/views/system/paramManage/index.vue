<template>
    <div style="min-width: 1440px">
        <page-header title="参数管理">
            <template #buttonContent>
                <el-button size="mini" type="primary" @click="openDialog('add')">新增</el-button>
            </template>
        </page-header>
        <div class="container">
            <el-form class="form-bottom-8" :model="form" inline label-position="right" label-width="80px">
                <el-form-item label="检索">
                    <el-input v-model="form.name" placeholder="请输入检索内容" @keyup.enter.native="search" @change="search"
                        clearable></el-input>
                </el-form-item>
                <el-form-item label="参数域">
                    <el-select v-model="form.area_id" placeholder="请选择参数域" @change="search">
                        <el-option v-for="item in areaOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item class="right" style="margin-right: 0">
                    <el-button size="mini" @click="resetForm">重置</el-button>
                    <el-button size="mini" type="primary" @click="searchParam">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="tableData" :height="tableHeight" stripe border highlight-current-row>
                <el-table-column label="参数域" prop="area" align="left" width="200" />
                <el-table-column label="名称" prop="name" align="left" width="300" />
                <el-table-column label="值" prop="value" align="left" min-width="200" />
                <el-table-column label="备注" prop="mark" min-width="200" align="left" />
                <el-table-column label="操作" width="150" align="left">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" class="margin-right8" @click="openDialog('edit', scope.row)">编辑
                        </el-button>
                        <el-button type="text" size="mini" class="red-main" @click="delParam(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background :page-sizes="[10, 20, 30]" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :page-size.sync="pageSize" :current-page.sync="currentPage"
                    layout="total,sizes,prev,pager,next,jumper" :total="total" class="right">
                </el-pagination>
            </div>
        </div>

        <el-dialog :title="title" width="580px" lock-scroll :close-on-click-modal="false" @open="getAreaList()"
            :visible.sync="visible" @closed="closeDialogEvent">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" label-position="right">
                <el-form-item label="参数域" prop="area" style="margin-right: 0">
                    <el-select v-model="editForm.area_id" placeholder="请选择参数域" :disabled="areaDisabled">
                        <el-option v-for="item in areaOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name" style="margin-right: 0">
                    <el-input v-model="editForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="值" prop="value" style="margin-right: 0">
                    <el-input v-model="editForm.value" clearable></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="mark" style="margin-right: 0">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" style="width: 447px" clearable
                        v-model="editForm.mark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" v-loading="saveLoading" @click="saveParam">保存</el-button>
                <el-button size="mini" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    apiSaveParam,
    apiEditParam,
    apiGetParamList,
    apiGetAreaList,
    apiDelParam
} from "../../../api/paramManage";

export default {
    name: "paramManage",
    data() {
        return {
            form: {
                name: '',
                area_id: 10000
            },
            loading: false,
            pageSize: 10,
            currentPage: 1,
            total: 0,
            tableData: [], // 数据
            tableHeight: null,

            // 参数域是否禁止选择
            areaDisabled: false,

            title: '', // 标题
            type: '',//打开弹窗的类型
            visible: false, // 弹窗

            // 参数域列表
            areaOptions: [],

            // 编辑暂存数据
            editForm: {
                area_id: 10000,
                name: '',
                value: '',
                mark: ''
            },

            // 规则
            rules: {
                name: [{ required: true, message: '请填写参数名称', trigger: 'change' }],
                value: [{ required: true, message: '请填写参数值', trigger: 'change' }]
            },

            // 保存时的 loading
            saveLoading: false
        }
    },
    // 加载的组件
    components: {},
    created() {
        this.getParamList();
        this.getAreaList();
    },
    mounted() {
        this.tableHeight = document.documentElement.clientHeight - 245;
    },
    methods: {

        search() {
            this.searchParam()
        },

        // 获取参数域列表
        async getAreaList() {
            let { data } = await apiGetAreaList();
            if (data.code == 200) {
                data.data.forEach(e => {
                    this.areaOptions.push({
                        id: e.id,
                        name: e.name
                    })
                });
                this.areaOptions = data.data;
            }
        },

        // 重置表单
        resetForm() {
            this.currentPage = 1;
            this.getParamList();
        },

        //查询任务列表
        searchParam() {
            this.currentPage = 1;
            this.getParamList();
        },

        //获取用户列表
        async getParamList() {
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                name: this.form.name,
                area_id: this.form.area_id
            };

            // 调用API 获取参数数据
            const { data } = await apiGetParamList(params);
            if (data.code === 200) {
                console.log(data)
                this.tableData = data.data;
                this.total = 0;
                if (this.tableData.length) {
                    this.total = data.pageInfo.total
                }
            }
        },

        // 分页
        handleSizeChange() {
            this.getParamList();
        },

        // 分页
        handleCurrentChange() {
            this.getParamList();
        },

        // 删除参数
        async delParam(row) {
            try {
                const { data } = await apiDelParam(row)
                if (data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除参数域成功'
                    });
                }
                this.getParamList()
            } catch (error) {
                this.$message({
                    type: 'error',
                    message: `删除参数域失败，错误原因：${error}`
                });
                this.getParamList()
            }
        },

        // 打开弹窗
        openDialog(type, row) {
            this.visible = true;
            this.type = type;
            if (type === 'add') {
                this.areaDisabled = false
                this.title = '添加参数'
            }
            else {
                this.areaDisabled = true
                this.title = '编辑参数';
                this.editForm.area_id = row.area_id;
                this.editForm.name = row.name;
                this.editForm.value = row.value;
                this.editForm.mark = row.mark;
            }
        },

        //保存参数信息
        saveParam() {
            this.$refs['editForm'].validate(async (valid) => {
                if (valid) {
                    let params = {
                        area_id: this.editForm.area_id,
                        name: this.editForm.name,
                        value: this.editForm.value,
                        mark: this.editForm.mark
                    };

                    console.log("saveParam -> params", params);

                    if (this.type === 'add') {
                        const { data: newData } = await apiSaveParam(params);
                        if (newData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.getParamList();
                            this.closeDialog();
                        }
                    }
                    else {
                        const { data: editData } = await apiEditParam(params);
                        if (editData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            });
                            this.getParamList();
                            this.closeDialog();
                        }
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 关闭弹窗
        closeDialog() {
            this.visible = false;
        },

        //关闭新增任务弹窗回调
        closeDialogEvent() {
            this.editForm = {
                area: '',
                name: '',
                value: '',
                mark: ''
            }
            this.$refs['editForm'].resetFields();
        },
        closeExpressDialog() {

        },
    }
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #ffffff;
    padding: 8px 12px;
}

/deep/ .el-dialog .el-dialog__body {
    height: auto;
}
</style>
