// models/Course.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  courseName: {
    type: String,
    required: true,
  },
  dosen_nip: {
    type: String,
    required: true,
  },
  mahasiswaId: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Courses", CourseSchema);
