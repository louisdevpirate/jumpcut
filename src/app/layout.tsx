import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { fontVariables } from "@/lib/fonts";

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
      <body
        className={`${fontVariables} font-roboto antialiased bg-black`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
