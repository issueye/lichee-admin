<template>
    <div style="min-width: 1440px">
        <page-header title="数据库源管理">
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
                    <el-button size="mini" type="primary" @click="searchDbSource()">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="tableData" :height="tableHeight" stripe border highlight-current-row>
                <el-table-column label="名称" prop="name" align="left" width="150" />
                <el-table-column label="地址" prop="host" align="left" width="200" />
                <el-table-column label="数据库" prop="database" width="110" align="left" />
                <el-table-column label="用户名" prop="user" width="110" align="left" />
                <el-table-column label="密码" prop="password" width="120" align="left" />
                <el-table-column label="端口号" prop="port" width="110" align="left" />
                <el-table-column label="类型" prop="type" align="left" width="120">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.type == 0"> SQLSERVER </el-tag>
                        <el-tag size="mini" v-else-if="scope.row.type == 1"> MYSQL </el-tag>
                        <el-tag size="mini" v-else> ORACLE </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="mark" align="left" />
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

        <el-dialog :title="title" width="580px" lock-scroll :close-on-click-modal="false" :visible.sync="visible"
            @closed="closeDialogEvent">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" label-position="right">
                <el-form-item label="名称" prop="name" style="margin-right: 0">
                    <el-input v-model="editForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="host" style="margin-right: 0">
                    <el-input v-model="editForm.host" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据库" prop="database" style="margin-right: 0">
                    <el-input v-model="editForm.database" clearable />
                </el-form-item>
                <el-form-item label="用户名" prop="user" style="margin-right: 0">
                    <el-input v-model="editForm.user" clearable />
                </el-form-item>
                <el-form-item label="密码" prop="password" style="margin-right: 0">
                    <el-input v-model="editForm.password" clearable />
                </el-form-item>
                <el-form-item label="端口号" prop="port" style="margin-right: 0">
                    <el-input v-model.number="editForm.port" clearable />
                </el-form-item>
                <el-form-item label="类型" prop="type" style="margin-right: 0">
                    <el-select v-model.number="editForm.type" placeholder="请选择数据库类型" @change="search">
                        <el-option v-for="item in typeOpertions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="mark" style="margin-right: 0">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" style="width: 447px" clearable
                        v-model="editForm.mark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="mini" @click="testLinkDB" class="testLink">
                    <span><i class="dotClass" :style="computeTestLink"></i></span>
                    <span>测试连接</span>
                </el-button>
                <el-button type="primary" size="mini" v-loading="saveLoading" @click="saveDbSource">保存</el-button>
                <el-button size="mini" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    apiGetDbSourceList,
    apiSaveDbSource,
    apiEditDbSource,
    apiDelDbSource,
    apiTestLinkDb
} from "../../api/dbSourceManage";

