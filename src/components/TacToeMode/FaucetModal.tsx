import React from "react";
import {
    Box,
    Text,
    Image,
    Modal,
    ModalContent,
    Checkbox,
} from "@chakra-ui/react";
import PolygonIcon from "./assets/polygon.svg";
import CloseIcon from "./assets/close-button.svg";

interface FaucetModalProps {
    open: boolean;
    onClose: (checked: boolean) => void;
}

const FaucetModal = ({ open, onClose }: FaucetModalProps) => {
    const [checked, setChecked] = React.useState(false);
    return (
        <Modal
            isOpen={open}
            onClose={() => {
                onClose(checked);
            }}
            size="full"
        >
            <ModalContent
                sx={{
                    background: "rgba(48, 48, 48, 0.50)",
                    backdropFilter: "blur(30px)",
                }}
            >
                <Box
                    pos={"absolute"}
                    left={"50%"}
                    top={"50%"}
                    transform={"translate(-50%,-50%)"}
                    height="10.9896vw"
                    w={"28.3854vw"}
                    padding="1.0417vw 3.125vw"
                    fontFamily="Orbitron"
                    color="#fff"
                    sx={{
                        border: "2px solid #fff",
                        backdropFilter: "blur(25px)",
                        borderRadius: "0.8333vw",
                    }}
                >
                    <Image
                        onClick={() => {
                            onClose(checked);
                        }}
                        src={CloseIcon}
                        sx={{
                            position: "absolute",
                            right: "1.0417vw",
                            top: "1.0417vw",
                            height: "0.9375vw",
                            width: "0.9375vw",
                            cursor: "pointer",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            color: "#fff",
                            fontSize: "1.25vw",
                            fontWeight: "600",
                            fontFamily: "Quantico",
                        }}
                    >
                        If you do not have sufficient gas, get free tokens with
                        the link below
                    </Text>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "1.0417vw",
                        }}
                    >
                        <Checkbox
                            onChange={(e) => {
                                setChecked(e.target.checked);
                            }}
                            checked={checked}
                            size="lg"
                            sx={{
                                "--chakra-shadows-outline": "none",
                                marginRight: "0.5208vw",
                                background: "#d9d9d9",
                                borderRadius: "4px",
                                "& span": {
                                    borderRadius: "4px",
                                },
                                "& span[data-checked]": {
                                    background: "#d9d9d9 !important",
                                    borderColor: "#d9d9d9 !important",
                                    borderRadius: "4px",
                                },
                                "& span:hover": {
                                    background: "#d9d9d9 !important",
                                    borderColor: "#d9d9d9 !important",
                                    borderRadius: "4px",
                                },
                            }}
                            variant="no-outline"
                        ></Checkbox>
                        <Text
                            sx={{
                                fontSize: "16px",
                                fontFamily: "Quantico",
                            }}
                        >
                            {" "}
                            Do not show again
                        </Text>
                    </Box>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default FaucetModal;
