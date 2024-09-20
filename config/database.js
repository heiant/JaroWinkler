const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://Heiant:1234anto@similarityCheck.gvq22dr.mongodb.net/similarityCheck?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = mongoose;
