//Require database credentials
const { knex } = require("./src/api/db.js");

const { Model } = require("objection");
Model.knex(knex);

const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");

//Load Model Classes
const Character = require("./src/api/models/Character.js");

const init = async () => {
    //Create a new Hapi server
    const server = Hapi.server({
        host: "localhost",
        port: 3000,
        routes: {
            cors: true,
        },
    });

    //Output endpoints at start up
    await server.register({
        plugin: require("blipp"),
        options: { showAuth: true },
    });

    //Log stuff
    await server.register({
        plugin: require("hapi-pino"),
    });

    server.route([
        //Base route
        {
            method: "GET",
            path: "/",
            options: {
                description: "Base path",
            },
            handler: (request, h) => "Hello, Hapi",
        },

        //Get all characters
        {
            method: "GET",
            path: "/characters",
            options: {
                description: "Get all of the characters",
            },
            handler: (request, h) => {
                return Character.query()
                    .select(
                        "name",
                        "image_address",
                        "num_attack_dice",
                        "num_defense_dice",
                        "pts",
                        "range",
                        "move",
                        "life",
                        "height",
                        "unit"
                    )
                    .then((data) => {
                        console.log(data);
                        return h.response(data).code(200);
                    })
                    .catch((err) => h.response(err).code(400));
            },
        },

        {
            method: "GET",
            path: "/orders",
            options: {
                description: "Used to display Barista View table",
            },
            handler: (request, h) => {
                return Order.query()
                    .where("status_id", "!=", 2)
                    .withGraphFetched("customer")
                    .then((data) => {
                        let result = [];
                        for (let i = 0; i < data.length; i++) {
                            result.push({
                                order_id: data[i]["order_id"],
                                firstName: data[i]["customer"]["firstName"],
                                status_id: data[i]["status_id"],
                                numDrinks: data[i]["numDrinks"],
                            });
                        }
                        return h.response(result).code(200);
                    })
                    .catch((err) => h.response(err).code(400));
            },
        },

        {
            method: "GET",
            path: "/order/{order_id}",
            options: {
                description: "Used to display Order View table",
            },
            handler: (request, h) => {
                return Order.query()
                    .withGraphFetched("drinks")
                    .withGraphFetched("ordered_drinks") // todo
                    .where("order_id", request.params.order_id)
                    .then((data) => {
                        let result = [];
                        for (let i = 0; i < data[0]["drinks"].length; i++) {
                            result.push({
                                ordered_drink_id:
                                    data[0]["ordered_drinks"][i]
                                        .ordered_drink_id,
                                name: data[0]["drinks"][i].name,
                                isReady: data[0]["ordered_drinks"][i].isReady,
                            });
                        }
                        return h.response(result).code(200);
                    })
                    .catch((err) => h.response(err).code(400));
            },
        },

        {
            method: "GET",
            path: "/drink-status",
            options: {
                description: "Used to display drink status in Order View table",
            },
            handler: (request, h) => {
                return Ordered_Drink.query()
                    .select("isReady")
                    .then((data) => h.response(data).code(200))
                    .catch((err) => h.response(err).code(400));
            },
        },

        //get all current drinks in the orders
        {
            method: "GET",
            path: "/orders/drinks",
            options: {
                description: "Get all current drinks",
            },
            handler: (request, h) => {
                return Order.query()
                    .select("order_id")
                    .withGraphFetched("drinks")
                    .then((data) => h.response(data).code(200))
                    .catch((err) => h.response(err).code(400));
            },
        },

        {
            method: "GET",
            path: "/drinks",
            options: {
                description: "Get all drinks on the menu",
            },
            handler: (request, h) => {
                return Drink.query().select("*").where("onMenu", "true");
            },
        },

        {
            method: "PATCH",
            path: "/toggleIsReady/{ordered_drink_id}",
            options: {
                description: "Toggle drink status",
            },
            handler: (request, h) => {
                return Ordered_Drink.query()
                    .update(request.payload)
                    .where("ordered_drink_id", request.params.ordered_drink_id)
                    .then(() => h.response().code(200))
                    .catch((err) => h.response(err).code(400));
            },
        },

        {
            method: "PATCH",
            path: "/order-status/{order_id}",
            options: {
                description: "Change order status",
            },
            handler: (request, h) => {
                return Order.query()
                    .update(request.payload)
                    .where("order_id", request.params.order_id)
                    .then((data) => h.response(data).code(200))
                    .catch((err) => h.response(err).code(400));
            },
        },

        {
            method: "POST",
            path: "/ordered_drink",
            config: {
                description: "Create a new ordered drink",
                validate: {
                    payload: Joi.object({
                        order_id: Joi.number().integer().min(1).required(),
                        drink_id: Joi.number().integer().min(1).required(),
                        barista_id: Joi.number().integer().min(1).required(),
                        isReady: Joi.required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const drink = await Ordered_Drink.query().insert(
                    request.payload
                );
                if (drink) {
                    return {
                        ok: true,
                        msge: "Drinks added",
                    };
                } else {
                    return {
                        ok: false,
                        msge: "Could not add drinks",
                    };
                }
            },
        },
        //Login
        {
            method: "POST",
            path: "/login",
            config: {
                description: "Log in",
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email().required(),
                        password: Joi.string().min(8).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const account = await Cashier.query()
                    .select("email", "cashier_id", "firstName", "lastName")
                    .where("email", request.payload.email)
                    .where("password", request.payload.password)
                    .first();
                if (
                    account !== null
                    // (await account.verifyPassword(request.payload.password))
                ) {
                    return {
                        ok: true,
                        msge: `Logged in successfully as '${request.payload.email}'`,
                        details: {
                            cashier_id: account.cashier_id,
                            firstName: account.firstName,
                            lastName: account.lastName,
                            email: account.email,
                        },
                    };
                } else {
                    return {
                        ok: false,
                        msge: "Invalid email or password",
                    };
                }
            },
        },

        //Create a new order
        {
            method: "POST",
            path: "/new-order",
            options: {
                description: "Create a new order",
                validate: {
                    payload: Joi.object({
                        numDrinks: Joi.number().integer().min(0).required(),
                        totalCost: Joi.number().min(1).required(),
                        customerEmail: Joi.string()
                            .min(2)
                            .max(40)
                            .email()
                            .required(),
                        cashier_id: Joi.number().min(1).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                if (request.payload.numDrinks == 0) {
                    return {
                        ok: false,
                        msge: "Must add at least one drink to the order.",
                    };
                }

                const existingCustomer = await Customer.query()
                    .select("customer_id")
                    .where("email", request.payload.customerEmail)
                    .first();

                if (!existingCustomer) {
                    return {
                        ok: false,
                        msge: `Account with email '${request.payload.customerEmail}' does not exist.`,
                        data: newOrder,
                    };
                }

                const newOrder = await Order.query()
                    .insert({
                        numDrinks: request.payload.numDrinks,
                        totalCost: request.payload.totalCost,
                        customer_id: existingCustomer.customer_id,
                        cashier_id: request.payload.cashier_id,
                    })
                    .catch((err) => console.log(err));
                if (newOrder) {
                    return {
                        ok: true,
                        msge: `Order created!`,
                        data: newOrder,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Something went wrong!`,
                        data: newOrder,
                    };
                }

                //Create a new order, but also create new drink_orders for each drink in the order
            },
        },

        //update an order

        //add a new drink to the database

        //remove a drink from the database

        // Delete an order
        {
            method: "DELETE",
            path: "/delete-order/{order_id}",
            config: {
                description: "Delete an order",
                // validate: { todo
                //     params: Joi.object({
                //         pid: Joi.number().integer().min(1).required(),
                //         vid: Joi.number().integer().min(1).required()
                //     })
                // }
            },
            handler: (request, h) =>
                Order.query()
                    .delete()
                    .where("order_id", request.params.order_id)
                    .then((result) => {
                        if (result) {
                            return {
                                ok: true,
                            };
                        }
                        return h.response().code(400);
                    })
                    .catch((err) => {
                        return h.response(err).code(400);
                    }), // todo this doesn't execute for some reason when there's no payload
        },

        //remove a drink from menu

        //Get customer emails
        {
            method: "GET",
            path: "/customer-emails",
            options: {
                description: "Get all customer emails",
            },
            handler: (request, h) => {
                return Customer.query().select("email");
            },
        },

        {
            method: "POST",
            path: "/drink",
            options: {
                description: "Add a new drink to the menu",
                validate: {
                    payload: Joi.object({
                        name: Joi.string().min(2).required(),
                        price: Joi.number().min(0).required(),
                        description: Joi.string(),
                    }),
                },
            },
            handler: async (request, h) => {
                const existingDrink = await Drink.query()
                    .where("name", request.payload.name)
                    .first();
                if (existingDrink) {
                    return {
                        ok: false,
                        msge: `Drink with name '${request.payload.name} already exists'`,
                    };
                }

                const newDrink = await Drink.query().insert({
                    name: request.payload.name,
                    price: request.payload.price,
                    onMenu: true,
                    description: request.payload.description,
                });

                if (newDrink) {
                    return {
                        ok: true,
                        msge: `Created drink '${request.payload.name}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create drink with name '${request.payload.name}'`,
                    };
                }
            },
        },

        //Create new customer
        {
            method: "POST",
            path: "/customer",
            options: {
                description: "Create a new customer",
            },
            handler: async (request, h) => {
                const existingAccount = await Customer.query()
                    .where("email", request.payload.email)
                    .first();
                if (existingAccount) {
                    return {
                        ok: false,
                        msge: `Customer with email '${request.payload.email}' is already known`,
                    };
                }

                const newAccount = await Customer.query().insert({
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    email: request.payload.email,
                });

                if (newAccount) {
                    return {
                        ok: true,
                        msge: `Created customer '${request.payload.email}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create customer with email '${request.payload.email}'`,
                    };
                }
            },
        },

        //Remove a customer

        //Update customer

        //Create a new cashier
        {
            method: "POST",
            path: "/cashier",
            options: {
                description: "Create a new cashier",
                // validate: {
                //     payload: Joi.object({
                //         firstName: Joi.string().min(2).max(40).required(),
                //         lastName: Joi.string().min(2).max(40).required(),
                //         email: Joi.string().min(2).max(40).email().required(), //fix
                //         password: Joi.string().min(2).max(40).required(), //fix
                //     }),
                // },
            },
            handler: async (request, h) => {
                // return Cashier.query()
                //     .insert(request.payload);
                const existingAccount = await Cashier.query()
                    .where("email", request.payload.email)
                    .first();
                if (existingAccount) {
                    return {
                        ok: false,
                        msge: `Account with email '${request.payload.email}' is already in use`,
                    };
                }

                const newAccount = await Cashier.query().insert({
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    email: request.payload.email,
                    password: request.payload.password,
                });

                if (newAccount) {
                    return {
                        ok: true,
                        msge: `Created cashier with email '${request.payload.email}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create cashier with email '${request.payload.email}'`,
                    };
                }
            },
        },

        //Delete a cashier
        {
            method: "DELETE",
            path: "/delete-cashier",
            config: {
                description: "Delete a cashier",
                // validate: { todo
                //     params: Joi.object({
                //         pid: Joi.number().integer().min(1).required(),
                //         vid: Joi.number().integer().min(1).required()
                //     })
                // }
            },
            handler: (request, h) =>
                Cashier.query()
                    .delete()
                    .where("cashier_id", request.payload.cashier_id)
                    .then((result) => {
                        if (result) {
                            return h.response().code(200);
                        }
                        return h.response().code(400);
                    })
                    .catch((err) => {
                        return h.response(err).code(400);
                    }), // todo this doesn't execute for some reason when there's no payload
        },
    ]);

    //Start the server
    await server.start();
};

// Catch promises lacking a .catch.
process.on("unhandledRejection", (err) => {
    console.error(err);
    process.exit(1);
});

// Go!
init();
