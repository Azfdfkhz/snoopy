// Ilustrasi Snoopy dalam SVG, bergaya komik klasik dengan warna pastel.
// pose: "stand" | "sit" | "lie"   held: "none" | "bomb" | "bombLit"   backpack: true/false
// Gerakan dikendalikan lewat CSS (globals.css) berdasarkan data-animation pada .snoopy-stage.

const INK = "#27303b";
const RED = "#e0545a";
const SW = 3.2; // tebal kontur

function Limb({ d, width = 15 }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 6.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#fff" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Foot({ cx, cy, rot = 0 }) {
  return <ellipse cx={cx} cy={cy} rx="25" ry="11.5" fill="#fff" stroke={INK} strokeWidth={SW} transform={`rotate(${rot} ${cx} ${cy})`} />;
}

// Kepala + kalung (kalung digambar lebih dulu supaya tertutup kepala).
function Head({ closedEyes }) {
  return (
    <g className="snoopy-head">
      <path d="M107 142 Q 132 158 160 141" fill="none" stroke={INK} strokeWidth="17.5" strokeLinecap="round" />
      <path d="M107 142 Q 132 158 160 141" fill="none" stroke={RED} strokeWidth="11" strokeLinecap="round" />
      <g fill={INK} stroke={INK} strokeWidth="6.4" strokeLinejoin="round">
        <ellipse cx="138" cy="86" rx="48" ry="46" />
        <ellipse cx="186" cy="104" rx="32" ry="21" />
      </g>
      <g fill="#fff">
        <ellipse cx="138" cy="86" rx="48" ry="46" />
        <ellipse cx="186" cy="104" rx="32" ry="21" />
      </g>
      <ellipse cx="170" cy="98" rx="10" ry="6.5" fill="#f6a5b4" opacity=".5" />
      <ellipse cx="216" cy="97" rx="16" ry="13" fill={INK} transform="rotate(-12 216 97)" />
      <ellipse cx="210" cy="92" rx="4.5" ry="2.8" fill="#fff" opacity=".85" transform="rotate(-12 210 92)" />
      {closedEyes ? (
        <path d="M160 78 Q 168 86 176 78" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      ) : (
        <ellipse className="snoopy-eye" cx="168" cy="76" rx="4" ry="6" fill={INK} />
      )}
      <path d="M196 113 Q 184 124 164 116" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      <g className="snoopy-ear">
        <path d="M108 44 C 74 42, 58 92, 70 134 C 76 156, 106 154, 110 132 C 114 106, 128 82, 128 60 C 128 48, 118 40, 108 44 Z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
    </g>
  );
}

function Bomb({ lit, big }) {
  return (
    <g className={`snoopy-bomb${lit ? " lit" : ""}`} transform={big ? "translate(172 236) scale(1.45) translate(-172 -236)" : undefined}>
      <path d="M176 196 Q 182 186 192 184" fill="none" stroke="#6b5a3c" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="170" cy="222" r="23" fill="#3a4250" stroke={INK} strokeWidth={SW} />
      <ellipse cx="162" cy="213" rx="6.5" ry="4.5" fill="#fff" opacity=".35" transform="rotate(-30 162 213)" />
      <rect x="164" y="196" width="14" height="8" rx="2" fill="#59616f" stroke={INK} strokeWidth="2.4" />
      <g className="bomb-spark" transform="translate(193 183)">
        <path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z" fill="#ffb938" stroke="#f08a1c" strokeWidth="1.5" />
      </g>
    </g>
  );
}

function Backpack() {
  return (
    <g className="snoopy-backpack">
      <path d="M96 150 C 78 150, 70 160, 72 180 C 74 198, 84 206, 100 204 C 108 190, 108 164, 96 150 Z" fill="#4f8fe0" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M80 186 C 84 192, 94 194, 100 190" fill="none" stroke="#2f66b3" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 154 Q 130 150 150 142" fill="none" stroke="#3a74c6" strokeWidth="4" strokeLinecap="round" opacity=".9" />
    </g>
  );
}

export default function Snoopy({ pose = "stand", held = "none", backpack = false }) {
  const stand = pose === "stand";
  const sit = pose === "sit";
  const lie = pose === "lie";

  return (
    <svg className={`snoopy-svg pose-${pose}`} viewBox="0 0 260 300" role="img" aria-label="Ilustrasi Snoopy bergaya kartun" xmlns="http://www.w3.org/2000/svg">
      <ellipse className="snoopy-shadow" cx={lie ? 140 : 128} cy="288" rx={lie ? 104 : 78} ry="8" fill="#4f7d4a" opacity=".25" />

      <g className="snoopy-bob">
        {(stand || sit) && (
          <>
            <g className="snoopy-tail">
              <path d={sit ? "M86 244 C 64 244, 48 232, 42 212 C 64 212, 84 222, 96 234 Z" : "M84 214 C 62 212, 46 196, 40 174 C 62 176, 82 188, 94 202 Z"} fill="#fff" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
            </g>

            <g className="arm-back-rot">
              <Limb d="M110 168 Q 102 190 108 212" width={14} />
            </g>

            {stand && (
              <g className="leg-back-rot">
                <Limb d="M114 246 L 108 272" width={16} />
                <Foot cx="116" cy="280" />
              </g>
            )}

            <path
              d={sit
                ? "M104 134 C 76 168, 64 232, 90 262 C 118 282, 178 282, 198 256 C 206 222, 184 160, 152 134 Z"
                : "M104 134 C 78 170, 72 232, 106 256 C 136 272, 178 262, 186 226 C 194 190, 178 150, 152 134 Z"}
              fill="#fff" stroke={INK} strokeWidth={SW} strokeLinejoin="round"
            />

            {stand && (
              <g className="leg-front-rot">
                <Limb d="M154 248 L 160 272" width={16} />
                <Foot cx="172" cy="280" />
              </g>
            )}
            {sit && (
              <>
                <Foot cx="168" cy="282" rot={-4} />
                <Foot cx="206" cy="274" rot={-10} />
              </>
            )}

            {backpack && stand && <Backpack />}

            <Head closedEyes={false} />

            <g className="arm-front-rot">
              <Limb d="M150 168 Q 158 190 152 212" width={14} />
            </g>

            {held !== "none" && stand && <Bomb lit={held === "bombLit"} big={held === "bombLit"} />}

            <g className="paper-held">
              <g transform="rotate(-10 176 190)">
                <rect x="158" y="164" width="40" height="48" rx="3" fill="#fff" stroke={INK} strokeWidth="3" />
                <path d="M166 176 H 190 M166 185 H 190 M166 194 H 182" stroke="#8aa6bd" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </g>
          </>
        )}

        {lie && (
          <>
            <ellipse cx="150" cy="238" rx="76" ry="35" fill="#fff" stroke={INK} strokeWidth={SW} transform="rotate(-3 150 238)" />
            <Foot cx="226" cy="214" rot={-62} />
            <Foot cx="240" cy="238" rot={-40} />
            <g className="arm-front-rot lie-arm">
              <Limb d="M140 228 Q 156 226 172 240" width={13} />
            </g>
            <g transform="translate(66 226) rotate(-14) scale(.72) translate(-130 -130)">
              <Head closedEyes />
            </g>
          </>
        )}

        <g className="snoopy-alert">
          <path d="M206 20 V 52" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <circle cx="206" cy="68" r="5.5" fill={INK} />
        </g>
      </g>
    </svg>
  );
}
