const express = require("express");
const {ApolloServer,gql} = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");
const Dataloader = require("dataloader");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const { connection } =require("./database/util")
const {verifyUser} = require("./helper/context")
const loaders = require("./loaders")

//Setup Environment Variables 
dotEnv.config();

const app = express();

//db connectivity
connection();  

//cors
app.use(cors());

//body parser middleware
app.use(express.json());

const PORT = process.env.PORT || 3000;

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req,connection}) => {
        const contextObj = []
        if(req){
            await verifyUser(req, )
            contextObj.email = req.email;
            contextObj.loggedInUserId = req.loggedInUserId;
        }
        contextObj.loaders = {
                user: new Dataloader(keys => loaders.user.batchUsers(keys))
        };
        return contextObj;    
    },
    formatError: (error) => {
        return {
            message:error.message
        }
    }
})

apolloServer.applyMiddleware({app, path:"/graphql"});

app.use('/',(req,res,next)=>{
    res.send({message:"Hello"})
});

const httpServer = app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
    console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer);