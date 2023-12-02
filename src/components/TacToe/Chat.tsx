import { Box, Image } from "@chakra-ui/react";
import React from "react";
import MessageActiveIcon from "./assets/message-active.svg";
import MessageIcon from "./assets/message.svg";
import EmoteActiveIcon from "./assets/emote-active.svg";
import EmoteIcon from "./assets/emote.svg";
import { useBttGameRetry } from "@/hooks/useRetryContract";
import { useGameContext } from "@/pages/TacToe";
import Merc1 from "./assets/emotes/1.png";
import Merc2 from "./assets/emotes/2.png";
import Merc3 from "./assets/emotes/3.png";
import Merc4 from "./assets/emotes/4.png";
import Merc5 from "./assets/emotes/5.png";
import Merc6 from "./assets/emotes/6.png";
import Merc7 from "./assets/emotes/7.png";
import Merc8 from "./assets/emotes/8.png";
import Merc9 from "./assets/emotes/9.png";
import Merc10 from "./assets/emotes/10.png";

import useSkyToast from "@/hooks/useSkyToast";
import { handleError } from "@/utils/error";
import { MessageStatus } from ".";

export const MESSAGES = [
    "I really need the grid.",
    "I do not want this grid.",
    "I would bid really high.",
    "I would bid really low.",
    "I have so many ways to win.",
];

export const MERCS = [
    Merc1,
    Merc2,
    Merc3,
    Merc4,
    Merc5,
    Merc6,
    Merc7,
    Merc8,
    Merc9,
    Merc10,
];

export const EMOTES = ["🥱", "🤔", "🤯", "😭", "🥺", "🤩", "🥳"];

const Chat = ({
    onLoading,
}: {
    onLoading: (
        type: "setMessage" | "setEmote",
        loading: MessageStatus,
        emoteIndex?: number,
    ) => void;
}) => {
    const toast = useSkyToast();
    const [active, setActive] = React.useState("message");
    const { bidTacToeGameAddress, tokenId, istest } = useGameContext();
    const tacToeGameRetryWrite = useBttGameRetry(bidTacToeGameAddress, tokenId);
    const [messageLoading, setMessageLoading] = React.useState(false);
    const [emoteLoading, setEmoteLoading] = React.useState(false);

    const handleSetMessage = async (
        type: "setMessage" | "setEmote",
        index: number,
    ) => {
        try {
            if (type === "setMessage" && messageLoading) {
                if (messageLoading) {
                    return;
                } else {
                    setMessageLoading(true);
                }
            }

            if (type === "setEmote") {
                if (emoteLoading) {
                    return;
                } else {
                    setEmoteLoading(true);
                }
            }

            onLoading(type, MessageStatus.Sending, index);
            await tacToeGameRetryWrite(type, [index], {
                usePaymaster: istest,
            });
            onLoading(type, MessageStatus.Sent, index);

            if (type === "setMessage") {
                setMessageLoading(false);
            } else {
                setEmoteLoading(false);
            }
        } catch (e) {
            console.log(e);
            if (type === "setMessage") {
                setMessageLoading(false);
            } else {
                setEmoteLoading(false);
            }
            onLoading(type, MessageStatus.Unknown, 0);
            toast(handleError(e));
        }
    };

    const handleChangeActive = (type: string) => {
        setActive(type);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "4.6875vw",
            }}
        >
            <Box
                sx={{
                    marginRight: "1.0417vw",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Image
                    src={active === "message" ? MessageActiveIcon : MessageIcon}
                    sx={{
                        marginRight: "0.5208vw",
                        cursor: "pointer",
                        width: "1.9792vw",
                        height: "1.9792vw",
                    }}
                    onClick={() => handleChangeActive("message")}
                />
                <Image
                    src={active === "emote" ? EmoteActiveIcon : EmoteIcon}
                    sx={{
                        cursor: "pointer",
                        width: "1.9792vw",
                        height: "1.9792vw",
                    }}
                    onClick={() => handleChangeActive("emote")}
                />
            </Box>

            {active === "message" &&
                MESSAGES.map((message, index) => {
                    return (
                        <Box
                            onClick={() => {
                                handleSetMessage("setMessage", index + 1);
                            }}
                            key={index + 1}
                            sx={{
                                border: "2px solid #d9d9d9",
                                borderRadius: "0.5208vw",
                                marginRight: "0.4167vw",
                                height: "1.9792vw",
                                lineHeight: "1.9792vw",
                                padding: "0 0.4167vw",
                                cursor: "pointer",
                                fontSize: "0.8333vw",
                            }}
                        >
                            {message}
                        </Box>
                    );
                })}
            {active === "emote" && (
                <>
                    {MERCS.map((message, index) => {
                        return (
                            <Image
                                key={index}
                                src={message}
                                onClick={() =>
                                    handleSetMessage("setEmote", index + 1)
                                }
                                sx={{
                                    width: "1.9792vw",
                                    height: "1.9792vw",
                                    cursor: "pointer",
                                    marginRight: "0.4167vw",
                                    border: "2px solid #d9d9d9",
                                    borderRadius: "0.5208vw",
                                }}
                            ></Image>
                        );
                    })}
                    {EMOTES.map((message, index) => {
                        return (
                            <Box
                                onClick={() =>
                                    handleSetMessage(
                                        "setEmote",
                                        MERCS.length + index + 1,
                                    )
                                }
                                key={index + MERCS.length}
                                sx={{
                                    border: "2px solid #d9d9d9",
                                    borderRadius: "0.5208vw",
                                    marginRight: "0.4167vw",
                                    height: "1.9792vw",
                                    width: "1.9792vw",
                                    lineHeight: "1.9792vw",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "0.8333vw",
                                }}
                            >
                                {message}
                            </Box>
                        );
                    })}
                </>
            )}
        </Box>
    );
};

export default Chat;
