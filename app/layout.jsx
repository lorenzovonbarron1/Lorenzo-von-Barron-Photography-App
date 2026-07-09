import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import PwaRegister from "@/components/PwaRegister";

export const metadata = {
  // Used to resolve absolute OG/Twitter image URLs — update if the
  // production domain differs.
  metadataBase: new URL("https://lorenzovonbarron.com"),
  title: "Lorenzo von Barron Photography",
  description:
    "Cinematic photography for people and brands building something worth being seen.",
  applicationName: "Lorenzo von Barron Photography",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LVB Photo",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "Lorenzo von Barron Photography",
    title: "Lorenzo von Barron Photography",
    description:
      "Cinematic photography for people and brands building something worth being seen.",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Lorenzo von Barron Photography",
    description:
      "Cinematic photography for people and brands building something worth being seen.",
    images: ["/icons/icon-512.png"],
  },
};

export const viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  // viewport-fit=cover lets the shell extend behind the iPhone notch /
  // dynamic island; safe-area insets in globals.css keep content clear.
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@400;500;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <PwaRegister />
      </body>
    </html>
  );
}
