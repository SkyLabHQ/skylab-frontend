import { BoardItem, useGameContext, UserMarkType } from "@/pages/TacToe";
import { Box, Text, Image, Button } from "@chakra-ui/react";
import React from "react";
import Board from "./Board";
import ResultUserCard from "./ResultUserCard";
import TwLogo from "./assets/tw-logo.svg";
import SaveIcon from "./assets/save-icon.svg";
import html2canvas from "html2canvas";
import saveAs from "file-saver";
import EarthIcon from "./assets/earth.svg";
import { getWinState } from ".";

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

const ResultPage = () => {
    const { list, myGameInfo, myInfo, tokenId, onStep } = useGameContext();
    return (
        <Box
            sx={{
                height: "100vh",
                background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, #4A4A4A 100%)",
                padding: "54px 200px 60px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    background: "#303030",
                    flex: 1,
                    position: "relative",
                    display: "flex",
                }}
                id="share-content"
            >
                <Box sx={{ flex: 1, padding: "50px 0 0 50px" }}>
                    <ResultUserCard
                        showResult
                        win={getWinState(myGameInfo.gameState)}
                        userInfo={myInfo}
                    ></ResultUserCard>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Board list={list}></Board>
                </Box>
                <Box sx={{ flex: 1 }}></Box>
                <Box
                    sx={{ position: "absolute", right: "38px", bottom: "22px" }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Image src={TwLogo} sx={{ marginRight: "4px" }}></Image>
                        <Text
                            sx={{ fontSize: "20px", color: "rgb(172,172,172)" }}
                        >
                            @skylabHQ
                        </Text>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "4px",
                        }}
                    >
                        <Image
                            src={EarthIcon}
                            sx={{ marginRight: "4px" }}
                        ></Image>
                        <Text
                            sx={{ fontSize: "20px", color: "rgb(172,172,172)" }}
                        >
                            skylab.wtf/#/activites
                        </Text>{" "}
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "30px",
                }}
            >
                <Box>
                    <Button
                        onClick={() => {
                            onStep(4);
                        }}
                        sx={{
                            border: "3px solid #bcbbbe !important",
                            borderRadius: "18px",
                            width: "140px",
                            height: "52px",
                            color: "#d9d9d9",
                            fontSize: "20px",
                            marginRight: "24px",
                        }}
                        variant={"outline"}
                    >
                        Next
                    </Button>
                    <Button
                        sx={{
                            border: "3px solid #bcbbbe !important",
                            borderRadius: "18px",
                            width: "180px",
                            height: "52px",
                            color: "#d9d9d9",
                            fontSize: "20px",
                            marginRight: "24px",
                        }}
                        variant={"outline"}
                        onClick={(e) => {
                            e.stopPropagation();
                            const text = getShareEmoji(
                                myInfo.mark,
                                list,
                                getWinState(myGameInfo.gameState),
                            );

                            window.open(
                                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    text,
                                )}`,
                            );
                        }}
                    >
                        <Image src={TwLogo}></Image>
                        <Text>Share Emoji</Text>
                    </Button>
                </Box>
                <Box sx={{ marginTop: "10px" }}>
                    <Button
                        sx={{
                            borderRadius: "18px",
                            width: "140px",
                            height: "52px",
                            color: "#d9d9d9",
                            fontSize: "20px",
                            marginRight: "24px",
                        }}
                        variant={"ghost"}
                        onClick={(e) => {
                            onStep(2);
                        }}
                    >
                        <Text
                            sx={{
                                textDecorationLine: "underline",
                                color: "#303030",
                            }}
                        >
                            Back
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
                            marginRight: "24px",
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
                            sx={{ marginRight: "5px" }}
                        ></Image>
                        <Text>Save Image</Text>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ResultPage;
