<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: {
    type: Number,
    default: 0,
  },
})

const clamped = computed(() => Math.max(0, Math.min(100, props.percentage)))
const rotation = computed(() => -90 + (clamped.value / 100) * 180)
</script>

<template>
  <div class="risk-gauge" role="img" :aria-label="`Risque ${clamped}%`">
    <div class="gauge-arc"></div>
    <div class="gauge-needle" :style="{ transform: `rotate(${rotation}deg)` }"></div>
    <div class="gauge-value">{{ clamped }}%</div>
  </div>
</template>
