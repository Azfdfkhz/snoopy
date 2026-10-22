"use client";

import { useEffect, useRef, useState } from "react";
import { STORY_CONFIG } from "../lib/messages.js";
import Snoopy from "./Snoopy.jsx";
import Scenery from "./Scenery.jsx";
import PaperPlane from "./PaperPlane.jsx";
import { SceneProps } from "./Props.jsx";
import Modal from "./Modal.jsx";
import ComposeForm from "./ComposeForm.jsx";

const SPARKLE_CHARS = ["✦", "✧", "·"];
const HEART_CHARS = ["♡", "✦", "♡", "✧"];
const ASK_DELAY_MS = 1800; // jeda setelah adegan terakhir sebelum popup muncul
const FLYING_MS = 2600;
const READING_MS = 2600;

const TONES = {
  boom: { type: "triangle", gain: 0.09, notes: [[110, 0, 0.22], [75, 0.09, 0.28], [220, 0.12, 0.12]] },
  step: { type: "sine", gain: 0.045, notes: [[240, 0, 0.06]] },
  pop: { type: "sine", gain: 0.045, notes: [[440, 0, 0.08], [660, 0.08, 0.1]] },
  chime: { type: "sine", gain: 0.045, notes: [[523, 0, 0.1], [659, 0.1, 0.12]] },
  whoosh: { type: "sine", gain: 0.03, notes: [[320, 0, 0.16], [440, 0.14, 0.16], [600, 0.28, 0.16], [760, 0.42, 0.14]] },
  happy: { type: "sine", gain: 0.05, notes: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.16]] }
};

// Bentuk bintang bergerigi untuk bubble "BOM!".
const BURST_POINTS = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2;
  const radius = i % 2 ? 40 : 50;
  return `${(50 + Math.cos(angle) * radius).toFixed(1)},${(50 + Math.sin(angle) * radius * 0.72).toFixed(1)}`;
}).join(" ");

