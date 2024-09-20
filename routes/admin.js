const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { ensureAuthenticated, isAdmin } = require("../middleware/auth");

router.get(
  "/admin/dashboard",
  ensureAuthenticated,
  isAdmin,
  adminController.dashboard
);
router.get(
  "/admin/user",
  ensureAuthenticated,
  isAdmin,
  adminController.getUsers
);
router.post(
  "/admin/user/add",
  ensureAuthenticated,
  isAdmin,
  adminController.addUser
);
router.post(
  "/admin/user/edit/:id",
  ensureAuthenticated,
  isAdmin,
  adminController.editUser
);
router.post(
  "/admin/user/delete/:id",
  ensureAuthenticated,
  isAdmin,
  adminController.deleteUser
);

module.exports = router;
