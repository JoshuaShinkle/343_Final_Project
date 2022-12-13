import React, { useEffect, useState } from "react";
import { allCharacters } from "../api/objects/allCharacters";
import { firstBy } from "thenby";
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
    Modal,
    Image,
    Container,
} from "@nextui-org/react";
import axios from "axios";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import { Col } from "react-bootstrap";
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
    const [filterPoints, setFilterPoints] = useState([0, 370]);
    const [filterRange, setFilterRange] = useState([0, 10]);
    const [filterMove, setFilterMove] = useState([0, 10]);
    const [filterLife, setFilterLife] = useState([0, 9]);
    const [filterHeight, setFilterHeight] = useState([2, 17]);
    const [searchValue, setSearchValue] = useState("");
    const [visible, setVisible] = useState(false);
    const [modalItem, setModalItem] = useState({});

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
        setVisible(true);
        setModalItem(item);
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

    const resetInputs = () => {
        setFilterAttackDice([1, 8]);
        setFilterDefenseDice([0, 9]);
        setFilterPoints([0, 370]);
        setFilterRange([0, 10]);
        setFilterMove([0, 10]);
        setFilterLife([0, 9]);
        setFilterHeight([2, 17]);
        setSearchValue("");
    };

    const closeHandler = () => {
        setVisible(false);
    };

    const isValidCharacter = (character) => {
        return (
            character.num_attack_dice >= filterAttackDice[0] &&
            character.num_attack_dice <= filterAttackDice[1] &&
            character.num_defense_dice >= filterDefenseDice[0] &&
            character.num_defense_dice <= filterDefenseDice[1] &&
            character.pts >= filterPoints[0] &&
            character.pts <= filterPoints[1] &&
            character.range >= filterRange[0] &&
            character.range <= filterRange[1] &&
            character.move >= filterMove[0] &&
            character.move <= filterMove[1] &&
            character.life >= filterLife[0] &&
            character.life <= filterLife[1] &&
            character.height >= filterHeight[0] &&
            character.height <= filterHeight[1] &&
            character.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    };

    return (
        <div>
            <Grid.Container gap={1} justify="center">
                <Grid>
                    <Text>Attack Dice</Text>
                    <Slider
                        value={filterAttackDice}
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
                        value={filterDefenseDice}
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
                        value={filterPoints}
                        defaultValue={[0, 370]}
                        onChange={handleChangePoints}
                        valueLabelDisplay="auto"
                        step={5}
                        min={0}
                        max={370}
                    />

                    <Text>Range</Text>
                    <Slider
                        value={filterRange}
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
                        value={filterMove}
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
                        value={filterLife}
                        defaultValue={[0, 9]}
                        onChange={handleChangeLife}
                        valueLabelDisplay="auto"
                        step={1}
                        min={1}
                        marks
                        max={9}
                    />

                    <Text>Height</Text>
                    <Slider
                        value={filterHeight}
                        defaultValue={[2, 17]}
                        onChange={handleChangeHeight}
                        valueLabelDisplay="auto"
                        step={1}
                        min={2}
                        marks
                        max={17}
                    />
                    <TextField
                        value={searchValue}
                        id="outlined-basic"
                        label="Search"
                        variant="outlined"
                        onChange={(event) => {
                            console.log(event.target.value);
                            setSearchValue(event.target.value);
                        }}
                    />
                    <Spacer y={1} />
                    <Button onPress={resetInputs}>
                        Reset search constraints
                    </Button>
                    <Text>
                        {
                            chars.filter((character) =>
                                isValidCharacter(character)
                            ).length
                        }{" "}
                        results
                    </Text>
                </Grid>
                <Grid lg={10}>
                    <Grid.Container gap={2} justify="flex-start">
                        {chars
                            .filter((character) => isValidCharacter(character))
                            // .sort(
                            //     (a, b) => b.num_attack_dice - a.num_attack_dice
                            // )
                            .map((item, index) => (
                                <Grid xs={6} sm={4} md={4} lg={3} key={index}>
                                    <Card
                                        css={{
                                            mw: "500px",
                                            mh: "350px",
                                        }}
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
                </Grid>
            </Grid.Container>
            <Modal
                width="700px"
                closeButton
                blur
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text h5 size={30}>
                        {modalItem.name}
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Image
                        width={600}
                        height={600}
                        src={modalItem.image_address}
                        alt="Default Image"
                        objectFit="cover"
                    />
                    <Container gap={0}></Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={closeHandler}> Close </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
