<script setup>
defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <header>
    <div class="page-strip">{{ pageTitle }}</div>
    <div class="brand-bar">
      <RouterLink class="brand" to="/" aria-label="Retour au formulaire">
        <span class="brand-mark">X</span>
        <span>X-CRISP-XAI</span>
      </RouterLink>
      <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
    </div>
  </header>
</template>
