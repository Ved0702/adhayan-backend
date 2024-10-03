const express=require("express");
const authRoutes=express.Router();
const User=require("../models/userModel");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const authMiddleWare=require("./middleware/authMiddleware");
authRoutes.post("/signup", async (req, res) => {
    try {
      const { firstName, lastName, email, password,phone} = req.body;
  
      if (!firstName || !email || !password) {
        return res.status(400).json({ error: "Please fill all required fields" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (existingUser.isVerified) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        if (!existingUser.isVerified) {
            // Delete the existing unverified user
            await existingUser.deleteOne();
        }
    }
  
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
      });

      await newUser.save();
  
      res.status(200).json({ message: "User created successfully", user: newUser });

    } catch (error) {
      console.log(error.message);
    
      res.status(500).json({ error: error.message });
    }
  });
  authRoutes.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password" });
      }
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      if (user.isVerified==false) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      if(user.isGoogleLogin) return res.status(400).json({error:"Login with Google to Continue"});
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
  
      const token = jwt.sign({ userId: user._id }, 'jwtPassword', { expiresIn: '1h' });
  
      res.status(200).json({
        token,
        ...user._doc,
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  authRoutes.post("/isTokenValid",async(req,res)=>{
        try {
            console.log("Inside TokenValid");
            const token=req.header("x-auth-token");
            console.log(token);
            if(!token) return res.json(false);
            const verified=jwt.verify(token,"jwtPassword");
            if(!verified) return res.json(false);
            const user=await User.findById(verified.userId);
            if(!user) return res.json(false);
            return res.json(true);
        
    } catch (error) {
        res.status(400).json({error:error.message});
        
    }
  });
  authRoutes.get("/getData",authMiddleWare,async(req,res)=>{
    try {
      console.log("getdata");
        const userId=req.user;
        const user=await User.findById(userId);
        if(!user) return res.status(400).json({error:"No User Found"});
        console.log(req.token);
        res.status(200).json({...user._doc,token:req.token});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});
authRoutes.post("/google-signin", async (req, res) => {
  try {
    const { email, firstName, lastName, profileImageUrl } = req.body;
    console.log(firstName);
    console.log(profileImageUrl);

    let user = await User.findOne({ email });

    if (user) {
      // If the user exists but was not a Google login, update the isGoogleLogin field
      if (!user.isGoogleLogin) {
        user.isGoogleLogin = true;
        user.isVerified=true;
        await user.save();
      }
    } else {
      // If the user doesn't exist, create a new user with Google information
      user = new User({
        email,
        firstName,
        lastName,
        profileImageUrl,
        isGoogleLogin: true,
        isVerified: true, // Assume Google-verified email is trusted
      });
      await user.save();
    }

    // Generate JWT token for the user
    const token = jwt.sign({ userId: user._id }, "jwtPassword", { expiresIn: '1h' });

    res.status(200).json({ ...user._doc,token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
authRoutes.post('/resetPass', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    console.log('changessss');
    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
authRoutes.post("/uploadPic",authMiddleWare,async(req,res)=>{
  try {
    console.log("inside upload");
    const userId=req.user;
    const {photoUrl}=req.body;
    if(photoUrl==null || photoUrl.length==0){
      return res.status(400).json({error:"Image URL is required"});
    }
    const user=await User.findById(userId);

    user.profileImageUrl=photoUrl;
    await user.save();
    res.status(200).json({message:"Profile Photo Updated Successfully"});

    
  } catch (error) {
    res.status(500).json({error:error.message});
    
  }
});
authRoutes.post("/updatePhone", authMiddleWare, async (req, res) => {
  try {
    // Extract the phone number from the request body
    const { phoneNum } = req.body;

    // Validate the phone number
    if (!phoneNum) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Find the user by ID from the token
    const userId = req.user; // Assuming authMiddleWare sets req.user with user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

  
    user.phone = phoneNum;
    await user.save();

    // Send a success response
    res.status(200).json({ message: "Phone number updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
  module.exports = authRoutes;