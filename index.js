const express=require("express");
const cors=require("cors");
const courseRoutes=require("./routes/course");
const app=express();
app.use(cors());
const connectDB=require("./db");
const authRoutes = require("./routes/auth");
const otpRoutes = require("./routes/otp");
require("dotenv").config();
const PORT=process.env.PORT;
connectDB();
app.use(express.json());

app.get("/",async(req,res)=>{
    res.json({"msg":"Hello World"});
});
app.use("/auth",authRoutes);
app.use("/course",courseRoutes);
app.use("/otp",otpRoutes);
app.listen(PORT,async(req,res)=>{
    console.log(`Listening on Port ${PORT}`);
});
module.exports = app;