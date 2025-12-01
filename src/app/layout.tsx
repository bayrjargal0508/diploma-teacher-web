import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const sfProRounded = localFont({
  src: [
    {
      path: "./fonts/sf-pro-rounded/SF-Pro-Rounded-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-rounded/SF-Pro-Rounded-Ultralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-rounded/SF-Pro-Rounded-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "/fonts/sf-pro-rounded/SF-Pro-Rounded-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-rounded/SF-Pro-Rounded-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-rounded/SF-Pro-Rounded-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-rounded/SF-Pro-Rounded-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-rounded/SF-Pro-Rounded-Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-rounded/SF-Pro-Rounded-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro-rounded",
});

const sfProMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yesh Teacher",
  description: "For Yesh Teacher website",
  icons: {
    icon: "/small-logo.svg",
    shortcut: "/small-logo.svg",
    apple: "/small-logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sfProRounded.variable} ${sfProMono.variable} antialiased`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
