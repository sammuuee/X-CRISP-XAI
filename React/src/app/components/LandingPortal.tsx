import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Cpu, Lock, Eye, EyeOff, AlertCircle, ArrowRight, FlaskConical } from 'lucide-react';

function DNAHelixPanel() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 620 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Large helix strand 1 — leftish */}
      <path
        d="M 60 -20 Q 160 100 60 220 Q 160 340 60 460 Q 160 580 60 700 Q 160 820 60 940"
        stroke="rgba(147,197,253,0.07)" strokeWidth="3" fill="none"
      />
      <path
        d="M 160 -20 Q 60 100 160 220 Q 60 340 160 460 Q 60 580 160 700 Q 60 820 160 940"
        stroke="rgba(147,197,253,0.07)" strokeWidth="3" fill="none"
      />
      {/* Rungs strand 1 */}
      {[30, 90, 150, 210, 270, 330, 390, 450, 510, 570, 630, 690, 750].map((y, i) => (
        <line key={`r1-${i}`} x1="65" y1={y} x2="155" y2={y}
          stroke="rgba(147,197,253,0.05)" strokeWidth="1.5" />
      ))}
      {/* Large helix strand 2 — rightish */}
      <path
        d="M 420 -20 Q 540 100 420 220 Q 540 340 420 460 Q 540 580 420 700 Q 540 820 420 940"
        stroke="rgba(96,165,250,0.06)" strokeWidth="2.5" fill="none"
      />
      <path
        d="M 540 -20 Q 420 100 540 220 Q 420 340 540 460 Q 420 580 540 700 Q 420 820 540 940"
        stroke="rgba(96,165,250,0.06)" strokeWidth="2.5" fill="none"
      />
      {[20, 80, 140, 200, 260, 320, 380, 440, 500, 560, 620, 680, 740].map((y, i) => (
        <line key={`r2-${i}`} x1="425" y1={y} x2="535" y2={y}
          stroke="rgba(96,165,250,0.04)" strokeWidth="1.5" />
      ))}
      {/* Scattered nucleotide dots */}
      {[
        [65, 30], [155, 30], [65, 150], [155, 150], [65, 270], [155, 270],
        [65, 390], [155, 390], [65, 510], [155, 510], [65, 630], [155, 630],
        [425, 80], [535, 80], [425, 200], [535, 200], [425, 320], [535, 320],
        [425, 440], [535, 440], [425, 560], [535, 560],
      ].map(([cx, cy], i) => (
        <circle key={`d-${i}`} cx={cx} cy={cy} r="3.5"
          fill="rgba(147,197,253,0.12)" />
      ))}
    </svg>
  );
}

const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'live.com', 'icloud.com', 'free.fr', 'wanadoo.fr', 'orange.fr',
]);

