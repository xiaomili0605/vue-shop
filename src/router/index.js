import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home'),
    // 在home中默认显示welcome组件
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../components/Welcome')
      },
      {
        path: '/users',
        component: () => import('../views/Users/Users')
      },
      {
        path: '/rights',
        component: () => import('../views/Power/Rights')
      },
      {
        path: '/roles',
        component: () => import('../views/Power/Roles')
      },
      {
        path: '/categories',
        component: () => import('../views/goods/Cate')
      },
      {
        path: '/params',
        component: () => import('../views/goods/Params')
      },
      {
        path: '/goods',
        component: () => import('../views/goods/List'),
      },
      {
        path: '/add',
        component: () => import('../views/goods/Add')
      },
      {
        path: '/orders',
        component: () => import('../views/Order/Order')
      },
      {
        path: '/reports',
        component: () => import('../views/Report/Report')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局导航守卫
// 1. 访问登录页直接放行
// 2. 没有token，强制跳转到登录页
// 3. 以上都不是放行即可
// 注意：判断条件接收后要写 return
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
