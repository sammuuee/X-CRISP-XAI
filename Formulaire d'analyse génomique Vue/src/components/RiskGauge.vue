<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: {
    type: Number,
    required: true,
  },
})

const rotation = computed(() => (props.percentage / 100) * 180 - 90)
const color = computed(() => {
  if (props.percentage < 25) return '#4ade80'
  if (props.percentage < 50) return '#fbbf24'
  if (props.percentage < 75) return '#fb923c'
  return '#ff6b6b'
})
</script>

<template>
  <div class="risk-gauge">
    <svg viewBox="0 0 200 100" role="img" :aria-label="`Risque : ${percentage}%`">
      <defs>
        <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="25%" stop-color="#fbbf24" />
          <stop offset="50%" stop-color="#fb923c" />
          <stop offset="75%" stop-color="#ff6b6b" />
        </linearGradient>
      </defs>
      <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="#e5e7eb" stroke-width="16" stroke-linecap="round" />
      <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="url(#gauge-gradient)" stroke-width="16" stroke-linecap="round" />
      <g :transform="`rotate(${rotation} 100 90)`">
        <line x1="100" y1="90" x2="100" y2="20" stroke="#2c5282" stroke-width="3" stroke-linecap="round" />
        <circle cx="100" cy="90" r="8" fill="#2c5282" />
        <circle cx="100" cy="20" r="6" fill="#2c5282" />
      </g>
      <text x="100" y="80" text-anchor="middle" font-size="25" font-weight="700" :fill="color">
        {{ percentage }}%
      </text>
    </svg>
  </div>
</template>

<style scoped>
.risk-gauge {
  width: 256px;
  max-width: 100%;
  height: 128px;
  margin: 0 auto;
}

svg {
  width: 100%;
  height: 100%;
}
</style>
