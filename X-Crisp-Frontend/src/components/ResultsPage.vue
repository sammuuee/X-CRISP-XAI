<script setup>
import { computed } from 'vue'
import DNABorder from './DNABorder.vue'
import RiskGauge from './RiskGauge.vue'

const stored = JSON.parse(sessionStorage.getItem('x-crisp-analysis') || 'null')
const request = stored?.request || null
const result = stored?.result || null

const riskPercentage = computed(() => result?.global_score ?? 0)
const riskLabel = computed(() => result?.risk_level ?? 'Analyse non disponible')
const highlightedSequence = computed(() => {
  return (result?.interpreted_sequence || []).map((item, index) => ({
    base: item.char,
    highlighted: item.risk === 'high' || item.risk === 'medium',
    attention: item.attention,
    index: index + 1,
  }))
})
const offTargets = computed(() => {
  return (result?.off_targets || []).map((site) => ({
    locus: site.locus,
    mismatches: `${site.mismatches}bp`,
    localScore: Math.round(site.score * 100),
    geneType: site.gene_type,
  }))
})
</script>

<template>
  <main class="app-shell">
    <DNABorder />
    <div class="app-content">
      <header class="classic-header">
        <div class="page-strip">PAGE 2 : RÉSULTATS ET EXPLICATION (XAI)</div>
        <div class="brand-bar">
          <RouterLink class="brand" to="/workspace">
            <span class="brand-mark">X</span>
            <span>X-CRISP-XAI</span>
          </RouterLink>
          <RouterLink class="back-link" to="/history">Historique</RouterLink>
        </div>
      </header>

      <section v-if="result" class="results-body">
        <div class="results-grid">
          <article>
            <h2>Résumé du risque</h2>
            <div class="panel risk-panel">
              <RiskGauge :percentage="riskPercentage" />
              <p class="risk-label">{{ riskLabel }}</p>
            </div>
          </article>

          <article>
            <h2>Légende explicative</h2>
            <div class="panel legend">
              <p><span class="dot low"></span>Faible (0-25%)</p>
              <p><span class="dot medium"></span>Moyen (25-50%)</p>
              <p><span class="dot high"></span>Haut (50-75%)</p>
              <p><span class="dot very-high"></span>Très haut (75-100%)</p>
            </div>
          </article>
        </div>

        <article>
          <h2>Interprétation des features</h2>
          <div class="panel">
            <p class="small-title">Séquence guide analysée</p>
            <div class="highlighted-sequence" :aria-label="request?.sequence">
              <span
                v-for="item in highlightedSequence"
                :key="item.index"
                :class="{ highlighted: item.highlighted }"
                :title="`Position ${item.index} | attention: ${item.attention}`"
              >
                {{ item.base }}
              </span>
            </div>
          </div>
        </article>

        <article>
          <h2>Sites hors-cible détectés</h2>
          <div class="panel table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Locus</th>
                  <th>Mismatches</th>
                  <th>Score local</th>
                  <th>Type de gène</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in offTargets" :key="row.locus">
                  <td>{{ row.locus }}</td>
                  <td>{{ row.mismatches }}</td>
                  <td>
                    <div class="score-cell">
                      <div class="score-track">
                        <div class="score-fill" :style="{ width: `${row.localScore}%` }"></div>
                      </div>
                      <strong>{{ row.localScore }}</strong>
                    </div>
                  </td>
                  <td>{{ row.geneType }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <RouterLink class="back-link" to="/workspace">Nouvelle analyse</RouterLink>
      </section>

      <section v-else class="results-body">
        <article>
          <h2>Aucune analyse disponible</h2>
          <div class="panel">
            <RouterLink class="back-link" to="/workspace">Lancer une analyse</RouterLink>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>
