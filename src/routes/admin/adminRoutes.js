const express = require("express");
const {
    createAdmin,
    loginAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    blockUnblockAdmin,
} = require("../../controllers/admin/adminController");

const router = express.Router();

// Auth
router.post("/register", createAdmin);
router.post("/login", loginAdmin);

// CRUD
router.get("/", getAdmins);
router.get("/:id", getAdminById);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
// PUT /api/admins/:id/block
router.put("/:id/block", blockUnblockAdmin);

module.exports = router;
