"use client"
import { darkTheme } from "@/components/themes"
import { ThemeProvider, CssBaseline } from "@mui/material"

export default function Layer({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
