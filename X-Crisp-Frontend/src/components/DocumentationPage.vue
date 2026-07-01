<template>
  <main class="app-shell doc-shell">
    <DNABorder />

    <div class="app-content">
      <header class="classic-header">
        <div class="page-strip">DOCUMENTATION</div>
        <div class="brand-bar">
          <RouterLink class="brand" to="/workspace">
            <span class="brand-mark">X</span>
            <span>X-CRISP-XAI</span>
          </RouterLink>
          <nav class="header-links" aria-label="Navigation secondaire">
            <RouterLink class="back-link" to="/workspace">Analyse</RouterLink>
            <RouterLink class="back-link" to="/history">Historique</RouterLink>
          </nav>
        </div>
      </header>

      <section class="doc-hero">
        <p class="eyebrow-blue">Guide d'utilisation</p>
        <h1>Comprendre le flux d'analyse CRISPR-Cas9</h1>
        <p>
          Cette documentation résume les données attendues, le rôle du backend et la manière dont le module IA
          interprète les séquences pour produire un score de risque et des explications XAI.
        </p>
      </section>

      <section class="doc-grid">
        <article class="doc-panel">
          <span class="doc-index">01</span>
          <h2>Données saisies</h2>
          <p>
            Le guide ARN doit contenir 23 nucléotides. La séquence cible directe permet une comparaison immédiate,
            tandis que la région ADN sert à rechercher automatiquement des candidats hors-cible.
          </p>
          <ul>
            <li>Guide ARN : caractères A, U/T, G et C.</li>
            <li>Séquence cible : 23 nucléotides attendus.</li>
            <li>Région ADN : zone plus longue scannée côté backend.</li>
          </ul>
        </article>

        <article class="doc-panel">
          <span class="doc-index">02</span>
          <h2>Recherche des candidats</h2>
          <p>
            Le backend transmet les données au module IA. Pour une région ADN, une fenêtre de 23 nucléotides est
            déplacée sur les deux brins, puis les candidats compatibles avec un PAM NGG sont classés.
          </p>
          <ul>
            <li>Filtrage par nombre maximum de mismatches.</li>
            <li>Prise en compte du guide et des séquences candidates.</li>
            <li>Retour des meilleurs sites hors-cible détectés.</li>
          </ul>
        </article>

        <article class="doc-panel">
          <span class="doc-index">03</span>
          <h2>Score et explication</h2>
          <p>
            Le modèle produit un score global et une attribution par position. La page de résultats affiche les bases
            importantes, le niveau de risque et les sites hors-cible associés.
          </p>
          <ul>
            <li>Score global exprimé en pourcentage.</li>
            <li>Légende faible, moyen, haut et très haut.</li>
            <li>Visualisation des positions les plus influentes.</li>
          </ul>
        </article>

        <article class="doc-panel">
          <span class="doc-index">04</span>
          <h2>Historique</h2>
          <p>
            Chaque analyse lancée depuis un compte connecté est enregistrée dans SQLite. L'historique permet de
            retrouver les séquences, le score obtenu et le niveau de risque calculé.
          </p>
          <ul>
            <li>Stockage local dans la base applicative.</li>
            <li>Historique lié au compte connecté.</li>
            <li>Consultation depuis le menu de l'espace de travail.</li>
          </ul>
        </article>
      </section>

      <section class="doc-note">
        <strong>Limites du prototype</strong>
        <p>
          Le scan complet d'un génome humain doit rester confié à un outil spécialisé comme Cas-OFFinder. Ici, le
          formulaire est conçu pour les régions ciblées, les tests de validation et la démonstration du pipeline.
        </p>
      </section>
    </div>
  </main>
</template>

<script setup>
import DNABorder from './DNABorder.vue'
</script>
