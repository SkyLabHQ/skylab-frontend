import {
    Box,
    Button,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
} from "@chakra-ui/react";
import React from "react";
import KeyboardIcon from "./assets/keyboard.svg";
import UpArrowIcon from "./assets/up-arrow.svg";
import DownArrowIcon from "./assets/down-arrow.svg";

const KeyItem = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                height: "1.0417vw",
                mixWidth: "1.0417vw",
                borderRadius: "0.2604vw",
                border: "1px solid #000",
                backgroundColor: "rgba(0, 0, 0, 0.20)",
                width: "3.125vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7292vw",
                fontWeight: "bold",
                padding: "0 0.5208vw",
            }}
        >
            {children}
        </Box>
    );
};

const KeyBoard = ({
    type = true,
    isOpen,
    onToggle,
    onClose,
}: {
    type?: boolean;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}) => {
    return (
        <>
            {type ? (
                <Popover
                    isOpen={isOpen}
                    onClose={() => {
                        onClose();
                        console.log("关闭");
                    }}
                >
                    <PopoverTrigger>
                        <Box
                            onClick={(e) => {
                                console.log(e, "e");
                                onToggle();
                            }}
                            sx={{
                                borderRadius: "0.5208vw",
                                height: "2.3958vw",
                                width: "2.3958vw",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid #fff",
                                marginRight: "0.7292vw",
                                cursor: "pointer",
                            }}
                        >
                            <Image
                                src={KeyboardIcon}
                                sx={{
                                    width: "1.9792vw",
                                    height: "1.9792vw",
                                }}
                            ></Image>
                        </Box>
                    </PopoverTrigger>
                    <PopoverContent
                        sx={{
                            backgroundColor: "#fff",
                            color: "#000",
                            width: "14.5833vw",
                            padding: "0px",
                            "& .chakra-popover__arrow": {
                                background: "#fff !important",
                            },
                            "&:focus": {
                                outline: "none !important",
                                boxShadow: "none !important",
                            },
                        }}
                    >
                        <PopoverArrow />
                        <PopoverBody>
                            <Box>
                                <Box sx={{}}>
                                    <Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <KeyItem>Shift</KeyItem>
                                                <Text
                                                    sx={{
                                                        fontSize: "0.7292vw",
                                                    }}
                                                >
                                                    +
                                                </Text>
                                                <KeyItem>Enter</KeyItem>
                                            </Box>

                                            <Text
                                                sx={{
                                                    fontSize: "0.7292vw",
                                                    fontWeight: "bold",
                                                    width: "5.2083vw",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Confirm Bid
                                            </Text>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                marginTop: "0.7813vw",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flex: 1,
                                                }}
                                            >
                                                <Image
                                                    src={UpArrowIcon}
                                                    sx={{}}
                                                ></Image>
                                            </Box>
                                            <Text
                                                sx={{
                                                    fontSize: "0.7292vw",
                                                    fontWeight: "bold",
                                                    width: "5.2083vw",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Add Bid
                                            </Text>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                marginTop: "0.7813vw",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flex: 1,
                                                }}
                                            >
                                                <Image
                                                    src={DownArrowIcon}
                                                    sx={{}}
                                                ></Image>
                                            </Box>
                                            <Text
                                                sx={{
                                                    fontSize: "0.7292vw",
                                                    fontWeight: "bold",
                                                    width: "5.2083vw",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Reduce Bid
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                ></Box>
                            </Box>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            ) : (
                <Popover>
                    <PopoverTrigger>
                        <Button
                            variant={"unstyled"}
                            sx={{
                                borderRadius: "0.5208vw",
                                height: "2.3958vw",
                                width: "2.3958vw",
                                minWidth: "2.3958vw",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid #fff",
                                marginRight: "0.7292vw",
                                cursor: "pointer",
                                "&:focus": {
                                    boxShadow: "none",
                                },
                            }}
                        >
                            <Image
                                src={KeyboardIcon}
                                sx={{
                                    width: "1.9792vw",
                                    height: "1.9792vw",
                                }}
                            ></Image>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        sx={{
                            backgroundColor: "#fff",
                            color: "#000",
                            width: "14.5833vw",
                            padding: "0px",
                            "& .chakra-popover__arrow": {
                                background: "#fff !important",
                            },
                            "&:focus": {
                                outline: "none !important",
                                boxShadow: "none !important",
                            },
                        }}
                    >
                        <PopoverArrow />
                        <PopoverBody>
                            <Box>
                                <Box sx={{}}>
                                    <Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <KeyItem>Shift</KeyItem>
                                                <Text
                                                    sx={{
                                                        fontSize: "0.7292vw",
                                                    }}
                                                >
                                                    +
                                                </Text>
                                                <KeyItem>Enter</KeyItem>
                                            </Box>

                                            <Text
                                                sx={{
                                                    fontSize: "0.7292vw",
                                                    fontWeight: "bold",
                                                    width: "5.2083vw",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Confirm Bid
                                            </Text>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                marginTop: "0.7813vw",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flex: 1,
                                                }}
                                            >
                                                <Image
                                                    src={UpArrowIcon}
                                                    sx={{}}
                                                ></Image>
                                            </Box>
                                            <Text
                                                sx={{
                                                    fontSize: "0.7292vw",
                                                    fontWeight: "bold",
                                                    width: "5.2083vw",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Add Bid
                                            </Text>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                marginTop: "0.7813vw",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flex: 1,
                                                }}
                                            >
                                                <Image
                                                    src={DownArrowIcon}
                                                    sx={{}}
                                                ></Image>
                                            </Box>
                                            <Text
                                                sx={{
                                                    fontSize: "0.7292vw",
                                                    fontWeight: "bold",
                                                    width: "5.2083vw",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Reduce Bid
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                ></Box>
                            </Box>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            )}
        </>
    );
};

export default KeyBoard;
