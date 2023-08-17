import { Box, Button, Image, Text } from "@chakra-ui/react";
import React from "react";
import Title from "@/components/Home/assets/blog-title.png";
import Content from "@/components/Home/assets/banner.png";
import Readmore from "@/components/Home/assets/readmore.svg";

const Blog = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 20vw",
            }}
        >
            <Box sx={{ maxWidth: "1343px", position: "relative" }}>
                <Image
                    src={Title}
                    sx={{
                        marginTop: "100px",
                        width: "70px",
                        left: "-100px",
                        position: "absolute",
                        top: "0",
                    }}
                ></Image>
                <Image
                    src={Content}
                    sx={{ width: "100%", marginTop: "10vh" }}
                ></Image>
                <Text
                    sx={{
                        fontSize: "40px",
                        fontFamily: "Orbitron",
                        fontWeight: 600,
                    }}
                >
                    Launching Sky Lab: Primitives of the Autonomous World
                </Text>
                <Text sx={{ fontSize: "32px", marginTop: "10px" }}>
                    Primitives of the Autonomous World: Constraints, Mechanisms,
                    Value Distribution. Sky Lab builds primitives of the
                    autonomous world as well as initial games on top of the
                    primitives. This blog explains why primitives matter...
                </Text>
                <Image
                    src={Readmore}
                    sx={{ marginTop: "10px", cursor: "pointer" }}
                    onClick={() => {
                        window.open(
                            "https://mirror.xyz/skylabhq.eth/AwA254UbuRPI-IqGYujG24E0ZB5KfjdKBgfNKb_rMXk",
                        );
                    }}
                ></Image>
            </Box>
        </Box>
    );
};

export default Blog;
