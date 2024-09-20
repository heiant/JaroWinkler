const Tugas = require("../models/tugas");
const fs = require("fs-extra");
const path = require("path");
const Course = require("../models/course");
const { exec } = require("child_process");
const { extractTextFromFile } = require("../utils/textExtractor");

const jaroWinkler = require("jaro-winkler");

exports.getDashboard = (req, res) => {
  res.render("dosen/dashboard");
};
exports.getCourseTugas = async (req, res) => {
  try {
    const courseId = req.params.id;
    const tugasList = await Tugas.find({ courseId });
    res.render("dosen/courseTugasList", {
      tugasList,
      courseId,
      user: req.user,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Get Task Detail from Course
exports.getTugasDetailFromCourse = async (req, res) => {
  try {
    const { courseId, tugasId } = req.params;
    const tugas = await Tugas.findById(tugasId);
    const tugasList = await Tugas.find({ _id: { $ne: tugasId }, courseId });
    res.render("dosen/tugasDetail", {
      tugas,
      tugasList,
      courseId,
      user: req.user,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
exports.compareTugas = async (req, res) => {
  try {
    console.log(req.params.id1, req.params.id2);
    console.log("ID1:", req.body.id1);
    console.log("ID2:", req.body.id2);

    const tugas1 = await Tugas.findById(req.body.id1);
    const tugas2 = await Tugas.findById(req.body.id2);
    console.log("Tugas1:", tugas1);
    console.log("Tugas2:", tugas2);

    if (!tugas1 || !tugas2) {
      console.error("One or both tugas not found");
      console.log(tugas1, tugas2);
      return res.status(404).send("One or both tugas not found");
    }

    const text1 = await extractTextFromFile(tugas1.tugas);
    const text2 = await extractTextFromFile(tugas2.tugas);

    const similarity = jaroWinkler(text1, text2) * 100;

    res.render("dosen/compareResult", {
      tugas1,
      tugas2,
      similarity,
      user: req.user,
    });
  } catch (err) {
    console.error("Error in compareTugas:", err);
    res.status(500).send("Server Error");
  }
};

// Helper function to extract RAR files using shell command

// Helper function to read JS and HTML files from a directory
async function readFiles(directory) {
  const files = await fs.readdir(directory);
  const contents = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileExt = path.extname(file);

    if (fileExt === ".js" || fileExt === ".html") {
      const content = await fs.readFile(filePath, "utf-8");
      contents.push(content);
    }
  }

  return contents;
}

// Get Courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ dosen_nip: req.user.username });
    res.render("dosen/courseList", {
      courses,
      user: req.user,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Get Create Course Form
exports.getCreateCourseForm = (req, res) => {
  res.render("dosen/createCourse", {
    user: req.user,
  });
};

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { courseName } = req.body;
    const newCourse = new Course({
      courseName,
      dosen_nip: req.user.username,
    });
    await newCourse.save();
    req.flash("success_msg", "Kelas berhasil dibuat");
    res.redirect("/dosen/course");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Get Students in Course
exports.getCourseStudents = async (req, res) => {
  try {
    const courseId = req.params.id;
    const tugasList = await Tugas.find({ courseId });
    res.render("dosen/courseTugasList", {
      tugasList,
      courseId,
      user: req.user,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
