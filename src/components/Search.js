import React, { useEffect, useState } from "react";
import { allCharacters } from "../api/objects/allCharacters";
import {
    Navbar,
    Button,
    Link,
    Text,
    Card,
    Radio,
    Grid,
    Row,
    Spacer,
} from "@nextui-org/react";
import axios from "axios";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
const axiosClient = axios.create({
    baseURL: "http://localhost:3000",
});

const knex = require("knex")({
    client: "pg",
    connection: {
        host: "heroscape.cawzoprjs77s.us-east-2.rds.amazonaws.com",
        user: "postgres",
        password: "postgres",
        database: "heroscape",
    },
});

export const Search = () => {
    const [chars, setChars] = useState([]);
    const [filterAttackDice, setFilterAttackDice] = useState([1, 8]);
    const [filterDefenseDice, setFilterDefenseDice] = useState([0, 9]);
    const [filterPoints, setFilterPoints] = useState([0, 300]);
    const [filterRange, setFilterRange] = useState([0, 10]);
    const [filterMove, setFilterMove] = useState([0, 10]);
    const [filterLife, setFilterLife] = useState([0, 10]);
    const [filterHeight, setFilterHeight] = useState([2, 17]);

    const getAllCharacters = async () => {
        axiosClient
            .get("/characters")
            .then((result) => {
                // console.log(result.data[200]);
                console.log(result.data);
                setChars(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getAllCharacters();
    }, []);

    const handler = (item) => {
        console.log(item);
    };

    const handleChangeAttackDice = (event, newValue) => {
        setFilterAttackDice(newValue);
    };

    const handleChangeDefenseDice = (event, newValue) => {
        setFilterDefenseDice(newValue);
    };

    const handleChangePoints = (event, newValue) => {
        setFilterPoints(newValue);
    };

    const handleChangeRange = (event, newValue) => {
        setFilterRange(newValue);
    };

    const handleChangeMove = (event, newValue) => {
        setFilterMove(newValue);
    };

    const handleChangeLife = (event, newValue) => {
        setFilterLife(newValue);
    };

    const handleChangeHeight = (event, newValue) => {
        setFilterHeight(newValue);
    };

    return (
        <div>
            <Box sx={{ width: 300 }}>
                <Text>Attack Dice</Text>
                <Slider
                    defaultValue={[1, 8]}
                    onChange={handleChangeAttackDice}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={8}
                />

                <Text>Defense Dice</Text>
                <Slider
                    defaultValue={[0, 9]}
                    onChange={handleChangeDefenseDice}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={9}
                />

                <Text>Points</Text>
                <Slider
                    defaultValue={[0, 300]}
                    onChange={handleChangePoints}
                    valueLabelDisplay="auto"
                    step={5}
                    min={0}
                    max={400}
                />

                <Text>Range</Text>
                <Slider
                    defaultValue={[0, 10]}
                    onChange={handleChangeRange}
                    valueLabelDisplay="auto"
                    step={1}
                    min={0}
                    marks
                    max={10}
                />

                <Text>Move</Text>
                <Slider
                    defaultValue={[0, 8]}
                    onChange={handleChangeMove}
                    valueLabelDisplay="auto"
                    step={1}
                    min={0}
                    marks
                    max={8}
                />

                <Text>Life</Text>
                <Slider
                    defaultValue={[0, 8]}
                    onChange={handleChangeLife}
                    valueLabelDisplay="auto"
                    step={1}
                    min={1}
                    marks
                    max={10}
                />

                <Text>Height</Text>
                <Slider
                    defaultValue={[2, 17]}
                    onChange={handleChangeHeight}
                    valueLabelDisplay="auto"
                    step={1}
                    min={2}
                    marks
                    max={17}
                />
            </Box>

            <Grid.Container gap={2} justify="flex-start">
                {chars
                    .filter(
                        (character) =>
                            character.num_attack_dice >= filterAttackDice[0] &&
                            character.num_attack_dice <= filterAttackDice[1] &&
                            character.num_defense_dice >=
                                filterDefenseDice[0] &&
                            character.num_defense_dice <=
                                filterDefenseDice[1] &&
                            character.pts >= filterPoints[0] &&
                            character.pts <= filterPoints[1] &&
                            character.range >= filterRange[0] &&
                            character.range <= filterRange[1] &&
                            character.move >= filterMove[0] &&
                            character.move <= filterMove[1] &&
                            character.life >= filterLife[0] &&
                            character.life <= filterLife[1] &&
                            character.height >= filterHeight[0] &&
                            character.height <= filterHeight[1]

                        // character.num_defense_dice < filterDefenseDicea
                    )
                    .map((item, index) => (
                        <Grid xs={6} sm={3} key={index}>
                            <Card
                                isPressable
                                isHoverable
                                onPress={handler.bind(this, item)}
                            >
                                <Card.Body css={{ p: 0 }}>
                                    <Card.Image
                                        src={item.image_address}
                                        objectFit="cover"
                                        width={500}
                                        height="100%"
                                        alt={item.name}
                                    />
                                </Card.Body>
                                <Card.Footer
                                    css={{ justifyItems: "flex-start" }}
                                >
                                    <Row
                                        wrap="wrap"
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Text b>{`${item.name}`}</Text>
                                        <Text
                                            css={{
                                                color: "$accents7",
                                                fontWeight: "$semibold",
                                                fontSize: "$sm",
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Grid>
                    ))}
            </Grid.Container>
        </div>
    );
};
