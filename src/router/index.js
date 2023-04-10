import vue from 'vue'
import vueRouter from 'vue-router'


vue.use(vueRouter);
const originalReplace = vueRouter.prototype.replace
vueRouter.prototype.replace = function (location) {
    return originalReplace.call(this, location).catch(err => err)
}
const originalPush = vueRouter.prototype.push
vueRouter.prototype.push = function (location) {
    return originalPush.call(this, location).catch(err => err)
}

let routes = [
    {
        path: '/',
        fullPath: '/',
        redirect: '/login'
    },
    {
        meta: { title: '登录' },
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        meta: { title: '主页' },
        path: '/home',
        name: 'home',
        component: () => import('../views/home.vue'),
        children: [
            {
                meta: { title: '任务管理' },
                path: 'job',
                name: 'job',
                component: () => import('../views/timeTaskManage/timeTaskManage')
            }, {
                meta: { title: '用户管理' },
                path: 'user',
                name: 'user',
                component: () => import('../views/userManage/index')
            }, {
                meta: { title: '数据库源管理' },
                path: 'db',
                name: 'db',
                component: () => import('../views/db/index')
            }, {
                meta: { title: '参数管理' },
                path: 'param',
                name: 'param',
                component: () => import('../views/system/paramManage/index')
            }, {
                meta: { title: '参数域管理' },
                path: 'area',
                name: 'area',
                component: () => import('../views/system/paramManage/area')
            }, {
                meta: { title: '代码编辑' },
                path: 'code',
                name: 'code',
                component: () => import('../views/codeEdit/index')
            }
        ]
    }
];

const router = new vueRouter({
    routes: routes,
    // // mode: 'history',
    // base: process.env.BASE_URL,
});
export default router
