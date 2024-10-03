const mongoose=require("mongoose");
require("dotenv").config();

const MONGO_URL=process.env.MONGO_URL;
const connectDB = async () => {
    mongoose.connect(MONGO_URL).then(() => {
        console.log("Database Connected");
    }).catch((e) => {

        console.log(e);
    });
}

module.exports = connectDB;