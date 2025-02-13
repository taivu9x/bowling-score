import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bowling Score",
  description: "Bowling Score",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          <div className="min-h-screen bg-gray-900">
            {children}
          </div>
      </body>
    </html>
  );
}