export default {
    name: "dbManage",
    data() {

        // 参数域名称只能输入字母
        let validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('名称不能为空'))
            } else {
                // 字母
                let alphabet = value.match(/([A-Za-z]+)/)
                if (alphabet) {
                    callback()
                } else {
                    callback(new Error('名称错误! (只允许字母)'))
                }
            }
        }

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

            title: '', // 标题
            type: '',//打开弹窗的类型
            visible: false, // 弹窗

            // 参数域列表
            areaOptions: [],

            // 编辑暂存数据
            editForm: {
                id: '',
                name: '',
                host: '',
                port: 0,
                database: '',
                user: '',
                password: '',
                type: 0,
                mark: ''
            },

            // typeOpertions
            typeOpertions: [
                { id: 0, name: "SQLSERVER" },
                { id: 1, name: "MYSQL" },
                { id: 2, name: "ORACLE" },
            ],

            // 规则
            rules: {
                name: [
                    { required: true, message: '请填写名称', trigger: 'change' },
                    { validator: validateName, trigger: 'blur' }
                ],
                host: [{ required: true, message: '请填写服务器地址', trigger: 'change' }],
                port: [{ required: true, message: '请填写服务器端口号', trigger: 'change' }],
                database: [{ required: true, message: '请填写数据库名称', trigger: 'change' }],
                user: [{ required: true, message: '请填写用户账号', trigger: 'change' }],
                password: [{ required: true, message: '请填写用户密码', trigger: 'change' }],
                type: [{ required: true, message: '请选择数据库类型', trigger: 'change' }]
            },

            // 保存时的 loading
            saveLoading: false,
            isLinkSuccess: 0
        }
    },
    // 加载的组件
    components: {},
    created() {
        this.getDbSourceList();
    },
    mounted() {
        this.tableHeight = document.documentElement.clientHeight - 245;
    },
    methods: {

        // 尝试连接数据库
        async testLinkDB() {
            let { data } = await apiTestLinkDb(this.editForm);
            if (data.code == 200) {
                this.isLinkSuccess = 1
            }
        },

        search() {
            this.searchDbSource()
        },


        // 重置表单
        resetForm() {
            this.currentPage = 1;
            this.getDbSourceList();
        },

        //查询任务列表
        searchDbSource() {
            this.currentPage = 1;
            this.getDbSourceList();
        },

        //获取用户列表
        async getDbSourceList() {
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                name: this.form.name
            };

            // 调用API 获取参数数据
            const { data } = await apiGetDbSourceList(params);
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
            this.getDbSourceList();
        },

        // 分页
        handleCurrentChange() {
            this.getDbSourceList();
        },

        // 删除参数
        async delParam(row) {
            try {
                const { data } = await apiDelDbSource(row)
                if (data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除参数域成功'
                    });
                }
                this.getDbSourceList()
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
                this.title = '添加数据库源链接'
            }
            else {
                this.title = '修改数据库源链接';

                this.editForm.id = row.id;
                this.editForm.name = row.name;
                this.editForm.host = row.host;
                this.editForm.port = row.port;
                this.editForm.database = row.database;
                this.editForm.user = row.user;
                this.editForm.password = row.password;
                this.editForm.type = row.type;
                this.editForm.mark = row.mark;
            }
        },

        //保存参数信息
        saveDbSource() {
            if (this.isLinkSuccess === 0) {
                this.$message({
                    type: 'warning',
                    message: '需要测试连接通过才能保存'
                });
                return
            }

            this.$refs['editForm'].validate(async (valid) => {
                if (valid) {
                    let dbSource = {
                        id: this.editForm.id,
                        name: this.editForm.name,
                        host: this.editForm.host,
                        port: this.editForm.port,
                        database: this.editForm.database,
                        user: this.editForm.user,
                        password: this.editForm.password,
                        type: this.editForm.type,
                        mark: this.editForm.mark
                    };

                    console.log("saveDbSource -> dbSource", dbSource);

                    if (this.type === 'add') {
                        const { data: newData } = await apiSaveDbSource(dbSource);
                        if (newData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '添加数据库成功'
                            });
                            this.getDbSourceList();
                            this.closeDialog();
                        }
                    }
                    else {
                        const { data: editData } = await apiEditDbSource(dbSource);
                        if (editData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '修改数据库源成功'
                            });
                            this.getDbSourceList();
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
                id: '',
                name: '',
                host: '',
                port: 0,
                database: '',
                user: '',
                password: '',
                type: 0,
                mark: ''
            }
            this.isLinkSuccess = 0;
            this.$refs['editForm'].resetFields();
        },
    },
    computed: {
        computeTestLink() {
            if (this.isLinkSuccess === 0) {
                return {
                    background: 'black'
                }
            } else {
                return {
                    background: 'springgreen'
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #ffffff;
    padding: 8px 12px;
}


.dotClass {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px; //这个用于圆点居中
    margin-bottom: 2px;
    background-color: red;
}

.testLink {
    margin-right: 50px;
    width: 90px;
}

/deep/ .el-dialog .el-dialog__body {
    height: auto;
}
</style>
