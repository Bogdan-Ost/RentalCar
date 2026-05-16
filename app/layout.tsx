import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers"; // Оновлений шлях
import Header from "@/components/Header/Header";

export const metadata: Metadata = {
  title: "Rental Car",
  description: "Car rental application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
