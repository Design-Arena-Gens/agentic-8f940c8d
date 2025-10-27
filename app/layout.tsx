import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SalesHunter Desk | VisionFrameStudios",
  description:
    "High-ROI outbound workflow to source prospects, craft outreach, and log follow ups for VisionFrameStudios."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div>
              <h1>SalesHunter Desk</h1>
              <p className="subtitle">
                VisionFrameStudios outbound console · purpose-built for boutique ecommerce leads
              </p>
            </div>
            <span className="badge">Daily capacity: 30 msgs max</span>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
