import Provider from "@/utils/provider";
import "./globals.css";
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";

declare global {
  interface Window {
    Kakao: any;
  }
}
const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const bitBit = localFont({
  src: "../public/font/DNFBitBitv2.ttf",
  variable: "--font-bitBit",
});

const nexonGothic = localFont({
  src: "../public/font/NEXON-Lv2-Gothic.ttf",
  variable: "--font-nexonGothic",
});

const nexonGothic_Light = localFont({
  src: "../public/font/NEXON-Lv2-Gothic-Light.ttf",
  variable: "--font-nexonGothic-Light",
});

const nexonGothic_Medium = localFont({
  src: "../public/font/NEXON-Lv2-Gothic-Medium.ttf",
  variable: "--font-nexonGothic-Medium",
});

const nexonGothic_Bold = localFont({
  src: "../public/font/NEXON-Lv2-Gothic-Bold.ttf",
  variable: "--font-nexonGothic-Bold",
});

const neoDuggeunmo_Pro = localFont({
  src: "../public/font/NeoDunggeunmoPro-Regular.ttf",
  variable: "--font-neoDuggeunmo_Pro",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "그루그루",
  description: "서로에게 남기는 메세지, 우리가 만들어가는 정원",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* nes.css 이식위한 작업 */}
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://unpkg.com/nes.css/css/nes.css" rel="stylesheet" />
      </head>
      <body
        className={`${pressStart2P.className} ${bitBit.variable} ${nexonGothic.variable} ${nexonGothic_Light.variable} ${nexonGothic_Medium.variable} ${nexonGothic_Bold.variable} ${neoDuggeunmo_Pro.variable}`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
