const mongoose = require("mongoose");

const dosenSchema = new mongoose.Schema({
  NIP: { type: String, required: true, unique: true },
  namaLengkap: { type: String, required: true },
});

module.exports = mongoose.model("dosen", dosenSchema);
