const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    enrolledCount: {
        type: Number,
        default: 0,
    },
    thumbnailUrl: {
        type: String,
    },
    category: {
        type: String,
        enum: ['Design', 'Code', 'Business', 'Data', 'Finance'],
        required: true,
    },
    lessons: [lessonSchema],
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
