<template>
    <el-container>
        <el-header class="page-header" :style="{ backgroundImage: `url(${headerBg})` }">
            <img class="company-icon" :src="systemLogo" alt="">
            <div class="system-name">LICHEE</div>
            <div class="user-function">
                <!--<span class="iconfont iconshezhi1 set"></span>-->
                <div class="user-msg">
                    <!--<img class="user-head-img" src="../assets/img/doctor-img.png" alt="">-->
                    <el-dropdown class="user-name">
                        <span class="el-dropdown-link">
                            {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="back">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="computeMenuWidth" class="aside">
                <el-menu router unique-opened :default-active="defaultActive" class="el-menu-vertical-demo"
                    background-color="#ffffff" text-color="#545c64" :collapse="iscollapse" @select="handleSelect">
                    <!-- 第一层 -->
                    <div v-for="(item, index) in menuData" :key="index">
                        <el-submenu :index="item.url" v-if="item.children.length > 0">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span slot="title" style="font-weight: bold" v-if="!iscollapse">{{ item.menuName }}</span>
                            </template>
                            <!-- 第二层 -->
                            <div :key="i" v-for="(child, i) in item.children">
                                <el-submenu :index="child.url" v-if="child.children.length > 0">
                                    <template slot="title">{{ child.menuName }}</template>
                                    <!-- 第三层 -->
                                    <div v-for="(third, i) in child.children">
                                        <el-submenu :index="third.url" v-if="third.children.length > 0">
                                            <template slot="title">{{ third.menuName }}</template>
                                            <div v-for="(fourth, i) in third.children">
                                                <el-menu-item :index="fourth.url" v-if="fourth.children.length === 0">
                                                    {{ fourth.menuName }}
                                                </el-menu-item>
                                            </div>
                                        </el-submenu>

                                        <el-menu-item :index="third.url" :key="i" v-if="third.children.length === 0">
                                            {{ third.menuName }}
                                            <i v-if="third.focused" class="el-icon-star-on margin-left10"
                                                style="font-size: 14px"></i>
                                            <i v-else class="el-icon-star-off margin-left10" style="font-size: 14px"></i>
                                        </el-menu-item>
                                    </div>

                                </el-submenu>

                                <el-menu-item :index="child.url" :key="i" v-if="child.children.length === 0">
                                    {{ child.menuName }}
                                </el-menu-item>
                            </div>
                        </el-submenu>

                        <el-menu-item :index="item.url" v-if="item.children.length === 0">
                            <i :class="item.icon"></i>
                            <span style="font-weight: bold" slot="title">{{ item.menuName }}</span>
                        </el-menu-item>
                    </div>
                </el-menu>
            </el-aside>
            <el-main>
                <div class="tabs-title">
                    <div class="option-box">
                        <div class="nav-tab">
                            <v-tags></v-tags>
                        </div>
                    </div>
                    <!--<i :class="iscollapse ? 'el-icon-arrow-right': 'el-icon-arrow-left'" @click="showCollapse"-->
                    <!--:style="collapseStyle"></i>-->
                </div>

                <div class="router-view padding-10">
                    <router-view style="min-width: 1280px;"></router-view>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import vTags from './components/tags.vue';
export default {
    name: "home",
    // 加载的组件
    components: {
        vTags
    },
    data() {
        return {
            headerBg: require('../assets/img/header.png'),
            systemLogo: require('../assets/img/lichee.png'),
            userName: '',
            defaultActive: '/home/job',//当前激活菜单
            iscollapse: false,
            collapseStyle: {
                position: 'absolute',
                top: '10px',
                left: '2px',
                cursor: 'pointer',
                transition: 'all 1s'
            },
            menuData: [
                {
                    icon: [],
                    menuName: "定时任务",
                    url: "/home/job",
                    children: []
                }, {
                    icon: [],
                    menuName: "用户管理",
                    url: "/home/user",
                    children: []
                }, {
                    icon: [],
                    menuName: "代码编辑",
                    url: "/home/code",
                    children: []
                }, {
                    icon: [],
                    menuName: "数据库源管理",
                    url: "/home/db",
                    children: []
                }, {
                    icon: [],
                    menuName: "系统管理",
                    url: "/home/system",
                    children: [
                        {
                            icon: [],
                            menuName: "参数管理",
                            url: "/home/param",
                            children: []
                        }, {
                            icon: [],
                            menuName: "参数域管理",
                            url: "/home/area",
                            children: []
                        }
                    ]
                }
            ],
            oneArr: []
        }
    },
    created() {
        this.$router.replace('/home/job')
        this.oneArr = this.menuData.reduce((acc, cur) => acc.concat(cur), [])
    },
    mounted() {

    },
    methods: {
        back() {
            this.$router.push('/login');
        },

        // 菜单选中
        handleSelect(key, keyPath) {
            console.log(key, '----> ', keyPath);
            this.oneArr.findIndex(function (currentValue, currentIndex, currentArray) {
                if (currentValue.url == key) {
                    // console.log('currentValue', currentValue);
                }
            })
        },

        // 移除
        removeTab() {

        },
    },

    computed: {
        //计算菜单宽度
        computeMenuWidth() {
            return this.iscollapse ? '63px' : '210px'
        },
    },
}
</script>

<style lang="scss" scoped>
/*消息气泡  */
/deep/ .el-badge__content.is-fixed {
    top: 10px;
    right: 40px;
    cursor: pointer;
}

.page-header {
    .company-icon {
        float: left;
        width: 27px;
        height: 30px;
        margin-top: 5px;
    }

    .system-name {
        float: left;
        width: 450px;
        line-height: 44px;
        color: white;
        font-weight: bold;
        font-size: 20px;
    }

    .user-function {
        float: right;
        height: 40px;
        line-height: 40px;

        .set {
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-right: 30px;
        }

        .user-msg {
            float: right;
            height: 100%;
            line-height: 40px;

            .user-name {
                display: inline-block;
                font-size: 15px;
                font-weight: bold;
                vertical-align: middle;
                color: white;
            }

            .user-head-img {
                width: 25px;
                height: 25px;
                border-radius: 30px;
                margin-right: 8px;
                vertical-align: middle;
            }
        }

        /deep/ .el-switch__label.is-active {
            color: white;
        }
    }
}

.tabs-title {
    position: relative;
    padding: 0 2px;
    height: 40px;

    /deep/ .el-tabs__header {
        margin: 0;
    }

    .option-box {
        float: left;
        width: 100%;

        .nav-tab {
            font-size: 14px;
            line-height: 40px;
        }
    }
}

.aside {
    box-shadow: 1px 0px 3px rgba(25, 41, 63, 0.1);
    overflow: auto;

    .el-menu {
        border-right: none;
    }

    // 修改菜单栏高度
    /deep/ .el-menu-item,
    .el-submenu__title {
        height: 40px;
        line-height: 40px;
    }
}

.router-view {
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
    background-color: rgb(241, 245, 253);
}

.red-main {
    color: red !important;
}
</style>
