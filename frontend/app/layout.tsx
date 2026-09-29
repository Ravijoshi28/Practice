import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Providers from "./lib/tanstackQuery";
import SessionGate from "./lib/sessionGate";

export const metadata: Metadata = {
  title: "LinkShortener — Good things. Short links.",
  description: "Create memorable short links, share them anywhere, and manage your connections in one simple workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        <Providers>
          <SessionGate>{children}</SessionGate>
          </Providers>
           <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#333', color: '#fff' },
          }}
        />
          </body>
    </html>
  );
}
