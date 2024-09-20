const mongoose = require("mongoose");

const mahasiswaSchema = new mongoose.Schema({
  NIM: { type: String, required: true, unique: true },
  namaLengkap: { type: String, required: true },
});

module.exports = mongoose.model("Mahasiswa", mahasiswaSchema);
