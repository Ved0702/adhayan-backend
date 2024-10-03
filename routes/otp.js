const express = require("express");
var randomize = require("randomatic");
const otpRoutes = express.Router();
const sendMail = require("../mailer/mailer");
const OTP = require("../models/otpModel");
const User = require("../models/userModel");

function generateOTP(length = 6) {
    return randomize('0', length);
}

otpRoutes.post("/getOtp", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        // const existingUser = await User.findOne({ email: email });
        // if (existingUser) return res.status(400).json({ error: "User already exists" });
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User with this Email Not Found!!"});
        }

        const existingOtp = await OTP.findOne({ email: email });
        if (existingOtp) await OTP.deleteOne({ email: email });

        const otp = generateOTP();
        const htmlMessage = `
            <div style="width: 100%; padding: 20px; box-sizing: border-box; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333; text-align: center;">Welcome to Adhyayan</h1>
                    <p style="font-size: 16px; color: #555; text-align: center;">Dear User,</p>
                    <p style="font-size: 16px; color: #555; text-align: center;">Thank you for signing up with Adhyayan. Your account has been created successfully.</p>
                    <p style="font-size: 16px; color: #555; text-align: center;">Please use the following OTP to verify your email address:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <h2 style="font-size: 36px; color: #e74c3c; margin: 0;">${otp}</h2>
                    </div>
                    <p style="font-size: 16px; color: #555; text-align: center;">This OTP is valid for 10 minutes.</p>
                    <p style="font-size: 14px; color: #777; text-align: center;">If you did not request this, please ignore this email.</p>
                    <p style="font-size: 16px; color: #555; text-align: center;">Best regards,<br/>Adhyayan Team</p>
                </div>
            </div>
        `;


        const newOtp = new OTP({
            otp,
            email,
        });

        await newOtp.save();
        console.log(otp);
         await sendMail(email, "Welcome to Adhyayan ,Your Account Has Been Successfully Created", htmlMessage);
        res.status(200).json({ msg: "Email Sent Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
 

otpRoutes.post("/verifyOtp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

        const existingOtp = await OTP.findOne({ email: email });
        if (!existingOtp) return res.status(404).json({ error: "OTP not found or already used" });

        if (existingOtp.expiresAt < Date.now()) {
            await OTP.deleteOne({ email: email });
            return res.status(400).json({ error: "OTP expired" });
        }

        if (existingOtp.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

        const user = await User.findOne({ email });
        user.isVerified=true;
    
        await user.save();

        await OTP.deleteOne({ email: email });
        console.log(otp);
        res.status(200).json({ msg: "Successfully Verified and User Created" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = otpRoutes;
