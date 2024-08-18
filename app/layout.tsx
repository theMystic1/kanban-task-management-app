import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/_styles/globals.css";
import { DarkModeProvider } from "./_contexts/DarkModeContext";
import { AsideContextProvider } from "./_contexts/AsideContext";

import MainServer from "./_components/ui/MainServer";
import Main from "./_components/ui/Main";

const plus_Sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s || Kanban task manager",
    default: "Welcome | Kanban task manager app",
  },
  description: "The greatest task manager app of all time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plus_Sans.className}>
        <DarkModeProvider>
          <AsideContextProvider>
            <MainServer>{children}</MainServer>
          </AsideContextProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
