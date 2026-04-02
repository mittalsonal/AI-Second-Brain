import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuralNotes – AI Second Brain",
  description: "Your personal AI-powered knowledge base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}