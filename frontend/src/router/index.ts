import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/List.vue'),
    meta: { title: '表单清单' }
  },
  {
    path: '/builder/:id?',
    name: 'Builder',
    component: () => import('@/views/Builder.vue'),
    meta: { title: '表单编排' }
  },
  {
    path: '/use/:id',
    name: 'Use',
    component: () => import('@/views/Use.vue'),
    meta: { title: '表单使用' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'EFlow'} - 表单编排系统`
  next()
})

export default router
