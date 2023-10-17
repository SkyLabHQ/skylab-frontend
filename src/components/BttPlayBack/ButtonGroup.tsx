import { Box, Button, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

const ButtonGroup = ({
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
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "40px",
                    "& > img": {
                        cursor: "pointer",
                    },
                }}
            >
                <Image
                    src={StartIcon}
                    sx={{
                        marginRight: "28px",
                    }}
                    onClick={handleStartStep}
                ></Image>
                <Image
                    src={PreStepIcon}
                    sx={{
                        marginRight: "28px",
                    }}
                    onClick={handlePreStep}
                ></Image>
                {startPlay ? (
                    <Image
                        src={StopIcon}
                        sx={{
                            marginRight: "28px",
                        }}
                        onClick={handleStopPlay}
                    ></Image>
                ) : (
                    <Image
                        src={PlayIcon}
                        sx={{
                            marginRight: "28px",
                        }}
                        onClick={handleStartPlay}
                    ></Image>
                )}
                <Image
                    src={NextStepIcon}
                    sx={{
                        marginRight: "28px",
                    }}
                    onClick={handleNextStep}
                ></Image>
                <Image src={EndIcon} onClick={handleEndStep}></Image>
            </Box>
            <Box
                sx={{
                    marginTop: "20px",
                }}
            >
                <Button
                    sx={{
                        border: "3px solid #bcbbbe !important",
                        borderRadius: "18px",
                        width: "180px",
                        height: "52px",
                        color: "#d9d9d9",
                        fontSize: "20px",
                        marginRight: "12px",
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
                        borderRadius: "18px",
                        width: "180px",
                        height: "52px",
                        color: "#d9d9d9",
                        fontSize: "20px",
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
        </Box>
    );
};
export default ButtonGroup;
