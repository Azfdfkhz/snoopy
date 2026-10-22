// Background ilustrasi dari public/background.png; karakter dan UI tetap berada di layer terpisah.
export default function Scenery({ theme = "meadow" }) {
  return (
    <div className={`scenery scenery-image theme-${theme}`} aria-hidden="true">
      <img className="scenery-background" src="/background.png" alt="" draggable="false" />
      <div className="scenery-soft-overlay" />
    </div>
  );
}
