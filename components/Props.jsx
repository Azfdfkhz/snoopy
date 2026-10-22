// Properti adegan: burung kecil, papan pesan, easel, bangku, not musik, dan "zzz".
const INK = "#27303b";

export function Bird() {
  return (
    <svg className="prop prop-bird" viewBox="0 0 64 64" aria-hidden="true">
      <g className="bird-body">
        <path d="M24 12 Q 20 4 27 6 Q 28 2 32 8 Q 36 4 36 12 Z" fill="#f4cf45" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <ellipse cx="32" cy="34" rx="20" ry="19" fill="#f7d94f" stroke={INK} strokeWidth="2.4" />
        <path d="M10 36 Q 18 50 30 46 Q 18 44 10 36 Z" fill="#f0c235" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <ellipse cx="38" cy="28" rx="2.6" ry="3.6" fill={INK} />
        <path d="M46 32 L 58 35 L 46 40 Z" fill="#f08a2a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="42" cy="38" r="4" fill="#f6a5a0" opacity=".55" />
      </g>
      <path d="M26 52 V 60 M38 52 V 60 M22 61 H 30 M34 61 H 42" stroke="#f08a2a" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Sign() {
  return (
    <div className="prop prop-sign" aria-hidden="true">
      <div className="sign-board">
        <b>Hai!</b>
        <span>Ada pesan<br />untukmu!</span>
        <svg viewBox="0 0 24 24" width="22" height="22"><g fill={INK}><ellipse cx="12" cy="16" rx="5.4" ry="4.4" /><circle cx="5.5" cy="10.5" r="2.2" /><circle cx="10" cy="6.5" r="2.2" /><circle cx="14.5" cy="6.5" r="2.2" /><circle cx="18.8" cy="10.5" r="2.2" /></g></svg>
      </div>
      <i className="sign-post sign-post-l" /><i className="sign-post sign-post-r" />
    </div>
  );
}

export function Easel() {
  return (
    <svg className="prop prop-easel" viewBox="0 0 170 210" aria-hidden="true">
      <path d="M30 206 L 62 20 M140 206 L 108 20 M85 206 V 120" stroke="#a9753f" strokeWidth="7" strokeLinecap="round" />
      <rect x="18" y="30" width="134" height="104" rx="6" fill="#e3b87a" stroke="#8a5d2f" strokeWidth="4" />
      <rect x="28" y="40" width="114" height="84" rx="3" fill="#fffdf6" />
      <path d="M85 112 C 60 96, 56 74, 70 70 C 78 68, 84 74, 85 80 C 86 74, 92 68, 100 70 C 114 74, 110 96, 85 112 Z" fill="#f06a78" />
      <path d="M44 100 C 40 84, 48 66, 62 62 C 56 70, 54 84, 58 96" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
      <path d="M118 60 l5 -8 M126 70 l9 -3" stroke="#f4b43e" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Bench() {
  return (
    <svg className="prop prop-bench" viewBox="0 0 360 130" aria-hidden="true">
      <rect x="40" y="6" width="280" height="16" rx="5" fill="#c58a52" stroke="#8a5d2f" strokeWidth="3" />
      <rect x="40" y="30" width="280" height="16" rx="5" fill="#cf9560" stroke="#8a5d2f" strokeWidth="3" />
      <rect x="22" y="58" width="316" height="20" rx="6" fill="#d79e66" stroke="#8a5d2f" strokeWidth="3" />
      <path d="M50 78 V 126 M310 78 V 126 M50 6 V 58 M310 6 V 58" stroke="#8a5d2f" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export function Notes() {
  return (
    <div className="prop prop-notes" aria-hidden="true">
      <span className="note n1">♪</span><span className="note n2">♫</span><span className="note n3">♪</span>
    </div>
  );
}

export function Zzz() {
  return (
    <div className="prop prop-zzz" aria-hidden="true">
      <span className="z z1">z</span><span className="z z2">z</span><span className="z z3">Z</span>
    </div>
  );
}

// group "stage": ikut bergerak bersama Snoopy (burung, not, zzz). group "scene": menempel di taman (papan, easel).
export function SceneProps({ list, group }) {
  const has = (name) => list.includes(name);
  if (group === "scene") {
    return (
      <>
        {has("sign") && <Sign />}
        {has("easel") && <Easel />}
      </>
    );
  }
  return (
    <>
      {has("bench") && <Bench />}
      {has("bird") && <Bird />}
      {has("notes") && <Notes />}
      {has("zzz") && <Zzz />}
    </>
  );
}
