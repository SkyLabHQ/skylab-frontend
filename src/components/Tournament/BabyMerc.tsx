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
            const res = await babyMercsContract.publicMint(account, {
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
                            height: "32px",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            color: "#FFF",
                            textAlign: "center",
                            fontSize: "1.25vw",
                            marginTop: "4px",
                        }}
                    >
                        50 MATICS EACH
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "40px",
                        }}
                    >
                        <Box
                            sx={{
                                width: "98px",
                                height: "26px",
                                borderRadius: "5px",
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
                                    height: "26px",
                                    width: "26px",
                                    textAlign: "center",
                                    color: "#000",
                                    fontSize: "28px",
                                    lineHeight: "26px",
                                    cursor: "pointer",
                                }}
                                onClick={handleSubAmount}
                            >
                                -
                            </Box>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                }}
                            >
                                {amount}
                            </Text>
                            <Box
                                sx={{
                                    background: "#f2d861",
                                    height: "26px",
                                    width: "26px",
                                    textAlign: "center",
                                    color: "#000",
                                    fontSize: "28px",
                                    lineHeight: "26px",
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
                                height: "3px",
                                margin: "0 4px",
                            }}
                        ></Image>
                        <Text
                            sx={{
                                color: "#F2D861",
                                fontSize: "24px",
                            }}
                            width="180px"
                        >
                            {amount * Price[chainId]} MATIC
                        </Text>
                    </Box>
                    <Box
                        onClick={handleMint}
                        sx={{
                            background: `url(${MintBg})`,
                            fontSize: "36px",
                            fontWeight: 900,
                            color: "#000",
                            width: "204px",
                            height: "60px",
                            backgroundSize: "100% 100%",
                            textAlign: "center",
                            lineHeight: "60px",
                            cursor: "pointer",
                            margin: "30px auto 0",
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
                        right: "100px",
                        top: "190px",
                        width: "964px",
                    }}
                >
                    <Image
                        src={BabyTitle}
                        sx={{
                            height: "56px",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            fontSize: "24px",
                            fontStyle: "italic",
                            fontWeight: 400,
                            lineHeight: "60px",
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
