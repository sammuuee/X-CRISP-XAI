import { createRouter, createWebHistory } from 'vue-router'
import AuthWorkspace from '../components/AuthWorkspace.vue'
import DocumentationPage from '../components/DocumentationPage.vue'
import HistoryPage from '../components/HistoryPage.vue'
import LandingPortal from '../components/LandingPortal.vue'
import ResultsPage from '../components/ResultsPage.vue'
import SubscriptionTunnel from '../components/SubscriptionTunnel.vue'
import { getToken } from '../services/api'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingPortal, meta: { public: true } },
    { path: '/subscribe', name: 'subscribe', component: SubscriptionTunnel, meta: { public: true } },
    { path: '/workspace', name: 'workspace', component: AuthWorkspace, meta: { requiresAuth: true } },
    { path: '/documentation', name: 'documentation', component: DocumentationPage, meta: { requiresAuth: true } },
    { path: '/results', name: 'results', component: ResultsPage, meta: { requiresAuth: true } },
    { path: '/history', name: 'history', component: HistoryPage, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !getToken()) {
    return { name: 'landing' }
  }
  return true
})

export default router
