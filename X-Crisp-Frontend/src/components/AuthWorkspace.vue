<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, ChevronRight, HelpCircle, Info, LogOut, User } from '@lucide/vue'
import DNABorder from './DNABorder.vue'
import { analyzeSequence, getStoredUser, logoutAccount } from '../services/api'

const router = useRouter()
const user = getStoredUser()
const userMenuOpen = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  sequence: 'CCTGCCTCCGCTCTACTCACTGG',
  target_sequence: 'CCTGGCTCCTCTCTCCTCACTGG',
  dna_sequence: '',
  max_mismatches: 6,
  species: 'Humain (hg38)',
  advancedParams: 'Cas9 - Seuil 50%',
})

function cleanSequence(field, max = 23) {
  form[field] = form[field].toUpperCase().replace(/[^AUGCTN]/g, '').slice(0, max)
}

async function submitAnalysis() {
  errorMessage.value = ''
  isLoading.value = true

  const payload = {
    sequence: form.sequence.trim().toUpperCase(),
    target_sequence: form.target_sequence.trim().toUpperCase() || null,
    dna_sequence: form.dna_sequence.trim().toUpperCase() || null,
    max_mismatches: form.max_mismatches,
    species: form.species,
    nuclease: form.advancedParams.split(' - ')[0],
    threshold: form.advancedParams.match(/Seuil (.+)$/)?.[1] || '50%',
  }

  try {
    const result = await analyzeSequence(payload)
    sessionStorage.setItem('x-crisp-analysis', JSON.stringify({ request: payload, result }))
    await router.push('/results')
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || "L'analyse a échoué."
  } finally {
    isLoading.value = false
  }
}

async function logout() {
  await logoutAccount()
  router.push('/')
}
</script>

<template>
  <main class="workspace-shell">
    <DNABorder />

    <div class="workflow-strip">
      <div>
        <strong>1</strong>
        <span>Soumission</span>
        <ChevronRight :size="15" />
        <span class="muted-step">2 Résultats</span>
      </div>
      <span>Saisie guidée - Analyse CRISPR-Cas9</span>
    </div>

    <header class="workspace-header">
      <div class="workspace-brand">
        <RouterLink class="brand" to="/workspace">
          <span class="brand-mark">X</span>
          <span>X-CRISP-XAI</span>
        </RouterLink>
        <span class="divider"></span>
        <div>
          <small>Sous licence de</small>
          <strong>{{ user?.company_name || 'Laboratoire connecté' }}</strong>
        </div>
      </div>

      <div class="user-area">
        <RouterLink class="active-pill" to="/history">Historique</RouterLink>
        <button class="user-button" type="button" @click="userMenuOpen = !userMenuOpen">
          <span>{{ (user?.company_name || 'XA').slice(0, 2).toUpperCase() }}</span>
          <span>{{ user?.email || 'Compte connecté' }}<br /><small>Compte professionnel</small></span>
          <ChevronDown :size="15" />
        </button>
        <div v-if="userMenuOpen" class="user-dropdown">
          <strong>{{ user?.company_name }}</strong>
          <small>{{ user?.email }}</small>
          <button type="button" @click="router.push('/history')"><User :size="16" />Historique</button>
          <button type="button" @click="router.push('/documentation')"><HelpCircle :size="16" />Documentation XAI</button>
          <button class="danger" type="button" @click="logout"><LogOut :size="16" />Se déconnecter</button>
        </div>
      </div>
    </header>

    <section class="workspace-body">
      <form class="workspace-form" @submit.prevent="submitAnalysis">
        <label>
          <span class="field-title">Guide ARN <Info :size="15" /></span>
          <input
            v-model="form.sequence"
            class="sequence-input"
            placeholder="CCTGCCTCCGCTCTACTCACTGG"
            autocomplete="off"
            spellcheck="false"
            required
            @input="cleanSequence('sequence')"
          />
        </label>
        <div class="sequence-meta">
          <span>{{ form.sequence.length }} / 23 nucléotides</span>
          <strong v-if="form.sequence.length === 23">Longueur conforme</strong>
        </div>

        <label>
          <span class="field-title">Séquence cible potentielle <Info :size="15" /></span>
          <input
            v-model="form.target_sequence"
            class="sequence-input"
            placeholder="CCTGGCTCCTCTCTCCTCACTGG"
            autocomplete="off"
            spellcheck="false"
            @input="cleanSequence('target_sequence')"
          />
        </label>
        <div class="sequence-meta">
          <span>{{ form.target_sequence.length }} / 23 nucléotides</span>
          <strong v-if="form.target_sequence.length === 23">Cible directe prête</strong>
        </div>

        <label>
          <span class="field-title">Région ADN à scanner <Info :size="15" /></span>
          <textarea
            v-model="form.dna_sequence"
            class="sequence-input"
            placeholder="Optionnel : collez une région ADN contenant des candidats off-target"
            rows="4"
            @input="cleanSequence('dna_sequence', 20000)"
          ></textarea>
        </label>

        <label>
          <span>Mismatches maximum</span>
          <select v-model.number="form.max_mismatches">
            <option :value="2">2</option>
            <option :value="4">4</option>
            <option :value="6">6</option>
            <option :value="8">8</option>
          </select>
        </label>

        <label>
          <span class="field-title">Sélection de l'espèce <Info :size="15" /></span>
          <select v-model="form.species">
            <option>Humain (hg38)</option>
          </select>
        </label>

        <label>
          <span class="field-title">Paramètres avancés <Info :size="15" /></span>
          <select v-model="form.advancedParams">
            <option>Cas9 - Seuil 50%</option>
            <option>Cas9 - Seuil 25%</option>
            <option>Cas9 - Seuil 75%</option>
          </select>
        </label>

        <p v-if="errorMessage" class="alert error">{{ errorMessage }}</p>

        <button
          class="solid-button analysis-button"
          type="submit"
          :disabled="isLoading || form.sequence.length !== 23 || (!form.target_sequence.trim() && !form.dna_sequence.trim())"
        >
          {{ isLoading ? 'Analyse en cours...' : "Lancer l'analyse XAI" }}
        </button>

        <p class="help-line">Rapport XAI avec attribution par position et classement des candidats détectés.</p>
      </form>
    </section>
  </main>
</template>
