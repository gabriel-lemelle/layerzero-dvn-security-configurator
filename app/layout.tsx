import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LayerZero DVN Security Configurator',
  description: 'Review LayerZero V2 DVN configurations, understand verifier diversity, and avoid single-DVN failure modes.',
  keywords: ['LayerZero', 'DVN', 'cross-chain', 'security', 'blockchain', 'OApp', 'verifier'],
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0a0a0a]">
      <body className="font-sans antialiased bg-[#0a0a0a] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
