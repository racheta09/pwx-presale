"use client"
import { darkTheme } from "@/components/themes"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"

export default function Layer({ children }: { children: React.ReactNode }) {
  const activeChainId = ChainId.BinanceSmartChainMainnet
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ThirdwebProvider activeChain={activeChainId}>
        {children}
      </ThirdwebProvider>
    </ThemeProvider>
  )
}
