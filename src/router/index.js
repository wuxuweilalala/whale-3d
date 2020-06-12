import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/index'
  },
  {
    path: '/index',
    redirect:'/index/scene',
    component: () => import('../views/index/index.vue'),
    children:[{
      path: 'scene',
      component: () => import('../views/scene/index.vue')
    },
      {
      path: 'parameters',
      component: () => import('../views/parameters/index.vue')
    },
      {
      path: 'inventory',
      component: () => import('../views/inventory/index.vue')
    },
      {
      path: 'order',
      component: () => import('../views/order/index.vue')
    }]
  },
  {
    path: '/preview',
    component: () => import('../views/preview/index.vue')
  },
  {
    path: '/edit',
    component: () => import('../views/edit/index.vue')
  },
  {
    path: '/edit2d',
    component: () => import('../views/edit2d/index.vue')
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
