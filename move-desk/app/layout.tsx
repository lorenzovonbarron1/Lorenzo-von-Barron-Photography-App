import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AGENT, agentAccentStyle } from "@/lib/agent.config";
import StickyContact from "@/components/StickyContact";

export const metadata: Metadata = {
  title: `${AGENT.name}'s Move Desk`,
  description:
    "A private real-estate concierge — homes worth your time, a straight conversation, and a next step you choose. Powered by LYNK Move Desk.",
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@400;500;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={agentAccentStyle()}>
        {children}
        <StickyContact />
      </body>
    </html>
  );
}
