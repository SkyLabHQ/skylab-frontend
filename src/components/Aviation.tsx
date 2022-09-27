import { Box, Heading, Image, Center, Portal } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { Trans } from "react-i18next";
import styled from "@emotion/styled";

import { AviationOverlay } from "./AviationOverlay";

export type AviationProps = {
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
    onPopup?: (visible: boolean) => void;
    changeBackgroundOnHover?: (hover: boolean) => void;
};

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

export const Aviation: FC<AviationProps> = ({
    layout,
    level,
    img,
    onPopup,
    changeBackgroundOnHover,
}) => {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const isNewLayout = level === 1;

    const onAviationClick = () => {
        if (isOverlayVisible) {
            return;
        }
        window.scrollTo({
            top: 0.75 * window.innerWidth - 50,
        });
        setIsOverlayVisible(!isOverlayVisible);
        onPopup?.(!isOverlayVisible);
    };

    const onOverlayClose = () => {
        // todo: scroll back to the position when overlay opens
        if (!isOverlayVisible) {
            return;
        }
        setIsOverlayVisible(!isOverlayVisible);
        onPopup?.(!isOverlayVisible);
    };

    const onMouseOver = () => {
        if (isNewLayout) {
            changeBackgroundOnHover?.(true);
        }
    };

    const onMouseLeave = () => {
        if (isNewLayout) {
            changeBackgroundOnHover?.(false);
        }
    };

    const content = (
        <AnimatedContainer
            pos={isNewLayout ? "absolute" : "relative"}
            top={layout.container.top}
            layout={layout}
            onClick={onAviationClick}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
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
                <Heading
                    fontSize={layout.text.fontSize}
                    fontFamily="Quantico"
                    fontWeight="700"
                    userSelect="none"
                >
                    <Trans i18nKey="level" values={{ num: level }} />
                </Heading>
            </Center>
            {isOverlayVisible ? (
                <AviationOverlay
                    onOverlayClose={onOverlayClose}
                    level={level}
                    img={img}
                />
            ) : null}
        </AnimatedContainer>
    );

    return isNewLayout ? <Portal>{content}</Portal> : content;
};
