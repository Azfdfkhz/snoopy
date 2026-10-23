// Ikon kecil (SVG) untuk HUD dan dock. Warna mengikuti currentColor.
const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const ArrowRight = (p) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const ArrowLeft = (p) => <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const Replay = (p) => <svg {...base} {...p}><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></svg>;
export const SkipNext = (p) => <svg {...base} {...p}><path d="M6 5l9 7-9 7z" /><path d="M19 5v14" /></svg>;
export const Gear = (p) => <svg {...base} {...p}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
export const Music = (p) => <svg {...base} {...p}><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>;
export const Leaf = (p) => <svg {...base} {...p}><path d="M5 19c0-8 5-14 15-14 0 9-5 15-13 15" /><path d="M5 19c3-5 6-8 10-10" /></svg>;
export const Bookmark = (p) => <svg {...base} {...p}><rect x="6" y="3" width="12" height="18" rx="3" /><circle cx="12" cy="8.5" r="1.4" fill="currentColor" stroke="none" /></svg>;
export const Mail = (p) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 7l8 6 8-6" /></svg>;
export const Heart = (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.800-8 11-8 11z" /></svg>;
