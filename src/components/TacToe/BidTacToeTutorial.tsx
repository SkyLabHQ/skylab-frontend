import React, { Children } from "react";
import { Box, Image, Modal, Text, useDisclosure } from "@chakra-ui/react";
import { TourProvider } from "@reactour/tour";
import "@reactour/popover/dist/index.css"; // arrow css
import { doArrow, tourConfig } from "@/components/TacToe/config";
import ContentComponent from "@/components/TacToe/TourComponent";
import TacToeTutorial from "@/components/TacToe/TacTocTutorial";

const BidTacToeTutorial = ({ children }: { children: React.ReactNode }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box>
            <Box
                onClick={() => {
                    onOpen();
                }}
            >
                {children}
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <TourProvider
                    onClickMask={() => {}}
                    steps={tourConfig}
                    padding={{
                        mask: 5,
                        popover: 35,
                    }}
                    beforeClose={() => {
                        onClose();
                    }}
                    ContentComponent={ContentComponent}
                    styles={{
                        maskWrapper: (base) => ({
                            ...base,
                        }),
                        popover: (base: any, state: any) => {
                            return {
                                ...base,
                                boxShadow: "none",
                                borderRadius: "16px",
                                ...doArrow(
                                    state.position,
                                    state.verticalAlign,
                                    state.horizontalAlign,
                                ),
                            };
                        },
                        highlightedArea: (base: any, props: any) => ({
                            ...base,
                            display: "block",
                            stroke: "#FDDC2D",
                            strokeWidth: 4,
                            strokeDasharray: "8,4",
                            padding: 0,
                            rx: 10,
                        }),
                    }}
                >
                    <TacToeTutorial></TacToeTutorial>
                </TourProvider>
            </Modal>
        </Box>
    );
};

export default BidTacToeTutorial;
