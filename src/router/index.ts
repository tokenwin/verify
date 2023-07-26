import { createRouter, createWebHistory } from 'vue-router'
import CrashView from '../views/CrashView.vue'
import LimboView from '../views/LimboView.vue'
import DiceView from '../views/DiceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'crash-verify',
      component: CrashView
    },
    {
      path: '/limbo',
      name: 'limbo-verify',
      component: LimboView
    },
    {
      path: '/dice',
      name: 'dice-verify',
      component: DiceView
    }
  ]
})

export default router
