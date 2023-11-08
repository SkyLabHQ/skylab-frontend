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
import RightArrowWhite from "./assets/right-arrow.svg";
import { BoardItem, GameInfo, Info, UserMarkType } from "@/pages/TacToe";
import { getWinState } from "../TacToe";
import { shortenAddressWithout0x } from "@/utils";
import ShareEmojiIcon from "./assets/share-emoji.svg";

const winEmoji = ["❤️", "👑", "🦋", "🌻", "🥳", "🤪", "😎", "🤭", "🤩"];
const loseEmoji = ["🥀", "💔", "🥲", "🥶", "🤬", "🥺", "🤕", "☠️"];
export const getShareEmoji = (
    myMark: UserMarkType,
    list: BoardItem[],
    win: boolean,
) => {
    const emojiList = win
        ? winEmoji.sort(() => Math.random() - 0.5).slice(0, 3)
        : loseEmoji.sort(() => Math.random() - 0.5).slice(0, 3);
    const gridSize = 3; // 九宫格的大小，这里是3x3

    const mark = myMark === UserMarkType.Circle ? "⭕️" : "❌";
    let gridString = "";

    for (let i = 0; i < gridSize; i++) {
        gridString += `${mark}       `;
        for (let j = 0; j < gridSize; j++) {
            const index = i * gridSize + j;
            const cellValue =
                list[index].mark === UserMarkType.Empty
                    ? "◻️"
                    : list[index].mark === UserMarkType.Circle ||
                      list[index].mark === UserMarkType.YellowCircle
                    ? "⭕️"
                    : "❌";
            gridString += cellValue;
        }
        gridString += `     ${mark}`; // 在每行末尾添加换行符
        if (i !== gridSize - 1) {
            gridString += "\n";
        }
    }

    const border = `${mark}                             ${mark}`;

    return `${mark}${mark}${emojiList.join("")}${mark}${mark}
${border}
${gridString}
${border}
${mark}${mark}${emojiList.join("")}${mark}${mark}
@skylabHQ
skylab.wtf/#/activites?step=2`;
};

const ButtonGroup = ({
    showShareEmoji,
    list,
    myGameInfo,
    myInfo,
    bttGameAddress,
    currentRound,
    startPlay,
    handleStartStep,
    handlePreStep,
    handleStartPlay,
    handleNextStep,
    handleEndStep,
    handleStopPlay,
    handleNext,
}: {
    showShareEmoji: boolean;
    list: BoardItem[];
    myInfo: Info;
    myGameInfo: GameInfo;
    bttGameAddress: string;
    currentRound: number;
    startPlay: boolean;
    handleStartStep: () => void;
    handlePreStep: () => void;
    handleStartPlay: () => void;
    handleNextStep: () => void;
    handleEndStep: () => void;
    handleStopPlay: () => void;
    handleNext?: () => void;
}) => {
    const { chainId } = useActiveWeb3React();

    const handleShare = () => {
        const url = `${
            window.location.origin
        }/#/tactoe/playback?gameAddress=${bttGameAddress}&show=true&round=${currentRound}&burner=${shortenAddressWithout0x(
            myInfo.burner,
        )}&chainId=${chainId}`;
        const text = `Bid Tac Toe is a fully on-chain cryptoeconomic tic tac toe game, on @0xPolygon . You one-shot blind bid to conquer grids to connect a line. It's a contest of deduction and psychology. 

Watch my replay here!

${url}  
        
@skylabHQ 
skylab.wtf/#/activites`;

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        );
    };
    const handleShareEmoji = () => {
        const text = getShareEmoji(
            myInfo.mark,
            list,
            getWinState(myGameInfo.gameState),
        );

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        );
    };
    return (
        <Box>
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
                    position: "relative",
                }}
            >
                {showShareEmoji && (
                    <Button
                        sx={{
                            border: "1px solid rgba(97, 97, 97, 1) !important",
                            borderRadius: "0.9375vw",
                            width: "9.375vw",
                            height: "2.7083vw",
                            color: "#d9d9d9",
                            fontSize: "1.0417vw",
                            position: "absolute",
                            left: "-10.4167vw",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                        variant={"outline"}
                        onClick={() => {
                            handleShareEmoji();
                        }}
                    >
                        <Image
                            src={ShareEmojiIcon}
                            sx={{
                                width: "1.5625vw",
                            }}
                        ></Image>
                        <Text
                            sx={{
                                flex: 1,
                                textAlign: "center",
                            }}
                        >
                            Share Emoji
                        </Text>
                    </Button>
                )}
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
                    <Image
                        src={SaveIcon}
                        sx={{ marginRight: "5px", width: "1.5625vw" }}
                    ></Image>
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
                        handleShare();
                    }}
                >
                    <Image
                        src={TwLogo}
                        sx={{
                            width: "1.5625vw",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            flex: 1,
                            textAlign: "center",
                        }}
                    >
                        Share Replay{" "}
                    </Text>
                </Button>
                {handleNext && (
                    <Button
                        variant={"ghost"}
                        sx={{
                            position: "absolute",
                            right: "-7.2083vw",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                        onClick={() => {
                            handleNext();
                        }}
                    >
                        <Text
                            sx={{
                                textDecoration: "underline",
                                fontSize: "1.25vw",
                                marginRight: "0.2604vw",
                            }}
                        >
                            Next
                        </Text>
                        <Image
                            src={RightArrowWhite}
                            sx={{
                                width: "1.0417vw",
                            }}
                        ></Image>
                    </Button>
                )}
            </Box>
        </Box>
    );
};
export default ButtonGroup;
