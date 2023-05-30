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
// import erc20abi from "@/assets/erc20abi.json"
import {
    Paper,
    Grid,
    LinearProgress,
    TextField,
    Alert,
    Snackbar,
} from "@mui/material"
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
        <main className="flex min-h-screen flex-col items-center">
            <Auth>
                <Paper
                    sx={{
                        padding: "1rem",
                        margin: "1rem",
                        borderRadius: "0.5rem",
                        // backgroundColor: "rgba(12,12,12,0.5)",
                        backgroundColor: "rgb(4, 30, 55, 0.5)",
                        textAlign: "center",
                        color: "white",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        letterSpacing: "0.1rem",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0px 0px 10px #1f466a",
                    }}
                >
                    <h1 className="text-4xl font-bold text-center">
                        Welcome to PWX Presale Dapp
                    </h1>
                    <h4 className="text-center font-bold">
                        Launching Price $0.016
                    </h4>
                    <Grid
                        container
                        spacing={3}
                        justifyContent="space-evenly"
                        alignItems="center"
                    >
                        <Grid
                            item
                            sm={12}
                            lg={6}
                            sx={{
                                padding: "20px",
                            }}
                        >
                            <Image
                                src="/logo.png"
                                alt="logo"
                                width="200"
                                height="200"
                            />
                            <h4 className="text-center">Token Sale is Live</h4>
                            <h6 className="text-center">
                                1st round 50,00,000 tokens @0.005 $ For 4 days
                            </h6>
                            <Timer deadline={"June 3, 2023 10:00:00"} />
                            <h6 className="text-center">
                                2nd round50,00,000 tokens @ 0.007 $ For 4 days
                            </h6>
                            <h6 className="text-center">
                                3rd round 50,00,000 tokens @ 0.009 $ for 4 days
                            </h6>
                            <h6 className="text-center">
                                Final round 50,00,000 tokens @ 0.011 $ for 4
                                days
                            </h6>
                        </Grid>
                        <Grid item sm={12} lg={6}>
                            <Grid
                                container
                                item
                                xl={12}
                                direction="row"
                                spacing={4}
                                justifyContent="center"
                                alignItems="center"
                                className="flex flex-col items-center justify-center"
                            >
                                <Paper
                                    elevation={24}
                                    style={{
                                        backgroundColor:
                                            "rgba(225, 217, 209,0.5)",
                                        // backgroundColor: "rgb(4, 30, 55)",
                                        width: "100%",
                                        padding: "20px",
                                        margin: "20px",
                                    }}
                                    className="flex flex-col items-center justify-center"
                                >
                                    <Grid
                                        container
                                        direction="column"
                                        alignItems={"center"}
                                        justifyItems="center"
                                    >
                                        <Grid item>
                                            <LinearProgress
                                                variant="determinate"
                                                // value={50}
                                                value={
                                                    ((parseInt(tokensSold) *
                                                        1e-18) /
                                                        5000000) *
                                                    100
                                                }
                                                style={{ height: "25px" }}
                                                className="rounded-lg max-w-2xl"
                                                color="primary"
                                            />
                                            <h4 style={{ color: "black" }}>
                                                {(
                                                    parseInt(tokensSold) * 1e-18
                                                ).toFixed(2)}{" "}
                                                PWX Sold
                                            </h4>
                                        </Grid>

                                        <Grid item>
                                            Current Rate:
                                            {rate / 1000} USDT/PWX
                                        </Grid>
                                        <Grid item>
                                            Balance:{" "}
                                            {(balance * 1e-18).toFixed(2)} USDT
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        container
                                        item
                                        direction="column"
                                        md={6}
                                        spacing={3}
                                        justifyItems="center"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <Image
                                                src="/usdt.png"
                                                alt="USDT"
                                                height="100"
                                                width="100"
                                            />
                                        </Grid>
                                        <Grid item>
                                            You will get{" "}
                                            {(
                                                (parseFloat(usdt) /
                                                    parseInt(rate)) *
                                                1000
                                            ).toFixed(2)}{" "}
                                            PWX
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-number"
                                                label="USDT"
                                                type="number"
                                                variant="outlined"
                                                value={usdt}
                                                onChange={(e) =>
                                                    setUsdt(e.target.value)
                                                }
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                name="usdttext"
                                            />
                                        </Grid>
                                        <Grid item>
                                            {parseInt(allowance) >=
                                            parseFloat(usdt) * 1e18 ? (
                                                <Web3Button
                                                    contractAddress={
                                                        saleAddress
                                                    }
                                                    action={async () => {
                                                        const tx = await buyPWX(
                                                            {
                                                                args: [
                                                                    (
                                                                        parseFloat(
                                                                            usdt
                                                                        ) * 1e18
                                                                    ).toString(),
                                                                ],
                                                            }
                                                        )
                                                        setTxhash(
                                                            tx?.receipt
                                                                ?.transactionHash
                                                        )
                                                    }}
                                                    isDisabled={
                                                        parseFloat(usdt) < 50
                                                    }
                                                >
                                                    Buy PWX
                                                </Web3Button>
                                            ) : (
                                                <Web3Button
                                                    contractAddress={
                                                        usdtAddress
                                                    }
                                                    action={async () =>
                                                        await approve({
                                                            args: [
                                                                saleAddress,
                                                                (
                                                                    parseFloat(
                                                                        usdt
                                                                    ) * 1e18
                                                                ).toString(),
                                                            ],
                                                        })
                                                    }
                                                    isDisabled={
                                                        parseFloat(usdt) < 50
                                                    }
                                                >
                                                    Approve USDT
                                                </Web3Button>
                                            )}
                                            <p className="text-center text-red-600 text-sm">
                                                *minimum buying amount is 50
                                                USDT
                                            </p>
                                        </Grid>
                                    </Grid>
                                    <p>
                                        Total Bought:{" "}
                                        {(
                                            parseInt(totalBought) * 1e-18
                                        ).toFixed(2)}{" "}
                                        PWX
                                    </p>
                                    <h3>Buying History</h3>
                                    {[
                                        ...Array(totalTransactions?.toNumber()),
                                    ].map((item, index) => (
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
                                        <Alert
                                            // onClose={}
                                            severity="success"
                                            sx={{ width: "100%" }}
                                        >
                                            <Link
                                                href={`https://www.bscscan.com/tx/${txhash}`}
                                                target="_blank"
                                            >
                                                Transaction Success
                                            </Link>
                                        </Alert>
                                    </Snackbar>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Auth>
        </main>
    )
}
