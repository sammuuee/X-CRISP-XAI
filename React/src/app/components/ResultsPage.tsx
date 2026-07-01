import DNABorder from './DNABorder';
import RiskGauge from './RiskGauge';

export default function ResultsPage() {
  const sequence = 'GGTGAGTGAGTGCATCAGGT';
  const highlightedSequence = sequence.split('').map((base, idx) => {
    if (idx >= 12 && idx <= 19) {
      return { base, color: '#ff6b6b' };
    }
    return { base, color: '#4a5568' };
  });

  const tableData = [
    { locus: 'Chr 3: Hg_12432', mismatches: '2bp', scoreLocal: 88, typeGene: 'Exonique' },
    { locus: 'Chr 5: Hg_24831', mismatches: '1bp', scoreLocal: 92, typeGene: 'Intronique' },
    { locus: 'Chr 7: Hg_98234', mismatches: '3bp', scoreLocal: 76, typeGene: 'UTR' },
  ];

  return (
    <div className="w-[1440px] h-[900px] mx-auto relative" style={{ background: 'linear-gradient(to bottom, #e0e7ef 0%, #f5f7fa 100%)' }}>
      <DNABorder />

      <div className="relative h-full flex flex-col">
        <div className="border-b border-gray-300 px-12 py-4 flex items-center justify-between" style={{ backgroundColor: '#dce4ec' }}>
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            PAGE 2 : RÉSULTATS ET EXPLICATION (XAI)
          </div>
        </div>

        <div className="flex items-center justify-between px-12 py-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#2C5282' }}>
              X
            </div>
            <span className="font-bold text-2xl" style={{ color: '#2C5282' }}>
              X-CRISP-XAI
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white p-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-4">Résumé du Risque</h3>
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
                  <RiskGauge percentage={82} />
                  <div className="text-center mt-4">
                    <div className="text-2xl font-bold" style={{ color: '#ff6b6b' }}>Risque élevé</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-4">Légende explicative</h3>
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4ade80' }}></div>
                    <span className="text-sm">Faible (0-25%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#fbbf24' }}></div>
                    <span className="text-sm">Moyen (25-50%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#fb923c' }}></div>
                    <span className="text-sm">Haut (50-75%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ff6b6b' }}></div>
                    <span className="text-sm">Très Haut (75-100%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-4">Interprétation des Features</h3>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
                <div className="mb-4">
                  <span className="text-xs text-gray-500 uppercase">Séquence Hors-Cible Principale</span>
                </div>
                <div className="font-mono text-2xl tracking-widest flex gap-1">
                  {highlightedSequence.map((item, idx) => (
                    <span key={idx} style={{ color: item.color, fontWeight: 'bold' }}>
                      {item.base}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-4">Sites Hors-Cible Détectés</h3>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#dce4ec' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Locus</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mismatches</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score Local</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type de gène</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {tableData.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="px-4 py-3 text-sm">{row.locus}</td>
                        <td className="px-4 py-3 text-sm">{row.mismatches}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${row.scoreLocal}%`,
                                  backgroundColor: '#2C5282',
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold">{row.scoreLocal}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{row.typeGene}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
