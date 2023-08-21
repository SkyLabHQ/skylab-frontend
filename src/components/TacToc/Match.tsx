import React, { useMemo, useState } from "react";
import { Box, Img, Select, Text } from "@chakra-ui/react";
import GatherTimeResult from "@/components/GameContent/assets/gatherTimeResult.svg";
import GatherTimeResult1 from "@/components/GameContent/assets/gatherTimeResult1.svg";
import GatherTimeResult2 from "@/components/GameContent/assets/gatherTimeResult2.svg";
import GatherTimeResult3 from "@/components/GameContent/assets/gatherTimeResult3.svg";

const zoneList = [
    { value: -12, label: "-12 Baker Island, Howland Island" },
    { value: -11, label: "-11 Pago Pago, Alofi, Midway Atoll" },
    { value: -10, label: "-10 Honolulu, Papeete" },
    { value: -9, label: "-9" },
    { value: -8, label: "-8 Anchorage, Fairbanks" },
    { value: -7, label: "-7 Seattle, Los Angeles, Vancouver " },
    { value: -6, label: "-6 Mexico City,  Guatemala City " },
    { value: -5, label: "-5 Lima, Chicago" },
    { value: -4, label: "-4 New York, Toronto" },
    { value: -3, label: "-3 Buenos Aires, Rio de Janeiro, Montevideo " },
    { value: -2, label: "-2 Nuuk" },
    { value: -1, label: "-1 Praia" },
    { value: 1, label: "+1 Paris, Rome, Berlin" },
    { value: 2, label: "+2 Oslo, Monaco" },
    { value: 3, label: "+3 Moscow, Athens, Cairo, Istanbul " },
    { value: 4, label: "+4 Dubai, Baku, Tbilisi" },
    { value: 5, label: "+5 Yekaterinburg" },
    { value: 6, label: "+6 Almaty, Dhaka, Omsk" },
    { value: 7, label: "+7 Bangkok, Jakarta, Hanoi " },
    { value: 8, label: "+8 Beijing, Hongkong, SIngapore" },
    { value: 9, label: "+9 Tokyo, Seoul, Chita " },
    { value: 10, label: "+10 Sydney, Brisbane, Port Moresby" },
    { value: 11, label: "+11 Honiara, Noumea" },
    { value: 12, label: "+12 Auckland, Anadyr" },
];

export const MatchPage = () => {
    const [zone, setZone] = useState("-4");

    const zoneImg = useMemo(() => {
        if (["-1", "-4", "-7", "-10", "2", "5", "8", "11"].includes(zone)) {
            return GatherTimeResult1;
        }

        if (["-3", "-6", "-9", "-12", "0", "3", "6", "9"].includes(zone)) {
            return GatherTimeResult2;
        }

        if (["-2", "-5", "-8", "-11", "1", "4", "7", "10"].includes(zone)) {
            return GatherTimeResult3;
        }
        return GatherTimeResult;
    }, [zone]);

    return (
        <Box
            pos="relative"
            bgRepeat="no-repeat,no-repeat"
            height="100vh"
            bgPos={"center bottom,center center"}
            bgSize={"100%,100% 100%"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingTop={"1vh"}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1vh",
                }}
            >
                <img
                    style={{}}
                    src={
                        "https://ipfs.io/ipfs/QmWQUsBUJQSB5ZaMsGXa6bWQSipdweimdjDcYq5gt9zfE8/Round0/2.png"
                    }
                ></img>
                <Text sx={{ fontSize: "48px", margin: "0 30px" }}>VS</Text>
                <img
                    style={{}}
                    src={
                        "https://ipfs.io/ipfs/QmWQUsBUJQSB5ZaMsGXa6bWQSipdweimdjDcYq5gt9zfE8/Round0/2.png"
                    }
                ></img>
            </Box>
            <Box
                sx={{
                    borderRadius: "20px",
                    border: "3px solid #FDDC2D",
                    background: "rgba(255, 255, 255, 0.20)",
                    backdropFilter: "blur(18.5px)",
                    width: "60vw",
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1vh",
                    padding: "1vh 1vw",
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Text sx={{ fontSize: "24px" }}>
                        Join the game during{" "}
                        <span style={{ color: "#FFF761" }}>gathering time</span>{" "}
                        for faster component matching! Calculate your
                        personalized gathering time based on your time zone
                        here.
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "3vh",
                        }}
                    >
                        <Text sx={{ fontSize: "24px" }}>Your time zone</Text>
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <Select
                                variant="unstyled"
                                sx={{
                                    width: "8vw",
                                    border: " 3px solid #FFF761",
                                    borderRadius: "10px",
                                    marginRight: "10px",
                                    height: "50px",
                                }}
                                value={zone}
                                onChange={(e) => {
                                    setZone(e.target.value);
                                }}
                            >
                                {zoneList.map((item) => {
                                    return (
                                        <option
                                            value={item.value}
                                            key={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    );
                                })}
                            </Select>
                            <Text sx={{ fontSize: "36px" }}> UTC</Text>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Img src={zoneImg} w="80%" />
                </Box>
            </Box>
        </Box>
    );
};

export default MatchPage;
