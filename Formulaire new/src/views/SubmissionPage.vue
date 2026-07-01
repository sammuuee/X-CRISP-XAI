<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import DNABorder from '../components/DNABorder.vue'

const router = useRouter()
const isLoading = ref(false)
const form = reactive({
  sequence: 'GGTGAGTGAGTGCATCAGGT',
  species: 'Humain (hg38)',
  advancedParams: 'Cas9 - Seuil 50%',
})

function submitAnalysis() {
  isLoading.value = true
  window.setTimeout(() => {
    sessionStorage.setItem('x-crisp-analysis', JSON.stringify({
      request: { ...form },
      result: {
        sequence: form.sequence.toUpperCase(),
        riskPercentage: 82,
        riskLabel: 'Risque eleve',
        highlightedRange: { start: 12, end: 19 },
        offTargets: [
          { locus: 'Chr 3: Hg_12432', mismatches: '2bp', localScore: 88, geneType: 'Exonique' },
          { locus: 'Chr 5: Hg_24831', mismatches: '1bp', localScore: 92, geneType: 'Intronique' },
          { locus: 'Chr 7: Hg_98234', mismatches: '3bp', localScore: 76, geneType: 'UTR' },
        ],
      },
    }))
    isLoading.value = false
    router.push('/results')
  }, 700)
}
</script>

<template>
  <main class="app-shell">
    <DNABorder />
    <div class="app-content">
      <header class="classic-header">
        <div class="page-strip">PAGE 1 : SOUMISSION DE SEQUENCE</div>
        <div class="brand-bar">
          <RouterLink class="brand" to="/">
            <span class="brand-mark">X</span>
            <span>X-CRISP-XAI</span>
          </RouterLink>
          <span class="subtitle">Saisie guidee</span>
        </div>
      </header>

      <section class="submission-body">
        <form class="analysis-form" @submit.prevent="submitAnalysis">
          <label class="field">
            Collez votre guide ARN
            <input v-model="form.sequence" class="sequence-input" placeholder="GGTGAGTGAGTGCATCAGGT" required />
          </label>

          <label class="field">
            Selection de l'espece
            <select v-model="form.species">
              <option>Humain (hg38)</option>
              <option>Souris (mm10)</option>
              <option>Rat (rn6)</option>
              <option>Poisson-zebre (danRer11)</option>
            </select>
          </label>

          <label class="field">
            Parametres avances
            <select v-model="form.advancedParams">
              <option>Cas9 - Seuil 50%</option>
              <option>Cas9 - Seuil 25%</option>
              <option>Cas9 - Seuil 75%</option>
              <option>Cas12 - Seuil 50%</option>
              <option>dCas9 - Seuil 50%</option>
            </select>
          </label>

          <button class="submit-button" type="submit" :disabled="isLoading || !form.sequence.trim()">
            {{ isLoading ? 'ANALYSE EN COURS...' : "LANCER L'ANALYSE" }}
          </button>
        </form>
      </section>
    </div>
  </main>
</template>