// Fase: story (cerita biasa) -> ask (popup ajakan) -> compose (form) -> flying -> reading -> thanks
//       atau ask/compose -> declined
export default function Story() {
  const { scenes, finale } = STORY_CONFIG;
  const total = scenes.length;

  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState("story");
  const [senderName, setSenderName] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(Boolean(STORY_CONFIG.soundEnabled));
  const [sparkles, setSparkles] = useState([]);
  const audioRef = useRef(null);
  const sparkleTimer = useRef(null);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const scene = scenes[current];
  const isLast = current === total - 1;
  const inStory = phase === "story";
  const busy = phase === "flying" || phase === "reading";

  // Tampilan mengikuti adegan, atau fase akhir (pesawat kertas, membaca, terima kasih).
  let view = {
    animation: scene.animation, pose: scene.pose || "stand", theme: scene.theme || "meadow",
    props: scene.props || [], backpack: Boolean(scene.backpack), held: scene.held || "none",
    bubble: scene.bubble || "normal", message: scene.message, caption: scene.caption, hint: scene.hint
  };
  const finaleBase = { pose: "stand", props: [], backpack: false, held: "none", bubble: "normal" };
  if (phase === "flying") view = { ...view, ...finaleBase, animation: "surprised", message: finale.flying, caption: "Ada pesawat kertas!", hint: "Pesanmu sedang terbang ke Snoopy." };
  if (phase === "reading") view = { ...view, ...finaleBase, animation: "read", message: finale.reading, caption: "Snoopy sedang membaca", hint: "Snoopy membaca pesanmu dengan teliti." };
  if (phase === "thanks") {
    view = {
      ...view, ...finaleBase, animation: "dance",
      message: senderName ? finale.thanksNamed.replace("{nama}", senderName) : finale.thanksAnonymous,
      caption: "Snoopy senang sekali",
      hint: "Pesanmu sudah sampai. Kamu bisa menulis lagi atau mengulang cerita."
    };
  }
  if (phase === "declined") view = { ...view, ...finaleBase, animation: "wave", message: finale.declined, caption: "Snoopy melambaikan tangan", hint: "Kamu bisa menulis pesan kapan saja." };

  const percent = inStory ? Math.round(((current + 1) / total) * 100) : 100;

  useEffect(() => {
    return () => {
      window.clearTimeout(sparkleTimer.current);
      audioRef.current?.close?.().catch(() => {});
    };
  }, []);

  // Setelah adegan terakhir, tawarkan menulis pesan.
  useEffect(() => {
    if (!(phase === "story" && isLast)) return;
    const id = window.setTimeout(() => setPhase("ask"), ASK_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase, isLast]);

  // Urutan setelah pesan terkirim: pesawat terbang, Snoopy membaca, lalu berterima kasih.
  useEffect(() => {
    if (phase === "flying") {
      const id = window.setTimeout(() => setPhase("reading"), FLYING_MS);
      return () => window.clearTimeout(id);
    }
    if (phase === "reading") {
      const id = window.setTimeout(() => {
        setPhase("thanks");
        showSparkles(14, HEART_CHARS);
        playTone("happy");
      }, READING_MS);
      return () => window.clearTimeout(id);
    }
  }, [phase]);

  function playTone(kind) {
    if (!soundRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioRef.current ||= new AudioCtx();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const tone = TONES[kind] || TONES.chime;
      const now = ctx.currentTime;
      tone.notes.forEach(([freq, delay, duration]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = tone.type;
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.exponentialRampToValueAtTime(tone.gain, now + delay + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.02);
      });
    } catch {
      // Audio hanyalah tambahan; cerita tetap berjalan jika audio diblokir browser.
    }
  }

  function showSparkles(count, chars = SPARKLE_CHARS) {
    const stamp = Date.now();
    setSparkles(
      Array.from({ length: count }, (_, i) => ({
        id: `${stamp}-${i}`,
        char: chars[i % chars.length],
        left: `${35 + Math.random() * 35}%`,
        top: `${42 + Math.random() * 27}%`,
        delay: `${Math.random() * 0.25}s`
      }))
    );
    window.clearTimeout(sparkleTimer.current);
    sparkleTimer.current = window.setTimeout(() => setSparkles([]), 1400);
  }

  function goTo(index) {
    const next = scenes[index];
    setPhase("story");
    setCurrent(index);
    if (next.animation === "dance") showSparkles(7);
    if (next.animation === "surprised") showSparkles(next.bubble === "boom" ? 18 : 12);
    playTone(next.sound);
  }

  function toggleSound() {
    const enabled = !soundEnabled;
    soundRef.current = enabled;
    setSoundEnabled(enabled);
    if (enabled) playTone("chime");
  }

  function handleSent(name) {
    setSenderName(name);
    setPhase("flying");
    playTone("whoosh");
  }

  function handlePrimary() {
    if (phase === "story") {
      if (isLast) setPhase("ask");
      else goTo(current + 1);
    } else if (phase === "thanks" || phase === "declined") {
      setPhase("compose");
    }
  }

  const primaryLabel = inStory
    ? isLast ? "Tulis pesan" : "Lanjutkan"
    : phase === "thanks" ? "Tulis pesan lagi" : "Tulis pesan";
  const primaryIcon = inStory && !isLast ? "→" : "✉";

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Snoopy Message Garden, beranda">
          <span className="brand-mark" aria-hidden="true">✿</span>
          <span>Snoopy <b>Message Garden</b></span>
        </a>
        <button className="sound-toggle" type="button" aria-pressed={soundEnabled} onClick={toggleSound}>
          <span aria-hidden="true">{soundEnabled ? "♫" : "♪"}</span>
          <span>{soundEnabled ? "Suara aktif" : "Suara mati"}</span>
        </button>
      </header>

      <section className="scene" aria-label="Taman tempat Snoopy menyampaikan pesan">
        <Scenery theme={view.theme} />
        <SceneProps list={view.props} group="scene" />

        <div className="scene-heading">
          <span className="eyebrow">A LITTLE NOTE FOR YOU</span>
          <h1>Seseorang punya<br /><em>pesan kecil.</em></h1>
          <p>Dan Snoopy dengan senang hati akan menyampaikannya.</p>
        </div>

        {/* Pembaca layar membaca pesan lewat elemen ini; balon di bawah hanya tampilan. */}
        <p className="sr-only" role="status" aria-live="polite">{view.message}</p>
        {/* key membuat animasi "pop" diulang setiap pesan baru muncul. */}
        <div className={`message-bubble pop${view.bubble === "boom" ? " boom" : ""}`} key={`${phase}-${scene.id}`} aria-hidden="true">
          {view.bubble === "boom" && (
            <svg className="boom-burst" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points={BURST_POINTS} fill="#fff" stroke="#4b8fd1" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          )}
          <p>{view.message}</p>
        </div>

        <div className="snoopy-stage" data-animation={view.animation} data-pose={view.pose}>
          <SceneProps list={view.props} group="stage" />
          <Snoopy pose={view.pose} held={view.held} backpack={view.backpack} />
          {phase === "flying" && <PaperPlane />}
          <div className="snoopy-caption">{view.caption || "Snoopy"}</div>
        </div>

        <div className="sparkles" aria-hidden="true">
          {sparkles.map((s) => (
            <span key={s.id} className="sparkle" style={{ left: s.left, top: s.top, animationDelay: s.delay }}>
              {s.char}
            </span>
          ))}
        </div>
      </section>

      <section className="controls" aria-label="Kontrol cerita">
        <div className="progress-wrap">
          <div className="progress-copy">
            <span>{inStory ? `Adegan ${current + 1} dari ${total}` : "Cerita selesai"}</span>
            <span>{percent}%</span>
          </div>
          <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
        </div>
        <div className="control-row">
          <button className="secondary-btn" type="button" onClick={() => goTo(0)} disabled={busy}>
            <span aria-hidden="true">↺</span> Ulangi
          </button>
          <button className="primary-btn" type="button" onClick={handlePrimary} disabled={busy}>
            {primaryLabel} <span aria-hidden="true">{primaryIcon}</span>
          </button>
        </div>
        <p className="hint">{view.hint || ""}</p>
      </section>

      {phase === "ask" && (
        <Modal labelledBy="askTitle" onClose={() => setPhase("declined")}>
          <h2 id="askTitle">{finale.askTitle}</h2>
          <p className="modal-text">{finale.askText}</p>
          <div className="modal-actions">
            <button className="secondary-btn" type="button" onClick={() => setPhase("declined")}>{finale.askNo}</button>
            <button className="primary-btn" type="button" data-autofocus onClick={() => setPhase("compose")}>{finale.askYes}</button>
          </div>
        </Modal>
      )}

      {phase === "compose" && (
        <ComposeForm onCancel={() => setPhase("declined")} onSent={handleSent} />
      )}
    </>
  );
}
