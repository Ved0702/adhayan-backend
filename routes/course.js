const express=require("express");
const Course=require("../models/courseModel");
const authMiddleware=require("../routes/middleware/authMiddleware");
const User=require("../models/userModel");
const courseRouter=express();
const mongoose=require("mongoose");
courseRouter.get("/popularCourse", async (req, res) => {
    try {
        const popularCourses = await Course.find({})
            .sort({ rating: -1 }) // Sort courses by rating in descending order
            .limit(10); // Limit the results to 10 courses

        res.status(200).json(popularCourses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

courseRouter.get("/category/:categoryType", async (req, res) => {
    try {
        const { categoryType } = req.params;

        const courses = await Course.find({ category: categoryType });

        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this category." });
        }

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
courseRouter.post("/saveCourse", authMiddleware, async (req, res) => {
    try {
        const userId = req.user; // Assuming authMiddleware adds the user ID to req.user
        const { courseId } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the course is already saved
        const isCourseSaved = user.savedCourses.some(
            (savedCourse) => savedCourse.courseId.toString() === courseId
        );

        if (isCourseSaved) {
            return res.status(400).json({ message: "Course is already saved" });
        }

        // Add the course to the savedCourses array
        user.savedCourses.push({ courseId });
        await user.save();

        res.status(200).json({ message: "Course saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
courseRouter.post("/unsaveCourse", authMiddleware, async (req, res) => {
    try {
        const userId = req.user; // Assuming authMiddleware adds the user ID to req.user
        const { courseId } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the course is saved
        const isCourseSaved = user.savedCourses.some(
            (savedCourse) => savedCourse.courseId.toString() === courseId
        );

        // if (!isCourseSaved) {
        //     return res.status(400).json({ message: "Course is not saved" });
        // }

        // Remove the course from the savedCourses array
        user.savedCourses = user.savedCourses.filter(
            (savedCourse) => savedCourse.courseId.toString() !== courseId
        );

        await user.save();

        res.status(200).json({ message: "Course removed from saved courses" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
courseRouter.get("/search/:searchText",async(req,res)=>{
    try {
        const searchText=req.params.searchText;
     
        if(!searchText ||searchText.length==0){
            return res.status(400).json({error:"Enter Text to Search"});
        }

        const course = await Course.find({
            $or: [
              { title: { $regex: searchText, $options: "i" } },   // Search in title
              { description: { $regex: searchText, $options: "i" } },  // Search in decription 
              { category: { $regex: searchText, $options: "i" } },   // Search in category
              { instructor: { $regex: searchText, $options: "i" } }, //search in instructor
            ],
        }); 
          res.status(200).json(course);
        
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

courseRouter.get("/getCourseDetail",async(req,res)=>{
    try {
        console.log("INSIDE COURSE DETAIL");
        const courseId=req.header("courseId");
        console.log(courseId);
        const course=await Course.findById(courseId);
        return res.status(200).json(course);
        
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }
});
courseRouter.post("/enrollCourse", authMiddleware, async (req, res) => {
    try {
      console.log("Inside enroll");
      
      // Get the userId from the auth middleware and courseId from the request headers
      const userId = req.user; 
      const courseId = req.header("courseId");
      
      // Fetch the user from the database
      const user = await User.findById(userId);
      
      // Check if the user is already enrolled in the course
      const isAlreadyEnrolled = user.enrolledCourses.some(
        (course) => course.courseId.toString() === courseId
      );
      
      if (isAlreadyEnrolled) {
        return res.status(400).json({ message: "User is already enrolled in this course." });
      }
      
      // Add the course to the enrolledCourses array
      user.enrolledCourses.push({ courseId });
      
      // Save the updated user document
      await user.save();
      
      return res.status(200).json({ message: "User successfully enrolled in the course." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  courseRouter.get("/isEnrolled",authMiddleware,async(req,res)=>{
    try {
        console.log("check enroll");
        const userId=req.user;
        const courseId=req.header("courseId");
        const isAlreadyEnrolled = user.enrolledCourses.some(
            (course) => course.courseId.toString() === courseId
          );
          return res.status(200).json(isAlreadyEnrolled);
    } catch (error) {
        console.log(error);
        res.status(500).json(false);
        
    }

  });
  courseRouter.patch('/updateCompletedLesson', authMiddleware,async (req, res) => {
    const { courseId, completedLessonNo } = req.body;
    const userId = req.user; // Assuming user ID is attached to req.user
  
    try {
        console.log("inside complete lesson");
      const user = await User.findOne({ _id: userId, 'enrolledCourses.courseId': courseId });
  
      if (!user) {
        return res.status(404).send('User or course not found');
      }
  
      const enrolledCourse = await user.enrolledCourses.find(enrolled => enrolled.courseId.toString() === courseId);
      
      if (enrolledCourse) {
        enrolledCourse.completedLessonNo = completedLessonNo;
        await user.save();
        return res.status(200).send('Completed lesson number updated');
      } else {
        return res.status(404).send('Enrolled course not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  courseRouter.post("/addCourse", authMiddleware, async (req, res) => {
    try {
        // Extracting the course details from the request body
        console.log("inside add course");
        const {
            title,
            description,
            price,
            thumbnailUrl,
            category,
            lessons,
        } = req.body;

        // Validate that required fields are provided
        if (!title || !description || !price || !category) {
            return res.status(400).json({ message: "Missing required fields." });
        }
        const user=await User.findById(req.user);
        const instructor=user.firstName;
        user.userType="Mentor";
        if(user.lastName){
            instructor=instructor+user.lastName;
        }
        console.log(instructor);
        // Create a new course instance
        const newCourse = new Course({
            title,
            description,
            instructor,
            price,
            thumbnailUrl,
            category,
            lessons,
        });

        // Save the new course to the database
        const savedCourse = await newCourse.save();

        // Return success response with the saved course
        res.status(200).json(savedCourse);
    } catch (error) {
        // Return error response if something goes wrong
        res.status(500).json({ error: error.message });
    }
});
module.exports=courseRouter;