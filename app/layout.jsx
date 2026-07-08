import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  title: "Lorenzo von Barron Photography",
  description:
    "Dark luxury editorial photography — headshots, fitness, automotive, weddings, events, product, and more. Look good. Move loud. Let them watch. Bookings via LYNK.",
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
      </body>
    </html>
  );
}
