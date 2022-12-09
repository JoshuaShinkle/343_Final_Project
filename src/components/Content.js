import React from "react";
import { Text, Spacer, Image, Button } from "@nextui-org/react";
import { Box } from "./Box.js";
import { Search } from "./Search.js";

export const Content = () => (
    <Box css={{ px: "$12", mt: "$8", "@xsMax": { px: "$10" } }}>
        <Text
            h1
            size={60}
            css={{
                textGradient: "45deg, $blue600 40%, $pink600 100%",
                textAlign: "center",
            }}
            weight="bold"
        >
            Heroscape Character Finder
        </Text>

        <Search />

        <Spacer y={1} />
        <Spacer y={1} />
    </Box>
);
