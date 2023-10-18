import { Box, Text, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import BackHomeButton from "./BackHomeButton";
import MintBabyImg from "./assets/mint-baby.png";
import BabyBg from "./assets/baby-bg.jpg";
import Line from "./assets/line.svg";
import MintBg from "./assets/mint-bg.jpg";
import BabyTitle from "./assets/baby-title.svg";
import BabyTitle1 from "./assets/baby-title1.svg";
import { useBabyMercsContract } from "@/hooks/useContract";
import { ethers } from "ethers";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import Loading from "../Loading";
import { ChainId } from "@/utils/web3Utils";

const Price = {
    [ChainId.POLYGON]: 1,
    [ChainId.MUMBAI]: 0.001,
};

const BabyMerc = ({
    onNextRound,
}: {
    onNextRound: (step: number | string) => void;
}) => {
    const { account, chainId } = useActiveWeb3React();
    const [loading, setLoading] = useState(false);
    const babyMercsContract = useBabyMercsContract();
    const [amount, setAmount] = useState(1);

    const handleAddAmount = () => {
        setAmount(amount + 1);
    };

    const handleSubAmount = () => {
        if (amount > 1) {
            setAmount(amount - 1);
        }
    };

    const handleMint = async () => {
        try {
            setLoading(true);
            const res = await babyMercsContract.publicMint(account, amount, {
                value: ethers.utils.parseEther(String(amount * Price[chainId])),
            });
            await res.wait();
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    return (
        <Box>
            {loading && <Loading></Loading>}
            <BackHomeButton onClick={() => onNextRound(2)}></BackHomeButton>
            <Box
                sx={{
                    width: "100%",
                    height: "100vh",
                    backgroundSize: "28.6458vw,100%",
                    backgroundPosition: "center left, center",
                    backgroundImage: `url(${MintBabyImg}), url(${BabyBg})`,
                    backgroundRepeat: "no-repeat, no-repeat",
                }}
            >
                <Box
                    sx={{
                        left: "6.7708vw",
                        top: "55.5556vh",
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Image
                        src={BabyTitle1}
                        sx={{
                            height: "1.6667vw",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            color: "#FFF",
                            textAlign: "center",
                            fontSize: "1.25vw",
                            marginTop: "0.2083vw",
                        }}
                    >
                        {Price[chainId]} MATICS EACH
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "2.0833vw",
                        }}
                    >
                        <Box
                            sx={{
                                width: "5.1042vw",
                                height: "1.3542vw",
                                borderRadius: "0.2604vw",
                                border: "1px solid #F2D861",
                                background: "#4A4A4A",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    background: "#f2d861",
                                    height: "1.3542vw",
                                    width: "1.3542vw",
                                    textAlign: "center",
                                    color: "#000",
                                    fontSize: "1.4583vw",
                                    lineHeight: "1.3542vw",
                                    cursor: "pointer",
                                }}
                                onClick={handleSubAmount}
                            >
                                -
                            </Box>
                            <Text
                                sx={{
                                    fontSize: "1.25vw",
                                }}
                            >
                                {amount}
                            </Text>
                            <Box
                                sx={{
                                    background: "#f2d861",
                                    height: "1.3542vw",
                                    width: "1.3542vw",
                                    textAlign: "center",
                                    color: "#000",
                                    fontSize: "1.4583vw",
                                    lineHeight: "1.3542vw",
                                    cursor: "pointer",
                                }}
                                onClick={handleAddAmount}
                            >
                                +
                            </Box>
                        </Box>
                        <Image
                            src={Line}
                            sx={{
                                height: "0.1563vw",
                                margin: "0 0.2083vw",
                            }}
                        ></Image>
                        <Text
                            sx={{
                                color: "#F2D861",
                                fontSize: "1.25vw",
                            }}
                            width="9.375vw"
                        >
                            {amount * Price[chainId]} MATIC
                        </Text>
                    </Box>
                    <Box
                        onClick={handleMint}
                        sx={{
                            background: `url(${MintBg})`,
                            fontSize: "1.875vw",
                            fontWeight: 900,
                            color: "#000",
                            width: "10.625vw",
                            height: "3.125vw",
                            backgroundSize: "100% 100%",
                            textAlign: "center",
                            lineHeight: "3.125vw",
                            cursor: "pointer",
                            margin: "1.5625vw auto 0",
                            "&:hover": {
                                filter: "drop-shadow(0px 4px 4px #000)",
                            },
                        }}
                    >
                        Mint
                    </Box>
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        right: "5.2083vw",
                        top: "9.8958vw",
                        width: "50.2083vw",
                    }}
                >
                    <Image
                        src={BabyTitle}
                        sx={{
                            height: "2.9167vw",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            fontSize: "1.25vw",
                            fontStyle: "italic",
                            fontWeight: 400,
                            lineHeight: "3.125vw",
                        }}
                    >
                        Baby Mercs allow you to not have your hard-earned
                        Mileage from games go wasted. ​ With Mileage and time,
                        Baby Mercs will become Mercs - the rulers of Mercury.
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

export default BabyMerc;
