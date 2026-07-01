<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import DNABorder from '../components/DNABorder.vue'
import { analyzeSequence } from '../services/analysisApi'
import { useAnalysisStore } from '../store/analysisStore'

const router = useRouter()
const { setAnalysis } = useAnalysisStore()
const userMenuOpen = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  sequence: '',
  species: 'Humain (hg38)',
  advancedParams: 'Cas9 - Seuil 50%',
})

function cleanSequence() {
  form.sequence = form.sequence.toUpperCase().replace(/[^AUGCTN]/g, '').slice(0, 40)
}

async function submitAnalysis() {
  errorMessage.value = ''
  isLoading.value = true

  const payload = {
    sequence: form.sequence.trim().toUpperCase(),
    species: form.species,
    parameters: form.advancedParams,
  }

  try {
    const result = await analyzeSequence(payload)
    setAnalysis(payload, result)
    await router.push('/results')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="workspace-shell">
    <DNABorder />

    <div class="workflow-strip">
      <div>
        <strong>1</strong>
        <span>Soumission</span>
        <span class="next-step">2 Resultats</span>
      </div>
      <span>Saisie guidee - Analyse CRISPR-Cas9</span>
    </div>

    <header class="workspace-header">
      <div class="workspace-brand">
        <RouterLink class="portal-brand" to="/">
          <span class="portal-mark">X</span>
          <span>X-CRISP-XAI</span>
        </RouterLink>
        <span class="license-separator"></span>
        <div>
          <small>Sous licence de</small>
          <strong>BioTech Corp.</strong>
        </div>
      </div>

      <div class="user-menu">
        <span class="active-pill">Espace actif - BioTech Corp.</span>
        <button class="user-button" type="button" @click="userMenuOpen = !userMenuOpen">
          <span>DS</span>
          <span>Dr. Smith<br /><small>Admin - BioTech Corp.</small></span>
        </button>
        <div v-if="userMenuOpen" class="user-dropdown">
          <strong>Dr. Smith (Admin)</strong>
          <small>admin@biotech-corp.fr</small>
          <button type="button" @click="userMenuOpen = false">Mon profil</button>
          <button type="button" @click="userMenuOpen = false">Parametres entreprise</button>
          <button type="button" @click="userMenuOpen = false">Documentation XAI</button>
          <button class="danger" type="button" @click="router.push('/')">Se deconnecter</button>
        </div>
      </div>
    </header>

    <section class="workspace-body">
      <form class="workspace-form" @submit.prevent="submitAnalysis">
        <label>
          <span>Collez votre guide ARN</span>
          <input
            v-model="form.sequence"
            class="sequence-input"
            type="text"
            placeholder="GGUGAGUGAGUGCAUCAGGU"
            autocomplete="off"
            spellcheck="false"
            required
            @input="cleanSequence"
          />
        </label>
        <div v-if="form.sequence" class="sequence-meta">
          <span>{{ form.sequence.length }} / 20 nucleotides</span>
          <strong v-if="form.sequence.length === 20">Longueur conforme</strong>
        </div>

        <label>
          <span>Selection de l'espece</span>
          <select v-model="form.species">
            <option>Humain (hg38)</option>
            <option>Souris (mm10)</option>
            <option>Rat (rn6)</option>
            <option>Poisson-zebre (danRer11)</option>
            <option>Arabidopsis thaliana (TAIR10)</option>
          </select>
        </label>

        <label>
          <span>Parametres avances</span>
          <select v-model="form.advancedParams">
            <option>Cas9 - Seuil 50%</option>
            <option>Cas9 - Seuil 25%</option>
            <option>Cas9 - Seuil 75%</option>
            <option>Cas12a - Seuil 50%</option>
            <option>dCas9 (CRISPRi) - Seuil 50%</option>
          </select>
        </label>

        <p v-if="errorMessage" class="inline-alert" role="alert">{{ errorMessage }}</p>

        <button class="solid-button analysis-button" type="submit" :disabled="isLoading || !form.sequence.trim()">
          {{ isLoading ? 'Analyse en cours...' : "Lancer l'analyse XAI" }}
        </button>

        <p class="help-line">Rapport XAI complet avec attribution de caracteristiques - temps estime : 8 a 12 secondes.</p>
      </form>
    </section>
  </main>
</template>
