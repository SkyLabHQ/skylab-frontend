import { useSkylabTestFlightContract } from "@/hooks/useContract";
import { handleError } from "@/utils/error";
import { Box, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { SubmitButton } from "../Button/Index";
import Loading from "../Loading";
import SkyToast from "../Toast";

interface ChildProps {
    onNextRound: (nextStep: number) => void;
    onPlaneBalance: () => Promise<void>;
}

const RequestAccessRound = ({ onNextRound, onPlaneBalance }: ChildProps) => {
    const skylabTestFlightContract = useSkylabTestFlightContract();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handlePlayTestMint = async () => {
        try {
            setLoading(true);
            const res = await skylabTestFlightContract.playTestMint();
            await res.wait();
            await onPlaneBalance();
            onNextRound(2);
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={"Successfully get plane"}></SkyToast>
                ),
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
    };
    return (
        <Box
            bg={"rgba(0, 0, 0, 0.5)"}
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
            zIndex={99}
        >
            {loading && <Loading />}
            <Text fontSize="36px" fontWeight={600} textAlign="center">
                You currently do not have any plane in your wallet
            </Text>
            <Box
                width="963px"
                sx={{
                    margin: "82px auto 0",
                    display: "flex",
                    justifyContent: "space-between",
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
                    onClick={handlePlayTestMint}
                >
                    <Text sx={{ fontSize: "36px" }}>Test Flight</Text>
                    <Text sx={{ fontSize: "20px" }}>Freemium version</Text>
                </Box>
                <Box
                    sx={{
                        background: "rgba(217, 217, 217, 0.2)",
                        border: "3px solid #616161",
                        backdropFilter: "blur(7.5px)",
                        borderRadius: "20px",
                        width: "426px",
                        height: "102px",
                        color: "#ABABAB",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                >
                    <Text sx={{ fontSize: "36px" }}>Set Off</Text>
                    <Text sx={{ fontSize: "20px" }}>Real version</Text>
                </Box>
            </Box>
            <SubmitButton
                width="863px"
                style={{ margin: "126px auto 0" }}
                onClick={() => {
                    onNextRound(3);
                }}
            >
                <Text>Request access for next round</Text>
            </SubmitButton>
        </Box>
    );
};

export default RequestAccessRound;
