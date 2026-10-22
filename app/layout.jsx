import "./globals.css";

export const metadata = {
  title: "Snoopy Message Garden",
  description: "Taman kecil tempat Snoopy menyampaikan pesan, dan kamu bisa membalasnya."
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#bde7ff"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
