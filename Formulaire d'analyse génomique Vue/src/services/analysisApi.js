const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

const mockResult = {
  riskPercentage: 82,
  riskLabel: 'Risque élevé',
  highlightedRange: { start: 12, end: 19 },
  offTargets: [
    { locus: 'Chr 3: Hg_12432', mismatches: '2bp', localScore: 88, geneType: 'Exonique' },
    { locus: 'Chr 5: Hg_24831', mismatches: '1bp', localScore: 92, geneType: 'Intronique' },
    { locus: 'Chr 7: Hg_98234', mismatches: '3bp', localScore: 76, geneType: 'UTR' },
  ],
}

export async function analyzeSequence(payload) {
  if (!apiUrl) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    return {
      ...mockResult,
      sequence: payload.sequence,
    }
  }

  const response = await fetch(`${apiUrl}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`L'analyse a échoué (${response.status}).`)
  }

  return response.json()
}
