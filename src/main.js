import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/css/global.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

const app = createApp(App)
app.use(store).use(router).use(ElementPlus, {locale}).mount('#app')
app.config.globalProperties.$axios = axios

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}