export default function LandingPortal() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    const domain = email.split('@')[1] ?? '';
    if (PERSONAL_DOMAINS.has(domain.toLowerCase())) {
      setError("Veuillez utiliser une adresse email professionnelle (pas Gmail, Yahoo, etc.).");
      return;
    }
    if (!domain.includes('.')) {
      setError("Adresse email invalide.");
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/workspace');
    }, 1600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email && password) handleLogin();
  };

  return (
    <div
      className="w-[1440px] h-[900px] mx-auto relative overflow-hidden"
      style={{ background: '#EEF4FF', fontFamily: "'Inter', sans-serif" }}
    >
      {/* DNA border strips — inline positioned inside canvas */}
      <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-20" style={{ background: 'linear-gradient(to right, rgba(44,82,130,0.06), transparent)' }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 900" preserveAspectRatio="none">
          <defs>
            <pattern id="lp-dna-left" x="0" y="0" width="48" height="80" patternUnits="userSpaceOnUse">
              <path d="M 8 0 Q 24 20 8 40 Q 24 60 8 80" stroke="#4A7AB5" strokeWidth="1.5" fill="none" opacity="0.3" />
              <path d="M 40 0 Q 24 20 40 40 Q 24 60 40 80" stroke="#6A9AD5" strokeWidth="1.5" fill="none" opacity="0.3" />
              <line x1="8" y1="8" x2="40" y2="8" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="8" y1="24" x2="40" y2="24" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="8" y1="40" x2="40" y2="40" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="8" y1="56" x2="40" y2="56" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="8" y1="72" x2="40" y2="72" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <circle cx="8" cy="8" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="40" cy="8" r="2.5" fill="#5A8AC5" opacity="0.35" />
              <circle cx="8" cy="24" r="2.5" fill="#5A8AC5" opacity="0.35" />
              <circle cx="40" cy="24" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="8" cy="40" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="40" cy="40" r="2.5" fill="#5A8AC5" opacity="0.35" />
              <circle cx="8" cy="56" r="2.5" fill="#5A8AC5" opacity="0.35" />
              <circle cx="40" cy="56" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="8" cy="72" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="40" cy="72" r="2.5" fill="#5A8AC5" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="48" height="900" fill="url(#lp-dna-left)" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-20" style={{ background: 'linear-gradient(to left, rgba(44,82,130,0.06), transparent)' }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 900" preserveAspectRatio="none">
          <defs>
            <pattern id="lp-dna-right" x="0" y="0" width="48" height="80" patternUnits="userSpaceOnUse">
              <path d="M 8 0 Q 24 20 8 40 Q 24 60 8 80" stroke="#4A7AB5" strokeWidth="1.5" fill="none" opacity="0.3" />
              <path d="M 40 0 Q 24 20 40 40 Q 24 60 40 80" stroke="#6A9AD5" strokeWidth="1.5" fill="none" opacity="0.3" />
              <line x1="8" y1="8" x2="40" y2="8" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="8" y1="24" x2="40" y2="24" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="8" y1="40" x2="40" y2="40" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="8" y1="56" x2="40" y2="56" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="8" y1="72" x2="40" y2="72" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <circle cx="8" cy="8" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="40" cy="8" r="2.5" fill="#5A8AC5" opacity="0.35" />
              <circle cx="8" cy="24" r="2.5" fill="#5A8AC5" opacity="0.35" />
              <circle cx="40" cy="24" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="8" cy="40" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="40" cy="40" r="2.5" fill="#5A8AC5" opacity="0.35" />
              <circle cx="8" cy="56" r="2.5" fill="#5A8AC5" opacity="0.35" />
              <circle cx="40" cy="56" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="8" cy="72" r="2.5" fill="#3A6AA5" opacity="0.35" />
              <circle cx="40" cy="72" r="2.5" fill="#5A8AC5" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="48" height="900" fill="url(#lp-dna-right)" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-20">
        <svg className="w-full h-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <defs>
            <pattern id="lp-dna-top" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 8 Q 20 20 40 8 Q 60 20 80 8" stroke="#4A7AB5" strokeWidth="1.5" fill="none" opacity="0.3" />
              <path d="M 0 32 Q 20 20 40 32 Q 60 20 80 32" stroke="#6A9AD5" strokeWidth="1.5" fill="none" opacity="0.3" />
              <line x1="8" y1="8" x2="8" y2="32" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="24" y1="8" x2="24" y2="32" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="40" y1="8" x2="40" y2="32" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="56" y1="8" x2="56" y2="32" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
              <line x1="72" y1="8" x2="72" y2="32" stroke="#5A8ABF" strokeWidth="1" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="1440" height="40" fill="url(#lp-dna-top)" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-20">
        <svg className="w-full h-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <use href="#lp-dna-top" />
          <rect width="1440" height="40" fill="url(#lp-dna-top)" />
        </svg>
      </div>

      {/* Main layout */}
      <div className="relative h-full flex flex-col z-10">
        {/* Header */}
        <header
          className="flex items-center justify-between px-14 py-4 border-b"
          style={{ borderColor: 'rgba(44,82,130,0.12)', backgroundColor: 'rgba(238,244,255,0.95)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base"
              style={{ backgroundColor: '#2C5282', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              X
            </div>
            <span
              className="font-extrabold text-xl tracking-tight"
              style={{ color: '#2C5282', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              X-CRISP-XAI
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
              style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}
            >
              v2.1 BETA
            </span>
          </div>
          <span className="text-xs text-gray-500">Plateforme réservée aux professionnels</span>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left — Marketing */}
          <div
            className="relative w-[620px] flex-shrink-0 flex flex-col justify-center px-16 py-10 overflow-hidden"
            style={{ backgroundColor: '#1A2E4A' }}
          >
            <DNAHelixPanel />
            <div className="relative z-10">
              <div
                className="flex items-center gap-2 mb-6"
              >
                <FlaskConical className="w-4 h-4" style={{ color: '#60A5FA' }} />
                <span
                  className="text-xs font-semibold tracking-[0.18em] uppercase"
                  style={{ color: '#60A5FA' }}
                >
                  Analyse Génomique CRISPR-Cas9
                </span>
              </div>

              <h1
                className="text-[36px] font-extrabold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Accédez au Standard<br />
                de l'Analyse CRISPR-Cas9<br />
                <span style={{ color: '#93C5FD' }}>Professionnelle.</span>
              </h1>

              <p className="text-sm leading-relaxed mb-8" style={{ color: '#93C5FD' }}>
                Une plateforme de précision clinique conçue exclusivement pour les laboratoires agréés
                et les entreprises du secteur biotechnologique européen.
              </p>

              <div className="space-y-5 mb-10">
                {[
                  {
                    Icon: Cpu,
                    label: 'Précision algorithmique',
                    desc: 'Modèles IA entraînés sur 50M+ sites génomiques validés cliniquement',
                  },
                  {
                    Icon: Shield,
                    label: 'XAI Compréhensible',
                    desc: 'Chaque prédiction est expliquée, traçable et prête pour publication peer-reviewed',
                  },
                  {
                    Icon: Lock,
                    label: 'Sécurité des données',
                    desc: 'Hébergement souverain EU, conformité RGPD certifiée ISO 27001',
                  },
                ].map(({ Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: 'rgba(59,130,246,0.18)' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: '#60A5FA' }} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{label}</div>
                      <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#7AB3E0' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/subscribe')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: '#3B82F6', boxShadow: '0 4px 24px rgba(59,130,246,0.25)' }}
              >
                S'abonner — Vérification SIRET requise
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="mt-3 text-xs" style={{ color: '#6B8EAA' }}>
                Réservé aux structures avec code APE/NAF biotechnologique
              </p>
            </div>
          </div>

          {/* Right — Login */}
          <div
            className="flex-1 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #EEF4FF 0%, #DBEAFE 100%)' }}
          >
            <div id="login-panel" className="w-[420px]">
              {/* Decorative label */}
              <div className="text-center mb-6">
                <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#64748B' }}>
                  Accès Abonnés
                </span>
              </div>

              <div
                className="bg-white rounded-2xl p-10 border"
                style={{
                  borderColor: 'rgba(44,82,130,0.1)',
                  boxShadow: '0 8px 40px rgba(44,82,130,0.1), 0 2px 8px rgba(44,82,130,0.06)',
                }}
              >
                <div className="mb-7">
                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ color: '#1A2E4A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Connexion Entreprise
                  </h2>
                  <p className="text-xs" style={{ color: '#64748B' }}>
                    Accès réservé aux abonnés professionnels certifiés
                  </p>
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2.5 p-3 rounded-lg text-sm mb-5 border"
                    style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                      Email Professionnel
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      onKeyDown={handleKeyDown}
                      placeholder="dr.martin@biotech-corp.fr"
                      className="w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      style={{
                        borderColor: 'rgba(44,82,130,0.2)',
                        backgroundColor: '#F8FAFF',
                        color: '#1A2E4A',
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium" style={{ color: '#374151' }}>
                        Mot de Passe
                      </label>
                      <button className="text-xs hover:underline" style={{ color: '#2C5282' }}>
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 pr-11 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        style={{
                          borderColor: 'rgba(44,82,130,0.2)',
                          backgroundColor: '#F8FAFF',
                          color: '#1A2E4A',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={!email || !password || isLoading}
                    className="w-full py-3.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 mt-1"
                    style={{
                      backgroundColor: '#2C5282',
                      boxShadow: '0 2px 12px rgba(44,82,130,0.25)',
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Vérification...
                      </span>
                    ) : (
                      'Se Connecter'
                    )}
                  </button>
                </div>

                <div className="mt-7 pt-6 border-t text-center" style={{ borderColor: 'rgba(44,82,130,0.1)' }}>
                  <p className="text-xs" style={{ color: '#64748B' }}>
                    Pas encore abonné ?{' '}
                    <button
                      onClick={() => navigate('/subscribe')}
                      className="font-semibold hover:underline"
                      style={{ color: '#2C5282' }}
                    >
                      Vérifier l'éligibilité de votre structure
                    </button>
                  </p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-5">
                {['ISO 27001', 'RGPD Conforme', 'Hébergement EU'].map(label => (
                  <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="px-14 py-2.5 border-t flex items-center justify-between"
          style={{ borderColor: 'rgba(44,82,130,0.1)', backgroundColor: 'rgba(238,244,255,0.9)' }}
        >
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            © 2025 X-CRISP-XAI · Tous droits réservés
          </span>
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            Réservé aux laboratoires et entreprises du secteur biotechnologique ·{' '}
            <button className="hover:underline">Mentions légales</button> ·{' '}
            <button className="hover:underline">Politique RGPD</button> ·{' '}
            <button className="hover:underline">CGU</button>
          </span>
        </footer>
      </div>
    </div>
  );
}
