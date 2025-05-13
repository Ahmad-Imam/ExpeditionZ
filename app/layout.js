import { Inter } from "next/font/google";

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";

import { AutumnProvider } from "autumn-js/next";

import ProductChangeDialog from "@/components/autumn/product-change-dialog";
import AutumnPaywall from "@/components/autumn/paywall-dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ExpeditionZ",
  description: "Take your trip to next level",
};

export default async function RootLayout({ children }) {
  // const user = await getLoggedUser();
  // console.log(user);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}  `}>
        <AutumnProvider
          authPlugin={{
            provider: "clerk",
            useOrg: false,
          }}
          components={{
            paywallDialog: AutumnPaywall,
            productChangeDialog: ProductChangeDialog,
          }}
          // customerId="test-user"
          // customerData={{ name: "Ahmad Imam", email: "ahmadimam71@gmail.com" }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider
              appearance={{
                baseTheme: dark,
              }}
            >
              <div className="flex flex-col mx-auto">
                <Header />
                <main className="min-h-screen pt-20 w-full mx-auto flex flex-col ">
                  {children}
                </main>
                <Toaster richColors />
                <footer className="my-12 w-full bg-background">
                  <div className=" mx-auto px-4 text-center">
                    <p>
                      © {new Date().getFullYear()} ExpeditionZ Travel Planner
                    </p>
                  </div>
                </footer>
              </div>
            </ClerkProvider>
          </ThemeProvider>
        </AutumnProvider>
      </body>
    </html>
  );
}
