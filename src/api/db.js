const knex = require("knex")({
    client: "pg",
    connection: {
        host: "roller.cse.taylor.edu",
        // port: 5432,
        user: "heroscape",
        password: "heroscape",
        database: "heroscape",
    },
});

module.exports = { knex };
