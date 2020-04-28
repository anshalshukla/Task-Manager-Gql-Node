const {gql} = require("apollo-server-express");

const userTypeDef = require("./users");
const taskTypeDef = require("./tasks");

const typeDefs = gql`
    scalar Date
    type Query{
        _:String
    }
    type Mutation{
        _:String
    }
    type Subscription{
        _:String
    }
`;

module.exports = [
    typeDefs,
    userTypeDef,
    taskTypeDef
]