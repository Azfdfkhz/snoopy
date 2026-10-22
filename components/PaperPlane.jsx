// Pesawat kertas yang terbang menuju Snoopy. Animasinya ada di globals.css (.paper-plane).
const INK = "#1f2327";

export default function PaperPlane() {
  return (
    <svg className="paper-plane" viewBox="0 0 84 54" aria-hidden="true">
      <path d="M3 25 L80 4 L40 32 Z" fill="#fff" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M40 32 L80 4 L48 49 Z" fill="#d6e6f2" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M40 32 L48 49 L31 40 Z" fill="#fff" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
    </svg>
  );
}
