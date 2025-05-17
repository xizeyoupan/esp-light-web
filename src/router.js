import { createWebHashHistory, createRouter } from 'vue-router'

import AboutView from './views/AboutView.vue'
import StateView from './views/StateView.vue'
import WiFiInfoView from './views/WiFiInfoView.vue'
import UserConfigView from './views/UserConfigView.vue'

const routes = [
    { path: '/', redirect: '/about' },
    { path: '/about', component: AboutView },
    { path: '/stat', component: StateView },
    { path: '/wifi-info', component: WiFiInfoView },
    { path: '/config', component: UserConfigView },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
