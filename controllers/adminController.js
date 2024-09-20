const User = require("../models/User");
const Mahasiswa = require("../models/mahasiswa");
const Dosen = require("../models/dosen");

exports.dashboard = async (req, res) => {
  res.render("admin/dashboard");
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const detailedUsers = await Promise.all(
      users.map(async (user) => {
        let detailedUser = { ...user._doc };
        if (user.role === "mahasiswa") {
          const mahasiswa = await Mahasiswa.findOne({ NIM: user.username });
          if (mahasiswa) {
            detailedUser.namaLengkap = mahasiswa.namaLengkap;
          }
        } else if (user.role === "dosen") {
          const dosen = await Dosen.findOne({ NIP: user.username });
          if (dosen) {
            detailedUser.namaLengkap = dosen.namaLengkap;
          }
        }
        return detailedUser;
      })
    );
    res.render("admin/userList", { users: detailedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.addUser = async (req, res) => {
  const { username, namaLengkap, password, role } = req.body;
  try {
    const newUser = new User({ username, namaLengkap, password, role });
    await newUser.save();

    if (role === "mahasiswa") {
      const newMahasiswa = new Mahasiswa({ NIM: username, namaLengkap });
      await newMahasiswa.save();
    } else if (role === "dosen") {
      const newDosen = new Dosen({ NIP: username, namaLengkap });
      await newDosen.save();
    }

    res.redirect("/admin/user");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.editUser = async (req, res) => {
  const { username, namaLengkap, role } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, {
      username,
      namaLengkap,
      role,
    });

    if (role === "mahasiswa") {
      await Mahasiswa.findOneAndUpdate(
        { NIM: username },
        { namaLengkap },
        { upsert: true }
      );
    } else if (role === "dosen") {
      await Dosen.findOneAndUpdate(
        { NIP: username },
        { namaLengkap },
        { upsert: true }
      );
    }

    res.redirect("/admin/user");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.role === "mahasiswa") {
      await Mahasiswa.findOneAndDelete({ NIM: user.username });
    } else if (user.role === "dosen") {
      await Dosen.findOneAndDelete({ NIP: user.username });
    }

    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/user");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
