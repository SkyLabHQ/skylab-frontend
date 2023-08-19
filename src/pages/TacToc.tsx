import { Box, Image, Text } from "@chakra-ui/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import TacTocTutorial from "@/components/TacToc/TacTocTutorial";
import TacTocPage from "@/components/TacToc";
import { TourProvider } from "@reactour/tour";
import { doArrow, tourConfig } from "@/components/TacToc/config";
import "@reactour/popover/dist/index.css"; // arrow css
import ContentComponent from "@/components/TacToc/TourComponent";

const GameContext = createContext<{}>(null);
export const useGameContext = () => useContext(GameContext);

const TacToc = () => {
    const { setIsKnobVisible } = useKnobVisibility();
    const { account } = useActiveWeb3React();
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);
    return (
        <Box>
            <TourProvider
                onClickMask={() => {}}
                steps={tourConfig}
                padding={{
                    mask: 5,
                    popover: 35,
                }}
                beforeClose={() => {
                    setShowTutorial(false);
                }}
                ContentComponent={ContentComponent}
                styles={{
                    maskWrapper: (base) => ({
                        ...base,
                    }),
                    popover: (base: any, state: any) => {
                        console.log(base, "base");
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
                {showTutorial && <TacTocTutorial></TacTocTutorial>}
                <GameContext.Provider value={{}}>
                    <TacTocPage
                        onShowTutorial={(show) => {
                            setShowTutorial(show);
                        }}
                    ></TacTocPage>
                </GameContext.Provider>
            </TourProvider>
        </Box>
    );
};

export default TacToc;
