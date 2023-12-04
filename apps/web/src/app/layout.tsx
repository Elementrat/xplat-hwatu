import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "ux/styles/globals.css";
import GlobalNavigation from "./components/GlobalNavigation/GlobalNavigation";
import styles from "./layout.module.css";
import AppContent from "./components/AppContent/AppContent";
import AppWrapperClient from "./context/AppWrapperClient/AppWrapperClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { UIProvider, LocalStorageProvider } from "xplat-lib";
import { TranslationProvider } from "xplat-lib";
import { Modals, AppRoot } from "ux";

const inter = Poppins({ subsets: ["latin"], weight: ["300", "500"] });

export const metadata: Metadata = {
  title: "Hwatu Study Tool",
  description: "Simuldeploy to web, iOS, Android"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <body className={inter.className}>
        <AppWrapperClient session={session}>
          <LocalStorageProvider>
            <UIProvider>
              <AppRoot>
                <TranslationProvider>
                  <GlobalNavigation />
                  <AppContent>{children}</AppContent>
                  <Modals />
                </TranslationProvider>
              </AppRoot>
            </UIProvider>
          </LocalStorageProvider>
        </AppWrapperClient>
      </body>
    </html>
  );
}
