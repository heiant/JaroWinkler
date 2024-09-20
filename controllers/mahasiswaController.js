const Tugas = require("../models/tugas");
const Course = require("../models/course");
const Dosen = require("../models/dosen");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.cancelCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const mahasiswaId = req.user._id;

    await Course.updateOne(
      { _id: courseId },
      { $pull: { mahasiswaId: mahasiswaId } }
    );

    res.redirect("/mahasiswa/course");
  } catch (err) {
    console.error("Error in cancelCourse:", err);
    res.status(500).send("Server Error");
  }
};

// Buat direktori 'uploads' jika belum ada
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("file");
exports.getDashboard = (req, res) => {
  res.render("mahasiswa/dashboard", {
    user: req.user,
  });
};

exports.getCourseDetail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const userTugas = await Tugas.findOne({
      courseId: req.params.id,
      mahasiswaId: req.user._id,
    });
    // const tugasList = await Tugas.find({ courseId: req.params.id });

    res.render("mahasiswa/courseDetail", {
      course,
      userTugas,
      // tugasList,
      user: req.user,
      success_msg: req.flash("success_msg"),
    });
    console.log(userTugas);
  } catch (err) {
    console.error("Error in getCourseDetail:", err);
    res.status(500).send("Server Error");
  }
};

exports.uploadTugas = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error in multer upload:", err);
      return res.status(500).send("Server Error");
    }
    try {
      const { judul, deskripsi } = req.body;
      const filePath = req.file.path;
      const courseId = req.params.id;
      const mahasiswaId = req.user._id;
      const newTugas = new Tugas({
        judul,
        deskripsi,
        tugas: filePath,
        mahasiswa: req.user.username,
        courseId,
        mahasiswaId,
      });
      await newTugas.save();
      req.flash("success_msg", "Tugas berhasil diupload");
      res.redirect(`/mahasiswa/course/${req.params.id}`);
    } catch (err) {
      console.error("Error in uploadTugas:", err);
      res.status(500).send("Server Error");
    }
  });
};

exports.editTugas = async (req, res) => {
  try {
    const { judulEdit, deskripsiEdit } = req.body;
    console.log(judulEdit, deskripsiEdit);
    const tugasId = req.params.id;
    console.log(tugasId);
    const filePath = req.file ? req.file.path : undefined;
    const updateData = { judul: judulEdit, deskripsi: deskripsiEdit };

    if (filePath) {
      updateData.tugas = filePath;
    }

    const tugas = await Tugas.findByIdAndUpdate(tugasId, updateData, {
      new: true,
    });

    if (!tugas) {
      return res.status(404).send("Tugas not found");
    }
  } catch (err) {
    console.error("Error in editTugas:", err);
    res.status(500).send("Server Error");
  }
  res.redirect(`/mahasiswa/course`);
};

// Get Courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    const detailedCourses = await Promise.all(
      courses.map(async (course) => {
        let detailedCourses = { ...course._doc };
        const dosen = await Dosen.findOne({ NIP: course.dosen_nip });
        detailedCourses.namaLengkap = dosen.namaLengkap;
        return detailedCourses;
      })
    );
    res.render("mahasiswa/courseList", {
      courses: detailedCourses,
      user: req.user,
    });
  } catch (err) {
    res.status(500).send("Server Error");
    console.error("Error in getCourses:", err);
  }
};

// Join Course
exports.joinCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course.mahasiswaId.includes(req.user._id)) {
      course.mahasiswaId.push(req.user._id);
      await course.save();
    }
    req.flash("success_msg", "Berhasil bergabung dengan kelas");
    res.redirect("/mahasiswa/course");
  } catch (err) {
    console.error("Error in joinCourse:", err);
    res.status(500).send("Server Error");
  }
};
