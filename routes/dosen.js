const express = require("express");
const router = express.Router();
const dosenController = require("../controllers/dosenController");
const { ensureAuthenticated } = require("../middleware/auth");

router.get(
  "/dosen/dashboard",
  ensureAuthenticated,
  dosenController.getDashboard
);
// Routes untuk Tugas
// Route untuk mendapatkan tugas mahasiswa dalam suatu kelas
router.get(
  "/dosen/course/:id/tugas",
  ensureAuthenticated,
  dosenController.getCourseTugas
);
router.get(
  "/dosen/course/:courseId/tugas/:tugasId",
  ensureAuthenticated,
  dosenController.getTugasDetailFromCourse
);
router.post(
  "/dosen/tugas/compare",
  ensureAuthenticated,
  dosenController.compareTugas
);

// Routes untuk Course
router.get("/dosen/course", ensureAuthenticated, dosenController.getCourses);
router.post("/dosen/course", ensureAuthenticated, dosenController.createCourse);
router.get(
  "/dosen/course/:id/students",
  ensureAuthenticated,
  dosenController.getCourseStudents
);
router.get(
  "/dosen/course/new",
  ensureAuthenticated,
  dosenController.getCreateCourseForm
);

module.exports = router;
