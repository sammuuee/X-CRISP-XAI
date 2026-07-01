import { useState } from 'react';
import { Loader2, ChevronDown, ChevronRight, LogOut, Settings, User, HelpCircle, Info } from 'lucide-react';
import DNABorder from './DNABorder';

interface AuthWorkspaceProps {
  onAnalyze: () => void;
}

function BioTechCorpLogo() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[10px] font-extrabold tracking-tight"
        style={{ backgroundColor: '#0D9488', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        BTC
      </div>
      <span className="text-sm font-bold" style={{ color: '#0D9488', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        BioTech Corp.
      </span>
    </div>
  );
}

function UserDropdown({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all hover:bg-blue-50 border"
        style={{ borderColor: 'rgba(44,82,130,0.15)' }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: '#2C5282' }}
        >
          DS
        </div>
        <div className="text-left">
          <div className="text-xs font-semibold" style={{ color: '#1A2E4A' }}>Dr. Smith</div>
          <div className="text-[10px]" style={{ color: '#64748B' }}>Admin · BioTech Corp.</div>
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform"
          style={{ color: '#64748B', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border bg-white shadow-xl z-50 py-1 overflow-hidden"
          style={{ borderColor: 'rgba(44,82,130,0.12)', boxShadow: '0 8px 32px rgba(44,82,130,0.12)' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(44,82,130,0.08)' }}>
            <div className="text-xs font-semibold" style={{ color: '#1A2E4A' }}>Dr. Smith (Admin)</div>
            <div className="text-[11px]" style={{ color: '#64748B' }}>admin@biotech-corp.fr</div>
          </div>
          {[
            { icon: User, label: 'Mon profil' },
            { icon: Settings, label: 'Paramètres entreprise' },
            { icon: HelpCircle, label: 'Documentation XAI' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors text-left"
              style={{ color: '#374151' }}
              onClick={() => setOpen(false)}
            >
              <Icon className="w-4 h-4" style={{ color: '#64748B' }} />
              {label}
            </button>
          ))}
          <div className="border-t my-1" style={{ borderColor: 'rgba(44,82,130,0.08)' }} />
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-50 transition-colors text-left"
            style={{ color: '#DC2626' }}
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

function XAITooltip({ content }: { content: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors hover:bg-blue-100"
        style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}
        aria-label="Aide XAI"
      >
        <Info className="w-3 h-3" style={{ color: '#3B82F6' }} />
      </button>
      {show && (
        <div
          className="absolute left-6 top-0 z-50 w-60 rounded-lg p-3 shadow-xl border text-xs leading-relaxed"
          style={{
            backgroundColor: '#1A2E4A',
            borderColor: 'rgba(59,130,246,0.3)',
            color: '#CBD5E1',
          }}
        >
          <div className="font-semibold mb-1" style={{ color: '#93C5FD' }}>
            IA Explicable (XAI)
          </div>
          {content}
          <div
            className="absolute -left-1.5 top-2 w-3 h-3 rotate-45"
            style={{ backgroundColor: '#1A2E4A', borderLeft: '1px solid rgba(59,130,246,0.3)', borderBottom: '1px solid rgba(59,130,246,0.3)' }}
          />
        </div>
      )}
    </div>
  );
}

export default function AuthWorkspace({ onAnalyze }: AuthWorkspaceProps) {
  const [sequence, setSequence] = useState('');
  const [species, setSpecies] = useState('Humain (hg38)');
  const [advancedParams, setAdvancedParams] = useState('Cas9 - Seuil 50%');
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAnalyze = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAnalyze();
    }, 2000);
  };

  return (
    <div
      className="w-[1440px] h-[900px] mx-auto relative"
      style={{ background: 'linear-gradient(to bottom, #e0e7ef 0%, #f5f7fa 100%)', fontFamily: "'Inter', sans-serif" }}
    >
      <DNABorder />

      <div className="relative h-full flex flex-col">
        {/* Step banner */}
        <div
          className="border-b px-12 py-3 flex items-center justify-between"
          style={{ backgroundColor: '#1A2E4A', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: '#3B82F6' }}
              >
                1
              </div>
              <span className="text-xs font-semibold text-white">Soumission</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: '#64748B' }} />
            <div className="flex items-center gap-2 opacity-50">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold border border-white/30"
                style={{ backgroundColor: 'transparent' }}
              >
                2
              </div>
              <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>Résultats</span>
            </div>
          </div>
          <div className="text-xs font-medium" style={{ color: '#64748B' }}>
            Saisie Guidée · Analyse CRISPR-Cas9
          </div>
        </div>

        {/* Main header */}
        <div
          className="flex items-center justify-between px-12 py-4 border-b"
          style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(44,82,130,0.12)' }}
        >
          {/* Left: Product logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#2C5282', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              X
            </div>
            <div>
              <span
                className="font-extrabold text-xl tracking-tight block leading-none"
                style={{ color: '#2C5282', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                X-CRISP-XAI
              </span>
              <span className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>
                Plateforme d'Analyse Génomique
              </span>
            </div>
            <div
              className="mx-4 h-8 w-px"
              style={{ backgroundColor: 'rgba(44,82,130,0.15)' }}
            />
            {/* Right of divider: licensed by */}
            <div>
              <div className="text-[10px] font-medium mb-1" style={{ color: '#94A3B8' }}>
                Sous licence de
              </div>
              <BioTechCorpLogo />
            </div>
          </div>

          {/* Right: User dropdown */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ backgroundColor: '#F0FDF4', color: '#059669', border: '1px solid #BBF7D0' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Espace actif · BioTech Corp.
            </div>
            <UserDropdown onLogout={() => window.location.href = '/'} />
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="w-full max-w-xl px-8 space-y-7">
            {/* Sequence input */}
            <div>
              <div className="flex items-center mb-3">
                <label htmlFor="aw-sequence" className="block text-sm font-semibold" style={{ color: '#374151' }}>
                  Collez votre guide ARN
                </label>
                <XAITooltip content="La séquence guide ARN (20 nt) est analysée par notre modèle XAI qui identifie les sites de clivage potentiels et génère des explications traçables par attribution de caractéristiques." />
              </div>
              <input
                id="aw-sequence"
                type="text"
                value={sequence}
                onChange={e => setSequence(e.target.value.toUpperCase().replace(/[^AUGCTN]/g, ''))}
                className="w-full px-4 py-3.5 border-2 rounded-lg text-base tracking-widest focus:outline-none transition-all"
                placeholder="GGUGAGUGAGUGCAUCAGGУ"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  letterSpacing: '0.06em',
                  borderColor: sequence ? '#2C5282' : 'rgba(44,82,130,0.25)',
                  backgroundColor: '#F8FAFF',
                  color: '#1A2E4A',
                }}
              />
              {sequence && (
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs" style={{ color: '#64748B' }}>
                    {sequence.length} / 20 nucléotides
                  </span>
                  {sequence.length === 20 && (
                    <span className="text-xs font-medium" style={{ color: '#10B981' }}>
                      ✓ Longueur conforme
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Species */}
            <div>
              <div className="flex items-center mb-3">
                <label htmlFor="aw-species" className="block text-sm font-semibold" style={{ color: '#374151' }}>
                  Sélection de l'espèce
                </label>
                <XAITooltip content="Le génome de référence conditionne la base de données d'alignement. hg38 est recommandé pour les études thérapeutiques humaines. Le modèle adapte ses seuils de spécificité selon l'espèce." />
              </div>
              <div className="relative">
                <select
                  id="aw-species"
                  value={species}
                  onChange={e => setSpecies(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 rounded-lg text-sm appearance-none focus:outline-none transition-all cursor-pointer"
                  style={{
                    borderColor: 'rgba(44,82,130,0.25)',
                    backgroundColor: '#F8FAFF',
                    color: '#1A2E4A',
                  }}
                >
                  <option>Humain (hg38)</option>
                  <option>Souris (mm10)</option>
                  <option>Rat (rn6)</option>
                  <option>Poisson-zèbre (danRer11)</option>
                  <option>Arabidopsis thaliana (TAIR10)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#64748B' }} />
              </div>
            </div>

            {/* Advanced params */}
            <div>
              <div className="flex items-center mb-3">
                <label htmlFor="aw-advanced" className="block text-sm font-semibold" style={{ color: '#374151' }}>
                  Paramètres avancés
                </label>
                <XAITooltip content="Le seuil de confiance détermine la sensibilité de détection des sites hors-cible. Un seuil bas (25%) maximise la détection mais augmente les faux positifs. Le modèle XAI documente son raisonnement pour chaque seuil." />
              </div>
              <div className="relative">
                <select
                  id="aw-advanced"
                  value={advancedParams}
                  onChange={e => setAdvancedParams(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 rounded-lg text-sm appearance-none focus:outline-none transition-all cursor-pointer"
                  style={{
                    borderColor: 'rgba(44,82,130,0.25)',
                    backgroundColor: '#F8FAFF',
                    color: '#1A2E4A',
                  }}
                >
                  <option>Cas9 - Seuil 50%</option>
                  <option>Cas9 - Seuil 25%</option>
                  <option>Cas9 - Seuil 75%</option>
                  <option>Cas12a - Seuil 50%</option>
                  <option>dCas9 (CRISPRi) - Seuil 50%</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#64748B' }} />
              </div>
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !sequence}
              className="w-full py-4 px-6 rounded-lg text-white font-bold text-sm tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase"
              style={{
                backgroundColor: '#2C5282',
                boxShadow: sequence && !isLoading ? '0 4px 20px rgba(44,82,130,0.3)' : 'none',
                letterSpacing: '0.1em',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                  </svg>
                  Lancer l'Analyse XAI
                </>
              )}
            </button>

            {/* Help line */}
            <p className="text-center text-xs" style={{ color: '#94A3B8' }}>
              L'analyse génère un rapport XAI complet avec attribution de caractéristiques · Temps estimé : 8–12 secondes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
