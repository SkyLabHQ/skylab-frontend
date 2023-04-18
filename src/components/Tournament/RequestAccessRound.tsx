import { Box, Text } from "@chakra-ui/react";
import NextRoundBg from "./assets/next-round.svg";

interface ChildProps {
    onNextRound: () => void;
}

const RequestAccessRound = ({ onNextRound }: ChildProps) => {
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
            paddingTop="131px"
        >
            <Text fontSize="36px" fontWeight={600} textAlign="center">
                You currently do not have any plane in your wallet
            </Text>
            <Box
                onClick={(e) => {
                    onNextRound();
                }}
                bg={`url(${NextRoundBg})`}
                bgSize="100% 100%"
                w="663px"
                h="129px"
                margin={"266px auto 0 "}
                paddingTop="20px"
                cursor="pointer"
            >
                <Text
                    color="#000"
                    fontSize="36px"
                    fontWeight="600"
                    textAlign="center"
                >
                    Request access for next round
                </Text>
            </Box>
        </Box>
    );
};

export default RequestAccessRound;
