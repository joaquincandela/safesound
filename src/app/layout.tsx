import type { Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { META_PIXEL_ID } from "../lib/meta-pixel";
import CatalogViewTracker from "../components/CatalogViewTracker";

export const metadata = {
  metadataBase: new URL("https://safesound.vercel.app"),
  title: "SafeSound | VOID, earplugs premium en Lima",
  description:
    "Earplugs VOID de silicona médica que reducen el ruido sin aislarte. 14 acabados a S/ 65. Pide por WhatsApp.",
  openGraph: {
    title: "SafeSound | Mute the noise. Feel the moment.",
    description: "Earplugs VOID de silicona médica. 14 acabados a S/ 65.",
    images: ["/assets/foto-roca.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#0C0908",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-primary-50 text-neutral-50">
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <CatalogViewTracker />
        {children}
      </body>
    </html>
  );
}
