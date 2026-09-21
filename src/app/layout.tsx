import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { CaseProvider } from '@/context/CaseContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CollateralIQ | AI Collateral Intelligence & Lending Risk Suite',
  description: 'AI-assisted collateral intelligence and verification platform for Indian banks and NBFCs, specialized in residential Home Loans and LAP across Mumbai and Thane.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-[#070B12] text-[#F8FAFC] antialiased min-h-screen selection:bg-cyan-500/20 selection:text-cyan-200">
        <CaseProvider>
          {children}
        </CaseProvider>
      </body>
    </html>
  );
}
