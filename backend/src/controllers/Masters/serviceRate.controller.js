const AddServiceRate = require("../../models/Masters/serviceRate.model"); 

const createServiceRate = async (req, res) => {
  try {
    const data = req.body;
    const serviceRate = new AddServiceRate(data);

    const savedServiceRate = await serviceRate.save();
    res.status(201).json({ message: "Service rate created successfully", data: savedServiceRate });
  } catch (error) {
    res.status(500).json({ message: "Failed to create service rate", error: error.message });
  }
};

const getAllServiceRates = async (req, res) => {
  try {
    const serviceRates = await AddServiceRate.find();
    res.status(200).json({ message: "Service rates fetched successfully", data: serviceRates });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service rates", error: error.message });
  }
};

const getServiceRateById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceRate = await AddServiceRate.findById(id);

    if (!serviceRate) {
      return res.status(404).json({ message: "Service rate not found" });
    }

    res.status(200).json({ message: "Service rate fetched successfully", data: serviceRate });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service rate", error: error.message });
  }
};

const updateServiceRate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedServiceRate = await AddServiceRate.findByIdAndUpdate(id, updatedData, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedServiceRate) {
      return res.status(404).json({ message: "Service rate not found" });
    }

    res.status(200).json({ message: "Service rate updated successfully", data: updatedServiceRate });
  } catch (error) {
    res.status(500).json({ message: "Failed to update service rate", error: error.message });
  }
};

const deleteServiceRate = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedServiceRate = await AddServiceRate.findByIdAndDelete(id);

    if (!deletedServiceRate) {
      return res.status(404).json({ message: "Service rate not found" });
    }

    res.status(200).json({ message: "Service rate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service rate", error: error.message });
  }
};

const bulkImport = async (req, res) => {
    try {  
        const serviceRate = req.body;
        const result = await AddServiceRate.insertMany(serviceRate);
        res.status(httpStatus.CREATED).json({ msg: "service Rate successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
  createServiceRate,
  getAllServiceRates,
  getServiceRateById,
  updateServiceRate,
  deleteServiceRate,
  bulkImport
};
