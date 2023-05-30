"use client"
import { ReactElement, useEffect, useState } from "react"
import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import { Grid } from "@mui/material"

export default function Auth({
  children,
}: {
  children: React.ReactNode
}): ReactElement {
  const [isLoggedin, setIsLoggedin] = useState(false)
  const address = useAddress()

  useEffect(() => {
    if (address) {
      setIsLoggedin(true)
    } else {
      setIsLoggedin(false)
    }
  }, [address])

  if (!isLoggedin) {
    return (
      <div className="bg-[url(/bg3.jpg)] min-h-screen flex flex-col items-center">
        <h1 className="text-6xl font-bold text-center">
          Welcome to PWX Presale Dapp
        </h1>
        <ConnectWallet btnTitle="Connect Wallet to continue" />
      </div>
    )
  }
  return <>{children}</>
}
