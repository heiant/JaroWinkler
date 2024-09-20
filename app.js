const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
const rootDir = require("./utils/path");
const { ensureAuthenticated } = require("./middleware/auth");
// const tugasRoutes = require("./routes/tugasRoutes");

const User = require("./models/User");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(rootDir, "public")));
// Middleware untuk parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware untuk parsing application/json
app.use(express.json());

app.use(
  "/css",
  express.static(path.join(rootDir, "node_modules", "bootstrap", "dist", "css"))
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.locals.baseURL = "http://localhost:3000/";

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

require("./config/passport")(passport);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
// routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/dosen"));
app.use("/", require("./routes/mahasiswa"));
app.use("/", require("./routes/admin"));
// Redirect based on role
app.get("/", ensureAuthenticated, (req, res) => {
  // Tambahkan ensureAuthenticated
  if (req.user.role === "dosen") {
    return res.redirect("/dosen/dashboard");
  } else if (req.user.role === "mahasiswa") {
    return res.redirect("/mahasiswa/dashboard");
  } else if (req.user.role === "admin") {
    return res.redirect("/admin/dashboard");
  }
});

//app.use("/", tugasRoutes);

app.get("/newUser", (req, res) => {
  const user = new User({
    username: "admin1",
    password: "admin1",
    role: "admin",
  });
  user.save();
  res.send("User created");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
