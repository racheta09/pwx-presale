import "./globals.css"
import { Inter } from "next/font/google"
import Layer from "@/components/layer"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PWX Presale Dapp",
  description: "",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={inter.className} id="__next">
        <Layer>
          <Navbar />
          {children}
        </Layer>
      </body>
    </html>
  )
}
