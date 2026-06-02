const RouteModel = require("../../../models/Masters/medicine/route.model");

// Create Route
exports.createRoute = async (req, res) => {
  try {
    const { routeName } = req.body;
    const newRoute = new RouteModel({ routeName });
    const savedRoute = await newRoute.save();
    res.status(201).json({ success: true, data: savedRoute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Routes (excluding deleted ones)
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await RouteModel.find({ delete: false });
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Route
exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRoute = await RouteModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedRoute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Route
exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoute = await RouteModel.findByIdAndUpdate(
      id,
      { delete: true, deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ success: true, data: deletedRoute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkImport = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Invalid or empty data provided" });
    }

    // Insert data into MongoDB
    await RouteModel.insertMany(req.body);

    return res
      .status(201)
      .json({ message: "Data imported successfully", data: newData });
  } catch (error) {
    console.error("Error importing data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};