const { knex } = require("../db.js");
const { Model } = require("objection");
const { Character } = require("../models/Character.js");
Model.knex(knex);

knex.select("*")
    .from("characters")
    .where("name", "like", "Al%")
    .then((data) => {
        console.log(data);
    });

// const { Pool } = require("pg");
// const conn = new Pool({
//     connectionString:
//         "jdbc:postgresql://heroscape.cawzoprjs77s.us-east-2.rds.amazonaws.com:5432/heroscape",
// });

// async function listUsers(req, res) {
//     try {
//         const db = await conn.connect();
//         const result = await db.query("SELECT * FROM users");
//         // const results = { users: result ? result.rows : null };
//         // res.render("pages/index", results);
//         db.release();
//     } catch (err) {
//         console.error(err);
//         // res.send("Error " + err);
//     }
// }

// console.log(listUsers());

// async function allCharacters() {
//     Character.query("SELECT * FROM characters").then((data) => {
//         return data;
//     });
// }

// console.log(allCharacters());

// export { allCharacters };
