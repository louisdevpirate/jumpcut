import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { fontVariables } from "@/lib/fonts";
import WebVitals from "@/components/WebVitals";

export const metadata: Metadata = {
  title: "JumpCut - Ma Cinémathèque",
  description: "Votre collection personnelle de films avec notes et critiques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Preconnect pour accélérer les connexions TMDb */}
        <link rel="preconnect" href="https://api.themoviedb.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        
        {/* Preload des fonts critiques */}
        <link 
          rel="preload" 
          href="/font/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* DNS prefetch pour autres domaines */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body
        className={`${fontVariables} font-roboto antialiased bg-black`}
      >
        <Navbar />
        {children}
        <WebVitals />
      </body>
    </html>
  );
}
