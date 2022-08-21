import { Box, Heading, Image, Center, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { Trans } from "react-i18next";
import styled from "@emotion/styled";

export interface AviationProps {
    layout: {
        container: {
            top: string;
        };
        image: {
            width: string;
            left: string;
            transform?: string;
        };
        text: {
            fontSize: string;
            top: string;
            left: string;
            transform?: string;
        };
    };
    level: number;
    img: string;
}

const AnimatedContainer = styled(Box)`
    &:hover {
        & .image-container {
            transform: scale(1.3) ${(props) => props.layout.image.transform};
            transition: ease 0.5s;
        }

        & .text-container {
            transform: translateY(2vw) ${(props) => props.layout.text.transform};
            transition: ease 0.5s;
        }
    }
`;

export const Aviation: FC<AviationProps> = ({ layout, level, img }) => {
    return (
        <AnimatedContainer
            pos="relative"
            top={layout.container.top}
            layout={layout}
        >
            <Box
                w={layout.image.width}
                pos="absolute"
                left={layout.image.left}
                cursor="pointer"
                className="image-container"
                transform={layout.image.transform}
            >
                <Image src={img} w="100%" h="100%" />
            </Box>
            <Center
                pos="absolute"
                top={layout.text.top}
                left={layout.text.left}
                className="text-container"
                transform={layout.text.transform}
            >
                <Heading fontSize={layout.text.fontSize} userSelect="none">
                    <Trans i18nKey="level" values={{ num: level }} />
                </Heading>
            </Center>
        </AnimatedContainer>
    );
};
