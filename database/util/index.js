const mongoose = require("mongoose");

module.exports.connection = async () => {
    try{
        mongoose.set("debug",true)
        await mongoose.connect(process.env.MONGO_DB_URL,{useNewUrlParser:true, useUnifiedTopology:true});
        console.log("Database Connected Successfully!")
    }
    catch(e){
        console.log(e);
        throw e;
    }
}
module.exports.isValidObjectId = async (id) =>{
    return mongoose.Types.ObjectId.isValid(id);
}