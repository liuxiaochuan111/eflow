import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'List',
    component: () => import('../views/ListPage.vue'),
    meta: { title: '表单片段列表' }
  },
  {
    path: '/editor/:id?',
    name: 'Editor',
    component: () => import('../views/EditorPage.vue'),
    meta: { title: '表单编排' }
  },
  {
    path: '/preview/:url',
    name: 'Preview',
    component: () => import('../views/PreviewPage.vue'),
    meta: { title: '表单预览' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
