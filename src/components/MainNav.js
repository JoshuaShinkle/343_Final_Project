import React from "react";
import { Navbar, Button, Link, Text, Card, Radio } from "@nextui-org/react";
import { Layout } from "./Layout.js";
// import { AcmeLogo } from "./AcmeLogo.js";

export default function App() {
    return (
        <Layout>
            <Navbar isBordered variant="fixed">
                <Navbar.Brand>
                    <Text b color="inherit" hideIn="xs">
                        Heroscape
                    </Text>
                </Navbar.Brand>
                <Navbar.Content hideIn="xs">
                    <Link href="#">Characters</Link>

                    <Link href="#">Search</Link>
                    <Link href="#">Sort</Link>
                </Navbar.Content>
                <Navbar.Content>
                    <Link color="inherit" href="#">
                        Login
                    </Link>
                    <Button auto flat as={Link} href="#">
                        Sign Up
                    </Button>
                </Navbar.Content>
            </Navbar>
        </Layout>
    );
}
