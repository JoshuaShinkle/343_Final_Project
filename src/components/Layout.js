import React from "react";
import { Content } from "./Content.js";
import { Box } from "./Box.js";
import { Container, Table } from "@nextui-org/react";

export const Layout = ({ children }) => (
    <Box
        css={{
            maxW: "100%",
        }}
    >
        {children}
        <Container>
            <Content />
        </Container>
    </Box>
);
