<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DNABorder from '../components/DNABorder.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const personalDomains = new Set(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'free.fr', 'wanadoo.fr', 'orange.fr'])
const canLogin = computed(() => email.value.trim() && password.value)

function handleLogin() {
  const domain = email.value.split('@')[1] || ''

  if (personalDomains.has(domain.toLowerCase())) {
    errorMessage.value = 'Veuillez utiliser une adresse email professionnelle.'
    return
  }

  if (!domain.includes('.')) {
    errorMessage.value = 'Adresse email invalide.'
    return
  }

  errorMessage.value = ''
  isLoading.value = true
  window.setTimeout(() => {
    isLoading.value = false
    router.push('/workspace')
  }, 900)
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
      <span>Plateforme reservee aux professionnels</span>
    </header>

    <section class="portal-grid">
      <div class="portal-intro">
        <div class="helix-panel" aria-hidden="true"></div>
        <div class="intro-copy">
          <p class="eyebrow-blue">Analyse Genomique CRISPR-Cas9</p>
          <h1>Accedez au standard de l'analyse CRISPR-Cas9 <span>professionnelle.</span></h1>
          <p>
            Une plateforme de precision clinique concue pour les laboratoires agrees et les entreprises du secteur
            biotechnologique europeen.
          </p>

          <div class="feature-list">
            <article>
              <strong>Precision algorithmique</strong>
              <span>Modeles IA entraines sur des sites genomiques valides cliniquement.</span>
            </article>
            <article>
              <strong>XAI comprehensible</strong>
              <span>Chaque prediction est expliquee, tracable et prete pour vos rapports.</span>
            </article>
            <article>
              <strong>Securite des donnees</strong>
              <span>Hebergement europeen et parcours concu pour les exigences RGPD.</span>
            </article>
          </div>

          <RouterLink class="primary-action" to="/subscribe">S'abonner - Verification SIRET requise</RouterLink>
        </div>
      </div>

      <div class="login-zone">
        <form class="panel login-panel" @submit.prevent="handleLogin">
          <p class="panel-kicker">Acces abonnes</p>
          <h2>Connexion entreprise</h2>
          <p>Acces reserve aux abonnes professionnels certifies.</p>

          <p v-if="errorMessage" class="alert error" role="alert">{{ errorMessage }}</p>

          <label>
            Email professionnel
            <input v-model.trim="email" type="email" placeholder="dr.martin@biotech-corp.fr" @input="errorMessage = ''" />
          </label>

          <label>
            Mot de passe
            <span class="password-wrap">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="............" />
              <button type="button" @click="showPassword = !showPassword">{{ showPassword ? 'Masquer' : 'Voir' }}</button>
            </span>
          </label>

          <button class="solid-button" type="submit" :disabled="!canLogin || isLoading">
            {{ isLoading ? 'Verification...' : 'Se connecter' }}
          </button>

          <div class="panel-footer">
            Pas encore abonne ?
            <RouterLink to="/subscribe">Verifier l'eligibilite</RouterLink>
          </div>
        </form>

        <div class="trust-line">
          <span>ISO 27001</span>
          <span>RGPD conforme</span>
          <span>Hebergement EU</span>
        </div>
      </div>
    </section>
  </main>
</template>
