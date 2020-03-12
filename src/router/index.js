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
