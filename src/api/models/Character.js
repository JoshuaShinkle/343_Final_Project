const { Model } = require("objection");

class Character extends Model {
    static get tableName() {
        return "characters";
    }

    static get idColumn() {
        return "id";
    }

    //     fullName() {
    //         return this.firstName + ' ' + this.lastName;
    //     }
}

module.exports = Character;
