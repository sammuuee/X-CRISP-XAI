import { useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import DNABorder from './DNABorder';

interface SubmissionPageProps {
  onAnalyze: () => void;
}

export default function SubmissionPage({ onAnalyze }: SubmissionPageProps) {
  const [sequence, setSequence] = useState('');
  const [species, setSpecies] = useState('Humain (hg38)');
  const [advancedParams, setAdvancedParams] = useState('Cas9 - Seuil 50%');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAnalyze();
    }, 2000);
  };

  return (
    <div className="w-[1440px] h-[900px] mx-auto relative" style={{ background: 'linear-gradient(to bottom, #e0e7ef 0%, #f5f7fa 100%)' }}>
      <DNABorder />

      <div className="relative h-full flex flex-col">
        <div className="border-b border-gray-300 px-12 py-4 flex items-center justify-between" style={{ backgroundColor: '#dce4ec' }}>
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            PAGE 1 : SOUMISSION DE SÉQUENCE
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
          <div className="text-lg text-gray-600 font-medium">
            Saisie Guidée
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="w-full max-w-2xl px-12 space-y-8">
            <div>
              <label htmlFor="sequence" className="block text-base font-medium text-gray-700 mb-3">
                Collez votre guide ARN
              </label>
              <input
                id="sequence"
                type="text"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-base tracking-widest focus:border-blue-500 focus:outline-none"
                placeholder="GGTGAGTGAGTGCATCAGGT"
                style={{ letterSpacing: '0.05em' }}
              />
            </div>

            <div>
              <label htmlFor="species" className="block text-base font-medium text-gray-700 mb-3">
                Sélection de l'espèce (ex: Humain hg38)
              </label>
              <div className="relative">
                <select
                  id="species"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base appearance-none bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option>Humain (hg38)</option>
                  <option>Souris (mm10)</option>
                  <option>Rat (rn6)</option>
                  <option>Poisson-zèbre (danRer11)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="advanced" className="block text-base font-medium text-gray-700 mb-3">
                Paramètres avancés
              </label>
              <div className="relative">
                <select
                  id="advanced"
                  value={advancedParams}
                  onChange={(e) => setAdvancedParams(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base appearance-none bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option>Cas9 - Seuil 50%</option>
                  <option>Cas9 - Seuil 25%</option>
                  <option>Cas9 - Seuil 75%</option>
                  <option>Cas12 - Seuil 50%</option>
                  <option>dCas9 - Seuil 50%</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !sequence}
              className="w-full py-4 px-6 rounded-lg text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg flex items-center justify-center gap-2 mt-8"
              style={{ backgroundColor: '#2C5282' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  LANCER L'ANALYSE
                </>
              ) : (
                <>
                  LANCER L'ANALYSE
                  <Loader2 className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
