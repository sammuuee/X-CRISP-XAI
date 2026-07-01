<script setup>
import { onMounted, ref } from 'vue'
import DNABorder from './DNABorder.vue'
import { fetchHistory } from '../services/api'

const analyses = ref([])
const errorMessage = ref('')

onMounted(async () => {
  try {
    analyses.value = await fetchHistory()
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || "Impossible de charger l'historique."
  }
})
</script>

<template>
  <main class="app-shell">
    <DNABorder />
    <div class="app-content">
      <header class="classic-header">
        <div class="page-strip">HISTORIQUE DES ANALYSES</div>
        <div class="brand-bar">
          <RouterLink class="brand" to="/workspace">
            <span class="brand-mark">X</span>
            <span>X-CRISP-XAI</span>
          </RouterLink>
          <RouterLink class="back-link" to="/workspace">Nouvelle analyse</RouterLink>
        </div>
      </header>

      <section class="results-body">
        <article>
          <h2>Analyses enregistrées</h2>
          <p v-if="errorMessage" class="alert error">{{ errorMessage }}</p>
          <div class="panel table-wrapper">
            <table v-if="analyses.length">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Guide ARN</th>
                  <th>Score</th>
                  <th>Risque</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in analyses" :key="item.id">
                  <td>{{ new Date(item.created_at).toLocaleString('fr-FR') }}</td>
                  <td>{{ item.sequence }}</td>
                  <td>{{ item.score }}%</td>
                  <td>{{ item.risk_level }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="help-line">Aucune analyse enregistrée pour ce compte.</p>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>
