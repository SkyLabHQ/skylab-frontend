import { Box, Image } from "@chakra-ui/react";
import saveAs from "file-saver";
import html2canvas from "html2canvas";
import React from "react";
import Download from "@/assets/download.svg";
import Tw from "@/assets/white-tw.svg";
import TwCode from "@/assets/twcode.png";
const ShareBottom = () => {
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
                    width: "95px",
                    height: "56px",
                    background: "rgba(217, 217, 217, 0.5)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "209px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 28px",
                    cursor: "pointer",
                }}
                onClick={onShare}
            >
                <Image src={Download}></Image>
            </Box>
            <Box
                sx={{
                    width: "95px",
                    height: "56px",
                    background: "rgba(217, 217, 217, 0.5)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "209px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 28px",
                    cursor: "pointer",
                }}
                onClick={() => {
                    window.open(
                        "https://twitter.com/skylabhq?s=21&t=3tvwVYYbX3FtWjnf7IBmAA",
                    );
                }}
            >
                <Image src={Tw}></Image>
            </Box>
        </Box>
    );
};

export default ShareBottom;
