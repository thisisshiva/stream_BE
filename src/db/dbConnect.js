const mongoose = require('mongoose');
const { DB_NAME } = require('../constant');



const dbConnect = async() => {
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    }catch(err){
        console.log("ERROR"+err);
    }
}
module.exports = dbConnect;