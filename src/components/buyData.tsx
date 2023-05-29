import { useContract, useContractRead } from "@thirdweb-dev/react"
import millify from "millify"

interface BuyDataProps {
    saleAddress: string
    address: string | undefined
    index: number
}
export default function BuyData({ saleAddress, address, index }: BuyDataProps) {
    const { data: saleContract } = useContract(saleAddress)
    const { data: buyingData, isLoading } = useContractRead(
        saleContract,
        "buyingData",
        [address, index?.toString()]
    )
    return (
        <div className="text-sm">
            Rate: ${buyingData?.rate?.toNumber() / 1000} Amount:{" "}
            {parseInt(buyingData?.tokensSold?.toString()?.slice(0, -16)) * 1e-2}{" "}
            PWX
        </div>
    )
}
