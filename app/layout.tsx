import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OurBus - Book Tickets",
  description: "India's best bus booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
