<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle, ArrowLeft, ArrowRight, Building2, CheckCircle2, CreditCard, Lock, ShieldCheck } from '@lucide/vue'
import DNABorder from './DNABorder.vue'
import { fetchCompanies, registerAccount } from '../services/api'

const router = useRouter()
const step = ref(1)
const siretStatus = ref('idle')
const passwordError = ref('')
const isLoading = ref(false)
const activationDone = ref(false)

const fallbackCompanies = {
  36252187900034: 'GenomEdge SAS',
  35600082700117: 'BioTech Corp. SA',
  51234567800019: 'InnovaGen Laboratoires',
  78231456700028: 'CRISPRPath Biotech',
  55210055400013: 'Institut Pasteur Démo',
  78467169500017: 'Sorbonne Biologie Lab',
  18008901303720: 'CNRS Génomique Test',
}
const companyMap = ref({ ...fallbackCompanies })

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
const siretExamples = computed(() => Object.keys(companyMap.value).join(', '))

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
    form.companyName = companyMap.value[form.siret] || 'Entreprise éligible'
    siretStatus.value = 'success'
  }, 500)
}

function continueAccount() {
  if (siretStatus.value === 'success') {
    step.value = 2
  } else {
    validateSiret()
  }
}

function continuePayment() {
  if (form.password !== form.confirmPassword) {
    passwordError.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  passwordError.value = ''
  step.value = 3
}

async function activateAccount() {
  isLoading.value = true
  try {
    await registerAccount({
      siret: form.siret,
      company_name: form.companyName,
      email: form.adminEmail,
      password: form.password,
    })
    activationDone.value = true
    window.setTimeout(() => router.push('/workspace'), 700)
  } catch (error) {
    passwordError.value = error.response?.data?.detail || "L'inscription a échoué."
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    const companies = await fetchCompanies()
    companyMap.value = companies.reduce((map, company) => {
      map[company.siret] = company.company_name
      return map
    }, { ...fallbackCompanies })
  } catch {
    companyMap.value = { ...fallbackCompanies }
  }
})
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
      <nav class="stepper" aria-label="Étapes">
        <span class="stepper-item" :class="{ active: step >= 1, done: step > 1 }">
          <span class="step-circle"><CheckCircle2 v-if="step > 1" :size="16" /><span v-else>1</span></span>
          <span>Vérification SIRET</span>
        </span>
        <span class="step-line" aria-hidden="true"></span>
        <span class="stepper-item" :class="{ active: step >= 2, done: step > 2 }">
          <span class="step-circle"><CheckCircle2 v-if="step > 2" :size="16" /><span v-else>2</span></span>
          <span>Création du compte</span>
        </span>
        <span class="step-line" aria-hidden="true"></span>
        <span class="stepper-item" :class="{ active: step >= 3 }">
          <span class="step-circle">3</span>
          <span>Paiement</span>
        </span>
      </nav>

      <form v-if="step === 1" class="panel tunnel-card" @submit.prevent="continueAccount">
        <div class="form-icon"><Building2 :size="28" /></div>
        <h1>Vérification de l'identité</h1>
        <p>Nous vérifions l'éligibilité de votre structure. Codes APE/NAF requis : 7211Z, 2120Z ou 7219Z.</p>

        <label>
          Numéro SIRET
          <input :value="formattedSiret" inputmode="numeric" placeholder="123 456 789 01234" @input="setDigits('siret', $event.target.value, 14); siretStatus = 'idle'" />
        </label>
        <small>Exemples de démo : {{ siretExamples }}</small>

        <p v-if="siretStatus === 'error'" class="alert error icon-alert">
          <AlertCircle :size="18" />
          <span>SIRET invalide ou non conforme au secteur biotechnologique.</span>
        </p>
        <p v-if="siretStatus === 'success'" class="alert success icon-alert">
          <CheckCircle2 :size="18" />
          <span>Entreprise éligible : {{ form.companyName }}</span>
        </p>

        <button class="solid-button with-icon" type="submit" :disabled="form.siret.length !== 14 || siretStatus === 'loading'">
          <span v-if="siretStatus === 'loading'">Vérification en cours...</span>
          <span v-else-if="siretStatus === 'success'">Continuer - créer le compte</span>
          <span v-else>Valider l'entreprise</span>
          <ArrowRight v-if="siretStatus !== 'loading'" :size="17" />
        </button>
      </form>

      <form v-else-if="step === 2" class="panel tunnel-card" @submit.prevent="continuePayment">
        <div class="form-icon"><ShieldCheck :size="28" /></div>
        <h1>Création du compte</h1>
        <p>Renseignez les informations de l'administrateur principal.</p>

        <label>Nom de l'entreprise<input v-model="form.companyName" readonly /></label>
        <label>Email administrateur<input v-model.trim="form.adminEmail" type="email" placeholder="admin@votre-labo.fr" required /></label>
        <label>Mot de passe<input v-model="form.password" type="password" required /></label>
        <label>Confirmer le mot de passe<input v-model="form.confirmPassword" type="password" required /></label>

        <p v-if="passwordError" class="alert error icon-alert">
          <AlertCircle :size="18" />
          <span>{{ passwordError }}</span>
        </p>

        <div class="button-row">
          <button class="outline-button with-icon" type="button" @click="step = 1">
            <ArrowLeft :size="17" />
            Retour
          </button>
          <button class="solid-button with-icon" type="submit" :disabled="!form.adminEmail || !form.password || !form.confirmPassword">
            Continuer vers le paiement
            <ArrowRight :size="17" />
          </button>
        </div>
      </form>

      <form v-else class="panel tunnel-card wide" @submit.prevent="activateAccount">
        <template v-if="activationDone">
          <h1>Accès activé</h1>
          <p>Bienvenue sur X-CRISP-XAI. Redirection vers votre espace de travail...</p>
        </template>

        <template v-else>
          <div class="form-icon payment"><CreditCard :size="28" /></div>
          <h1>Paiement et activation</h1>
          <p>Offre professionnel - {{ form.companyName }} : 490 EUR / mois HT, 14 jours offerts.</p>

          <label>Titulaire de la carte<input v-model.trim="form.cardHolder" name="cc-name" autocomplete="cc-name" placeholder="Dr. Claire Martin" /></label>
          <label>Numéro de carte<input :value="formattedCard" name="cc-number" autocomplete="cc-number" inputmode="numeric" placeholder="4242 4242 4242 4242" @input="setDigits('cardNumber', $event.target.value, 16)" /></label>
          <div class="field-grid">
            <label>Expiration<input :value="formattedExpiry" name="cc-exp" autocomplete="cc-exp" inputmode="numeric" placeholder="12/27" @input="setDigits('cardExpiry', $event.target.value, 4)" /></label>
            <label>CVC<input :value="form.cardCvc" name="cc-csc" autocomplete="cc-csc" inputmode="numeric" placeholder="123" @input="setDigits('cardCvc', $event.target.value, 3)" /></label>
          </div>

          <div class="button-row">
            <button class="outline-button with-icon" type="button" @click="step = 2">
              <ArrowLeft :size="17" />
              Retour
            </button>
            <button class="solid-button success-button with-icon" type="submit" :disabled="isLoading">
              <Lock v-if="!isLoading" :size="17" />
              {{ isLoading ? 'Activation en cours...' : "Payer 490 EUR et activer l'accès" }}
            </button>
          </div>
        </template>
      </form>
    </section>
  </main>
</template>
