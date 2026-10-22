"use client";

import { useEffect, useState } from "react";

const ASSET = "/animations/snoopy-frames/png/";
const POSES = {
  idle: ["snoopy_01_idle.png", "snoopy_02_looking.png"],
  walk: ["snoopy_03_walking.png", "snoopy_02_looking.png"],
  point: ["snoopy_04_pointing.png"],
  dance: ["snoopy_06_dance.png", "snoopy_05_happy.png", "snoopy_16_excited.png"],
  surprised: ["snoopy_09_surprised.png", "snoopy_16_excited.png"],
  wave: ["snoopy_12_wave.png", "snoopy_14_wink.png"],
  read: ["snoopy_10_thinking.png", "snoopy_01_idle.png"],
  sleep: ["snoopy_08_sleep.png"],
  lie: ["snoopy_07_sit.png"],
  sit: ["snoopy_07_sit.png"],
  confused: ["snoopy_10_thinking.png", "snoopy_11_shy.png"],
  shy: ["snoopy_11_shy.png", "snoopy_14_wink.png"],
  laugh: ["snoopy_15_laugh.png", "snoopy_05_happy.png"],
  wake_up: ["snoopy_08_sleep.png", "snoopy_02_looking.png"],
  look_at_user: ["snoopy_02_looking.png", "snoopy_14_wink.png"],
  stop: ["snoopy_01_idle.png"],
  suspense: ["snoopy_10_thinking.png", "snoopy_09_surprised.png"],
  react: ["snoopy_09_surprised.png", "snoopy_16_excited.png"],
  walk_away: ["snoopy_13_back.png", "snoopy_03_walking.png"],
};

export default function Snoopy({ pose = "stand", held = "none", backpack = false, animation = "idle" }) {
  const sequence = POSES[animation] || POSES[pose] || POSES.idle;
  const [frame, setFrame] = useState(0);
  const [previousFrame, setPreviousFrame] = useState(0);
  const [crossfading, setCrossfading] = useState(false);

  useEffect(() => {
    setFrame(0);
    setPreviousFrame(0);
    setCrossfading(false);
    if (sequence.length < 2) return undefined;

    // Idle terasa santai; aksi lebih aktif tetapi tetap tidak terlalu cepat.
    const interval = animation === "walk" ? 460 : animation === "dance" ? 520 : animation === "wave" ? 850 : 1850;
    const timer = window.setInterval(() => {
      setFrame((current) => {
        const next = (current + 1) % sequence.length;
        setPreviousFrame(current);
        setCrossfading(true);
        return next;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [animation, sequence]);

  useEffect(() => {
    if (!crossfading) return undefined;
    const timer = window.setTimeout(() => setCrossfading(false), 240);
    return () => window.clearTimeout(timer);
  }, [frame, crossfading]);

  const image = sequence[frame % sequence.length];
  const previousImage = sequence[previousFrame % sequence.length];
  const fallback = `${ASSET}snoopy_01_idle.png`;
  return (
    <div className={`snoopy-image-wrap${backpack ? " has-backpack" : ""}${held !== "none" ? " holding-item" : ""}`}>
      {crossfading && previousImage !== image && (
        <img
          key={`previous-${previousImage}`}
          className="snoopy-image snoopy-image-previous"
          src={`${ASSET}${previousImage}`}
          alt=""
          aria-hidden="true"
          draggable="false"
          onError={(event) => { event.currentTarget.src = fallback; }}
        />
      )}
      <img
        key={`current-${image}`}
        className={`snoopy-image snoopy-image-current${crossfading ? " is-crossfading" : ""}`}
        src={`${ASSET}${image}`}
        alt="Snoopy"
        draggable="false"
        onError={(event) => { event.currentTarget.src = fallback; }}
      />
      {held !== "none" && <img className="snoopy-held-item" src={`${ASSET}bomb_cartoon.png`} alt="" aria-hidden="true" />}
    </div>
  );
}
