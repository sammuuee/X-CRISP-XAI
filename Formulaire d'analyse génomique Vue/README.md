# Formulaire d'analyse génomique - Vue

Conversion en Vue 3 et JavaScript du projet React d'origine.

## Lancer le projet

```bash
npm install
npm run dev
```

## Connecter l'API

Copier `.env.example` vers `.env`, puis adapter `VITE_API_URL`.

Le formulaire envoie une requête `POST` vers :

```text
${VITE_API_URL}/api/analyze
```

Corps JSON :

```json
{
  "sequence": "GGTGAGTGAGTGCATCAGGT",
  "species": "Humain (hg38)",
  "parameters": "Cas9 - Seuil 50%"
}
```

Sans `VITE_API_URL`, `src/services/analysisApi.js` renvoie des données simulées afin que le parcours reste testable.
