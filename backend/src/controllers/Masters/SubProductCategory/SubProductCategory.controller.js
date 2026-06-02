const { default: mongoose } = require("mongoose");
const SubProductCategoryModel = require("../../../models/Masters/SubProductCategory/SubProductCategory.model");

const getSubProductCategoryController = async (req, res) => {
  try {
    const Id = req.user.adminId || req.user.staffId; // From middleware
    const { companyId } = req.query;
    // if (!Id) {
    //   return res
    //     .status(401)
    //     .json({ status: "false", message: "Unauthorized: Admin ID missing" });
    // }
    // log
    console.log("Admin ID from token:", Id);

    const subCategories = await SubProductCategoryModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    }).sort({ createdAt: -1 }); // Descending

    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({
        status: "false",
        message: "No sub product categories found",
      });
    }

    // new product add first
    // subCategories.sort((a, b) => {
    //   if (a.createdAt > b.createdAt) return -1;
    //   return 0;
    // });

    res.status(200).json({ status: "true", data: subCategories });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching sub product categories", error.message],
    });
  }
};

const getSubProductCategoryByProduct = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { productName } = req.params;
    // console.log("inside sub product ", productName);

    const subCategories = await SubProductCategoryModel.find({
      // companyId: new mongoose.Types.ObjectId(companyId),
      productName: productName,
    });
    // .sort({ createdAt: -1 }); // Descending

    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({
        status: "false",
        message: "No sub product categories found",
      });
    }

    // new product add first
    // subCategories.sort((a, b) => {
    //   if (a.createdAt > b.createdAt) return -1;
    //   return 0;
    // });

    res.status(200).json({ status: "true", data: subCategories });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching sub product categories", error.message],
    });
  }
};

const postSubProductCategoryController = async (req, res) => {
  try {
    const { productName, subProductName } = req.body;
    const Id = req.user.adminId || req.user.staffId;
    const { companyId } = req.query;
    if (!productName || !subProductName) {
      return res.status(400).json({
        status: "false",
        message: "Both productName and subProductName are required",
      });
    }

    const newSubCategory = new SubProductCategoryModel({
      productName,
      companyId,
      subProductName,
      createdBy: Id,
    });

    await newSubCategory.save();
    res.status(201).json({ status: "true", data: newSubCategory });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating sub product category", error.message],
    });
  }
};

const putSubProductCategoryController = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const Id = req.user.adminId || req.user.staffId;

    console.log("Admin ID from token:", Id);

    if (!Id) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: Admin ID missing from token",
      });
    }

    const updatedSubCategory = await SubProductCategoryModel.findOneAndUpdate(
      { _id: id, createdBy: Id }, // ✅ proper filter
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedSubCategory) {
      return res.status(404).json({
        status: "false",
        message: "Sub product category not found",
      });
    }

    res.status(200).json({ status: "true", data: updatedSubCategory });
  } catch (error) {
    console.error("Update error:", error);

    res.status(500).json({
      status: "false",
      message: ["Error updating sub product category", error.message],
    });
  }
};

const deleteSubProductCategoryController = async (req, res) => {
  try {
    const id = req.params.id;
    const Id = req.user.adminId || req.user.staffId;

    if (!Id) {
      return res.status(401).json({
        status: "false",
        message: "Unauthorized: Admin ID missing from token",
      });
    }

    const deletedSubCategory = await SubProductCategoryModel.findOneAndDelete({
      _id: id,
      createdBy: Id, // ✅ secure delete only own data
    });

    if (!deletedSubCategory) {
      return res.status(404).json({
        status: "false",
        message: "Sub product category not found",
      });
    }

    res.status(200).json({
      status: "true",
      message: "Sub product category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting sub product category", error.message],
    });
  }
};

module.exports = {
  getSubProductCategoryController,
  getSubProductCategoryByProduct,
  postSubProductCategoryController,
  putSubProductCategoryController,
  deleteSubProductCategoryController,
};
