import { Box, Image } from "@chakra-ui/react";
import React from "react";
import MessageActiveIcon from "./assets/message-active.svg";
import MessageIcon from "./assets/message.svg";
import EmoteActiveIcon from "./assets/emote-active.svg";
import EmoteIcon from "./assets/emote.svg";
import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import { useGameContext } from "@/pages/TacToe";
import useSkyToast from "@/hooks/useSkyToast";
import { handleError } from "@/utils/error";

export const MESSAGES = [
    "I really need the grid.",
    "I do not want this grid.",
    "I would bid really high.",
    "I would bid really low.",
    "I have so many ways to win.",
];

export const EMOTES = ["🥱", "🤔", "🤯", "😭", "🥺", "🤩", "🥳"];

const Chat = ({
    onLoading,
}: {
    onLoading: (type: "setMessage" | "setEmote", loading: boolean) => void;
}) => {
    const toast = useSkyToast();
    const [active, setActive] = React.useState("message");
    const { bidTacToeGameAddress, tokenId } = useGameContext();
    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );
    const [loading, setLoading] = React.useState(false);
    const handleSetMessage = async (
        type: "setMessage" | "setEmote",
        index: number,
    ) => {
        try {
            if (loading) return;
            onLoading(type, true);
            await tacToeGameRetryWrite(type, [index]);
            onLoading(type, false);
        } catch (e) {
            console.log(e);
            onLoading(type, false);
            toast(handleError(e));
        }
    };

    const handleChangeActive = (type: string) => {
        setActive(type);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "90px" }}>
            <Box
                sx={{
                    marginRight: "20px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Image
                    src={active === "message" ? MessageActiveIcon : MessageIcon}
                    sx={{
                        marginRight: "10px",
                        cursor: "pointer",
                        width: "46px",
                        height: "46px",
                    }}
                    onClick={() => handleChangeActive("message")}
                />
                <Image
                    src={active === "emote" ? EmoteActiveIcon : EmoteIcon}
                    sx={{ cursor: "pointer", width: "46px", height: "46px" }}
                    onClick={() => handleChangeActive("emote")}
                />
            </Box>

            {active === "message" &&
                MESSAGES.map((message, index) => {
                    return (
                        <Box
                            onClick={() =>
                                handleSetMessage("setMessage", index + 1)
                            }
                            key={index + 1}
                            sx={{
                                border: "2px solid #d9d9d9",
                                borderRadius: "10px",
                                marginRight: "8px",
                                height: "46px",
                                lineHeight: "46px",
                                padding: "0 10px",
                                cursor: "pointer",
                            }}
                        >
                            {message}
                        </Box>
                    );
                })}
            {active === "emote" &&
                EMOTES.map((message, index) => {
                    return (
                        <Box
                            onClick={() =>
                                handleSetMessage("setEmote", index + 1)
                            }
                            key={index + 1}
                            sx={{
                                border: "2px solid #d9d9d9",
                                borderRadius: "10px",
                                marginRight: "8px",
                                height: "46px",
                                lineHeight: "46px",
                                padding: "0 10px",
                                cursor: "pointer",
                            }}
                        >
                            {message}
                        </Box>
                    );
                })}
        </Box>
    );
};

export default Chat;
