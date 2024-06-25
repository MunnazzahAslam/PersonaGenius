import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@radix-ui/themes/styles.css';
import clsx from "clsx";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import StoreProvider from "@/providers/redux/provider/store-provider";
import Navigation from "@/components/site/navigation";
import { ResponseProvider } from "@/providers/response-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PersonaGenius",
  description: "Unlock Customer Insights now with PersonaGenius.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          font.className,
          "font-sans antialiased overflow-x-hidden w-full"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <ResponseProvider>
              <Navigation />
              <ModalProvider>{children}</ModalProvider>
            </ResponseProvider>
          </StoreProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}