import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KIJANIFY — 공급망·탄소",
  description:
    "커피·코코아 농업 공급망 탄소 데이터 및 ESG/EUDR 컴플라이언스 프로토타입",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${sourceSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
