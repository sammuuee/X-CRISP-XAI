<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle, ArrowRight, Cpu, Eye, EyeOff, FlaskConical, Lock, Shield } from '@lucide/vue'
import DNABorder from './DNABorder.vue'
import { loginAccount } from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const canLogin = computed(() => email.value.trim() && password.value)

async function handleLogin() {
  const domain = email.value.split('@')[1] || ''

  if (!domain.includes('.')) {
    errorMessage.value = 'Adresse email invalide.'
    return
  }

  errorMessage.value = ''
  isLoading.value = true
  try {
    await loginAccount({ email: email.value, password: password.value })
    router.push('/workspace')
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || 'Connexion impossible.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="portal-shell">
    <DNABorder />

    <header class="top-bar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">X</span>
        <span>X-CRISP-XAI</span>
        <small>v2.1 BETA</small>
      </RouterLink>
      <span>Plateforme réservée aux professionnels</span>
    </header>

    <section class="portal-grid">
      <div class="portal-intro">
        <div class="helix-panel" aria-hidden="true"></div>
        <div class="intro-copy">
          <p class="eyebrow-blue icon-line"><FlaskConical :size="16" />Analyse Génomique CRISPR-Cas9</p>
          <h1>Accédez au standard de l'analyse CRISPR-Cas9 <span>professionnelle.</span></h1>
          <p>
            Une plateforme de précision clinique conçue pour les laboratoires agréés et les entreprises du secteur
            biotechnologique européen.
          </p>

          <div class="feature-list">
            <article>
              <span class="feature-icon"><Cpu :size="17" /></span>
              <span>
                <strong>Précision algorithmique</strong>
                <small>Modèles IA entraînés sur des sites génomiques validés cliniquement.</small>
              </span>
            </article>
            <article>
              <span class="feature-icon"><Shield :size="17" /></span>
              <span>
                <strong>XAI compréhensible</strong>
                <small>Chaque prédiction est expliquée, traçable et prête pour vos rapports.</small>
              </span>
            </article>
            <article>
              <span class="feature-icon"><Lock :size="17" /></span>
              <span>
                <strong>Sécurité des données</strong>
                <small>Hébergement européen et parcours conçu pour les exigences RGPD.</small>
              </span>
            </article>
          </div>

          <RouterLink class="primary-action with-icon" to="/subscribe">
            S'abonner - Vérification SIRET requise
            <ArrowRight :size="17" />
          </RouterLink>
        </div>
      </div>

      <div class="login-zone">
        <form class="panel login-panel" @submit.prevent="handleLogin">
          <p class="panel-kicker">Accès abonnés</p>
          <h2>Connexion entreprise</h2>
          <p>Accès réservé aux abonnés professionnels certifiés.</p>

          <p v-if="errorMessage" class="alert error icon-alert" role="alert">
            <AlertCircle :size="18" />
            <span>{{ errorMessage }}</span>
          </p>

          <label>
            Email professionnel
            <input v-model.trim="email" type="email" placeholder="dr.martin@biotech-corp.fr" @input="errorMessage = ''" />
          </label>

          <label>
            Mot de passe
            <span class="password-wrap">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="............" />
              <button type="button" :aria-label="showPassword ? 'Masquer' : 'Voir'" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" :size="17" />
                <Eye v-else :size="17" />
              </button>
            </span>
          </label>

          <button class="solid-button" type="submit" :disabled="!canLogin || isLoading">
            {{ isLoading ? 'Vérification...' : 'Se connecter' }}
          </button>

          <div class="panel-footer">
            Pas encore abonné ?
            <RouterLink to="/subscribe">Vérifier l'éligibilité</RouterLink>
          </div>
        </form>

        <div class="trust-line">
          <span>ISO 27001</span>
          <span>RGPD conforme</span>
          <span>Hébergement EU</span>
        </div>
      </div>
    </section>
  </main>
</template>
