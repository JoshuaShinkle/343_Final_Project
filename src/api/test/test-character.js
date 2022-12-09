const { knex } = require("../db.js");
const { Model } = require("objection");
const { Character } = require("../models/Character.js");
const { allCharacters } = require("../objects/allCharacters.js");
Model.knex(knex);
async function testCharacter() {
    Model.knex(knex);
    return Character.query()
        .where("name", "like", "A%")
        .then((character) => {
            console.log(character);
        });
}

