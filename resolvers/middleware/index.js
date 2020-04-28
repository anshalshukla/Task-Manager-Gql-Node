const {skip} = require("graphql-resolvers");
const Task = require("../../database/models/task")
const {isValidObjectId} = require("../../database/util")

module.exports.isAuthenticated = (_, __, {email}) => {
    if(!email){
        throw new Error("Access Denied! Please log in to continue")
    }
    return skip;
}

module.exports.isTaskOwner = async(_,{id},{loggedInUserId}) =>{
    try{
        if(!isValidObjectId(id)){
            throw new Error("Invalid Task Id!")
        }
        const task = await Task.findById(id);
        if(!task){
            throw new Error("Task not found!")
        } else if(task.user.toString() != loggedInUserId){
            throw new Error("You cannot access other's task.")
        }
        return skip
    }catch(e){
        console.log(e)
        throw e
    }
    
}