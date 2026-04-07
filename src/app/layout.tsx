import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOIDGLYPH // Neural Interface",
  description: "Cyberpunk-kawaii chat interface for Hermes Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <meta name="view-transition" content="same-origin" />
      <body className="antialiased">
        {children}
        <canvas id="matrix-canvas" className="matrix-canvas" />
      </body>
    </html>
  );
}
