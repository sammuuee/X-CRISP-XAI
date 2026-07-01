<script setup>
import { computed } from 'vue'
import DNABorder from '../components/DNABorder.vue'
import RiskGauge from '../components/RiskGauge.vue'

const stored = JSON.parse(sessionStorage.getItem('x-crisp-analysis') || 'null')
const fallback = {
  sequence: 'GGTGAGTGAGTGCATCAGGT',
  riskPercentage: 82,
  riskLabel: 'Risque eleve',
  highlightedRange: { start: 12, end: 19 },
  offTargets: [
    { locus: 'Chr 3: Hg_12432', mismatches: '2bp', localScore: 88, geneType: 'Exonique' },
    { locus: 'Chr 5: Hg_24831', mismatches: '1bp', localScore: 92, geneType: 'Intronique' },
    { locus: 'Chr 7: Hg_98234', mismatches: '3bp', localScore: 76, geneType: 'UTR' },
  ],
}

const result = computed(() => stored?.result || fallback)
const highlightedSequence = computed(() => {
  const range = result.value.highlightedRange || { start: -1, end: -1 }
  return result.value.sequence.split('').map((base, index) => ({
    base,
    highlighted: index >= range.start && index <= range.end,
  }))
})
</script>

<template>
  <main class="app-shell">
    <DNABorder />
    <div class="app-content">
      <header class="classic-header">
        <div class="page-strip">PAGE 2 : RESULTATS ET EXPLICATION (XAI)</div>
        <div class="brand-bar">
          <RouterLink class="brand" to="/workspace">
            <span class="brand-mark">X</span>
            <span>X-CRISP-XAI</span>
          </RouterLink>
        </div>
      </header>

      <section class="results-body">
        <div class="results-grid">
          <article>
            <h2>Resume du risque</h2>
            <div class="panel risk-panel">
              <RiskGauge :percentage="result.riskPercentage" />
              <p class="risk-label">{{ result.riskLabel }}</p>
            </div>
          </article>

          <article>
            <h2>Legende explicative</h2>
            <div class="panel legend">
              <p><span class="dot low"></span>Faible (0-25%)</p>
              <p><span class="dot medium"></span>Moyen (25-50%)</p>
              <p><span class="dot high"></span>Haut (50-75%)</p>
              <p><span class="dot very-high"></span>Tres haut (75-100%)</p>
            </div>
          </article>
        </div>

        <article>
          <h2>Interpretation des features</h2>
          <div class="panel">
            <p class="small-title">Sequence hors-cible principale</p>
            <div class="highlighted-sequence" :aria-label="result.sequence">
              <span v-for="(item, index) in highlightedSequence" :key="index" :class="{ highlighted: item.highlighted }">
                {{ item.base }}
              </span>
            </div>
          </div>
        </article>

        <article>
          <h2>Sites hors-cible detectes</h2>
          <div class="panel table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Locus</th>
                  <th>Mismatches</th>
                  <th>Score local</th>
                  <th>Type de gene</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in result.offTargets" :key="row.locus">
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
    </div>
  </main>
</template>
