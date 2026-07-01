<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import DNABorder from '../components/DNABorder.vue'

const router = useRouter()
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

function buildMockResult(sequence) {
  return {
    sequence,
    riskPercentage: 82,
    riskLabel: 'Risque eleve',
    highlightedRange: { start: 12, end: 19 },
    offTargets: [
      { locus: 'Chr 3: Hg_12432', mismatches: '2bp', localScore: 88, geneType: 'Exonique' },
      { locus: 'Chr 5: Hg_24831', mismatches: '1bp', localScore: 92, geneType: 'Intronique' },
      { locus: 'Chr 7: Hg_98234', mismatches: '3bp', localScore: 76, geneType: 'UTR' },
    ],
  }
}

function submitAnalysis() {
  errorMessage.value = ''

  if (!form.sequence.trim()) {
    errorMessage.value = 'Veuillez saisir une sequence.'
    return
  }

  isLoading.value = true
  window.setTimeout(() => {
    const payload = {
      sequence: form.sequence.trim().toUpperCase(),
      species: form.species,
      parameters: form.advancedParams,
    }

    sessionStorage.setItem('x-crisp-analysis', JSON.stringify({
      request: payload,
      result: buildMockResult(payload.sequence),
    }))

    isLoading.value = false
    router.push('/results')
  }, 900)
}
</script>

<template>
  <main class="workspace-shell">
    <DNABorder />

    <div class="workflow-strip">
      <div>
        <strong>1</strong>
        <span>Soumission</span>
        <span class="muted-step">2 Resultats</span>
      </div>
      <span>Saisie guidee - Analyse CRISPR-Cas9</span>
    </div>

    <header class="workspace-header">
      <div class="workspace-brand">
        <RouterLink class="brand" to="/">
          <span class="brand-mark">X</span>
          <span>X-CRISP-XAI</span>
        </RouterLink>
        <span class="divider"></span>
        <div>
          <small>Sous licence de</small>
          <strong>BioTech Corp.</strong>
        </div>
      </div>

      <div class="user-area">
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

        <p v-if="errorMessage" class="alert error">{{ errorMessage }}</p>

        <button class="solid-button analysis-button" type="submit" :disabled="isLoading || !form.sequence.trim()">
          {{ isLoading ? 'Analyse en cours...' : "Lancer l'analyse XAI" }}
        </button>

        <p class="help-line">Rapport XAI complet avec attribution de caracteristiques - temps estime : 8 a 12 secondes.</p>
      </form>
    </section>
  </main>
</template>
