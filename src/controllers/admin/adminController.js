const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin");

// Helper: generate JWT
const generateToken = (admin) => {
    return jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// ✅ Create Admin
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body;

        // check duplicates
        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingMobile = await Admin.findOne({ mobile });
        if (existingMobile) {
            return res.status(400).json({ message: "Mobile number already exists" });
        }

        const admin = new Admin({ name, email, mobile, password, role });
        await admin.save();

        res.status(201).json({
            message: "Admin created successfully",
            admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Login Admin
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(admin);

        res.json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get all admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-password");
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get single admin
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const { name, email, mobile, password, role, blocked } = req.body;

        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (name) admin.name = name;
        if (email) admin.email = email;
        if (mobile) admin.mobile = mobile;
        if (role) admin.role = role;
        if (typeof blocked === "boolean") admin.blocked = blocked;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
        }

        await admin.save();

        res.json({
            message: "Admin updated successfully",
            admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, blocked: admin.blocked },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Block / Unblock Admin
exports.blockUnblockAdmin = async (req, res) => {
    try {
        const { blocked } = req.body; // expects true or false

        if (typeof blocked !== "boolean") {
            return res.status(400).json({ message: "Blocked must be true or false" });
        }

        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        admin.blocked = blocked;
        await admin.save();

        res.json({
            message: `Admin has been ${blocked ? "blocked" : "unblocked"} successfully`,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                blocked: admin.blocked,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ✅ Delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
