import { ReactElement, useEffect, useState } from "react"
import Web3 from "web3"

declare global {
  interface Window {
    ethereum?: any
  }
}
const connectMetamask = async (): Promise<[string, number]> => {
  if (typeof window !== "undefined" && window.ethereum) {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    })
  }
  const web3 = new Web3(window.ethereum || "https://bsc-dataseed1.binance.org")
  const address = await web3.eth.getAccounts()
  const chainId = await web3.eth.getChainId()
  return [address[0], chainId]
}

export default function Auth({
  children,
}: {
  children: React.ReactNode
}): ReactElement {
  const [isLoggedin, setIsLoggedin] = useState(false)
  const [address, setAddress] = useState("")
  const [chainId, setChainId] = useState(0)

  const fetchAddress = async () => {
    const [fetchedAddress, chainId] = await connectMetamask()
    setAddress(fetchedAddress)
    setChainId(chainId)
  }

  useEffect(() => {
    setIsLoggedin(!!address)
  }, [address])
  if (!isLoggedin || chainId !== 56) {
    return (
      <div className="bg-[url(/bg3.jpg)] min-h-screen flex flex-col items-center">
        <h1 className="text-6xl font-bold text-center">
          Welcome to PWX Presale Dapp
        </h1>
        {chainId !== 56 && chainId !== 0 ? (
          <h2 className="text-red-700 text-center">
            Please switch to Binance Smart Chain Mainnet
          </h2>
        ) : (
          ""
        )}
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
