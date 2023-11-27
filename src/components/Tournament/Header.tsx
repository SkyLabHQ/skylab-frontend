import {
    Box,
    Button,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    SimpleGrid,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import Discord from "./assets/discord.svg";
import FaucetIcon from "./assets/faucet-icon.svg";
import Lock from "./assets/tower-icon.svg";
import Tw from "./assets/tw.svg";
import Telegram from "./assets/telegram.svg";
import { PilotInfo } from "@/hooks/usePilotInfo";
import SkylabIcon from "./assets/skylab-icon.svg";
import MyPilot from "./MyPilot";
import Airdrop from "./assets/airdrop-icon.svg";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import { faucetUrl } from "@/skyConstants";
import CosmeticRewardIcon from "./assets/cosmetic-reward.svg";
import TasksIcon from "./assets/tasks.svg";
import FactionIcon from "./assets/faction.svg";

import MenuIcon from "./assets/menu.svg";
import { YellowButton, YellowButtonStyle } from "../Button/Index";

const Header = ({
    activePilot,
    onNextRound,
}: {
    activePilot: PilotInfo;
    onNextRound: (step: number | string) => void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { account, chainId } = useActiveWeb3React();
    const addNetworkToMetask = useAddNetworkToMetamask();

    const menuList = [
        // {
        //     icon: CosmeticRewardIcon,
        //     title: "Cosmetic Reward",
        // },
        // {
        //     icon: TasksIcon,
        //     title: "Tasks",
        // },
        // {
        //     icon: FactionIcon,
        //     title: "Faction",
        // },
        {
            icon: Lock,
            title: "Mercury Overview",
        },
        {
            icon: Airdrop,
            title: "Reward History",
            onClick: () => {
                onNextRound(0);
            },
        },
        {
            icon: SkylabIcon,
            title: "Website",
            onClick: () => {
                window.open("https://skylab.wtf", "_blank");
            },
        },
        {
            icon: FaucetIcon,
            onClick: () => {
                window.open(faucetUrl, "_blank");
            },
        },
    ];

    const menuList2 = [
        {
            icon: Tw,
            onClick: () => {
                window.open("https://twitter.com/skylabHQ", "_blank");
            },
        },
        {
            icon: Discord,
            onClick: () => {
                window.open("https://discord.gg/qWxPz8Qr87", "_blank");
            },
        },
        {
            icon: Telegram,
            onClick: () => {
                window.open("https://t.me/skylabHQ", "_blank");
            },
        },
    ];

    return (
        <Box
            pos="absolute"
            left="1.1979vw"
            top="3.2407vh"
            width={"100%"}
            zIndex={20}
        >
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <Box>
                    <MyPilot
                        img={activePilot.img}
                        showSupport={activePilot.owner !== account}
                        onClick={async () => {
                            if (chainId !== Number(DEAFAULT_CHAINID)) {
                                await addNetworkToMetask(
                                    Number(DEAFAULT_CHAINID),
                                );
                                return;
                            }
                            onNextRound("currentPilot");
                        }}
                    ></MyPilot>
                </Box>
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <Text
                            sx={{
                                color: "#F2D861",
                                textShadow: "0.2083vw 0.2083vw 0vw #000",
                                fontFamily: "Orbitron",
                                fontSize: "2.5vw",
                                fontStyle: "normal",
                                fontWeight: 800,
                                lineHeight: "normal",
                                WebkitTextStroke: "0.1042vw #000",
                                marginRight: "1.5625vw",
                            }}
                        >
                            Tournament
                        </Text>
                    </Box>
                </Box>
            </Box>
            <Menu>
                <MenuButton
                    as={Button}
                    leftIcon={
                        <Image
                            src={MenuIcon}
                            sx={{ width: "1.0417vw", height: "1.0417vw" }}
                        ></Image>
                    }
                    sx={{
                        width: "6.5104vw",
                        height: "2.2917vw",
                        flexShrink: 0,
                        marginTop: "36px",
                        borderRadius: "0.7813vw",
                        background: "transparent !important",
                        border: "2px solid #F2D861",
                        boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        fontSize: "1.0417vw",
                        display: "flex",
                        alignItems: "center",
                        color: "#F2D861",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: "0 0.8333vw",
                        "&:hover": {
                            boxShadow: "0px 4px 4px #fbc53e",
                            background: "transparent",
                        },
                        "&:focus": {
                            boxShadow: "none",
                        },
                    }}
                >
                    Menu
                </MenuButton>

                <MenuList
                    sx={{
                        background: "rgb(135,135,135)",
                        color: "#F2D861",
                        width: "220px",
                        padding: "10px",
                        borderRadius: "20px",
                    }}
                >
                    <Box>
                        <SimpleGrid columns={3} spacing={0}>
                            {menuList.map((item, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            cursor: item.onClick
                                                ? "pointer"
                                                : "no-drop",
                                            padding: "0",
                                            "&:hover": {
                                                background: "transparent",
                                            },
                                        }}
                                        onClick={() => {
                                            item?.onClick();
                                        }}
                                    >
                                        <Image
                                            sx={{
                                                width: "52px",
                                                height: "52px",
                                            }}
                                            src={item.icon}
                                        ></Image>
                                        <Text
                                            sx={{
                                                fontSize: "13px",
                                                textAlign: "center",
                                                lineHeight: "13px",
                                                marginTop: "2px",
                                            }}
                                        >
                                            {item.title}
                                        </Text>
                                    </MenuItem>
                                );
                            })}
                        </SimpleGrid>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            margin: "10px 0",
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                height: "1px",
                                background: "#FDDC2D",
                            }}
                        ></Box>
                        <Text>SNS</Text>
                        <Box
                            sx={{
                                flex: 1,
                                height: "1px",
                                background: "#FDDC2D",
                            }}
                        ></Box>
                    </Box>
                    <SimpleGrid columns={3} spacing={4}>
                        {menuList2.map((item, index) => {
                            return (
                                <Image
                                    sx={{
                                        width: "52px",
                                        height: "52px",
                                        cursor: "pointer",
                                    }}
                                    src={item.icon}
                                    key={index}
                                    onClick={() => {
                                        item?.onClick();
                                        if (item?.onClick) {
                                            onClose();
                                        }
                                    }}
                                ></Image>
                            );
                        })}
                    </SimpleGrid>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default Header;
