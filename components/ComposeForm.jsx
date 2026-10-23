"use client";

import { useState } from "react";
import Modal from "./Modal.jsx";

const MAX_LENGTH = 1000;

// Dialog penulisan pesan. onSent(nama) dipanggil setelah server menerima pesan.
export default function ComposeForm({ onCancel, onSent }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: manusia tidak melihat kolom ini
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const text = message.trim();
    if (text.length < 2) {
      setError("Pesannya masih terlalu pendek. Coba tulis sedikit lagi, ya.");
      return;
    }
    if (text.length > MAX_LENGTH) {
      setError("Pesan maksimal 1000 karakter.");
      return;
    }

    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: text, website })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Pesan belum berhasil dikirim. Coba lagi.");
      onSent(name.trim());
    } catch (err) {
      setError(err.message || "Ada kendala saat mengirim pesan. Coba lagi nanti.");
      setSending(false);
    }
  }

  return (
    <Modal labelledBy="composeTitle" onClose={onCancel} dismissible={!sending}>
      <h2 id="composeTitle">Tulis pesan untuk Snoopy</h2>
      <form className="compose-form" onSubmit={handleSubmit}>
        <label htmlFor="visitorName">Nama panggilan <span>(opsional)</span></label>
        <input
          id="visitorName"
          name="name"
          type="text"
          maxLength={50}
          placeholder="Mau dipanggil siapa?"
          autoComplete="nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="visitorMessage">Pesan</label>
        <textarea
          id="visitorMessage"
          name="message"
          rows={4}
          maxLength={MAX_LENGTH}
          required
          data-autofocus
          placeholder="Tulis pesanmu di sini..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="form-meta">
          <span>Snoopy With U.</span>
          <span>{message.length}/{MAX_LENGTH}</span>
        </div>
        <input
          className="website-field"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <p className={`form-status${error ? " error" : ""}`} role="alert">{error}</p>
        <div className="modal-actions">
          <button className="secondary-btn" type="button" onClick={onCancel} disabled={sending}>Batal</button>
          <button className="primary-btn" type="submit" disabled={sending}>{sending ? "Mengirim..." : "Kirim pesan"}</button>
        </div>
      </form>
    </Modal>
  );
}
