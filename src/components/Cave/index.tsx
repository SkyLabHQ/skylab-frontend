import { Img, Box } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

import CaveLine from "../../assets/cave-line.svg";
import CaveBg from "../../assets/cave-background.png";
import Factory2 from "../../assets/factory-2.svg";
import Factory3 from "../../assets/factory-3.svg";
import Factory7 from "../../assets/factory-7.svg";
import Factory8 from "../../assets/factory-8.svg";
import { BackButton } from "./BackButton";
import { FactoryBoard } from "./FactoryBoard";
import { Lift } from "./Lift";
import { Board } from "./Board";

type Props = {
    onBack: () => void;
};

export type Factory = {
    level: number;
    img: string;
    number: number;
    shieldInUse: number;
    shieldDamaged: number;
    dailyFuelOutput: number;
    dailyBatteryOutput: number;
    totalFuelOutput: number;
    totalBatteryOutput: number;
};

export const config: Factory[] = [
    {
        level: 2,
        img: Factory2,
        number: 1,
        shieldInUse: 108,
        shieldDamaged: 12,
        dailyFuelOutput: 10,
        dailyBatteryOutput: 90,
        totalBatteryOutput: 180,
        totalFuelOutput: 210,
    },
    {
        level: 3,
        img: Factory3,
        number: 6,
        shieldInUse: 108,
        shieldDamaged: 12,
        dailyFuelOutput: 10,
        dailyBatteryOutput: 90,
        totalBatteryOutput: 180,
        totalFuelOutput: 210,
    },
    {
        level: 7,
        img: Factory7,
        number: 3,
        shieldInUse: 108,
        shieldDamaged: 12,
        dailyFuelOutput: 10,
        dailyBatteryOutput: 90,
        totalBatteryOutput: 180,
        totalFuelOutput: 210,
    },
    {
        level: 8,
        img: Factory8,
        number: 1,
        shieldInUse: 108,
        shieldDamaged: 12,
        dailyFuelOutput: 10,
        dailyBatteryOutput: 90,
        totalBatteryOutput: 180,
        totalFuelOutput: 210,
    },
];

export const Cave: FC<Props> = ({ onBack }) => {
    const [caveLevel, setCaveLevel] = useState(1);
    const [selectedFactory, setSelectedFactory] = useState<
        Record<number, Factory[]>
    >({ 1: [], 2: [] });

    useEffect(() => {
        if (caveLevel === 2) {
            setSelectedFactory({
                ...selectedFactory,
                1: [],
            });
        }
    }, [caveLevel]);

    return (
        <Box
            w="100%"
            h="100vh"
            minH="900px"
            pos="relative"
            scrollSnapAlign="start"
            bgImg={CaveBg}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
        >
            <Box pos="absolute" left="2vw" bottom="4vh">
                <BackButton onClick={onBack} />
            </Box>
            <Box pos="absolute" left="8vw" bottom="24vh">
                <FactoryBoard
                    caveLevel={caveLevel}
                    selectedFactory={selectedFactory[caveLevel]}
                    setSelectedFactory={(val) =>
                        setSelectedFactory({
                            ...selectedFactory,
                            [caveLevel]: val,
                        })
                    }
                />
            </Box>
            <Img
                src={CaveLine}
                pos="absolute"
                left="65vw"
                bottom="10vh"
                h="75vh"
            />
            <Box pos="absolute" right="4vw" bottom="8vh">
                <Board
                    caveLevel={caveLevel}
                    selectedFactory={selectedFactory}
                    setSelectedFactory={setSelectedFactory}
                />
            </Box>
            <Box pos="absolute" right="2vw" bottom="4vh">
                <Lift
                    onUp={() => setCaveLevel(1)}
                    onDown={() => setCaveLevel(2)}
                />
            </Box>
        </Box>
    );
};
