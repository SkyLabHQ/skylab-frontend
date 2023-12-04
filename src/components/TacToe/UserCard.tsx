import React, { useEffect, useMemo } from "react";
import { shortenAddress } from "@/utils";
import AdvantageIcon from "./assets/advantage-icon.svg";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    Image,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    useClipboard,
    NumberInput,
    NumberInputField,
} from "@chakra-ui/react";
import CopyIcon from "./assets/copy-icon.svg";
import GoldIcon from "./assets/gold.svg";
import AddIcon from "./assets/add-icon.svg";
import SubIcon from "./assets/sub-icon.svg";
import DotIcon from "./assets/dot3.svg";
import UnlockIcon from "./assets/unlock.svg";
import LockIcon from "./assets/lock.svg";
import { GameState, MessageStatus } from ".";
import Plane1 from "@/assets/aviations/a1.png";
import { EMOTES, MERCS, MESSAGES } from "./Chat";
import useSkyToast from "@/hooks/useSkyToast";
import { PilotInfo } from "@/hooks/usePilotInfo";
import BotIcon from "./assets/bot.png";
import GearIcon from "./assets/gear.svg";
import { useCountUp } from "react-countup";

export const Message = ({
    message = 0,
    emote = 0,
    messageLoading = MessageStatus.Unknown,
    emoteLoading = MessageStatus.Unknown,
    emoteIndex = 0,
    messageIndex = 0,
    status = "my",
}: {
    message: number;
    emote: number;
    messageLoading?: MessageStatus;
    emoteLoading?: MessageStatus;
    emoteIndex?: number;
    messageIndex?: number;
    status?: "my" | "op";
}) => {
    const [whiteTriangle, transparentTriangle] = useMemo(() => {
        if (status === "my") {
            return [
                {
                    borderRightColor: "#fff",
                    top: "0.5208vw",
                    left: "-1.0417vw",
                },
                {
                    borderRightColor: "#303030",
                    top: "0.5208vw",
                    left: "-0.9375vw",
                },
            ];
        } else {
            return [
                {
                    borderLeftColor: "#fff",
                    top: "0.5208vw",
                    right: "-1.0417vw",
                },
                {
                    borderLeftColor: "#303030",
                    top: "0.5208vw",
                    right: "-0.9375vw",
                },
            ];
        }
    }, [status]);

    const sendText = useMemo(() => {
        if (
            messageLoading === MessageStatus.Sending ||
            emoteLoading === MessageStatus.Sending
        ) {
            return "Sending";
        }

        if (
            messageLoading === MessageStatus.Sent ||
            emoteLoading === MessageStatus.Sent
        ) {
            return "Sent";
        }

        return "";
    }, [messageLoading, emoteLoading]);

    const showMessage = useMemo(() => {
        if (messageLoading !== MessageStatus.Unknown) {
            return MESSAGES[messageIndex - 1];
        } else if (message > 0) {
            return MESSAGES[message - 1];
        }
        return "";
    }, [message, messageLoading, messageIndex]);

    const showMercs = useMemo(() => {
        if (emoteLoading !== MessageStatus.Unknown) {
            return MERCS[emoteIndex - 1];
        } else if (emote > MERCS.length && emote === 0) {
            return "";
        } else if (emote > 0) {
            return MERCS[emote - 1];
        }

        return "";
    }, [emote, emoteLoading, emoteIndex]);

    const showEmote = useMemo(() => {
        if (emoteLoading !== MessageStatus.Unknown) {
            return EMOTES[emoteIndex - MERCS.length - 1];
        } else if (emote <= MERCS.length) {
            return "";
        } else if (emote > 0) {
            return EMOTES[emote - MERCS.length - 1];
        }

        return "";
    }, [emote, emoteLoading, emoteIndex]);

    return (
        <Box
            sx={{
                position: "relative",
                display:
                    emote === 0 &&
                    message === 0 &&
                    emoteLoading === MessageStatus.Unknown &&
                    messageLoading == MessageStatus.Unknown &&
                    "none",
            }}
        >
            <Box
                sx={{
                    border: "2px solid #fff",
                    height: "2.6042vw",
                    lineHeight: "2.6042vw",
                    borderRadius: "0.5208vw",
                    position: "relative",
                    padding: "0 0.5208vw",
                    display: "flex",
                    alignItems: "center",
                    minWidth: "5.2083vw",
                }}
            >
                <Box
                    sx={{
                        width: "0",
                        height: "0",
                        border: "0.5208vw solid transparent",
                        position: "absolute",
                        ...whiteTriangle,
                    }}
                ></Box>
                <Box
                    sx={{
                        width: "0",
                        height: "0",
                        border: "0.5208vw solid transparent",
                        position: "absolute",
                        ...transparentTriangle,
                    }}
                ></Box>

                {showMessage && (
                    <Text
                        sx={{
                            whiteSpace: "nowrap",
                            marginRight: "0.2604vw",
                            fontSize: "0.8333vw",
                        }}
                    >
                        {showMessage}
                    </Text>
                )}
                {showMercs && (
                    <Box
                        sx={{
                            height: "1.6667vw",
                            width: "1.6667vw",
                        }}
                    >
                        <Image src={showMercs}></Image>
                    </Box>
                )}

                {showEmote && (
                    <Text
                        sx={{
                            whiteSpace: "nowrap",
                        }}
                    >
                        {showEmote}
                    </Text>
                )}
            </Box>
            {sendText && (
                <Text
                    sx={{
                        color: "#bcbbbe",
                        fontSize: "0.8333vw",
                        position: "absolute",
                        bottom: "-1.3021vw",
                        left: "0",
                        width: "100%",
                    }}
                >
                    {sendText}
                </Text>
            )}
        </Box>
    );
};

