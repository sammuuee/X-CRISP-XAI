<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import DNABorder from '../components/DNABorder.vue'
import { analyzeSequence } from '../services/analysisApi'
import { useAnalysisStore } from '../store/analysisStore'

const router = useRouter()
const { setAnalysis } = useAnalysisStore()

const form = reactive({
  sequence: '',
  species: 'Humain (hg38)',
  advancedParams: 'Cas9 - Seuil 50%',
})

const isLoading = ref(false)
const errorMessage = ref('')

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
  <main class="app-shell">
    <DNABorder />
    <div class="app-content">
      <AppHeader page-title="PAGE 1 : SOUMISSION DE SÉQUENCE" subtitle="Saisie guidée" />

      <section class="submission-body">
        <form class="analysis-form" @submit.prevent="submitAnalysis">
          <div class="field">
            <label for="sequence">Collez votre guide ARN</label>
            <input
              id="sequence"
              v-model="form.sequence"
              class="sequence-input"
              type="text"
              placeholder="GGTGAGTGAGTGCATCAGGT"
              autocomplete="off"
              spellcheck="false"
              required
            />
          </div>

          <div class="field">
            <label for="species">Sélection de l'espèce (ex : Humain hg38)</label>
            <select id="species" v-model="form.species">
              <option>Humain (hg38)</option>
              <option>Souris (mm10)</option>
              <option>Rat (rn6)</option>
              <option>Poisson-zèbre (danRer11)</option>
            </select>
          </div>

          <div class="field">
            <label for="advanced">Paramètres avancés</label>
            <select id="advanced" v-model="form.advancedParams">
              <option>Cas9 - Seuil 50%</option>
              <option>Cas9 - Seuil 25%</option>
              <option>Cas9 - Seuil 75%</option>
              <option>Cas12 - Seuil 50%</option>
              <option>dCas9 - Seuil 50%</option>
            </select>
          </div>

          <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

          <button class="submit-button" type="submit" :disabled="isLoading || !form.sequence.trim()">
            <span>{{ isLoading ? 'ANALYSE EN COURS…' : "LANCER L'ANALYSE" }}</span>
            <span class="loader-icon" :class="{ spinning: isLoading }" aria-hidden="true"></span>
          </button>
        </form>
      </section>
    </div>
  </main>
</template>
