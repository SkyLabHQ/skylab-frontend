import { Box, HStack, Text, VStack } from "@chakra-ui/react";

import { useState } from "react";

interface ChildProps {
    onNextRound: () => void;
}
const ConfirmedRound = ({ onNextRound }: ChildProps) => {
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
            paddingTop="80px"
        >
            <VStack w="1042px" margin="0 auto">
                <Text fontSize="36px" fontWeight={600} lineHeight="40px">
                    Request confirmed!
                </Text>
                <Text fontSize="36px" fontWeight={600} lineHeight="40px">
                    We will airdrop L1 paper plane to you
                </Text>{" "}
                <Text
                    fontSize="36px"
                    fontWeight={600}
                    color="#FFF761"
                    lineHeight="40px"
                >
                    within the next 24hr
                </Text>
                <Box>
                    <Text fontSize="48px" fontWeight={600} marginTop="50px">
                        The tournament
                    </Text>
                    <HStack justifyContent="space-between" marginTop="25px">
                        <Text fontSize="36px" fontWeight={600}>
                            Starts
                        </Text>
                        <Text fontSize="36px" fontWeight={600}>
                            April 20
                        </Text>
                    </HStack>
                    <HStack justifyContent="space-between" marginTop="25px">
                        <Text fontSize="36px" fontWeight={600}>
                            Ends
                        </Text>
                        <Text fontSize="36px" fontWeight={600}>
                            April 30
                        </Text>
                    </HStack>
                </Box>
                <Text
                    fontSize="36px"
                    fontWeight={600}
                    marginTop="50px !important"
                >
                    Good luck!
                </Text>
            </VStack>
        </Box>
    );
};

export default ConfirmedRound;
