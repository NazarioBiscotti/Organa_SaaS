import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Organa",
  description: "Organa application",
};


export default function RootLayout({
  children,
}: LayoutProps<"/">) {

  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} `}
    >

      <head>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body  className="font-sans antialiased mybody">


        <Navbar />
      
      <div className="p-2">

        {children}
      </div>
       
      </body>
    </html>
  );
}