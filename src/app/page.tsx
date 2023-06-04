"use client"
import Auth from "@/components/auth"
import { useState, useEffect } from "react"
import { LinearProgress, TextField, Alert, Snackbar } from "@mui/material"
import Image from "next/image"
import BuyData from "@/components/buyData"
import Link from "next/link"

import { Timer } from "@/components/timer"
import erc20abi from "@/assets/tokenabi.json"
import PWXSeller from "@/assets/PWXSeller.json"

import Web3 from "web3"
import { AbiItem } from "web3-utils"

const getAddress = async (): Promise<string> => {
  const web3 = new Web3(window.ethereum || "https://bsc-dataseed1.binance.org")
  const address = await web3.eth.getAccounts()
  return address[0]
}

export default function Home() {
  const web3 = new Web3(Web3.givenProvider || "https://bsc-dataseed1.binance.org")
  const [address, setAddress] = useState("")
  const saleAddress = "0xb0b6f0a830E9027E0cbF74400592006cE9DBA12B" //Mainnet
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955" //Mainnet
  // const saleAddress = "0x207d4c59858193Af55190b2E8604d77221C2cC5c"
  // // const usdtAddress = "0xea9579a69EbD08217926B364E8c8de513FDf8E23"

  const saleContract = new web3.eth.Contract(
    PWXSeller as AbiItem[],
    saleAddress
  )
  const usdtContract = new web3.eth.Contract(erc20abi as AbiItem[], usdtAddress)

  const buyPWX = async () => {
    const sold = await saleContract.methods
      .buyPWXwithUSDT((parseFloat(usdt) * 1e18).toString())
      .send({ from: address })
    setTxhash(sold["transactionHash"])
  }
  const approve = async () => {
    const approved = await usdtContract.methods
      .approve(saleAddress, (parseFloat(usdt) * 1e18).toString())
      .send({ from: address })
    setTxhash(approved["transactionHash"])
  }

  const [allowance, setAllowance] = useState("")
  const [balance, setBalance] = useState("")
  const [tokensSold, setTokensSold] = useState("")
  const [rate, setRate] = useState("")
  const [totalBought, setTotalBought] = useState("")
  const [totalTransactions, setTotalTransactions] = useState("")
  useEffect(() => {
    const fetchAddress = async () => {
      const fetchedAddress = await getAddress()
      setAddress(fetchedAddress)
    }

    fetchAddress()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      const allowance = await usdtContract.methods
        .allowance(address, saleAddress)
        .call()
      const balance = await usdtContract.methods.balanceOf(address).call()
      const tokensSold: any = await saleContract.methods.tokensSold().call()
      const rate: any = await saleContract.methods.rate().call()
      const totalBought: any = await saleContract.methods
        .totalBought(address)
        .call()
      const totalTransactions: any = await saleContract.methods
        .totalTransactions(address)
        .call()
      setAllowance(allowance)
      setBalance(balance)
      setTokensSold(tokensSold)
      setRate(rate)
      setTotalBought(totalBought)
      setTotalTransactions(totalTransactions)
    }
    if (address) fetchData()
  }, [address])

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
                1st round 50,00,000 tokens @0.005 $ Completed
              </h5>
              <h5 className="text-center">
                2nd round 50,00,000 tokens @ 0.007 $ For 4 days
              </h5>
              <Timer deadline={"June 5, 2023 00:00:00"} />
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
                  ((parseInt(tokensSold) * 1e-18 -
                    713600 +
                    71428 +
                    285714 +
                    2895755) /
                    5000000) *
                  100
                }
                className="rounded-lg h-8 min-w-full"
                color="primary"
              />
              <h4 className="text-center">
                {(
                  parseInt(tokensSold) * 1e-18 -
                  713600 +
                  71428 +
                  285714 +
                  2895755
                ).toFixed(2)}{" "}
                PWX Sold
              </h4>

              <p className="text-lg">
                Current Rate:
                {parseInt(rate) / 1000} USDT/PWX
                <br />
                Balance: {(parseInt(balance) * 1e-18).toFixed(2)} USDT
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
                <button
                  onClick={buyPWX}
                  disabled={parseFloat(usdt) < 50}
                  type="button"
                  className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Buy PWX
                </button>
              ) : (
                <button
                  onClick={approve}
                  disabled={parseFloat(usdt) < 50}
                  type="button"
                  className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Approve USDT
                </button>
              )}
              <p className="text-center text-red-600 text-sm">
                *minimum buying amount is 50 USDT
              </p>
              <p>
                Total Bought:{" "}
                {address == "0x40bf5F6aFD0b240b7f15D87CF5aAFd62DF094C2B"
                  ? "1340000.00"
                  : (parseInt(totalBought) * 1e-18).toFixed(2)}{" "}
                PWX
              </p>
              <h3>Buying History</h3>
              {address == "0x40bf5F6aFD0b240b7f15D87CF5aAFd62DF094C2B" ? (
                <div className="text-sm">Rate: $0.005 Amount: 1340000 PWX</div>
              ) : (
                ""
              )}
              {totalTransactions &&
                [...Array(parseInt(totalTransactions))].map((item, index) => (
                  <BuyData
                    key={index}
                    saleContract={saleContract}
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
