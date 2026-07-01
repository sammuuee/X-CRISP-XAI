import { createRouter, createWebHistory } from 'vue-router'
import LandingPortal from '../views/LandingPortal.vue'
import SubscriptionTunnel from '../views/SubscriptionTunnel.vue'
import AuthWorkspace from '../views/AuthWorkspace.vue'
import SubmissionPage from '../views/SubmissionPage.vue'
import ResultsPage from '../views/ResultsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingPortal },
    { path: '/subscribe', name: 'subscribe', component: SubscriptionTunnel },
    { path: '/workspace', name: 'workspace', component: AuthWorkspace },
    { path: '/submit', name: 'submit', component: SubmissionPage },
    { path: '/results', name: 'results', component: ResultsPage },
  ],
})

export default router
