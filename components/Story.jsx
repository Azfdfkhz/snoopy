"use client";

import { useEffect, useRef, useState } from "react";
import { STORY_CONFIG } from "../lib/messages.js";
import SnoopyAnimator from "./SnoopyAnimator.jsx";
import BackgroundScene from "./BackgroundScene.jsx";
import PaperPlane from "./PaperPlane.jsx";
import { SceneProps } from "./Props.jsx";
import Modal from "./Modal.jsx";
import ComposeForm from "./ComposeForm.jsx";
import SceneDecor from "./SceneDecor.jsx";
import * as Icon from "./Icons.jsx";

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [typed, setTyped] = useState(0); // jumlah karakter pesan yang sudah tampil
  const audioRef = useRef(null);
  const sparkleTimer = useRef(null);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const scene = scenes[current];
  const isLast = current === total - 1;
  const inStory = phase === "story";
  const busy = phase === "flying" || phase === "reading";
  const playing = motionOn && !reduced; // false → Snoopy dan dekorasi diam di satu pose

  // Tampilan mengikuti adegan, atau fase akhir (pesawat kertas, membaca, terima kasih).
  let view = {
    animation: scene.animation, pose: scene.pose || "stand", theme: scene.theme || "meadow",
    props: scene.props || [], backpack: Boolean(scene.backpack), held: scene.held || "none",
    bubble: scene.bubble || "normal", title: scene.title, message: scene.message, caption: scene.caption, hint: scene.hint
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
      setTyped((prev) => Math.max(prev, n)); // tombol "Tampilkan teks" tidak ditimpa lagi oleh efek ketik
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

  const typingNow = typing && (phase === "story" || phase === "thanks" || phase === "declined");
  const progressLabel = inStory ? `${current + 1} / ${total}` : "Selesai";

  return (
    <>
      <section className={`scene${playing ? "" : " motion-off"}`} aria-label="Taman tempat Snoopy menyampaikan pesan">
        <BackgroundScene theme={view.theme} />
        <SceneDecor />

        {/* ---------- HUD atas ---------- */}
        <header className="hud-top">
          <a className="brand" href="#" aria-label="Snoopy, beranda">
            <span className="brand-avatar"><img src="/animations/snoopy-frames/png/snoopy_01_idle.png" alt="" draggable={false} /></span>
            <span className="brand-name">Snoopy</span>
            <span className="brand-heart" aria-hidden="true">♥</span>
          </a>
          <div className="hud-right">
            <div className="progress-pill" role="status" aria-label={inStory ? `Adegan ${current + 1} dari ${total}` : "Cerita selesai"}>
              <Icon.Bookmark width={20} height={20} />
              <span>{progressLabel}</span>
            </div>
            <div className="settings-wrap">
              <button className="round-btn" type="button" aria-label="Pengaturan" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((v) => !v)}>
                <Icon.Gear width={26} height={26} />
              </button>
              {settingsOpen && (
                <div className="settings-pop">
                  <button type="button" role="switch" aria-checked={playing} disabled={reduced} onClick={() => setMotionOn((v) => !v)}>
                    <span>{reduced ? "Gerakan dikurangi" : "Animasi"}</span><i className="switch" aria-hidden="true" />
                  </button>
                  <button type="button" role="switch" aria-checked={soundEnabled} onClick={toggleSound}>
                    <span>Suara</span><i className="switch" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Pembaca layar membaca pesan lewat elemen ini; balon di bawah hanya tampilan. */}
        <p className="sr-only" role="status" aria-live="polite">{view.title ? `${view.title}. ` : ""}{view.message}. {view.hint || ""}</p>
        {/* key membuat animasi "pop" diulang setiap pesan baru muncul. */}
        <div className={`message-bubble pop${view.bubble === "boom" ? " boom" : ""}`} key={`${phase}-${scene.id}`} aria-hidden="true">
          {view.bubble === "boom" ? (
            <svg className="boom-burst" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points={BURST_POINTS} fill="#fff" stroke="#4b8fd1" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          ) : null}
          {view.bubble !== "boom" && view.title && (
            <h2 className="bubble-title">{view.title} <span className="bubble-heart"><Icon.Heart /></span></h2>
          )}
          <p>
            <span>{chars.slice(0, typed).join("")}</span>
            <span className="ghost">{chars.slice(typed).join("")}</span>
          </p>
          {view.bubble !== "boom" && <span className="bubble-next"><Icon.ArrowRight width={26} height={26} /></span>}
        </div>

        <div className="snoopy-stage" data-animation={view.animation} data-pose={view.pose}>
          <SceneProps list={view.props} excited={view.animation === "dance" || view.animation === "surprised"} playing={playing} />
          <SnoopyAnimator animation={view.animation} pose={view.pose} held={view.held} playing={playing} />
          {phase === "flying" && <PaperPlane />}
        </div>

        <div className="sparkles" aria-hidden="true">
          {sparkles.map((s) => (
            <span key={s.id} className="sparkle" style={{ left: s.left, top: s.top, animationDelay: s.delay }}>
              {s.char}
            </span>
          ))}
        </div>

        {/* ---------- Toggle bawah ---------- */}
        <button className="pill-toggle motion-toggle" type="button" role="switch" aria-checked={playing} disabled={reduced} onClick={() => setMotionOn((v) => !v)}>
          <Icon.Leaf width={20} height={20} />
          <span>{reduced ? "Gerakan Dikurangi" : playing ? "Animasi Aktif" : "Animasi Mati"}</span>
          <i className="switch" aria-hidden="true" />
        </button>
        <button className={`pill-toggle sound-btn${soundEnabled ? "" : " off"}`} type="button" aria-pressed={soundEnabled} onClick={toggleSound}>
          <Icon.Music width={20} height={20} />
          <span>{soundEnabled ? "Suara" : "Senyap"}</span>
        </button>

        {/* ---------- Dock kontrol ---------- */}
        <nav className="dock" aria-label="Kontrol cerita">
          <button className="dock-btn dock-back" type="button" aria-label="Kembali" onClick={goBack} disabled={busy || !inStory || current === 0}>
            <Icon.ArrowLeft />
          </button>
          <button className="dock-btn" type="button" aria-label="Replay, ulangi cerita" onClick={() => goTo(0)} disabled={busy}>
            <Icon.Replay /><span>Replay</span>
          </button>
          <button className="dock-main" type="button" aria-label={primaryLabel} title={primaryLabel} onClick={handlePrimary} disabled={busy}>
            {inStory && !isLast ? <Icon.ArrowRight width={38} height={38} strokeWidth={2.6} /> : <Icon.Mail width={34} height={34} />}
          </button>
          <button className="dock-btn" type="button" aria-label="Lewati animasi teks" onClick={() => setTyped(chars.length)} disabled={!typingNow}>
            <Icon.SkipNext /><span>Lewati</span>
          </button>
        </nav>
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
