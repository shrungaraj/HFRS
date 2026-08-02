import './Logo.css'

export function Logo() {
  return (
    <div className="logo">
      <svg
        className="logo-icon"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="10"
          width="10"
          height="10"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="18"
          y="10"
          width="10"
          height="10"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 15h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 4v4M16 24v4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="logo-text">ChainCert</span>
    </div>
  )
}
