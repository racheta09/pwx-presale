"use client"
import Auth from "@/components/auth"
import {
  useContractWrite,
  useContractRead,
  useContract,
  useAddress,
  Web3Button,
} from "@thirdweb-dev/react"
import { useState } from "react"
import { LinearProgress, TextField, Alert, Snackbar } from "@mui/material"
import Image from "next/image"
import BuyData from "@/components/buyData"
import Link from "next/link"
import { Timer } from "@/components/timer"

export default function Home() {
  const saleAddress = "0xb0b6f0a830E9027E0cbF74400592006cE9DBA12B" //Mainnet
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955" //Mainnet
  // const saleAddress = "0x207d4c59858193Af55190b2E8604d77221C2cC5c"
  // const usdtAddress = "0xea9579a69EbD08217926B364E8c8de513FDf8E23"
  const address = useAddress()
  const { data: saleContract } = useContract(saleAddress)
  const { data: usdtContract } = useContract(usdtAddress, "token")
  const { data: allowance } = useContractRead(usdtContract, "allowance", [
    address,
    saleAddress,
  ])
  const { data: balance } = useContractRead(usdtContract, "balanceOf", [
    address,
  ])
  // const { data: saleEnded } = useContractRead(saleContract, "saleEnded")
  const { data: tokensSold } = useContractRead(saleContract, "tokensSold")
  const { data: rate } = useContractRead(saleContract, "rate")
  const { data: totalBought } = useContractRead(saleContract, "totalBought", [
    address,
  ])
  const { data: totalTransactions } = useContractRead(
    saleContract,
    "totalTransactions",
    [address]
  )
  const { mutateAsync: buyPWX } = useContractWrite(
    saleContract,
    "buyPWXwithUSDT"
  )
  const { mutateAsync: approve } = useContractWrite(usdtContract, "approve")

  const [usdt, setUsdt] = useState("0")
  const [txhash, setTxhash] = useState("")
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen">
      <Auth>
        <div className="flex flex-col justify-center items-center gap-2 m-2 p-2 w-full bg-slate-900">
          <div>
            <h1 className="text-4xl font-bold text-center">
              Welcome to PWX Presale Dapp
            </h1>
            <h3 className="text-center font-bold">Launching Price $0.016</h3>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-2 w-full lg:w-5/6 m-2 p-2">
            <div className="flex flex-1 flex-col items-center justify-center bg-[url(/bg2.jpg)] bg-center bg-transparent gap-2 p-5 min-h-screen w-full lg:w-1/2">
              <Image src="/logo.png" alt="logo" width="200" height="200" />
              <h4 className="text-center">Token Sale is Live</h4>
              <h5 className="text-center">
                1st round 50,00,000 tokens @0.005 $ For 4 days
              </h5>
              <Timer deadline={"June 3, 2023 10:00:00"} />
              <h5 className="text-center">
                2nd round50,00,000 tokens @ 0.007 $ For 4 days
              </h5>
              <h5 className="text-center">
                3rd round 50,00,000 tokens @ 0.009 $ for 4 days
              </h5>
              <h5 className="text-center">
                Final round 50,00,000 tokens @ 0.011 $ for 4 days
              </h5>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center bg-[url(/bg1.jpg)] bg-center bg-transparent gap-2 p-5 min-h-screen w-full lg:w-1/2">
              <LinearProgress
                variant="determinate"
                value={
                  ((parseInt(tokensSold) * 1e-18 + 840000 + 1200000) /
                    5000000) *
                  100
                }
                className="rounded-lg h-8 min-w-full"
                color="primary"
              />
              <h4 className="text-center">
                {(parseInt(tokensSold) * 1e-18 + 840000 + 1200000).toFixed(2)}{" "}
                PWX Sold
              </h4>

              <p className="text-lg">
                Current Rate:
                {rate / 1000} USDT/PWX
                <br />
                Balance: {(balance * 1e-18).toFixed(2)} USDT
              </p>
              <Image src="/usdt.png" alt="USDT" height="100" width="100" />
              <p className="text-lg">
                You will get{" "}
                {((parseFloat(usdt) / parseInt(rate)) * 1000).toFixed(2)} PWX
              </p>
              <TextField
                id="outlined-number"
                label="USDT"
                type="number"
                variant="outlined"
                value={usdt}
                onChange={(e) => setUsdt(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                name="usdttext"
              />
              {parseInt(allowance) >= parseFloat(usdt) * 1e18 ? (
                <Web3Button
                  contractAddress={saleAddress}
                  action={async () => {
                    const tx = await buyPWX({
                      args: [(parseFloat(usdt) * 1e18).toString()],
                    })
                    setTxhash(tx?.receipt?.transactionHash)
                  }}
                  isDisabled={parseFloat(usdt) < 50}
                >
                  Buy PWX
                </Web3Button>
              ) : (
                <Web3Button
                  contractAddress={usdtAddress}
                  action={async () =>
                    await approve({
                      args: [saleAddress, (parseFloat(usdt) * 1e18).toString()],
                    })
                  }
                  isDisabled={parseFloat(usdt) < 50}
                >
                  Approve USDT
                </Web3Button>
              )}
              <p className="text-center text-red-600 text-sm">
                *minimum buying amount is 50 USDT
              </p>
              <p>
                Total Bought: {(parseInt(totalBought) * 1e-18).toFixed(2)} PWX
              </p>
              <h3>Buying History</h3>
              {[...Array(totalTransactions?.toNumber())].map((item, index) => (
                <BuyData
                  key={index}
                  saleAddress={saleAddress}
                  address={address}
                  index={index}
                />
              ))}
              <Snackbar
                open={txhash !== ""}
                autoHideDuration={6000}
                onClose={() => setTxhash("")}
              >
                <Alert severity="success" className="w-full">
                  <Link
                    href={`https://www.bscscan.com/tx/${txhash}`}
                    target="_blank"
                  >
                    Transaction Success
                  </Link>
                </Alert>
              </Snackbar>
            </div>
          </div>
        </div>
      </Auth>
    </main>
  )
}
