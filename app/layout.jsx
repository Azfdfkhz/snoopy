import "./globals.css";

export const metadata = {
  title: "Pesan kecil dari Snoopy",
  description: "Snoopy nitip pesan kecil buat Indy."
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
