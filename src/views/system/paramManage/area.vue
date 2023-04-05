<template>
    <div style="min-width: 1440px">
        <page-header title="参数域管理">
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
                    <el-button size="mini" type="primary" @click="searchArea">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="tableData" :height="tableHeight" stripe border highlight-current-row>
                <el-table-column label="ID" prop="id" align="left" width="200" />
                <el-table-column label="名称" prop="name" align="left" min-width="200" />
                <el-table-column label="备注" prop="mark" min-width="200" align="left" />
                <el-table-column label="操作" width="150" align="left">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" class="margin-right8" @click="openDialog('edit', scope.row)">编辑
                        </el-button>
                        <el-button type="text" size="mini" class="red-main" @click="delArea(scope.row)">删除</el-button>
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

        <el-dialog :title="title" width="580px" lock-scroll :close-on-click-modal="false" open="getAreaList"
            :visible.sync="visible" @closed="closeDialogEvent">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" label-position="right">
                <el-form-item label="名称" prop="name" style="margin-right: 0">
                    <el-input v-model="editForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="mark" style="margin-right: 0">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" style="width: 447px" clearable
                        v-model="editForm.mark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" v-loading="saveLoading" @click="saveArea">保存</el-button>
                <el-button size="mini" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    apiGetAreaList,
    apiSaveArea,
    apiDelArea,
    apiEditArea
} from "../../../api/paramManage";

export default {
    name: "paramManage",
    data() {

        // 参数域名称只能输入字母
        let validateAreaName = (rule, value, callback) => {
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

            // 参数域列表
            areaOptions: [],

            // 编辑暂存数据
            editForm: {
                name: '',
                mark: '',
                id: ''
            },

            // 规则
            rules: {
                name: [
                    { required: true, message: '请填写参数域名称', trigger: 'change' },
                    { validator: validateAreaName, trigger: 'blur' }
                ]
            },

            // 保存时的 loading
            saveLoading: false
        }
    },
    // 加载的组件
    components: {},
    created() {
        this.getAreaList();
    },
    mounted() {
        this.tableHeight = document.documentElement.clientHeight - 245;
    },
    methods: {

        search() {
            this.getAreaList();
        },

        // 获取参数域列表
        async getAreaList() {
            let { data } = await apiGetAreaList();
            if (data.code == 200) {

            }
        },

        // 重置表单
        resetForm() {
            this.currentPage = 1;
            this.getAreaList();
        },

        //查询任务列表
        searchArea() {
            this.currentPage = 1;
            this.getAreaList();
        },

        //获取用户列表
        async getAreaList() {
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                name: this.form.name
            };

            // 调用API 获取参数数据
            const { data } = await apiGetAreaList(params);
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
            this.getAreaList();
        },

        // 分页
        handleCurrentChange() {
            this.getAreaList();
        },

        // 打开弹窗
        openDialog(type, row) {
            this.visible = true;
            this.type = type;
            if (type === 'add') {
                this.title = '添加参数域'
            }
            else {
                this.title = '编辑参数域';
                this.editForm.name = row.name;
                this.editForm.mark = row.mark;
                this.editForm.id = row.id;
            }
        },

        // 删除参数域
        async delArea(row) {
            // console.log('delArea', row);
            if (row.id == 10000) {
                this.$message({
                    type: 'warning',
                    message: `${row.name}，不允许删除`
                });
                return
            }

            try {
                const { data } = await apiDelArea(row)
                if (data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除参数域成功'
                    });
                }
                this.getAreaList()
            } catch (error) {
                this.$message({
                    type: 'error',
                    message: `删除参数域失败，错误原因：${error}`
                });
                this.getAreaList()
            }
        },

        //保存参数信息
        saveArea() {
            this.$refs['editForm'].validate(async (valid) => {
                if (valid) {
                    let params = {
                        name: this.editForm.name,
                        mark: this.editForm.mark,
                        id: this.editForm.id
                    };
                    if (this.type === 'add') {
                        console.log('params', params);
                        const { data: newData } = await apiSaveArea(params);
                        if (newData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.getAreaList();
                            this.closeDialog();
                        }
                    }
                    else {
                        const { data: editData } = await apiEditArea(params);
                        if (editData.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            });
                            this.getAreaList();
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
