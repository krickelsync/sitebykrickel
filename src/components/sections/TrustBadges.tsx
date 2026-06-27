const badges = [
  {
    label: "Easy to install",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          stroke="currentColor"
          strokeWidth="1.8"
          d="M12,18 L12,8 L12,18 Z M12,23 C18.0751322,23 23,18.0751322 23,12 C23,5.92486775 18.0751322,1 12,1 C5.92486775,1 1,5.92486775 1,12 C1,18.0751322 5.92486775,23 12,23 Z M17,12 L12,7 L7,12"
          transform="matrix(1 0 0 -1 0 24)"
        />
      </svg>
    ),
  },
  {
    label: "Built for Shopify 2.0",
    svg: (
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.919 4.546c-0.025 0-0.075 0.026-0.097 0.026s-0.361 0.094-0.892 0.262c-0.529-1.541-1.47-2.962-3.134-2.962h-0.144c-0.356-0.5-0.921-0.832-1.564-0.868l-0.005-0c-3.881 0-5.736 4.845-6.317 7.305-1.492 0.456-2.578 0.795-2.699 0.842-0.844 0.266-0.867 0.29-0.965 1.087-0.094 0.577-2.287 17.574-2.287 17.574l16.946 3.183zM17.18 2.935c0.867 0.092 1.426 1.083 1.786 2.193-0.436 0.142-0.919 0.289-1.447 0.457v-0.315c0.001-0.049 0.002-0.107 0.002-0.165 0-0.777-0.125-1.524-0.355-2.224l0.014 0.050zM16.506 5.727v0.169c-0.942 0.29-1.978 0.605-2.992 0.92 0.264-1.607 1.237-2.944 2.58-3.699l0.026-0.013c0.248 0.705 0.391 1.518 0.391 2.365 0 0.091-0.002 0.182-0.005 0.273l0-0.013zM14.963 2.042c0 0 0.001 0 0.001 0 0.19 0 0.366 0.063 0.507 0.17l-0.002-0.002c-1.749 1.048-2.947 2.861-3.132 4.964l-0.002 0.024c-0.82 0.266-1.616 0.506-2.361 0.722 0.648-2.231 2.216-5.867 4.988-5.867zM15.638 15.132c-0.648-0.32-1.408-0.514-2.211-0.53l-0.005-0c-1.808 0-1.879 1.132-1.879 1.426 0 1.54 4.049 2.143 4.049 5.785 0.014 0.128 0.021 0.277 0.021 0.427 0 2.359-1.912 4.271-4.271 4.271-0.002 0-0.005 0-0.007 0h0c-0.050 0.002-0.108 0.002-0.166 0.002-1.676 0-3.187-0.703-4.255-1.83l-0.003-0.003 0.807-2.607c0.774 0.68 1.745 1.154 2.817 1.328l0.033 0.004c0.012 0 0.025 0.001 0.039 0.001 0.646 0 1.171-0.52 1.18-1.165v-0.001c0-2.023-3.317-2.117-3.317-5.447-0-0.020-0-0.044-0-0.068 0-3.026 2.453-5.478 5.478-5.478 0.195 0 0.388 0.010 0.578 0.030l-0.024-0.002c0.077-0.004 0.167-0.007 0.258-0.007 0.756 0 1.474 0.169 2.116 0.471l-0.030-0.013-1.181 3.393zM20.17 30.97l9.017-1.951s-3.254-22.010-3.28-22.156c-0.018-0.133-0.128-0.235-0.263-0.24h-0c-0.121 0-2.411-0.17-2.411-0.17s-1.593-1.592-1.798-1.763c-0.043-0.039-0.093-0.070-0.148-0.091l-0.003-0.001-1.142 26.372z"
        />
      </svg>
    ),
  },
  {
    label: "No coding required",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M17 17L22 12L17 7M7 7L2 12L7 17M14 3L10 21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Simple Drag & Drop",
    svg: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M14 6h2v2h5a1 1 0 0 1 1 1v7.5L16 13l.036 8.062 2.223-2.15L20.041 22H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zm8 11.338V21a1 1 0 0 1-.048.307l-1.96-3.394L22 17.338zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z"
        />
      </svg>
    ),
  },
];

const TrustBadges = () => {
  return (
    <section className="relative py-12 md:py-16 px-4 md:px-8 border-t border-border/40">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        {badges.map((b) => (
          <div
            key={b.label}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm flex items-center justify-center text-foreground transition-colors hover:text-primary hover:border-primary/40">
              <span className="w-6 h-6 md:w-7 md:h-7 block [&>svg]:w-full [&>svg]:h-full">
                {b.svg}
              </span>
            </div>
            <p className="font-syne font-semibold text-xs md:text-sm leading-tight max-w-[10ch]">
              {b.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;