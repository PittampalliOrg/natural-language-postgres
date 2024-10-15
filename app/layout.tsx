import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { KasadaClient } from "@/utils/kasada/kasada-client";

export const metadata = {
  metadataBase: new URL("https://natural-language-postgres.vercel.app"),
  title: "Natural Language Postgres",
  description:
    "Chat with a Postgres database using natural language powered by the AI SDK by Vercel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistMono.className} ${GeistSans.className}`}>
        <KasadaClient />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
