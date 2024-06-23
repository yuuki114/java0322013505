import {createRouter, createWebHashHistory} from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'


const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        meta:{
            title: '首页'
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title){
        document.title = to.meta.title
    }
    const tokenStr = window.sessionStorage.getItem('token')
    if(to.path !== '/login' && !tokenStr){
        return next('/login')
    }
    next();
})

export default router
