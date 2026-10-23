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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Caveat:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