const MyBid = ({
    showTutorialStep,
    loading,
    balance,
    bidAmount,
    gameState,
    onInputChange,
    onConfirm,
}: {
    showTutorialStep?: boolean;
    loading: boolean;
    balance: number;
    bidAmount: number;
    gameState: number;
    onInputChange?: (value: number) => void;
    onConfirm: () => void;
}) => {
    const countUpRef = React.useRef(null);
    const { update } = useCountUp({
        ref: countUpRef,
        end: balance,
        duration: 1,
        prefix: "/ ",
    });

    useEffect(() => {
        update(balance);
    }, [balance]);

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            event.shiftKey && key === "Enter";
            switch (key) {
                case "ArrowUp":
                    onInputChange?.(bidAmount + 1);
                    break;

                case "ArrowDown": {
                    onInputChange?.(bidAmount - 1);
                    break;
                }
            }

            if (event.shiftKey && key === "Enter") {
                onConfirm();
            }
        };
        document.addEventListener("keydown", keyboardListener);
        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [onConfirm, bidAmount]);

    return (
        <Box
            className={
                showTutorialStep
                    ? "btt-first-step btt-second-step btt-third-step"
                    : ""
            }
        >
            <Box
                sx={{
                    marginTop: "0.7813vw",
                    display: "flex",
                }}
            >
                <Box>
                    <Text sx={{ fontSize: "1.25vw" }}>Bid</Text>
                    <Box
                        sx={{
                            position: "relative",
                        }}
                    >
                        <Image
                            src={SubIcon}
                            sx={{
                                position: "absolute",
                                left: "-1.5625vw",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                width: "1.25vw",
                            }}
                            onClick={() => {
                                if (bidAmount - 1 < 0) return;

                                onInputChange(bidAmount - 1);
                            }}
                        ></Image>
                        <Image
                            src={AddIcon}
                            onClick={() => {
                                if (bidAmount + 1 > balance) return;

                                onInputChange(bidAmount + 1);
                            }}
                            sx={{
                                position: "absolute",
                                right: "-1.5625vw",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                width: "1.25vw",
                            }}
                        ></Image>
                        <motion.div
                            style={{
                                height: "2.2917vw",
                                width: "6.25vw",
                                borderRadius: "0.9375vw",
                                overflow: "hidden",
                                border: "3px solid #fff",
                                background: "rgba(255, 255, 255, 0.40)",
                                display: "flex",
                                alignItems: "center",
                            }}
                            animate={{
                                border:
                                    gameState !== GameState.WaitingForBid ||
                                    loading
                                        ? ["4px solid #fff", "4px solid #fff"]
                                        : [
                                              "4px solid #fff",
                                              "4px solid #fddc2d",
                                          ],
                            }}
                            transition={{
                                duration: 0.4,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        >
                            <NumberInput
                                isDisabled={
                                    loading ||
                                    gameState !== GameState.WaitingForBid
                                }
                                variant="unstyled"
                                max={balance}
                                min={0}
                                value={bidAmount}
                                sx={{
                                    "& input": {
                                        color: "#fff",
                                        lineHeight: "1",
                                        padding: 0,
                                        fontSize: "1.6667vw",
                                        width: "100%",
                                        textAlign: "center",
                                    },
                                }}
                                onChange={(e) => {
                                    if (Number(e) > balance) {
                                        onInputChange(balance);
                                        return;
                                    }
                                    onInputChange(Number(e));
                                }}
                            >
                                <NumberInputField />
                            </NumberInput>
                        </motion.div>
                    </Box>
                </Box>

                <Box
                    style={{
                        marginLeft: "1.5625vw",
                        flex: 1,
                    }}
                >
                    <Text
                        sx={{
                            fontSize: "0.8333vw",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                            lineHeight: "1.875vw",
                        }}
                    >
                        Remaining
                    </Text>
                    <Box
                        ref={countUpRef}
                        sx={{
                            fontSize: "1.6667vw",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                        }}
                    ></Box>
                </Box>
            </Box>
            <>
                {loading ? (
                    <Button
                        disabled={true}
                        variant={"outline"}
                        sx={{
                            color: "#BCBBBE",
                            borderRadius: "0.9375vw",
                            fontSize: "0.8333vw",
                            height: "2.2917vw",
                            width: "6.25vw",
                            marginTop: "0.5208vw",
                            "&:disabled": {
                                border: "2px solid #fff !important",
                                opacity: 1,
                                background: "transparent",
                            },
                            "&:hover[disabled]": {
                                background: "transparent",
                            },
                        }}
                    >
                        Confirming
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            onConfirm();
                        }}
                        disabled={
                            gameState === GameState.Commited ||
                            gameState === GameState.Revealed
                        }
                        variant={"outline"}
                        sx={{
                            color: "#fddc2d",
                            border: "2px solid #fddc2d !important",
                            borderRadius: "0.9375vw",
                            background:
                                gameState === GameState.Commited ||
                                gameState === GameState.Revealed
                                    ? "linear-gradient(180deg, rgba(253, 220, 45, 0.50) 0%, rgba(253, 220, 45, 0.00) 100%)"
                                    : "transparent",
                            fontSize: "0.8333vw",
                            height: "2.2917vw",
                            width: "6.25vw",
                            marginTop: "0.5208vw",
                            "&:disabled": {
                                border: "2px solid #fddc2d !important",
                                opacity: 1,
                            },
                            "&:hover[disabled]": {
                                background:
                                    gameState === GameState.Commited ||
                                    gameState === GameState.Revealed
                                        ? "linear-gradient(180deg, rgba(253, 220, 45, 0.50) 0%, rgba(253, 220, 45, 0.00) 100%)"
                                        : "transparent",
                            },
                        }}
                    >
                        {gameState === GameState.Commited ||
                        gameState === GameState.Revealed
                            ? "Confirmed"
                            : "Confirm"}
                    </Button>
                )}
            </>
        </Box>
    );
};

