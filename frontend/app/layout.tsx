// app/layout.tsx
import { Public_Sans } from "next/font/google";
import "./globals.css";
import AppProviders from "../src/components/AppProviders";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={publicSans.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
