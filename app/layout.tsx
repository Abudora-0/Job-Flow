import type { Metadata } from "next";
import { Work_Sans, Courier_Prime } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-body" });
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  variable: "--font-type",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "JobFlow — Application Dossier",
  description: "Track your job hunt like a case file: a paper Kanban desk with deadlines, priorities and stats.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${workSans.variable} ${courierPrime.variable}`}>
      <body className={workSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
