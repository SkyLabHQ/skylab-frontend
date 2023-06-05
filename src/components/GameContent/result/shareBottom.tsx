import { Box, Image, Text, useToast } from "@chakra-ui/react";
import saveAs from "file-saver";
import html2canvas from "html2canvas";
import React from "react";
import Download from "@/assets/download.svg";
import Tw from "@/assets/white-tw.svg";
import TwCode from "@/assets/twcode.png";
import { generateLoseText, generateWinText } from "../utils";
const ShareBottom = ({
    myLevel,
    myBattery,
    myFuel,
    opLevel,
    opBattery,
    opFuel,
    win,
}: {
    myLevel: number;
    myBattery: number;
    myFuel: number;
    opLevel: number;
    opBattery: number;
    opFuel: number;
    win: boolean;
}) => {
    const toast = useToast();
    const onShare = async () => {
        const content = document.getElementById("share-content");
        const canvas = await html2canvas(content);
        canvas.toBlob((blob) => {
            if (!blob) {
                return;
            }
            saveAs(blob, "my_image.jpg");
        });
    };
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "13px",
            }}
        >
            <Box
                sx={{
                    height: "56px",
                    background: "rgba(217, 217, 217, 0.5)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "209px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 28px",
                    cursor: "pointer",
                    padding: "0 34px",
                }}
                onClick={onShare}
            >
                <Image src={Download}></Image>
                <Text sx={{ fontSize: "36px", marginLeft: "24px" }}>
                    Save Image
                </Text>
            </Box>

            <Box
                sx={{
                    height: "56px",
                    background: "rgba(217, 217, 217, 0.5)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "209px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 28px",
                    cursor: "pointer",
                    padding: "0 34px",
                }}
                onClick={() => {
                    const text = win
                        ? generateWinText({
                              myLevel,
                              myBattery,
                              myFuel,
                              opLevel,
                              opBattery,
                              opFuel,
                          })
                        : generateLoseText({
                              myLevel,
                              myBattery,
                              myFuel,
                              opLevel,
                              opBattery,
                              opFuel,
                          });
                    console.log(text, "text");
                    window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            text,
                        )}`,
                    );
                }}
            >
                <Image src={Tw}></Image>
                <Text
                    sx={{ fontSize: "36px", marginLeft: "24px" }}
                    onClick={() => {}}
                >
                    Share
                </Text>
            </Box>
        </Box>
    );
};

export default ShareBottom;
