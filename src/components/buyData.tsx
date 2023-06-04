import { useState, useEffect } from "react"
import Web3 from "web3"

interface BuyDataProps {
  saleContract: any
  address: string | undefined
  index: number
}
export default function BuyData({
  saleContract,
  address,
  index,
}: BuyDataProps) {
  const [buyingData, setBuyingData] = useState({ rate: "", tokensSold: "" })
  useEffect(() => {
    const fetchData = async () => {
      const buyingData = saleContract.methods
        .buyingData(address, index.toString())
        .call()
      setBuyingData(buyingData)
    }
  })

  return (
    <div className="text-sm">
      Rate: ${parseInt(buyingData?.rate) / 1000} Amount:{" "}
      {parseInt(buyingData?.tokensSold?.toString()?.slice(0, -16)) * 1e-2} PWX
    </div>
  )
}
