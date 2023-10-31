import { Box, Button, Image, Text } from "@chakra-ui/react";
import React from "react";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import StartIcon from "./assets/start.svg";
import PreStepIcon from "./assets/pre-step.svg";
import NextStepIcon from "./assets/next-step.svg";
import PlayIcon from "./assets/play.svg";
import EndIcon from "./assets/end.svg";
import StopIcon from "./assets/stop.svg";
import SaveIcon from "@/components/TacToe/assets/save-icon.svg";
import saveAs from "file-saver";
import html2canvas from "html2canvas";
import TwLogo from "@/components/TacToe/assets/tw-logo.svg";
import { CHAIN_NAMES } from "@/utils/web3Utils";
import RightArrow from "@/components/TacToe/assets/right-arrow.svg";
import { useNavigate } from "react-router-dom";
import BttIcon from "@/assets/btt-icon.png";

const StartJourney = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: "flex",
                background: "#fff",
                borderRadius: "0.9375vw",
                color: "#000",
                padding: "0.2083vw 0.3125vw",
                fontFamily: "Orbitron",
                cursor: "pointer",
                marginTop: "1.5625vw",
                width: "20.8333vw",
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
            }}
            onClick={() => {
                navigate("/activities");
            }}
        >
            <Image
                src={BttIcon}
                sx={{ height: "3.8542vw", marginRight: "0.7813vw" }}
            ></Image>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        sx={{
                            fontSize: "1.6667vw",
                            fontWeight: "bold",
                            marginRight: "0.7813vw",
                        }}
                    >
                        Bid Tac Toe
                    </Text>
                    <Box
                        sx={{
                            borderLeft: "1px solid #000",
                            paddingLeft: "0.5208vw",
                        }}
                    >
                        <Image
                            src={RightArrow}
                            sx={{ height: "1.6667vw" }}
                        ></Image>
                    </Box>
                </Box>
                <Text sx={{ fontWeight: "bold", fontSize: "1.0417vw" }}>
                    Start your journey
                </Text>
            </Box>
        </Box>
    );
};

const ButtonGroup = ({
    startJourney,
    burner,
    bttGameAddress,
    currentRound,
    startPlay,
    handleStartStep,
    handlePreStep,
    handleStartPlay,
    handleNextStep,
    handleEndStep,
    handleStopPlay,
}: {
    startJourney: boolean;
    burner: string;
    bttGameAddress: string;
    currentRound: number;
    startPlay: boolean;
    handleStartStep: () => void;
    handlePreStep: () => void;
    handleStartPlay: () => void;
    handleNextStep: () => void;
    handleEndStep: () => void;
    handleStopPlay: () => void;
}) => {
    const { chainId } = useActiveWeb3React();
    return (
        <Box
            sx={{
                position: "relative",
                maxWidth: "74.4792vw",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "2.0833vw",
                    "& > img": {
                        cursor: "pointer",
                    },
                }}
            >
                <Image
                    src={StartIcon}
                    sx={{
                        marginRight: "1.4583vw",
                        width: "2.0833vw",
                    }}
                    onClick={handleStartStep}
                ></Image>
                <Image
                    src={PreStepIcon}
                    sx={{
                        marginRight: "1.4583vw",
                        width: "3.125vw",
                    }}
                    onClick={handlePreStep}
                ></Image>
                {startPlay ? (
                    <Image
                        src={StopIcon}
                        sx={{
                            marginRight: "1.4583vw",
                            width: "1.25vw",
                        }}
                        onClick={handleStopPlay}
                    ></Image>
                ) : (
                    <Image
                        src={PlayIcon}
                        sx={{
                            marginRight: "1.4583vw",
                            width: "1.5625vw",
                        }}
                        onClick={handleStartPlay}
                    ></Image>
                )}
                <Image
                    src={NextStepIcon}
                    sx={{
                        marginRight: "1.4583vw",
                        width: "3.125vw",
                    }}
                    onClick={handleNextStep}
                ></Image>
                <Image
                    src={EndIcon}
                    onClick={handleEndStep}
                    sx={{
                        width: "2.0833vw",
                    }}
                ></Image>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1.0417vw",
                }}
            >
                <Button
                    sx={{
                        border: "3px solid #bcbbbe !important",
                        borderRadius: "0.9375vw",
                        width: "9.375vw",
                        height: "2.7083vw",
                        color: "#d9d9d9",
                        fontSize: "1.0417vw",
                        marginRight: "0.625vw",
                    }}
                    variant={"outline"}
                    onClick={async (e) => {
                        e.stopPropagation();
                        const content =
                            document.getElementById("share-content");
                        const canvas = await html2canvas(content);
                        canvas.toBlob((blob: any) => {
                            if (!blob) {
                                return;
                            }
                            saveAs(blob, "result.jpg");
                        });
                    }}
                >
                    <Image src={SaveIcon} sx={{ marginRight: "5px" }}></Image>
                    <Text
                        sx={{
                            flex: 1,
                            textAlign: "center",
                        }}
                    >
                        Save Image
                    </Text>
                </Button>
                <Button
                    sx={{
                        border: "3px solid #bcbbbe !important",
                        borderRadius: "0.9375vw",
                        width: "9.375vw",
                        height: "2.7083vw",
                        color: "#d9d9d9",
                        fontSize: "1.0417vw",
                    }}
                    variant={"outline"}
                    onClick={() => {
                        const text = `Bid Tac Toe,fully on-chain PvP game of psychology and strategy, on ${CHAIN_NAMES[chainId]} 
where you place one-shot blind bids for each grid.
${window.location.host}/#/tactoe/playback?gameAddress=${bttGameAddress}&show=true&round=${currentRound}&burner=${burner}&chainId=${chainId}
@skylabHQ
skylab.wtf/#/activites`;
                        window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                text,
                            )}`,
                        );
                    }}
                >
                    <Image src={TwLogo}></Image>
                    <Text
                        sx={{
                            flex: 1,
                            textAlign: "center",
                        }}
                    >
                        Share
                    </Text>
                </Button>
            </Box>
            {startJourney && <StartJourney></StartJourney>}
        </Box>
    );
};
export default ButtonGroup;
