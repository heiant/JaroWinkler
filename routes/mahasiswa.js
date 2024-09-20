const express = require("express");
const router = express.Router();
const mahasiswaController = require("../controllers/mahasiswaController");
const { ensureAuthenticated } = require("../middleware/auth");

router.get(
  "/mahasiswa/dashboard",
  ensureAuthenticated,
  mahasiswaController.getDashboard
);
// Routes untuk Course
router.get(
  "/mahasiswa/course",
  ensureAuthenticated,
  mahasiswaController.getCourses
);
router.post(
  "/mahasiswa/course/join",
  ensureAuthenticated,
  mahasiswaController.joinCourse
);
// Route untuk melihat detail kelas dan upload tugas
router.get(
  "/mahasiswa/course/:id",
  ensureAuthenticated,
  mahasiswaController.getCourseDetail
);
router.post(
  "/mahasiswa/course/:id/upload",
  ensureAuthenticated,
  mahasiswaController.uploadTugas
);

// Rute untuk membatalkan kelas
router.post(
  "/mahasiswa/course/cancel",
  ensureAuthenticated,
  mahasiswaController.cancelCourse
);
// Rute untuk mengedit tugas
router.post(
  "/mahasiswa/course/edit/:id",
  ensureAuthenticated,
  mahasiswaController.editTugas
);
module.exports = router;
