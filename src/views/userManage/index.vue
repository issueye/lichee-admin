<template>
    <div style="min-width: 1440px">
        <page-header title="用户管理">
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
                    <el-button size="mini" type="primary" @click="searchUser">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="tableData" :height="tableHeight" stripe border highlight-current-row>
                <el-table-column label="用户ID" prop="id" align="left" width="180" />
                <el-table-column label="登录名" prop="account" width="120" align="left" />
                <el-table-column label="用户名" prop="name" min-width="150" align="left" />
                <el-table-column label="备注" prop="mark" min-width="200" align="left" />
                <el-table-column label="登录时间" prop="login_time" min-width="200" align="left" />
                <el-table-column label="创建时间" prop="create_time" min-width="200" align="left" />
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-switch size="mini" v-model="scope.row.enable" :active-value="1" :inactive-value="0"
                            @change="editStatus(scope.row, $event)" active-color="#13ce66" inactive-color="#ff4949" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="left">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" class="margin-right8" @click="openDialog('edit', scope.row)">编辑
                        </el-button>
                        <el-button type="text" size="mini" class="red-main" @click="delUser(scope.row)">删除</el-button>
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
                <el-form-item label="登录名" prop="account" style="margin-right: 0">
                    <el-input v-model="editForm.account" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="name" style="margin-right: 0">
                    <el-input v-model="editForm.name" clearable></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="mark" style="margin-right: 0">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" style="width: 434px" clearable
                        v-model="editForm.mark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" v-loading="saveLoading" @click="saveUser">保存</el-button>
                <el-button size="mini" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    apiSaveUser,
    apiEditUser,
    apiEditUserStatus,
    apiGetUserList,
    apiDelUser
} from "../../api/userManage";

export default {
    name: "userManage",
    data() {
        return {
            form: {
                name: ''
            },
            loading: false,
            pageSize: 10,
            currentPage: 1,
            total: 0,
            tableData: [], // 数据
            tableHeight: null,

            title: '', // 标题
            type: '',//打开弹窗的类型
            visible: false, // 弹窗

            // 编辑暂存数据
            editForm: {
                account: '',
                name: '',
                mark: ''
            },

            // 规则
            rules: {
                name: [
                    { required: true, message: '请填写用户名', trigger: 'change' },

                ],
                account: [
                    { required: true, message: '请填写登录名', trigger: 'change' },

                ]
            },

            // 保存时的 loading
            saveLoading: false
        }
    },
    // 加载的组件
    components: {},
    created() {
        this.getUserList();
    },
    mounted() {
        this.tableHeight = document.documentElement.clientHeight - 245;
    },
    methods: {

        search() {
            this.searchUser()
        },

        // 重置表单
        resetForm() {
            this.currentPage = 1;
            this.getUserList();
        },

        //查询任务列表
        searchUser() {
            this.currentPage = 1;
            this.getUserList();
        },

        //获取用户列表
        async getUserList() {
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                name: this.form.name
            };

            // 调用API 获取用户数据
            const { data } = await apiGetUserList(params);
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
            this.getUserList();
        },

        // 分页
        handleCurrentChange() {
            this.getUserList();
        },

        // 打开弹窗
        openDialog(type, row) {
            this.visible = true;
            this.type = type;
            if (type === 'add') {
                this.title = '添加用户'
            }
            else {
                this.title = '编辑用户';
                this.editForm.id = row.id;
                this.editForm.name = row.name;
                this.editForm.account = row.account;
                this.editForm.mark = row.mark;
            }
        },

        //保存用户信息
        saveUser() {
            this.$refs['editForm'].validate(async (valid) => {
                if (valid) {
                    let params = {
                        id: this.editForm.id,
                        name: this.editForm.name,
                        account: this.editForm.account,
                        mark: this.editForm.mark
                    };
                    if (this.type === 'add') {
                        const { data: newData } = await apiSaveUser(params);
                        if (newData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.getUserList();
                            this.closeDialog();
                        }
                    }
                    else {
                        const { data: editData } = await apiEditUser(params);
                        if (editData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            });
                            this.getUserList();
                            this.closeDialog();
                        }
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 删除用户信息
        async delUser(row) {
            this.$confirm('确定删除当前数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let params = {
                    id: row.id
                };

                // 调用API删除用户信息
                const { data } = await apiDelUser(params);
                if (data.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });

                    if (this.currentPage > 1 && this.tableData.length === 1) {
                        this.currentPage--
                    }

                    this.getUserList()
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
            console.log("row", row)
            console.log("val", val)
            let params = {
                id: row.id,
                status: val
            };

            // 修改用户状态
            const { data } = await apiEditUserStatus(params);
            if (data.code === 200) {
                this.$message({
                    type: 'success',
                    message: '修改成功'
                });
                this.getUserList();
            }
            else {
                row.status = val === 0 ? 1 : 0
            }
        },

        // 关闭弹窗
        closeDialog() {
            this.visible = false;
        },

        //关闭新增任务弹窗回调
        closeDialogEvent() {
            this.editForm = {
                id: '',
                name: '',
                account: '',
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
