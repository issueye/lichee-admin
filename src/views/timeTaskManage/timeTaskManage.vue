<template>
    <div style="min-width: 1440px">
        <page-header title="定时任务管理">
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
                <el-form-item class="right" style="margin-right: 0">
                    <el-button size="mini" @click="resetForm">重置</el-button>
                    <el-button size="mini" type="primary" @click="searchTask">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="tableData" :height="tableHeight" stripe border highlight-current-row>
                <el-table-column label="任务ID" prop="id" align="left" width="180" />
                <el-table-column label="任务名称" prop="name" width="120" align="left" />
                <el-table-column label="表达式" prop="expr" min-width="150" align="left" />
                <el-table-column label="描述" prop="mark" min-width="200" align="left" />
                <el-table-column label="脚本路径" prop="path" min-width="200" align="left" />
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-switch size="mini" v-model="scope.row.enable" @change="editStatus(scope.row, $event)"
                            active-color="#13ce66" inactive-color="#ff4949" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="left">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" class="margin-right8" @click="openDialog('edit', scope.row)">编辑
                        </el-button>
                        <el-button type="text" size="mini" class="red-main" @click="delTaskList(scope.row)">删除</el-button>
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

        <el-dialog :title="title" width="580px" lock-scroll :close-on-click-modal="false" :visible.sync="visible"
            @closed="closeDialogEvent">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" label-position="right">
                <el-form-item label="任务名称" prop="name" style="margin-right: 0">
                    <el-input v-model="editForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="表达式" prop="expr" style="margin-right: 0">
                    <el-input v-model="editForm.expr" @focus="expressVisible = true" clearable></el-input>
                </el-form-item>

                <el-form-item label="任务描述" prop="mark" style="margin-right: 0">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" style="width: 434px" clearable
                        v-model="editForm.mark">
                    </el-input>
                </el-form-item>
                <el-form-item label="脚本路径" prop="path" style="margin-right: 0">
                    <el-input placeholder="请输入内容" style="width: 434px" clearable v-model="editForm.path">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" v-loading="saveLoading" @click="saveTask">保存</el-button>
                <el-button size="mini" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="表达式" lock-scroll width="1080px" :visible.sync="expressVisible" @closed="closeExpressDialog">

            <vcrontab :expression="expression" @fill="getExpressionData" @hide="expressVisible = false" />
        </el-dialog>
    </div>
</template>

<script>
import vcrontab from 'vcrontab'
import {
    delTask,
    editTaskName,
    editTaskStatus, getIp,
    getTaskList,
    saveTaskName
} from "../../api/timeTaskManage";

export default {
    name: "timeTaskManage",
    data() {
        return {
            form: {
                name: ''
            },
            loading: false,
            pageSize: 10,
            currentPage: 1,
            total: 0,
            tableData: [],
            tableHeight: null,

            title: '',
            type: '',//打开弹窗的类型
            visible: false,

            editForm: {
                id: '',
                name: '',
                expr: '',
                mark: '',
                path: '',
                cip: ''
            },
            rules: {
                name: [
                    { required: true, message: '请填写任务名称', trigger: 'change' },

                ],
                expr: [
                    { required: true, message: '表达式', trigger: 'change' },

                ],
                mark: [
                    { required: true, message: '请填写任务描述', trigger: 'change' }
                ],
                path: [
                    { required: true, message: '请填写任务脚本', trigger: 'change' }
                ]
            },
            IPlist: [],

            saveLoading: false,

            //表达式弹窗
            expressVisible: false,
            expression: ''
        }
    },
    components: {
        vcrontab,
    },
    created() {
        this.getTaskList();
    },
    mounted() {
        this.tableHeight = document.documentElement.clientHeight - 245;
    },
    methods: {

        search() {
            this.searchTask()
        },

        // 重置表单
        resetForm() {
            this.currentPage = 1;
            this.getTaskList();
        },

        //查询任务列表
        searchTask() {
            this.currentPage = 1;
            this.getTaskList();
        },

        //获取任务列表
        async getTaskList() {
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                name: this.form.name,
                mark: this.form.mark
            };

            const { data } = await getTaskList(params);
            if (data.code === 200) {
                console.log(data)
                this.tableData = data.data;
                this.total = 0;
                if (this.tableData.length) {
                    this.total = data.pageInfo.total
                }
            }
        },

        handleSizeChange() {
            this.getTaskList();
        },
        handleCurrentChange() {
            this.getTaskList();
        },
        openDialog(type, row) {
            this.visible = true;
            this.type = type;
            if (type === 'add') {
                this.title = '添加定时任务'
            }
            else {
                this.title = '编辑定时任务';
                this.editForm.id = row.id;
                this.editForm.name = row.name;
                this.editForm.expr = row.expr;
                this.editForm.status = row.status;
                this.editForm.mark = row.mark;
                this.editForm.path = row.path;
            }

        },
        //获取表达式值
        getExpressionData(val) {
            this.editForm.expr = val;
        },

        //保存任务
        saveTask() {
            this.$refs['editForm'].validate(async (valid) => {
                if (valid) {
                    let params = {
                        id: this.editForm.id,
                        name: this.editForm.name,
                        expr: this.editForm.expr,
                        mark: this.editForm.mark,
                        path: this.editForm.path
                    };
                    if (this.type === 'add') {
                        const { data: newData } = await saveTaskName(params);
                        if (newData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.getTaskList();
                            this.closeDialog();
                        }
                    }
                    else {
                        const { data: editData } = await editTaskName(params);
                        if (editData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            });
                            this.getTaskList();
                            this.closeDialog();
                        }
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        async delTaskList(row) {

            this.$confirm('确定删除当前数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let params = {
                    id: row.id
                };

                const { data } = await delTask(params);

                if (data.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    if (this.currentPage > 1 && this.tableData.length === 1) {
                        this.currentPage--
                    }
                    this.getTaskList()
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },

        //编辑状态
        async editStatus(row, val) {
            console.log(val)
            let params = {
                id: row.id,
                status: val
            };
            const { data } = await editTaskStatus(params);
            if (data.code === 200) {
                this.$message({
                    type: 'success',
                    message: '修改成功'
                });
                this.getTaskList();
            }
            else {
                row.status = val === 0 ? 1 : 0
            }
        },

        closeDialog() {
            this.visible = false;
        },
        //关闭新增任务弹窗回调
        closeDialogEvent() {
            this.editForm = {
                id: '',
                taskName: '',
                expression: '',
                taskDes: '',
                taskScript: '',
                cip: ''
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
