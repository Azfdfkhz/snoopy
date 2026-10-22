// Latar taman bergaya cat air pastel. Semua lapisan selalu ada; tema (theme) hanya mengatur
// lapisan mana yang terlihat sehingga latar berganti dengan transisi halus.
// theme: "meadow" | "city" | "bench" | "sign" | "flowers" | "fence"
const INK = "#27303b";

// Posisi bunga dibuat deterministik (tanpa Math.random) agar sama di server dan browser.
function lcg(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const FLOWER_COLORS = ["#f48fb1", "#ffd54f", "#ffffff", "#ff8a65", "#ba68c8", "#fff59d"];
const FLOWERS = (() => {
  const r = lcg(11);
  return Array.from({ length: 54 }, (_, i) => ({
    x: Math.round(r() * 980) / 10,
    y: Math.round((2 + r() * 20) * 10) / 10,
    s: Math.round((11 + r() * 10) * 10) / 10,
    c: FLOWER_COLORS[i % FLOWER_COLORS.length]
  }));
})();

const BUILDINGS = [
  [4, 46, 9], [14, 62, 8], [23, 38, 7], [31, 70, 10], [42, 50, 8], [51, 66, 9], [61, 42, 7], [69, 58, 10], [80, 48, 8], [89, 64, 9]
];

function Cloud({ className }) {
  return (
    <svg className={`cloud ${className}`} viewBox="0 0 140 60" aria-hidden="true">
      <defs>
        <linearGradient id={`cg-${className}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#e3f1fb" />
        </linearGradient>
      </defs>
      <path d="M24 54 C 2 54, 0 32, 20 30 C 20 10, 46 6, 56 22 C 64 4, 94 6, 98 28 C 122 24, 134 52, 112 54 Z" fill={`url(#cg-${className})`} />
    </svg>
  );
}

function BigTree({ className, flip }) {
  const id = `tg-${className}`;
  return (
    <svg className={`big-tree ${className}`} viewBox="0 0 220 300" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <defs>
        <radialGradient id={id} cx=".4" cy=".35" r=".75">
          <stop offset="0" stopColor="#9bd98a" /><stop offset=".6" stopColor="#6fbd6a" /><stop offset="1" stopColor="#4f9e58" />
        </radialGradient>
      </defs>
      <path d="M92 300 C 98 246, 96 200, 88 150 L 128 150 C 122 200, 122 248, 130 300 Z" fill="#a9754a" stroke="#7d5232" strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 280 C 104 230, 102 196, 98 160" fill="none" stroke="#c99968" strokeWidth="5" strokeLinecap="round" opacity=".6" />
      <g fill={`url(#${id})`}>
        <circle cx="110" cy="84" r="66" /><circle cx="52" cy="124" r="46" /><circle cx="170" cy="122" r="48" /><circle cx="110" cy="140" r="46" />
      </g>
      <g fill="#b7e6a4" opacity=".55"><circle cx="84" cy="62" r="20" /><circle cx="140" cy="70" r="12" /><circle cx="40" cy="110" r="12" /></g>
    </svg>
  );
}

export default function Scenery({ theme = "meadow" }) {
  return (
    <div className={`scenery theme-${theme}`} aria-hidden="true">
      <div className="sky-glow" />
      <Cloud className="cloud-one" />
      <Cloud className="cloud-two" />
      <Cloud className="cloud-three" />

      {/* kota di kejauhan */}
      <svg className="layer skyline" viewBox="0 0 100 60" preserveAspectRatio="none">
        {BUILDINGS.map(([x, h, w], i) => (
          <rect key={i} x={x} y={60 - h} width={w} height={h} fill={i % 2 ? "#a9c4de" : "#9ab8d6"} />
        ))}
      </svg>

      {/* deretan pohon jauh */}
      <svg className="layer treeline" viewBox="0 0 1000 120" preserveAspectRatio="none">
        <path d="M0 120 V 70 C 30 40, 70 40, 90 66 C 120 30, 170 34, 190 64 C 220 36, 270 40, 290 68 C 320 34, 380 36, 400 66 C 440 32, 490 38, 510 68 C 540 36, 600 38, 620 66 C 660 34, 710 40, 730 68 C 760 38, 820 38, 840 66 C 880 36, 940 40, 1000 62 V 120 Z" fill="#86c47c" opacity=".85" />
      </svg>

      <svg className="layer hill hill-far" viewBox="0 0 1000 200" preserveAspectRatio="none">
        <defs><linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b2e08b" /><stop offset="1" stopColor="#92cf74" /></linearGradient></defs>
        <path d="M0 80 C 160 20, 340 30, 500 66 C 660 100, 820 24, 1000 66 L1000 200 L0 200 Z" fill="url(#hf)" />
      </svg>
      <svg className="layer hill hill-near" viewBox="0 0 1000 200" preserveAspectRatio="none">
        <defs><linearGradient id="hn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a6dc7c" /><stop offset="1" stopColor="#7fc460" /></linearGradient></defs>
        <path d="M0 40 C 260 0, 660 64, 1000 14 L1000 200 L0 200 Z" fill="url(#hn)" />
      </svg>

      {/* jalan setapak */}
      <svg className="layer path" viewBox="0 0 1000 200" preserveAspectRatio="none">
        <path d="M280 200 C 360 120, 520 90, 760 70 C 840 64, 900 70, 1000 90 L1000 200 Z" fill="#f0e0b4" opacity=".95" />
      </svg>

      <BigTree className="tree-left" />
      <BigTree className="tree-right" flip />

      {/* pagar putih */}
      <div className="layer fence">
        {Array.from({ length: 18 }, (_, i) => <i key={i} />)}
        <b />
      </div>

      <div className="flowers-layer">
        {FLOWERS.map((f, i) => (
          <span key={i} style={{ left: `${f.x}%`, bottom: `${f.y}%`, fontSize: `${f.s}px`, color: f.c }}>✿</span>
        ))}
      </div>
    </div>
  );
}
