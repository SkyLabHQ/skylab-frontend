import { Box, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import SubmitBg from "./assets/submit.svg";

interface ChildProps {
    onNextRound: (nextStep: number) => void;
}
const SubmitRound = ({ onNextRound }: ChildProps) => {
    const [address, setAddress] = useState("");
    const [accesscode, setAccesscode] = useState("");

    return (
        <Box
            bg={"rgba(217, 217, 217, 0.2)"}
            w="1252px"
            h="639px"
            border="3px solid #FFAD29"
            backdropFilter="blur(7.5px)"
            pos="absolute"
            left="50%"
            top="24%"
            transform="translate(-50%)"
            borderRadius="40px"
            paddingTop="49px"
            zIndex={100}
        >
            <VStack w="698px" margin="0 auto">
                <Text fontSize="36px" fontWeight={600} w="100%">
                    Wallet Address
                </Text>
                <Input
                    variant="unstyled"
                    border="3px solid #FFAD29"
                    borderColor={"#FFAD29"}
                    borderRadius="40px"
                    w={"100%"}
                    paddingLeft="30px"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                    }}
                    sx={{
                        fontSize: "36px",
                        height: "102px",
                    }}
                />
                <Text
                    fontSize="36px"
                    fontWeight={600}
                    w="100%"
                    marginTop={"16px"}
                >
                    Access code
                </Text>
                <Input
                    variant="unstyled"
                    border="3px solid #FFAD29"
                    borderColor={"#FFAD29"}
                    borderRadius="40px"
                    w={"100%"}
                    paddingLeft="2vw"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                    }}
                    sx={{
                        fontSize: "36px",
                        height: "102px",
                    }}
                />
                <Box
                    bg={`url(${SubmitBg})`}
                    bgSize="100% 100%"
                    w="570px"
                    h="129px"
                    marginTop="88px !important"
                    paddingTop="20px"
                    cursor={"pointer"}
                    onClick={() => {
                        onNextRound(4);
                    }}
                >
                    <Text
                        color="#000"
                        fontSize="36px"
                        fontWeight="600"
                        textAlign="center"
                    >
                        Submit
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
};

export default SubmitRound;
