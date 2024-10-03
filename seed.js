const mongoose = require('mongoose');
const Course = require("./models/courseModel");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:vedadmin@cluster0.rzt5n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  return seedDB(); // Seed data after connecting
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Seed Data
const seedCourses = [
  {
    "title": "Introduction to Graphic Design",
    "description": "Learn the basics of graphic design, including principles, tools, and techniques.",
    "instructor": "John Doe",
    "price": 490,
    "rating": 4.5,
    "enrolledCount": 1200,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1724362040/courseImage/nxwwl7tycp25ttqzoz6s.png",
    "category": "Design",
    "lessons": [
      {
        "title": "Design Principles",
        "content": "Understanding the core principles of design.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Introduction to Adobe Illustrator",
        "content": "Getting started with Adobe Illustrator and its tools.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Creating Vector Art",
        "content": "Techniques for creating stunning vector artwork.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "JavaScript for Beginners",
    "description": "An introduction to JavaScript, covering basic syntax, data types, and functions.",
    "instructor": "Jane Smith",
    "price": 390,
    "rating": 4.7,
    "enrolledCount": 950,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1726120330/unxg29ob7hd4lvoiddou.jpg",
    "category": "Code",
    "lessons": [
      {
        "title": "Introduction to JavaScript",
        "content": "Learn the basics of JavaScript and how it integrates with HTML.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "JavaScript Variables and Data Types",
        "content": "Understanding variables and different data types in JavaScript.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Control Structures in JavaScript",
        "content": "Learn about loops, conditionals, and other control structures in JavaScript.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Data Science with Python",
    "description": "An in-depth course on Data Science using Python, covering libraries like Pandas and NumPy.",
    "instructor": "Alice Johnson",
    "price": 590,
    "rating": 5.0,
    "enrolledCount": 1500,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1725913239/ayzohpebzkbecf2g2www.jpg",
    "category": "Data",
    "lessons": [
      {
        "title": "Introduction to Data Science",
        "content": "Overview of Data Science and its applications.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Python for Data Science",
        "content": "Using Python for data manipulation and analysis.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Working with Pandas and NumPy",
        "content": "Deep dive into data manipulation with Pandas and NumPy.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Data Visualization with Matplotlib",
        "content": "Techniques for visualizing data with Matplotlib.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Business Analytics",
    "description": "Learn the fundamentals of Business Analytics, focusing on data-driven decision making.",
    "instructor": "Michael Brown",
    "price": 690,
    "rating": 4.6,
    "enrolledCount": 1100,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1726120487/dbhsibmhcxqegbcau436.jpg",
    "category": "Business",
    "lessons": [
      {
        "title": "Introduction to Business Analytics",
        "content": "Understanding the role of analytics in business decision making.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Data Collection and Preparation",
        "content": "Techniques for collecting and preparing data for analysis.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Analytical Techniques",
        "content": "Exploring different analytical techniques and tools.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Financial Modeling",
    "description": "A course on financial modeling, teaching you how to build financial models from scratch.",
    "instructor": "Sara Davis",
    "price": 790,
    "rating": 4.6,
    "enrolledCount": 1300,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1725912257/ttlojmds3esazh7pfray.jpg",
    "category": "Finance",
    "lessons": [
      {
        "title": "Introduction to Financial Modeling",
        "content": "Overview of financial modeling and its importance.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Building Basic Financial Models",
        "content": "Step-by-step guide to building basic financial models.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Advanced Financial Modeling Techniques",
        "content": "Explore advanced techniques in financial modeling.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Advanced React and Redux",
    "description": "Master React and Redux with advanced concepts like middleware, async actions, and testing.",
    "instructor": "Chris Evans",
    "price": 790,
    "rating": 5.0,
    "enrolledCount": 2000,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1725912516/igt67vpiduztyiqdhjua.jpg",
    "category": "Code",
    "lessons": [
      {
        "title": "React Middleware",
        "content": "Understanding middleware in React applications.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Async Actions in Redux",
        "content": "Handling asynchronous actions with Redux.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Testing React Components",
        "content": "Best practices for testing React components.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Mastering SQL for Data Analysis",
    "description": "Become proficient in SQL for complex data analysis and manipulation.",
    "instructor": "Emma Watson",
    "price": 590,
    "rating": 4.8,
    "enrolledCount": 1800,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1726121120/i3jkumk19zhkwnlgornf.jpg",
    "category": "Data",
    "lessons": [
      {
        "title": "Advanced SQL Queries",
        "content": "Learn advanced SQL queries for data manipulation.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Optimizing SQL Performance",
        "content": "Techniques to optimize SQL query performance.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Working with Complex Joins",
        "content": "Mastering complex joins for multi-table data analysis.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Project Management Essentials",
    "description": "Learn the essentials of project management, including methodologies, tools, and techniques.",
    "instructor": "Tom Hiddleston",
    "price": 690,
    "rating": 4.7,
    "enrolledCount": 1500,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1726120991/fzni5d4l64x0jo7ezj3z.jpg",
    "category": "Business",
    "lessons": [
      {
        "title": "Project Planning",
        "content": "Strategies for effective project planning.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Risk Management",
        "content": "Identifying and managing project risks.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Project Execution and Monitoring",
        "content": "Best practices for project execution and monitoring.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Python for Machine Learning",
    "description": "Dive into machine learning with Python, exploring algorithms, libraries, and real-world applications.",
    "instructor": "Robert Downey Jr.",
    "price": 890,
    "rating": 4.9,
    "enrolledCount": 2200,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1725910785/leoslmeit1t7lwvdrohx.png",
    "category": "Data",
    "lessons": [
      {
        "title": "Introduction to Machine Learning",
        "content": "Understanding the basics of machine learning.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Supervised Learning",
        "content": "Exploring supervised learning algorithms.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Unsupervised Learning",
        "content": "Techniques and applications of unsupervised learning.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Web Development with Django",
    "description": "Learn how to build scalable web applications using Django, a popular Python framework.",
    "instructor": "Scarlett Johansson",
    "price": 790,
    "rating": 4.8,
    "enrolledCount": 1700,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1724362040/courseImage/nxwwl7tycp25ttqzoz6s.png",
    "category": "Code",
    "lessons": [
      {
        "title": "Getting Started with Django",
        "content": "Introduction to Django and setting up your environment.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Building Models in Django",
        "content": "Learn how to create and manage models in Django.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Creating Views and Templates",
        "content": "Learn how to create views and templates in Django.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
  {
    "title": "Digital Marketing Masterclass",
    "description": "Become an expert in digital marketing with this comprehensive masterclass.",
    "instructor": "Ryan Reynolds",
    "price": 690,
    "rating": 4.7,
    "enrolledCount": 2000,
    "thumbnailUrl": "https://res.cloudinary.com/dxa9xqx3t/image/upload/v1726119634/l1ebzxzj58gp0tvvk2fn.jpg",
    "category": "Business",
    "lessons": [
      {
        "title": "Introduction to Digital Marketing",
        "content": "Overview of digital marketing strategies and tools.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "SEO Strategies",
        "content": "Learn the best practices for search engine optimization.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      },
      {
        "title": "Content Marketing",
        "content": "Creating effective content marketing strategies.",
        "url": "https://res.cloudinary.com/dxa9xqx3t/video/upload/v1726121576/mjhbp6rbda89hbtpha6l.mp4"
      }
    ]
  },
];

// Insert Seed Data
const seedDB = async () => {
  try {
    await Course.deleteMany({}); // Clear existing data
    await Course.insertMany(seedCourses); // Insert new data
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    mongoose.connection.close(); // Close the connection after seeding
  }
};

seedDB();
