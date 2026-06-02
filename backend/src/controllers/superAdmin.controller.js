const { SuperAdminModel } = require("../models/index");

const { generateToken } = require("../utils/handleToken");

const {
  registerValidation,
  loginValidation,
} = require("../validations/superAdmin.validations");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { Consultant, AdminModel, Administrative } = require("../models");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  const domain = email.split("@")[1];
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

const register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error)
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: error.details[0].message });

  const email = req.body.email;
  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ msg: "Invalid email format" });
  }

  const emailExists = await SuperAdminModel.findOne({ email: req.body.email });
  if (emailExists) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ msg: "Super admin already exists" });
  }

  const admin = new SuperAdminModel({
    name: req.body.name, 
    email: req.body.email,
    password: req.body.password,
    role: "super-admin",
  });

  try {
    const savedAdmin = await admin.save();
    res.status(httpStatus.CREATED).json({
      msg: "Super-Admin registered successfully!!!",
      superAdmin: savedAdmin,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }

  const admin = await SuperAdminModel.findOne({ email: req.body.email });

  const results = await Promise.allSettled([
    Consultant.findOne({
      "basicDetails.email":req.body.email ,
    }),
    Administrative.findOne({
      "basicDetails.email":req.body.email ,
    }),
  ]);
  if (!admin) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ msg: "Email or password is incorrect" });
  }

  if (admin.password !== req.body.password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ msg: "Email or password is incorrect" });
  }

  // payload
  const adminDetails = {
    name: admin.name,
    email: admin.email,
    role: admin.role,
  }
  // generate token
  const token = generateToken(adminDetails);

  // const token = jwt.sign({ _id: admin._id }, process.env.secret_key);

  // save to cookies
  res.cookie("token", token);
 
  // set to header
  res.setHeader("Authorization", `Bearer ${token}`);

  if (!token) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error generating token" });
  }

  

  res.status(httpStatus.OK).json({
    msg: `Welcome ${admin.name}`,
    token: token,
    userId: admin._id,
    Email: admin.email,
    role: admin.role,
  });
};

const getSuperAdmin = async (req, res) => {
  try {
    const superadmins = await SuperAdminModel.find();

    if (!superadmins || superadmins.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No super admins found" });
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "Super admins retrieved successfully",
      data: superadmins,
    });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving subadmins" });
  }
};

const updateSuperAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { id } = req.params;

    const updateSubAdmin = await SuperAdminModel.findByIdAndUpdate(
      { _id: id },
      { name, email, password, role },
      { new: true }
    );
    res.status(httpStatus.OK).json({data : updateSubAdmin});
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const deleteSuperAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const subadmin = await SuperAdminModel.findByIdAndDelete({ _id: id });
    if (!subadmin) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Super Admin not found" });
    }
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Super Admin deleted successfully" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting super Admin" });
  }
};

module.exports = {
  register,
  login,
  getSuperAdmin,
  deleteSuperAdmin,
  updateSuperAdmin,
};
