<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import DNABorder from '../components/DNABorder.vue'

const router = useRouter()
const step = ref(1)
const siretStatus = ref('idle')
const passwordError = ref('')
const isLoading = ref(false)
const activationDone = ref(false)

const eligibleSirets = new Set(['36252187900034', '35600082700117', '51234567800019', '78231456700028'])
const companyMap = {
  36252187900034: 'GenomEdge SAS',
  35600082700117: 'BioTech Corp. SA',
  51234567800019: 'InnovaGen Laboratoires',
  78231456700028: 'CRISPRPath Biotech',
}

const form = reactive({
  siret: '',
  companyName: '',
  adminEmail: '',
  password: '',
  confirmPassword: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardHolder: '',
})

const formattedSiret = computed(() => form.siret.replace(/(\d{3})(\d{3})(\d{3})(\d{0,5})/, (...parts) => parts.slice(1, 5).filter(Boolean).join(' ')))
const formattedCard = computed(() => form.cardNumber.replace(/(\d{4})/g, '$1 ').trim())
const formattedExpiry = computed(() => form.cardExpiry.replace(/(\d{2})(\d{0,2})/, (_, a, b) => (b ? `${a}/${b}` : a)))

function setDigits(field, value, max) {
  form[field] = value.replace(/\D/g, '').slice(0, max)
}

function validateSiret() {
  if (form.siret.length !== 14) {
    siretStatus.value = 'error'
    return
  }

  siretStatus.value = 'loading'
  window.setTimeout(() => {
    if (eligibleSirets.has(form.siret)) {
      form.companyName = companyMap[form.siret] || 'Entreprise Eligible'
      siretStatus.value = 'success'
    } else {
      siretStatus.value = 'error'
    }
  }, 700)
}

function continueAccount() {
  if (siretStatus.value === 'success') {
    step.value = 2
  } else {
    validateSiret()
  }
}

function continuePayment() {
  if (form.password.length < 8) {
    passwordError.value = 'Le mot de passe doit contenir au moins 8 caracteres.'
    return
  }

  if (form.password !== form.confirmPassword) {
    passwordError.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  passwordError.value = ''
  step.value = 3
}

function activateAccount() {
  isLoading.value = true
  window.setTimeout(() => {
    isLoading.value = false
    activationDone.value = true
    window.setTimeout(() => router.push('/workspace'), 900)
  }, 900)
}
</script>

<template>
  <main class="tunnel-shell">
    <DNABorder />

    <header class="top-bar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">X</span>
        <span>X-CRISP-XAI</span>
      </RouterLink>
      <span>Inscription - professionnels du secteur biotechnologique</span>
    </header>

    <section class="tunnel-body">
      <nav class="stepper" aria-label="Etapes">
        <span :class="{ active: step >= 1 }">1. Verification SIRET</span>
        <span :class="{ active: step >= 2 }">2. Creation du compte</span>
        <span :class="{ active: step >= 3 }">3. Paiement</span>
      </nav>

      <form v-if="step === 1" class="panel tunnel-card" @submit.prevent="continueAccount">
        <h1>Verification de l'identite</h1>
        <p>Nous verifions l'eligibilite de votre structure. Codes APE/NAF requis : 7211Z, 2120Z ou 7219Z.</p>

        <label>
          Numero SIRET
          <input :value="formattedSiret" inputmode="numeric" placeholder="123 456 789 01234" @input="setDigits('siret', $event.target.value, 14); siretStatus = 'idle'" />
        </label>
        <small>Exemple de demo : 36252187900034</small>

        <p v-if="siretStatus === 'error'" class="alert error">SIRET invalide ou non conforme au secteur biotechnologique.</p>
        <p v-if="siretStatus === 'success'" class="alert success">Entreprise eligible : {{ form.companyName }}</p>

        <button class="solid-button" type="submit" :disabled="form.siret.length !== 14 || siretStatus === 'loading'">
          <span v-if="siretStatus === 'loading'">Verification en cours...</span>
          <span v-else-if="siretStatus === 'success'">Continuer - creer le compte</span>
          <span v-else>Valider l'entreprise</span>
        </button>
      </form>

      <form v-else-if="step === 2" class="panel tunnel-card" @submit.prevent="continuePayment">
        <h1>Creation du compte</h1>
        <p>Renseignez les informations de l'administrateur principal.</p>

        <label>Nom de l'entreprise<input v-model="form.companyName" readonly /></label>
        <label>Email administrateur<input v-model.trim="form.adminEmail" type="email" placeholder="admin@votre-labo.fr" required /></label>
        <label>Mot de passe<input v-model="form.password" type="password" required /></label>
        <label>Confirmer le mot de passe<input v-model="form.confirmPassword" type="password" required /></label>

        <p v-if="passwordError" class="alert error">{{ passwordError }}</p>

        <div class="button-row">
          <button class="outline-button" type="button" @click="step = 1">Retour</button>
          <button class="solid-button" type="submit" :disabled="!form.adminEmail || !form.password || !form.confirmPassword">Continuer vers le paiement</button>
        </div>
      </form>

      <form v-else class="panel tunnel-card wide" @submit.prevent="activateAccount">
        <template v-if="activationDone">
          <h1>Acces active</h1>
          <p>Bienvenue sur X-CRISP-XAI. Redirection vers votre espace de travail...</p>
        </template>

        <template v-else>
          <h1>Paiement et activation</h1>
          <p>Offre professionnel - {{ form.companyName }} : 490 EUR / mois HT, 14 jours offerts.</p>

          <label>Titulaire de la carte<input v-model.trim="form.cardHolder" placeholder="Dr. Claire Martin" required /></label>
          <label>Numero de carte<input :value="formattedCard" inputmode="numeric" placeholder="4242 4242 4242 4242" @input="setDigits('cardNumber', $event.target.value, 16)" /></label>
          <div class="field-grid">
            <label>Expiration<input :value="formattedExpiry" inputmode="numeric" placeholder="12/27" @input="setDigits('cardExpiry', $event.target.value, 4)" /></label>
            <label>CVC<input :value="form.cardCvc" inputmode="numeric" placeholder="123" @input="setDigits('cardCvc', $event.target.value, 3)" /></label>
          </div>

          <div class="button-row">
            <button class="outline-button" type="button" @click="step = 2">Retour</button>
            <button class="solid-button success-button" type="submit" :disabled="!form.cardHolder || form.cardNumber.length < 16 || isLoading">
              {{ isLoading ? 'Activation en cours...' : "Payer 490 EUR et activer l'acces" }}
            </button>
          </div>
        </template>
      </form>
    </section>
  </main>
</template>
