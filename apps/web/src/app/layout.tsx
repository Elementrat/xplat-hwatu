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

const inter = Poppins({ subsets: ["latin"], weight: ["300", "500"] });

export const metadata: Metadata = {
  title: "App - cross-platform",
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
        <div className={styles.appRoot}>
          <AppWrapperClient session={session}>
            <GlobalNavigation />
            <AppContent>{children}</AppContent>
          </AppWrapperClient>
        </div>
      </body>
    </html>
  );
}
