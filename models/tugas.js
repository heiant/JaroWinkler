const mongoose = require("../config/database");

const Schema = mongoose.Schema;

const TugasSchema = new Schema({
  judul: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String,
    required: true,
  },
  mahasiswa: {
    type: String,
    required: true,
  },
  tugas: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  mahasiswaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("tugas", TugasSchema);
