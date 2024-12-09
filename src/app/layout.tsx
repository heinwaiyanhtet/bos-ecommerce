import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import { AppProvider } from "./Provider/AppProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Boss Nation",
  description: "Boss Nation: Be Authentic. Shop With Us.",
  keywords: [
    "Boss Nation Authentic Fashion",
    "Boss Nation",
    "Hugo Boss Myanmar",
    "Luxury",
    "Mens Fashion",
    "Yangon",
    "Exclusive",
    "Branded",
    "New Arrival",
    "Limited Edition",
    "Buy Online",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Boss Nation: Be Authentic. Shop With Us.",
    url: "http://boss-nation.com/",
    siteName: "Boss Nation",
    description: "Boss Nation: Be Authentic. Shop With Us.",
    images: [
      {
        url: "https://minio.mms-it.com/boss-nation/post_47.jpg",
        width: 1920,
        height: 1080,
        alt: "Boss Nation",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        
        <AppProvider>{children}</AppProvider>
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
