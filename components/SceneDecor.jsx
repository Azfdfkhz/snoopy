// Dekorasi statis di sisi kiri scene: papan gantung dan tumpukan buku dengan cangkir.
// Murni CSS (tanpa gambar tambahan), disembunyikan di layar kecil agar tidak menutupi Snoopy.
export default function SceneDecor() {
  return (
    <div className="decor-props" aria-hidden="true">
      <div className="decor-sign">
        <span>Good<br />Days<br />Ahead</span>
        <i>♡</i>
      </div>
      <div className="decor-books">
        <div className="mug"><svg viewBox="0 0 24 24" width="16" height="16" fill="#27303b"><ellipse cx="12" cy="16" rx="4.8" ry="4" /><circle cx="5.5" cy="11" r="2" /><circle cx="9.6" cy="6.8" r="2" /><circle cx="14.4" cy="6.8" r="2" /><circle cx="18.5" cy="11" r="2" /></svg></div>
        <div className="book book-1" />
        <div className="book book-2">Better Days</div>
        <div className="book book-3" />
      </div>
    </div>
  );
}