const OpBid = ({
    myGameState,
    opGameState,
    balance,
}: {
    myGameState: number;
    opGameState: number;
    balance: number;
}) => {
    const isWaiting = useMemo(() => {
        if (opGameState === GameState.WaitingForBid) {
            return true;
        }
        if (
            myGameState === GameState.Commited &&
            opGameState === GameState.Commited
        ) {
            return true;
        }

        if (
            myGameState === GameState.Revealed &&
            opGameState === GameState.Commited
        ) {
            return true;
        }

        return false;
    }, [myGameState, opGameState]);

    return (
        <Box>
            <Box sx={{ marginTop: "0.7813vw", display: "flex" }}>
                <Box>
                    <Text sx={{ fontSize: "1.25vw" }}>Bid</Text>
                    <Box
                        sx={{
                            height: "2.2917vw",
                            background: "#4a4a4a",
                            borderRadius: "0.9375vw",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#000000",
                            fontSize: "1.6667vw",
                            width: "6.25vw",
                        }}
                    >
                        {myGameState === GameState.WaitingForBid &&
                            opGameState === GameState.Commited && (
                                <Image
                                    src={LockIcon}
                                    sx={{
                                        width: "2.0417vw",
                                    }}
                                ></Image>
                            )}

                        {isWaiting && (
                            <motion.div
                                animate={{
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Image
                                    src={DotIcon}
                                    sx={{
                                        width: "4.0417vw",
                                    }}
                                ></Image>
                            </motion.div>
                        )}
                        {myGameState === GameState.Commited &&
                            opGameState === GameState.Revealed && (
                                <Image
                                    src={UnlockIcon}
                                    sx={{
                                        width: "2.0417vw",
                                    }}
                                ></Image>
                            )}
                    </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Text
                        sx={{
                            fontSize: "0.8333vw",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                            lineHeight: "1.875vw",
                        }}
                    >
                        Remaining
                    </Text>
                    <Text
                        sx={{
                            fontSize: "1.6667vw",
                            textAlign: "right",
                            margin: "0vw 0 0 0.5208vw",
                            flex: 1,
                            color: "#bcbbbe",
                        }}
                    >
                        / {balance}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

interface UserCardProps {
    pilotInfo?: PilotInfo;
    showTutorialStep?: boolean;
    loading?: boolean;
    messageLoading?: MessageStatus;
    emoteLoading?: MessageStatus;
    markIcon: string;
    address: string;
    balance: number;
    bidAmount: number;
    messageIndex?: number;
    emoteIndex?: number;
    showAdvantageTip?: boolean;
    level?: number;
    emote?: number;
    message?: number;
    myGameState?: number;
    opGameState?: number;
    status?: "my" | "op";
    planeUrl?: string;
    isBot?: boolean;
    onConfirm?: () => void;
    onInputChange?: (value: number) => void;
}

export const AdvantageTip = ({
    direction,
    markIcon,
    showAdvantageTip,
}: {
    direction: "right" | "left";
    markIcon: string;
    showAdvantageTip: boolean;
}) => {
    return (
        <Box
            sx={{
                width: "fit-content",
                marginTop: "1.5625vw",
            }}
        >
            <Popover placement={direction}>
                <Image src={markIcon} sx={{ width: "1.875vw" }}></Image>
                <PopoverTrigger>
                    <Box
                        sx={{
                            position: "relative",
                        }}
                    >
                        {showAdvantageTip && (
                            <Image
                                src={AdvantageIcon}
                                sx={{
                                    position: "absolute",
                                    top: "-2.8646vw",
                                    right:
                                        direction === "right"
                                            ? "-1.3021vw"
                                            : "1.5625vw",
                                    cursor: "pointer",
                                }}
                            ></Image>
                        )}
                    </Box>
                </PopoverTrigger>
                <PopoverContent
                    sx={{
                        background: "#D9D9D9",
                        borderRadius: "0.5208vw",
                        border: "none",
                        color: "#000",
                        textAlign: "center",
                        "&:focus": {
                            outline: "none !important",
                            boxShadow: "none !important",
                        },
                    }}
                >
                    <PopoverBody
                        sx={{
                            textAlign: "left",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: "0.8333vw",
                            }}
                        >
                            <span style={{ fontWeight: 600 }}>
                                [Draw Advantage]
                            </span>
                            If your next bid equals to your opponent,
                            {direction === "left"
                                ? "your opponent will win the grid"
                                : "your will win the grid."}
                        </Text>
                        <Text
                            style={{
                                fontSize: "0.7292vw",
                                marginTop: "1.0417vw",
                            }}
                        >
                            Draw advantage belongs to loser of the previous
                            grid. The first draw advantage of each game is given
                            randomly.
                        </Text>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export const MyUserCard = ({
    isBot,
    pilotInfo,
    showTutorialStep,
    level,
    loading,
    markIcon,
    address,
    balance,
    bidAmount,
    showAdvantageTip,
    status = "my",
    myGameState,
    emote = 0,
    message = 0,
    messageIndex = 0,
    emoteIndex = 0,
    planeUrl = Plane1,
    messageLoading,
    emoteLoading,
    onConfirm,
    onInputChange,
}: UserCardProps) => {
    const { onCopy } = useClipboard(address ?? "");
    const toast = useSkyToast();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                {isBot ? (
                    <Box
                        sx={{
                            position: "relative",
                            background: `url(${GearIcon}) no-repeat`,
                            backgroundPosition: "0 0",
                            backgroundSize: "50%",
                        }}
                    >
                        <Image
                            src={BotIcon}
                            sx={{
                                width: "2.5vw",
                                position: "absolute",
                                right: "22%",
                            }}
                        ></Image>
                        <Image
                            sx={{
                                width: "6.9792vw",
                                height: "6.9792vw",
                            }}
                            src={planeUrl}
                        ></Image>
                    </Box>
                ) : (
                    <Image
                        sx={{
                            width: "6.9792vw",
                            height: "6.9792vw",
                        }}
                        src={planeUrl}
                    ></Image>
                )}
                {pilotInfo?.img && (
                    <Image
                        src={pilotInfo.img}
                        sx={{
                            position: "absolute",
                            left: "0%",
                            top: "30%",
                            width: "1.875vw",
                            border: "1px solid #000",
                            borderRadius: "50%",
                        }}
                    ></Image>
                )}
                <Text
                    sx={{
                        fontSize: "0.8333vw",
                        fontWeight: "bold",
                    }}
                >
                    Level {level}
                </Text>
                <Box
                    sx={{
                        position: "absolute",
                        left: "6.9792vw",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <Message
                        message={message}
                        emote={emote}
                        messageLoading={messageLoading}
                        emoteLoading={emoteLoading}
                        status={status}
                        emoteIndex={emoteIndex}
                        messageIndex={messageIndex}
                    ></Message>
                </Box>
            </Box>
            <AdvantageTip
                direction="right"
                markIcon={markIcon}
                showAdvantageTip={showAdvantageTip}
            ></AdvantageTip>
            <Text
                sx={{
                    fontSize: "0.8333vw",
                    cursor: "pointer",
                    marginTop: "0.3125vw",
                }}
                onClick={() => {
                    onCopy();
                    toast("Copy address success");
                }}
            >
                {shortenAddress(address, 5, 4)}
                <Image
                    src={CopyIcon}
                    sx={{
                        width: "0.8333vw",
                        marginLeft: "0.5208vw",
                        display: "inline-block",
                        verticalAlign: "middle",
                    }}
                ></Image>
            </Text>
            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "1.0417vw",
                    height: "12.6042vw",
                    padding: "0.3646vw 0.8333vw 0.625vw 1.9792vw",
                    marginTop: "0.7813vw",
                }}
            >
                <Box
                    sx={{
                        width: "9.6875vw",
                        height: "2.5vw",
                        background: "#bcbbbe",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "1.3542vw",
                        paddingLeft: "0.7292vw",
                    }}
                >
                    <Image src={GoldIcon} sx={{ width: "2.8125vw" }}></Image>
                    <Text
                        sx={{
                            textShadow: "1px 1px 0px #303030",
                            fontSize: "1.25vw",
                            color: "#fddc2d",
                            marginLeft: "0.6771vw",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
                <MyBid
                    showTutorialStep={showTutorialStep}
                    loading={loading}
                    balance={balance}
                    bidAmount={bidAmount}
                    onInputChange={onInputChange}
                    onConfirm={onConfirm}
                    gameState={myGameState}
                ></MyBid>
            </Box>
        </Box>
    );
};

export const OpUserCard = ({
    isBot,
    pilotInfo,
    level,
    markIcon,
    address,
    balance,
    opGameState,
    showAdvantageTip,
    status = "my",
    myGameState,
    emote = 0,
    message = 0,
    planeUrl = Plane1,
}: UserCardProps) => {
    const { onCopy } = useClipboard(address ?? "");
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                {isBot ? (
                    <Box
                        sx={{
                            position: "relative",
                            background: `url(${GearIcon}) no-repeat`,
                            backgroundPosition: "0 0",
                            backgroundSize: "50%",
                            transform: "scaleX(-1)",
                        }}
                    >
                        <Image
                            src={BotIcon}
                            sx={{
                                width: "2.5vw",
                                position: "absolute",
                                right: "22%",
                            }}
                        ></Image>
                        <Image
                            sx={{
                                width: "6.9792vw",
                                height: "6.9792vw",
                            }}
                            src={planeUrl}
                        ></Image>
                    </Box>
                ) : (
                    <Image
                        sx={{
                            width: "6.9792vw",
                            height: "6.9792vw",
                            transform: "scaleX(-1)",
                        }}
                        src={planeUrl}
                    ></Image>
                )}
                {pilotInfo?.img && (
                    <Image
                        src={pilotInfo.img}
                        sx={{
                            position: "absolute",
                            right: "0%",
                            top: "30%",
                            width: "1.875vw",
                            border: "1px solid #000",
                            borderRadius: "50%",
                        }}
                    ></Image>
                )}
                <Text
                    sx={{
                        fontSize: "0.8333vw",
                        textAlign: "right",
                        fontWeight: "bold",
                    }}
                >
                    Level {level}
                </Text>
                <Box
                    sx={{
                        position: "absolute",
                        right: "6.9792vw",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <Message
                        message={message}
                        emote={emote}
                        status={status}
                    ></Message>
                </Box>
            </Box>
            <AdvantageTip
                direction="left"
                markIcon={markIcon}
                showAdvantageTip={showAdvantageTip}
            ></AdvantageTip>
            <Text
                sx={{
                    fontSize: "0.8333vw",
                    cursor: "pointer",
                    marginTop: "0.3125vw",
                }}
                onClick={onCopy}
            >
                {shortenAddress(address, 5, 4)}
                <Image
                    src={CopyIcon}
                    sx={{
                        width: "0.8333vw",
                        marginLeft: "0.5208vw",
                        display: "inline-block",
                        verticalAlign: "middle",
                    }}
                ></Image>
            </Text>
            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "1.0417vw",
                    height: "12.6042vw",
                    padding: "0.3646vw 0.8333vw 0.625vw 0.8333vw",
                    marginTop: "0.7813vw",
                    width: "13.0208vw",
                }}
            >
                <Box
                    sx={{
                        width: "9.6875vw",
                        height: "2.5vw",
                        background: "#bcbbbe",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "1.3542vw",
                        paddingLeft: "0.7292vw",
                    }}
                >
                    <Image src={GoldIcon} sx={{ width: "2.8125vw" }}></Image>
                    <Text
                        sx={{
                            textShadow: "1px 1px 0px #303030",
                            fontSize: "1.25vw",
                            color: "#fddc2d",
                            marginLeft: "0.6771vw",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
                <OpBid
                    myGameState={myGameState}
                    opGameState={opGameState}
                    balance={balance}
                ></OpBid>
            </Box>
        </Box>
    );
};
