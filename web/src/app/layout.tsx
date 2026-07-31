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
  applicationName: "KIJANIFY",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "KIJANIFY — 공급망·탄소",
    description:
      "현장 GPS·조사부터 토지이용·탄소·EUDR/DDS·공급망까지 연결하는 시연 플랫폼",
    locale: "ko_KR",
    type: "website",
  },
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
