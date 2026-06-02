const holidayTypeModel = require("../../../models/Masters/HolidayType/HolidayType.model");

// ✅ Create Holiday Type
const createHolidayType = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { holidayTypeName, color } = req.body;

    if (!companyId || !holidayTypeName) {
      return res.status(400).json({
        success: false,
        message: "companyId and holidayTypeName are required",
      });
    }

    const newHolidayType = new holidayTypeModel({
      companyId,
      holidayTypeName,
      color: color || "#1976d2", // default if not provided
    });

    await newHolidayType.save();

    res.status(201).json({
      success: true,
      message: "Holiday Type created successfully",
      data: newHolidayType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Holiday Type",
      error: error.message,
    });
  }
};

// ✅ Get all Holiday Types
const getHolidayTypes = async (req, res) => {
  try {
    const { companyId } = req.query;
    const filter = companyId ? { companyId } : {};

    const holidayTypes = await holidayTypeModel
      .find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: holidayTypes });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Holiday Types",
      error: error.message,
    });
  }
};

// ✅ Get single Holiday Type by ID
const getHolidayTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const holidayType = await holidayTypeModel.findById(id);

    if (!holidayType) {
      return res.status(404).json({
        success: false,
        message: "Holiday Type not found",
      });
    }

    res.status(200).json({ success: true, data: holidayType });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Holiday Type",
      error: error.message,
    });
  }
};

// ✅ Update Holiday Type (name or color)
const updateHolidayType = async (req, res) => {
  try {
    const { id } = req.params;
    const { holidayTypeName, color } = req.body;

    const updatedHolidayType = await holidayTypeModel.findByIdAndUpdate(
      id,
      { holidayTypeName, color },
      { new: true }
    );

    if (!updatedHolidayType) {
      return res.status(404).json({
        success: false,
        message: "Holiday Type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday Type updated successfully",
      data: updatedHolidayType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Holiday Type",
      error: error.message,
    });
  }
};

// ✅ Delete Holiday Type
const deleteHolidayType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHolidayType = await holidayTypeModel.findByIdAndDelete(id);

    if (!deletedHolidayType) {
      return res.status(404).json({
        success: false,
        message: "Holiday Type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday Type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting Holiday Type",
      error: error.message,
    });
  }
};

module.exports = {
  createHolidayType,
  getHolidayTypes,
  getHolidayTypeById,
  updateHolidayType,
  deleteHolidayType,
};

// const holidayTypeModel = require("../../../models/Masters/HolidayType/HolidayType.model");

// // Create Holiday Type
// const createHolidayType = async (req, res) => {
//   try {
//     const { companyId } = req.query;
//     const { holidayTypeName } = req.body;

//     console.log(companyId, holidayTypeName);

//     if (!companyId || !holidayTypeName) {
//       return res.status(400).json({
//         success: false,
//         message: "companyId and holidayTypeName are required",
//       });
//     }

//     const newHolidayType = new holidayTypeModel({
//       companyId,
//       holidayTypeName,
//     });

//     await newHolidayType.save();
//     res.status(201).json({
//       success: true,
//       message: "Holiday Type created successfully",
//       data: newHolidayType,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating Holiday Type",
//       error: error.message,
//     });
//   }
// };

// // Get all Holiday Types
// const getHolidayTypes = async (req, res) => {
//   try {
//     const { companyId } = req.query;
//     const filter = companyId ? { companyId } : {};

//     const holidayTypes = await holidayTypeModel
//       .find(filter)
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: holidayTypes });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching Holiday Types",
//       error: error.message,
//     });
//   }
// };

// // Get single Holiday Type by ID
// const getHolidayTypeById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const holidayType = await holidayTypeModel.findById(id);

//     if (!holidayType) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Holiday Type not found" });
//     }

//     res.status(200).json({ success: true, data: holidayType });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching Holiday Type",
//       error: error.message,
//     });
//   }
// };

// // Update Holiday Type
// const updateHolidayType = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { holidayTypeName } = req.body;

//     const updatedHolidayType = await holidayTypeModel.findByIdAndUpdate(
//       id,
//       { holidayTypeName },
//       { new: true }
//     );

//     if (!updatedHolidayType) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Holiday Type not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Holiday Type updated successfully",
//       data: updatedHolidayType,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating Holiday Type",
//       error: error.message,
//     });
//   }
// };

// // Delete Holiday Type
// const deleteHolidayType = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedHolidayType = await holidayTypeModel.findByIdAndDelete(id);

//     if (!deletedHolidayType) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Holiday Type not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Holiday Type deleted successfully" });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting Holiday Type",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   createHolidayType,
//   getHolidayTypes,
//   getHolidayTypeById,
//   updateHolidayType,
//   deleteHolidayType,
// };
