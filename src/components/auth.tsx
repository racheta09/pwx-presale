import { ReactElement, useEffect, useState } from "react"
import Web3 from "web3"

declare global {
  interface Window {
    ethereum?: any
  }
}
const getAddress = async (): Promise<string> => {
  if (typeof window !== "undefined" && window.ethereum) {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    // window.web3 = new Web3(window.ethereum)
  }
  const web3 = new Web3(window.ethereum || "https://bsc-dataseed1.binance.org")
  const address = await web3.eth.getAccounts()
  return address[0]
}

export default function Auth({
  children,
}: {
  children: React.ReactNode
}): ReactElement {
  const [isLoggedin, setIsLoggedin] = useState(false)
  const [address, setAddress] = useState("")

  const fetchAddress = async () => {
    const fetchedAddress = await getAddress()
    setAddress(fetchedAddress)
  }

  useEffect(() => {
    setIsLoggedin(!!address)
  }, [address])

  if (!isLoggedin) {
    return (
      <div className="bg-[url(/bg3.jpg)] min-h-screen flex flex-col items-center">
        <h1 className="text-6xl font-bold text-center">
          Welcome to PWX Presale Dapp
        </h1>
        <button
          onClick={fetchAddress}
          type="button"
          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Login to continue
        </button>
      </div>
    )
  }
  return <>{children}</>
}
