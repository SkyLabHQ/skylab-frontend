import { Box, Img, Text } from "@chakra-ui/react";
import { PlaneInfo } from "@/pages/Mercury";
import { useNavigate } from "react-router-dom";

interface ChildProps {
    currentImg: number;
    planeList: PlaneInfo[];
    onNextRound: (nextStep: number) => void;
    onCurrentImg: (index: number) => void;
}

const Flight = () => {
    const navigate = useNavigate();

    return (
        <Box zIndex={100}>
            <Box pos="absolute" zIndex={100} left="3.1vw" top="1.2vh">
                <Text fontSize="48px" fontWeight={800}>
                    Activities
                </Text>
            </Box>
            <Box
                pos="absolute"
                left="50%"
                top="50%"
                transform="translate(-50%,-50%)"
            >
                <Text
                    fontWeight={800}
                    fontSize="128px"
                    textAlign={"center"}
                    onClick={() => {
                        // onNextRound(7);
                    }}
                >
                    Trailblazer
                </Text>
                <Box
                    width="963px"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 600,
                    }}
                >
                    <Box
                        sx={{
                            background: "#8DF6F5",
                            border: "3px solid #FFAD29",
                            backdropFilter: "blur(7.5px)",
                            borderRadius: "20px",
                            width: "426px",
                            height: "102px",
                            color: "#000",
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                        // onClick={handlePlayTestMint}
                    >
                        <Text sx={{ fontSize: "36px" }}>Test flight</Text>
                        <Text sx={{ fontSize: "20px" }}>Freemium version</Text>
                    </Box>
                    <Box
                        sx={{
                            background:
                                "linear-gradient(270deg, #8DF6F5 0%, #FFAD29 49.48%, #8DF6F5 100%)",
                            border: "3px solid #FFAD29",
                            backdropFilter: "blur(7.5px)",
                            borderRadius: "20px",
                            width: "426px",
                            height: "102px",
                            color: "#000",
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                    >
                        <Text sx={{ fontSize: "36px" }}>Set Off</Text>
                        <Text sx={{ fontSize: "20px" }}>Real version</Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Flight;
