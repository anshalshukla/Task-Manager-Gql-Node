const {GraphQLDateTime} = require("graphql-iso-date");

const userResolver = require("./users");
const taskResolver = require("./tasks");

const customDateTimeScalarResolver = {
    Date: GraphQLDateTime
}

module.exports = [
    userResolver,
    taskResolver,
    customDateTimeScalarResolver
]