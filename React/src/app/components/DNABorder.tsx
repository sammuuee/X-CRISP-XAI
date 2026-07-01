export default function DNABorder() {
  return (
    <>
      <svg
        className="absolute -left-16 top-0 h-full w-16 pointer-events-none"
        viewBox="0 0 64 600"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="dna-left" x="0" y="0" width="64" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 Q 32 25 10 50 Q 32 75 10 100"
              stroke="#5a7a9a"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 54 0 Q 32 25 54 50 Q 32 75 54 100"
              stroke="#7a9aba"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <line x1="10" y1="10" x2="54" y2="10" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="25" x2="54" y2="25" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="40" x2="54" y2="40" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="60" x2="54" y2="60" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="75" x2="54" y2="75" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="90" x2="54" y2="90" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <circle cx="10" cy="10" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="54" cy="10" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="10" cy="25" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="54" cy="25" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="10" cy="40" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="54" cy="40" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="10" cy="60" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="54" cy="60" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="10" cy="75" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="54" cy="75" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="10" cy="90" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="54" cy="90" r="3" fill="#4a6a8a" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="64" height="600" fill="url(#dna-left)" />
      </svg>

      <svg
        className="absolute -right-16 top-0 h-full w-16 pointer-events-none"
        viewBox="0 0 64 600"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="dna-right" x="0" y="0" width="64" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 Q 32 25 10 50 Q 32 75 10 100"
              stroke="#5a7a9a"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 54 0 Q 32 25 54 50 Q 32 75 54 100"
              stroke="#7a9aba"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <line x1="10" y1="10" x2="54" y2="10" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="25" x2="54" y2="25" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="40" x2="54" y2="40" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="60" x2="54" y2="60" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="75" x2="54" y2="75" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="10" y1="90" x2="54" y2="90" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <circle cx="10" cy="10" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="54" cy="10" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="10" cy="25" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="54" cy="25" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="10" cy="40" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="54" cy="40" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="10" cy="60" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="54" cy="60" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="10" cy="75" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="54" cy="75" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="10" cy="90" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="54" cy="90" r="3" fill="#4a6a8a" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="64" height="600" fill="url(#dna-right)" />
      </svg>

      <svg
        className="absolute -top-12 left-0 w-full h-12 pointer-events-none"
        viewBox="0 0 600 48"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="dna-top" x="0" y="0" width="100" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 0 10 Q 25 24 50 10 Q 75 24 100 10"
              stroke="#5a7a9a"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 0 38 Q 25 24 50 38 Q 75 24 100 38"
              stroke="#7a9aba"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <line x1="10" y1="10" x2="10" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="25" y1="10" x2="25" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="40" y1="10" x2="40" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="60" y1="10" x2="60" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="75" y1="10" x2="75" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="90" y1="10" x2="90" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <circle cx="10" cy="10" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="10" cy="38" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="25" cy="10" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="25" cy="38" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="40" cy="10" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="40" cy="38" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="60" cy="10" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="60" cy="38" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="75" cy="10" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="75" cy="38" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="90" cy="10" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="90" cy="38" r="3" fill="#4a6a8a" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="48" fill="url(#dna-top)" />
      </svg>

      <svg
        className="absolute -bottom-12 left-0 w-full h-12 pointer-events-none"
        viewBox="0 0 600 48"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="dna-bottom" x="0" y="0" width="100" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 0 10 Q 25 24 50 10 Q 75 24 100 10"
              stroke="#5a7a9a"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 0 38 Q 25 24 50 38 Q 75 24 100 38"
              stroke="#7a9aba"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <line x1="10" y1="10" x2="10" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="25" y1="10" x2="25" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="40" y1="10" x2="40" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="60" y1="10" x2="60" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="75" y1="10" x2="75" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <line x1="90" y1="10" x2="90" y2="38" stroke="#8aaacc" strokeWidth="1.5" opacity="0.3" />
            <circle cx="10" cy="10" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="10" cy="38" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="25" cy="10" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="25" cy="38" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="40" cy="10" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="40" cy="38" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="60" cy="10" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="60" cy="38" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="75" cy="10" r="3" fill="#4a6a8a" opacity="0.5" />
            <circle cx="75" cy="38" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="90" cy="10" r="3" fill="#6a8aaa" opacity="0.5" />
            <circle cx="90" cy="38" r="3" fill="#4a6a8a" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="48" fill="url(#dna-bottom)" />
      </svg>
    </>
  );
}
