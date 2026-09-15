import type { Metadata } from 'next';
import './globals.css';
import { CaseProvider } from '@/context/CaseContext';

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
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <CaseProvider>
          {children}
        </CaseProvider>
      </body>
    </html>
  );
}
