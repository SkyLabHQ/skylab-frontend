import { Box, Text } from "@chakra-ui/react";

const RoundInfo = ({
    currentRound,
    allRound,
}: {
    currentRound: number;
    allRound: number;
}) => {
    return (
        <Box
            sx={{
                borderRadius: "1.0417vw",
                background: "#d9d9d9",
                display: "flex",
                width: "6.875vw",
                alignItems: "center",
                justifyContent: "center",
                margin: "2.6042vw auto 0",
                height: "1.875vw",
            }}
        >
            <Text
                sx={{
                    fontSize: "0.8333vw",
                    color: "#303030",
                }}
            >
                Round {currentRound}
            </Text>
            <Text
                sx={{
                    color: "#616161",
                    fontSize: "0.7292vw",
                }}
            >
                {" "}
                /{allRound}
            </Text>
        </Box>
    );
};

export default RoundInfo;
