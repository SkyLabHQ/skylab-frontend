import React from "react";
import { shortenAddress } from "@/utils";
import AdvantageIcon from "./assets/advantage-icon.svg";
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
import { GameInfo } from ".";
import GoldIcon from "./assets/gold.svg";
import AddIcon from "./assets/add-icon.svg";
import SubIcon from "./assets/sub-icon.svg";

const MyBid = ({
    loading,
    balance,
    bidAmount,
    gameInfo,
    onInputChange,
    onConfirm,
}: {
    loading: boolean;
    balance: number;
    bidAmount: string;
    gameInfo: GameInfo;
    onInputChange?: (value: string) => void;
    onConfirm: () => void;
}) => {
    return (
        <Box>
            <Box
                sx={{
                    marginTop: "15px",
                    display: "flex",
                }}
                className="first-step second-step"
            >
                <Box>
                    <Text sx={{ fontSize: "24px" }}>Bid</Text>
                    <Box
                        sx={{
                            position: "relative",
                        }}
                    >
                        <Image
                            src={SubIcon}
                            sx={{
                                position: "absolute",
                                left: "-30px",
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                        ></Image>
                        <Image
                            src={AddIcon}
                            sx={{
                                position: "absolute",
                                right: "-30px",
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                        ></Image>
                        <NumberInput
                            isDisabled={loading}
                            variant="unstyled"
                            max={balance}
                            value={bidAmount}
                            sx={{
                                "& input": {
                                    height: "44px",
                                    background: "rgba(255, 255, 255, 0.40)",
                                    borderRadius: "18px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fff",
                                    fontSize: "32px",
                                    width: "120px",
                                    textAlign: "center",
                                    border: "3px solid #fff",
                                    padding: 0,
                                },
                            }}
                            onChange={(e) => {
                                onInputChange(e);
                            }}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                </Box>

                <Box sx={{ marginLeft: "30px" }}>
                    <Text
                        sx={{
                            fontSize: "16px",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                            lineHeight: "36px",
                        }}
                    >
                        Remaining
                    </Text>
                    <Text
                        sx={{
                            fontSize: "32px",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                        }}
                    >
                        / {balance}
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    height: "44px",
                    width: "120px",
                    marginTop: "10px",
                }}
            >
                <Button
                    onClick={onConfirm}
                    disabled={loading || !(gameInfo?.gameState === 1)}
                    variant={"outline"}
                    sx={{
                        color: "#fff",
                        border: "2px solid #FDDC2D !important",
                        height: "100%",
                        borderRadius: "18px",
                        width: "100%",
                        fontSize: "24px",
                        "&: disabled": {
                            border: "2px solid #fff !important",
                        },
                    }}
                >
                    {loading ? "Confirming" : "Confirm"}
                </Button>
            </Box>
        </Box>
    );
};

const OpBid = ({
    bidAmount,
    balance,
}: {
    balance: number;
    bidAmount: string;
}) => {
    return (
        <Box>
            <Box sx={{ marginTop: "15px", display: "flex" }}>
                <Box>
                    <Text sx={{ fontSize: "24px" }}>Bid</Text>
                    <Box
                        sx={{
                            height: "44px",

                            background: "#4a4a4a",
                            borderRadius: "18px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#000000",
                            fontSize: "32px",
                            width: "120px",
                        }}
                    >
                        {bidAmount}
                    </Box>
                </Box>
                <Box>
                    <Text
                        sx={{
                            fontSize: "16px",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                            lineHeight: "36px",
                        }}
                    >
                        Remaining
                    </Text>
                    <Text
                        sx={{
                            fontSize: "32px",
                            textAlign: "right",
                            margin: "0px 0 0 10px",
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
    loading?: boolean;
    gameInfo?: GameInfo;
    markIcon: string;
    address: string;
    balance: number;
    bidAmount: string;
    showAdvantageTip?: boolean;
    status?: "my" | "op";
    onConfirm?: () => void;
    onInputChange?: (value: string) => void;
}

const UserCard = ({
    loading,
    gameInfo,
    markIcon,
    address,
    balance,
    bidAmount,
    showAdvantageTip,
    status = "my",
    onConfirm,
    onInputChange,
}: UserCardProps) => {
    const { onCopy } = useClipboard(address ?? "");
    return (
        <Box sx={{}}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: status === "my" ? "start-end" : "flex-end",
                }}
            >
                <Image
                    sx={{
                        width: "134px",
                        transform: status === "my" ? "" : "scaleX(-1)",
                        /*兼容IE*/
                    }}
                    src={
                        "https://ipfs.io/ipfs/QmWQUsBUJQSB5ZaMsGXa6bWQSipdweimdjDcYq5gt9zfE8/Round0/2.png"
                    }
                ></Image>
                <Box
                    sx={{
                        position: "relative",
                        width: "fit-content",
                        marginTop: "30px",
                    }}
                >
                    <Image src={markIcon} sx={{ width: "36px" }}></Image>
                    {showAdvantageTip && (
                        <Popover placement="top">
                            <PopoverTrigger>
                                <Image
                                    src={AdvantageIcon}
                                    sx={{
                                        position: "absolute",
                                        top: "-20px",
                                        right: "-20px",
                                        cursor: "pointer",
                                    }}
                                ></Image>
                            </PopoverTrigger>
                            <PopoverContent
                                sx={{
                                    background: "#D9D9D9",
                                    borderRadius: "10px",
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
                                            fontSize: "16px",
                                        }}
                                    >
                                        <span style={{ fontWeight: 600 }}>
                                            [Draw Advantage]
                                        </span>
                                        If your next bid equals to your
                                        opponent, your opponent will win the
                                        grid.
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: "14px",
                                            marginTop: "20px",
                                        }}
                                    >
                                        Draw advantage belongs to loser of the
                                        previous grid. The first buff of each
                                        game is given randomly based on [method]
                                    </Text>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    )}
                </Box>
                <Text
                    sx={{
                        fontSize: "16px",
                        cursor: "pointer",
                        marginTop: "6px",
                    }}
                    onClick={onCopy}
                >
                    {shortenAddress(address, 5, 4)}
                    <Image
                        src={CopyIcon}
                        sx={{
                            width: "16px",
                            marginLeft: "10px",
                            display: "inline-block",
                            verticalAlign: "middle",
                        }}
                    ></Image>
                </Text>
            </Box>

            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "20px",
                    height: "242px",
                    padding: "7px 16px 16px 40px",
                }}
            >
                <Box
                    sx={{
                        width: "186px",
                        height: "48px",
                        background: "#bcbbbe",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "26px",
                        paddingLeft: "14px",
                    }}
                >
                    <Image src={GoldIcon}></Image>

                    <Text
                        sx={{
                            textShadow: "1px 1px 0px #303030",
                            fontSize: "24px",
                            color: "#fddc2d",
                            marginLeft: "13px",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
                {status === "my" && (
                    <MyBid
                        loading={loading}
                        balance={balance}
                        bidAmount={bidAmount}
                        onInputChange={onInputChange}
                        onConfirm={onConfirm}
                        gameInfo={gameInfo}
                    ></MyBid>
                )}
                {status === "op" && (
                    <OpBid bidAmount={bidAmount} balance={balance}></OpBid>
                )}
            </Box>
        </Box>
    );
};

export default UserCard;
