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
const TYPE_MS = 24; // jeda per karakter pada efek ketik
const pad = (n) => String(n).padStart(2, "0");

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
  const [motionOn, setMotionOn] = useState(true); // tombol "Gerakan" (animasi dekoratif)
  const [reduced, setReduced] = useState(false); // preferensi sistem prefers-reduced-motion
  const [typed, setTyped] = useState(0); // jumlah karakter pesan yang sudah tampil
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

  const chars = Array.from(view.message);
  const typing = typed < chars.length;
  const percent = inStory ? Math.round(((current + 1) / total) * 100) : 100;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Efek ketik: mulai dari awal setiap pesan berganti. Reduced motion langsung menampilkan semuanya.
  const messageKey = `${phase}|${scene.id}`;
  useEffect(() => {
    const total = Array.from(view.message).length;
    if (reduced) { setTyped(total); return; }
    setTyped(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= total) window.clearInterval(id);
    }, TYPE_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageKey, senderName, reduced]);

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

  function goBack() {
    if (inStory && current > 0) goTo(current - 1);
  }

  function handlePrimary() {
    // Saat teks masih diketik, tombol lanjut menyelesaikan teks dulu (lewati animasi).
    if (typing && (phase === "story" || phase === "thanks" || phase === "declined")) {
      setTyped(chars.length);
      return;
    }
    if (phase === "story") {
      if (isLast) setPhase("ask");
      else goTo(current + 1);
    } else if (phase === "thanks" || phase === "declined") {
      setPhase("compose");
    }
  }

  const primaryLabel = typing && inStory
    ? "Tampilkan teks"
    : inStory
    ? isLast ? "Balas pesan" : "Lanjutkan"
    : phase === "thanks" ? "Tulis pesan lagi" : "Tulis pesan";
  const primaryIcon = typing && inStory ? "⏩" : inStory && !isLast ? "→" : "✉";

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Snoopy Message Garden, beranda">
          <img className="brand-snoopy" src="/animations/snoopy-frames/png/snoopy_01_idle.png" alt="" />
          <span>Snoopy <b aria-hidden="true">♥</b></span>
        </a>
        <div className="header-actions">
          <div className="story-counter" aria-label={`Adegan ${current + 1} dari ${total}`}><span aria-hidden="true">▣</span> {current + 1} / {total}</div>
          <button className="settings-button" type="button" aria-label="Pengaturan animasi" aria-pressed={!motionOn || reduced} onClick={() => setMotionOn((v) => !v)}>⚙</button>
        </div>
      </header>

      <section className={`scene${motionOn && !reduced ? "" : " motion-off"}`} aria-label="Taman tempat Snoopy menyampaikan pesan">
        <Scenery theme={view.theme} />
        <SceneProps list={view.props} group="scene" />

        <div className="scene-heading">
          <span className="eyebrow">a little note for you</span>
          <h1>Ada pesan kecil<br /><em>buat Indy.</em></h1>
          <p>Snoopy yang bakal nyampein. Pelan-pelan aja bacanya.</p>
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
          <p>
            <span>{chars.slice(0, typed).join("")}</span>
            <span className="ghost">{chars.slice(typed).join("")}</span>
          </p>
        </div>

        <div className="snoopy-stage" data-animation={view.animation} data-pose={view.pose}>
          <SceneProps list={view.props} group="stage" />
          <Snoopy pose={view.pose} held={view.held} backpack={view.backpack} animation={view.animation} />
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
        <div className="control-row">
          <button className="secondary-btn replay-btn" type="button" onClick={() => { goTo(0); setPhase("story"); }} disabled={busy}>
            <span aria-hidden="true">↻</span> Replay
          </button>
          <button className="primary-btn next-round-btn" type="button" onClick={handlePrimary} disabled={busy} aria-label={primaryLabel}>
            <span aria-hidden="true">{primaryIcon === "→" ? "→" : primaryIcon === "⏩" ? "»" : "✉"}</span>
          </button>
          <button className="secondary-btn skip-btn" type="button" onClick={() => {
            if (typing) { setTyped(chars.length); return; }
            if (inStory && !isLast) { goTo(current + 1); return; }
            handlePrimary();
          }} disabled={busy}>
            <span aria-hidden="true">⏭</span> Lewati
          </button>
        </div>
        <p className="hint">{view.hint || ""}</p>
      </section>
      <button className="motion-toggle floating-pill" type="button" aria-pressed={motionOn && !reduced} disabled={reduced} onClick={() => setMotionOn((v) => !v)}>
        <span aria-hidden="true">🍃</span> {reduced ? "Gerakan dikurangi" : "Animasi " + (motionOn ? "Aktif" : "Mati")} <span className={`toggle-switch${motionOn && !reduced ? " on" : ""}`} aria-hidden="true"><i /></span>
      </button>
      <button className="sound-toggle floating-pill sound-pill" type="button" aria-pressed={soundEnabled} onClick={toggleSound}>
        <span aria-hidden="true">♫</span> Suara
      </button>

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
