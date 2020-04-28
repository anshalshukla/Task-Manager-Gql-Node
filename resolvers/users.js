const User = require("../database/models/user")
const Task = require("../database/models/task")
const {combineResolvers} = require("graphql-resolvers")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {isAuthenticated} = require("./middleware")
const PubSub = require("../subscriptions")
const {userEvents} = require("../subscriptions/events")

module.exports = {
    Query:{
        user: combineResolvers(isAuthenticated,async (_,__,{email}) => {
            try{
                const user = await User.findOne({email})
                if(!user){
                    throw new Error("User not found!")
                }
                return user;
            }catch(e){
                console.log(e)
                throw e
            }
    })
    },
    Mutation:{
        signup:async (_,{input}) => {
            try{
                const user = await User.findOne({email:input.email});
                if(user){
                    throw new Error("Email already registered!");
                }
                const hashedPassword = await bcrypt.hash(input.password,12);
                const newUser = new User({...input, password:hashedPassword})
                const result = await newUser.save();
                PubSub.publish(userEvents.USER_CREATED,{
                    userCreated: result
                })
                return result;
            }catch(e){
                console.log(e);
                throw e;
            }
        },
        login:async (_,{input}) => {
            try{
                const user = await User.findOne({email:input.email});
                if (!user){
                    throw new Error("Email not registered!");
                }
                const isPasswordValid = await bcrypt.compare(input.password,user.password)
                if(!isPasswordValid){
                    throw new Error("Invalid Password!")
                }
                const secret = process.env.JWT_SECRET_KEY || "NotSoSecretKey"
                const token = jwt.sign({email:user.email},secret,{expiresIn:"1h"})
                return{token}

            }catch(e){
                console.log(e);
                throw e;
            }
        }
    },
    Subscription:{
        userCreated:{
           subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
        }
    },
    User:{
        tasks:async ({id}) =>{
            try{
                const tasks = await Task.find({user:id})
                return tasks
            }catch(e){
                console.log(e)
                throw e
            }
        }
    }
}