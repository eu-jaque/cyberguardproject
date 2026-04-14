export default function CircuitBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, #0a0e17 0%, #000000 100%)" }}>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(212,165,53,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,165,53,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Circuit lines SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left circuits */}
        <path d="M0,120 H200 L240,160 H400" stroke="#d4a535" strokeWidth="1.5" fill="none" filter="url(#glow)" />
        <path d="M0,250 H150 L180,280 H350 L380,250 H500" stroke="#d4a535" strokeWidth="1" fill="none" filter="url(#glow)" />
        <path d="M0,400 H100 L130,370 H280" stroke="#d4a535" strokeWidth="1.5" fill="none" filter="url(#glow)" />
        <path d="M0,550 H180 L210,520 H320" stroke="#d4a535" strokeWidth="1" fill="none" filter="url(#glow)" />

        {/* Right circuits */}
        <path d="M100%,150 H80% L78%,180 H60%" stroke="#d4a535" strokeWidth="1.5" fill="none" filter="url(#glow)"
          style={{ transform: 'translateX(0)' }} />
        <path d="M1920,300 H1700 L1670,330 H1500" stroke="#d4a535" strokeWidth="1" fill="none" filter="url(#glow)" />
        <path d="M1920,480 H1750 L1720,450 H1550 L1520,480 H1400" stroke="#d4a535" strokeWidth="1.5" fill="none" filter="url(#glow)" />
        <path d="M1920,620 H1800 L1770,650 H1600" stroke="#d4a535" strokeWidth="1" fill="none" filter="url(#glow)" />

        {/* Circuit nodes */}
        {[
          [200, 120], [400, 160], [150, 250], [500, 250], [280, 370],
          [320, 520], [1700, 300], [1500, 330], [1550, 450], [1400, 480]
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="#d4a535" opacity="0.6" filter="url(#glow)" />
        ))}
      </svg>
    </div>
  );
}
