import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Building2, CreditCard, Lock, ShieldCheck } from 'lucide-react';

type Step = 1 | 2 | 3;

interface FormData {
  siret: string;
  companyName: string;
  adminEmail: string;
  password: string;
  confirmPassword: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardHolder: string;
}

/* Simulated eligible SIRET codes (14 digits, NAF 7211Z / 2120Z / 7219Z) */
const ELIGIBLE_SIRETS = new Set([
  '36252187900034',
  '35600082700117',
  '51234567800019',
  '78231456700028',
]);

const COMPANY_MAP: Record<string, string> = {
  '36252187900034': 'GenomEdge SAS',
  '35600082700117': 'BioTech Corp. SA',
  '51234567800019': 'InnovaGen Laboratoires',
  '78231456700028': 'CRISPRPath Biotech',
};

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1 as Step, label: 'Vérification SIRET' },
    { n: 2 as Step, label: 'Création du compte' },
    { n: 3 as Step, label: 'Paiement & Activation' },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2"
              style={{
                backgroundColor: current > n ? '#2C5282' : current === n ? '#2C5282' : 'transparent',
                borderColor: current >= n ? '#2C5282' : '#CBD5E1',
                color: current >= n ? '#fff' : '#94A3B8',
              }}
            >
              {current > n ? <CheckCircle2 className="w-4 h-4" /> : n}
            </div>
            <span
              className="text-[11px] font-medium mt-1.5 whitespace-nowrap"
              style={{ color: current >= n ? '#2C5282' : '#94A3B8' }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="w-24 h-0.5 mx-1 mb-5 transition-all"
              style={{ backgroundColor: current > n ? '#2C5282' : '#E2E8F0' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* Step 1: SIRET verification */
function Step1Siret({
  siret, setSiret, onNext,
}: {
  siret: string;
  setSiret: (v: string) => void;
  onNext: (companyName: string) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [resolvedName, setResolvedName] = useState('');

  const handleValidate = () => {
    const clean = siret.replace(/\s/g, '');
    if (clean.length !== 14 || !/^\d+$/.test(clean)) {
      setStatus('error');
      setResolvedName('');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      if (ELIGIBLE_SIRETS.has(clean)) {
        const name = COMPANY_MAP[clean] ?? 'Entreprise Éligible';
        setResolvedName(name);
        setStatus('success');
      } else {
        setStatus('error');
        setResolvedName('');
      }
    }, 1400);
  };

  const formatSiret = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 14);
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,5})/, (_, a, b, c, d) =>
      [a, b, c, d].filter(Boolean).join(' ')
    );
  };

  return (
    <div className="w-[520px]">
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#EEF4FF' }}
        >
          <Building2 className="w-7 h-7" style={{ color: '#2C5282' }} />
        </div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: '#1A2E4A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Vérification de l'Identité
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
          Nous vérifions instantanément l'éligibilité de votre structure.<br />
          <strong>Code APE/NAF requis :</strong> 7211Z, 2120Z ou 7219Z
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
            Numéro SIRET
          </label>
          <input
            type="text"
            value={formatSiret(siret)}
            onChange={e => {
              setSiret(e.target.value.replace(/\D/g, '').slice(0, 14));
              setStatus('idle');
            }}
            placeholder="123 456 789 01234"
            className="w-full px-4 py-3.5 rounded-lg border-2 text-base transition-all focus:outline-none"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              letterSpacing: '0.06em',
              borderColor:
                status === 'error' ? '#EF4444' :
                status === 'success' ? '#10B981' :
                'rgba(44,82,130,0.2)',
              backgroundColor: '#F8FAFF',
              color: '#1A2E4A',
            }}
          />
          <p className="text-xs mt-1.5" style={{ color: '#94A3B8' }}>
            14 chiffres — Entrez votre SIRET à 14 chiffres (ex: 36252187900034 pour démo)
          </p>
        </div>

        {status === 'error' && (
          <div
            className="flex items-start gap-3 p-4 rounded-lg border"
            style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: '#DC2626' }}>
                Cette entreprise n'est pas éligible au service.
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#EF4444' }}>
                SIRET invalide, non trouvé ou code APE/NAF non conforme au secteur biotechnologique.
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div
            className="flex items-start gap-3 p-4 rounded-lg border"
            style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: '#059669' }}>
                Entreprise éligible — {resolvedName}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#10B981' }}>
                Code APE/NAF validé · Secteur biotechnologique confirmé
              </div>
            </div>
          </div>
        )}

        <button
          onClick={status === 'success' ? () => onNext(resolvedName) : handleValidate}
          disabled={siret.length !== 14 || status === 'loading'}
          className="w-full py-3.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            backgroundColor: status === 'success' ? '#059669' : '#2C5282',
            boxShadow: '0 2px 12px rgba(44,82,130,0.2)',
          }}
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Vérification en cours...
            </>
          ) : status === 'success' ? (
            <>
              Continuer — Créer le compte
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Valider l'entreprise
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* Step 2: Account creation */
function Step2Account({
  data, onChange, onNext, onBack,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [passwordError, setPasswordError] = useState('');

  const handleNext = () => {
    if (data.password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (data.password !== data.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    setPasswordError('');
    onNext();
  };

  const fields: { key: keyof FormData; label: string; type: string; placeholder: string; readOnly?: boolean }[] = [
    { key: 'companyName', label: "Nom de l'entreprise", type: 'text', placeholder: 'Pré-rempli via SIRET', readOnly: true },
    { key: 'adminEmail', label: 'Email Administrateur', type: 'email', placeholder: 'admin@votre-labo.fr' },
    { key: 'password', label: 'Mot de Passe', type: 'password', placeholder: '••••••••••••' },
    { key: 'confirmPassword', label: 'Confirmer le Mot de Passe', type: 'password', placeholder: '••••••••••••' },
  ];

  return (
    <div className="w-[520px]">
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#EEF4FF' }}
        >
          <ShieldCheck className="w-7 h-7" style={{ color: '#2C5282' }} />
        </div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: '#1A2E4A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Création du Compte
        </h2>
        <p className="text-sm" style={{ color: '#64748B' }}>
          Renseignez les informations de l'administrateur principal
        </p>
      </div>

      <div className="space-y-4">
        {fields.map(({ key, label, type, placeholder, readOnly }) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
              {label}
            </label>
            <input
              type={type}
              value={data[key]}
              onChange={e => onChange(key, e.target.value)}
              placeholder={placeholder}
              readOnly={readOnly}
              className="w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              style={{
                borderColor: 'rgba(44,82,130,0.2)',
                backgroundColor: readOnly ? '#F1F5F9' : '#F8FAFF',
                color: readOnly ? '#64748B' : '#1A2E4A',
                cursor: readOnly ? 'not-allowed' : 'text',
              }}
            />
          </div>
        ))}

        {passwordError && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#DC2626' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {passwordError}
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm border-2 transition-all hover:bg-blue-50"
            style={{ color: '#2C5282', borderColor: '#2C5282' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <button
            onClick={handleNext}
            disabled={!data.adminEmail || !data.password || !data.confirmPassword}
            className="flex-1 py-3 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: '#2C5282', boxShadow: '0 2px 12px rgba(44,82,130,0.2)' }}
          >
            Continuer vers le paiement
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Step 3: Payment */
function Step3Payment({
  data, onChange, companyName, onBack, onActivate,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
  companyName: string;
  onBack: () => void;
  onActivate: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handlePay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDone(true);
      setTimeout(() => {
        onActivate();
        navigate('/workspace');
      }, 2000);
    }, 2200);
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{0,2})/, (_, a, b) => b ? `${a}/${b}` : a);

  if (done) {
    return (
      <div className="w-[520px] text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#F0FDF4' }}
        >
          <CheckCircle2 className="w-10 h-10" style={{ color: '#10B981' }} />
        </div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: '#1A2E4A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Accès activé !
        </h2>
        <p className="text-sm" style={{ color: '#64748B' }}>
          Bienvenue sur X-CRISP-XAI. Redirection vers votre espace de travail...
        </p>
      </div>
    );
  }

  return (
    <div className="w-[560px]">
      {/* Header row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EEF4FF' }}>
          <CreditCard className="w-5 h-5" style={{ color: '#2C5282' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold leading-tight" style={{ color: '#1A2E4A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Paiement & Activation
          </h2>
          <p className="text-xs" style={{ color: '#64748B' }}>Paiement sécurisé · Aucun engagement de durée</p>
        </div>
      </div>

      {/* Offer summary — compact */}
      <div className="rounded-xl px-4 py-3 mb-3 border flex items-center justify-between" style={{ backgroundColor: '#F8FAFF', borderColor: 'rgba(44,82,130,0.15)' }}>
        <div>
          <div className="text-sm font-bold mb-1" style={{ color: '#1A2E4A' }}>
            Offre Professionnel — {companyName}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {['Analyses illimitées CRISPR-Cas9', 'Rapports XAI PDF/JSON', '5 utilisateurs inclus', 'Support 24/5'].map(item => (
              <span key={item} className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}>
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: '#10B981' }} />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4 pl-4 border-l" style={{ borderColor: 'rgba(44,82,130,0.12)' }}>
          <div className="text-xl font-extrabold" style={{ color: '#2C5282', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>490 €</div>
          <div className="text-xs" style={{ color: '#94A3B8' }}>/ mois HT</div>
          <div className="text-xs font-medium" style={{ color: '#10B981' }}>14 jours offerts</div>
        </div>
      </div>

      {/* Payment form */}
      <div className="rounded-xl px-4 py-3.5 border mb-4" style={{ borderColor: 'rgba(44,82,130,0.15)', backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2 mb-2.5">
          <Lock className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
          <span className="text-xs font-semibold" style={{ color: '#374151' }}>
            Paiement sécurisé SSL — Simulé (module Stripe B2B)
          </span>
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Titulaire de la carte</label>
            <input
              type="text"
              value={data.cardHolder}
              onChange={e => onChange('cardHolder', e.target.value)}
              placeholder="Dr. Claire Martin"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              style={{ borderColor: 'rgba(44,82,130,0.2)', backgroundColor: '#F8FAFF', color: '#1A2E4A' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Numéro de carte</label>
            <input
              type="text"
              value={formatCard(data.cardNumber)}
              onChange={e => onChange('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="4242 4242 4242 4242"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              style={{ fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.04em', borderColor: 'rgba(44,82,130,0.2)', backgroundColor: '#F8FAFF', color: '#1A2E4A' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Expiration (MM/AA)</label>
              <input
                type="text"
                value={formatExpiry(data.cardExpiry)}
                onChange={e => onChange('cardExpiry', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="12/27"
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                style={{ fontFamily: "'Roboto Mono', monospace", borderColor: 'rgba(44,82,130,0.2)', backgroundColor: '#F8FAFF', color: '#1A2E4A' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>CVC</label>
              <input
                type="text"
                value={data.cardCvc.replace(/\D/g, '').slice(0, 3)}
                onChange={e => onChange('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                style={{ fontFamily: "'Roboto Mono', monospace", borderColor: 'rgba(44,82,130,0.2)', backgroundColor: '#F8FAFF', color: '#1A2E4A' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm border-2 transition-all hover:bg-blue-50"
          style={{ color: '#2C5282', borderColor: '#2C5282' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <button
          onClick={handlePay}
          disabled={!data.cardHolder || data.cardNumber.length < 16 || isLoading}
          className="flex-1 py-3 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#059669',
            boxShadow: '0 2px 12px rgba(5,150,105,0.25)',
          }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Activation en cours...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Payer 490 € et Activer l'accès
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function SubscriptionTunnel() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [siret, setSiret] = useState('');
  const [formData, setFormData] = useState<FormData>({
    siret: '',
    companyName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardHolder: '',
  });

  const updateField = (k: keyof FormData, v: string) => setFormData(p => ({ ...p, [k]: v }));

  return (
    <div
      className="w-[1440px] h-[900px] mx-auto relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #EEF4FF 0%, #DBEAFE 50%, #EEF4FF 100%)', fontFamily: "'Inter', sans-serif" }}
    >
      {/* DNA side borders */}
      <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 900" preserveAspectRatio="none">
          <defs>
            <pattern id="st-dna-l" x="0" y="0" width="48" height="80" patternUnits="userSpaceOnUse">
              <path d="M 8 0 Q 24 20 8 40 Q 24 60 8 80" stroke="#4A7AB5" strokeWidth="1.5" fill="none" opacity="0.25" />
              <path d="M 40 0 Q 24 20 40 40 Q 24 60 40 80" stroke="#6A9AD5" strokeWidth="1.5" fill="none" opacity="0.25" />
              <line x1="8" y1="16" x2="40" y2="16" stroke="#5A8ABF" strokeWidth="1" opacity="0.15" />
              <line x1="8" y1="40" x2="40" y2="40" stroke="#5A8ABF" strokeWidth="1" opacity="0.15" />
              <line x1="8" y1="64" x2="40" y2="64" stroke="#5A8ABF" strokeWidth="1" opacity="0.15" />
              <circle cx="8" cy="16" r="2" fill="#3A6AA5" opacity="0.3" />
              <circle cx="40" cy="16" r="2" fill="#5A8AC5" opacity="0.3" />
              <circle cx="8" cy="40" r="2" fill="#5A8AC5" opacity="0.3" />
              <circle cx="40" cy="40" r="2" fill="#3A6AA5" opacity="0.3" />
              <circle cx="8" cy="64" r="2" fill="#3A6AA5" opacity="0.3" />
              <circle cx="40" cy="64" r="2" fill="#5A8AC5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="48" height="900" fill="url(#st-dna-l)" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 900" preserveAspectRatio="none">
          <rect width="48" height="900" fill="url(#st-dna-l)" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10">
        <svg className="w-full h-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <defs>
            <pattern id="st-dna-t" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 8 Q 20 20 40 8 Q 60 20 80 8" stroke="#4A7AB5" strokeWidth="1.5" fill="none" opacity="0.25" />
              <path d="M 0 32 Q 20 20 40 32 Q 60 20 80 32" stroke="#6A9AD5" strokeWidth="1.5" fill="none" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="1440" height="40" fill="url(#st-dna-t)" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-10">
        <svg className="w-full h-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <rect width="1440" height="40" fill="url(#st-dna-t)" />
        </svg>
      </div>

      <div className="relative h-full flex flex-col z-10">
        {/* Header */}
        <header
          className="flex items-center justify-between px-14 py-4 border-b"
          style={{ borderColor: 'rgba(44,82,130,0.12)', backgroundColor: 'rgba(238,244,255,0.9)' }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
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
          </button>
          <div className="text-xs font-medium" style={{ color: '#64748B' }}>
            Inscription · Réservé aux professionnels du secteur biotechnologique
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center px-14 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(44,82,130,0.2) transparent' }}>
          <StepIndicator current={step} />

          <div
            className="bg-white rounded-2xl border mb-5"
            style={{
              borderColor: 'rgba(44,82,130,0.12)',
              boxShadow: '0 8px 40px rgba(44,82,130,0.08), 0 2px 8px rgba(44,82,130,0.05)',
              minWidth: '520px',
              padding: '28px 36px',
            }}
          >
            {step === 1 && (
              <Step1Siret
                siret={siret}
                setSiret={setSiret}
                onNext={name => {
                  updateField('companyName', name);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <Step2Account
                data={formData}
                onChange={updateField}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3Payment
                data={formData}
                onChange={updateField}
                companyName={formData.companyName}
                onBack={() => setStep(2)}
                onActivate={() => {}}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer
          className="px-14 py-2.5 border-t flex items-center justify-between"
          style={{ borderColor: 'rgba(44,82,130,0.1)', backgroundColor: 'rgba(238,244,255,0.9)' }}
        >
          <span className="text-xs" style={{ color: '#94A3B8' }}>© 2025 X-CRISP-XAI</span>
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            <Lock className="w-3 h-3 inline mr-1" />
            Paiement sécurisé SSL · Données hébergées en Europe
          </span>
        </footer>
      </div>
    </div>
  );
}
