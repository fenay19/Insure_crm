const {
  OutsourceDiagnosticsModel,
  DepartmentSetupModel
} = require('../../models')
const { validationResult } = require('express-validator')
const httpStatus = require('http-status')

const createOutsourceDiagnostic = async (req, res) => {
  try {
    const { labName, address, contact, departmentId, addOtherLab } = req.body

    const existingLab = await OutsourceDiagnosticsModel.findOne({
      labName,
      delete: false
    })

    if (existingLab) {
      return res.status(400).json({ error: 'Lab Name already exists' })
    }

    const newLab = new OutsourceDiagnosticsModel({
      labName,
      address,
      contact,
      departmentId,
      addOtherLab
    })

    const savedLab = await newLab.save()

    return res
      .status(201)
      .json({ msg: 'Lab added successfully', lab: savedLab })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
}

const getAllOutsourceDiagnostic = async (req, res) => {
  try {
    const outsourceDiagnostics = await OutsourceDiagnosticsModel.find({
      delete: false
    })
      .populate('departmentId')
      .populate('addOtherLab.departmentId')

    res.status(200).json({ data: outsourceDiagnostics })
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

const getOutsourceDiagnosticById = async (req, res) => {
  try {
    const { id } = req.params
    const outsourceDiagnostic = await OutsourceDiagnosticsModel.findById({
      _id: id
    })
    if (!outsourceDiagnostic) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Outsource Diagnostic not found' })
    }
    res.status(httpStatus.OK).json({ data: outsourceDiagnostic })
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

const updateOutsourceDiagnosticById = async (req, res) => {
    try {
      const { id } = req.params; 
      const { labName, address, contact, departmentId, addOtherLab } = req.body;
  
      const existingLab = await OutsourceDiagnosticsModel.findOne({
        labName,
        delete: false,
        _id: { $ne: id }  // Ensure we're not checking the current lab's name
      });
  
      if (existingLab) {
        return res.status(400).json({ error: 'Lab Name already exists' });
      }
  
      const updatedLab = await OutsourceDiagnosticsModel.findByIdAndUpdate(
        id,
        { labName, address, contact, departmentId, addOtherLab }, 
        { new: true } 
      );
  
      if (!updatedLab) {
        return res.status(404).json({ error: 'Outsource Diagnostic not found' });
      }
  
      return res.status(200).json({ msg: 'Outsource Diagnostic updated successfully', lab: updatedLab });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

const deleteOutsourceDiagnosticById = async (req, res) => {
  try {
    const { id } = req.params
    const deletedOutsourceDiagnostic =
      await OutsourceDiagnosticsModel.findByIdAndUpdate(
        { _id: id },
        { ...req.body, delete: true, deletedAt: Date.now() }
      )
    if (!deletedOutsourceDiagnostic) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Outsource Diagnostic not found' })
    }
    res.status(httpStatus.OK).json({ msg: 'Outsource Diagnostic Deleted!!' })
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

// parameters functionality start here

const addParamOutsourceDiagnosticById = async (req, res) => {
  try {
    const { id } = req.params
    const { parameters } = req.body

    if (!Array.isArray(parameters)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Parameters should be an array' })
    }

    const updatedOutsourceDiagnostic =
      await OutsourceDiagnosticsModel.findByIdAndUpdate(
        id,
        { $push: { parameters: { $each: parameters } } },
        { new: true }
      )

    if (!updatedOutsourceDiagnostic) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Outsource Diagnostic not found' })
    }
    res.status(httpStatus.OK).json({
      msg: 'Outsource Diagnostic updated!!',
      data: updatedOutsourceDiagnostic
    })
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

const updateParamOutsourceDiagnosticById = async (req, res) => {
  try {
    const { id, paramId } = req.params
    const updatedOutsourceDiagnostic =
      await OutsourceDiagnosticsModel.findOneAndUpdate(
        { _id: id, 'parameters._id': paramId },
        { $set: { 'parameters.$': { _id: paramId, ...req.body } } },
        { new: true }
      )
    if (!updatedOutsourceDiagnostic) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Outsource Diagnostic not found' })
    }
    res.status(httpStatus.OK).json({
      msg: 'Outsource Diagnostic updated!!',
      data: updatedOutsourceDiagnostic
    })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

const deleteParamOutsourceDiagnosticById = async (req, res) => {
  try {
    const { id, paramId } = req.params
    const updatedOutsourceDiagnostic =
      await OutsourceDiagnosticsModel.findOneAndUpdate(
        { _id: id, 'parameters._id': paramId },
        { $pull: { parameters: { _id: paramId } } },
        { new: true }
      )
    if (!updatedOutsourceDiagnostic) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Outsource Diagnostic not found' })
    }
    res.status(httpStatus.OK).json({
      msg: 'Outsource Diagnostic updated!!',
      data: updatedOutsourceDiagnostic
    })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' })
  }
}

const bulkImport = async (req, res) => {
  try {
    const outsourceDiagnostic = req.body

    const departments = await DepartmentSetupModel.find({ delete: false })

    outsourceDiagnostic.forEach(diagnostic => {
      const departmentNames = diagnostic.departmentId
        .split(',')
        .map(name => name.trim())

      diagnostic.departmentId = departmentNames
        .map(name => {
          const department = departments.find(
            dept => dept.departmentName === name
          )
          return department ? department._id : null
        })
        .filter(Boolean)
    })

    console.log(outsourceDiagnostic)
    const result = await OutsourceDiagnosticsModel.insertMany(
      outsourceDiagnostic
    )
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Outsource Diagnostics added!!', data: result })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

module.exports = {
  createOutsourceDiagnostic,
  getAllOutsourceDiagnostic,
  getOutsourceDiagnosticById,
  updateOutsourceDiagnosticById,
  deleteOutsourceDiagnosticById,

  addParamOutsourceDiagnosticById,
  updateParamOutsourceDiagnosticById,
  deleteParamOutsourceDiagnosticById,
  bulkImport
}
