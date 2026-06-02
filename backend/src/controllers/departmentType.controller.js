const DepartmentType = require('../models/departmentType.modal')
const httpStatus = require('http-status')

// Create a new Department Type
const createDepartmentType = async (req, res) => {
  try {
    const { departmentTypeName } = req.body
    if (!departmentTypeName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Please provide departmentTypeName' })
    }

    const departmentTypeExists = await DepartmentType.findOne({
      departmentTypeName,
      delete: false
    })
    if (departmentTypeExists) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'Department Type already exists' })
    }

    const departmentType = new DepartmentType(req.body)
    await departmentType.save()
    res.status(httpStatus.CREATED).json({
      data: departmentType,
      message: 'Department Type created successfully'
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Get all Department Types
const getDepartmentTypes = async (req, res) => {
  try {
    const departmentTypes = await DepartmentType.find({ delete: false })

    res.status(httpStatus.OK).json({ data: departmentTypes })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Update Department Type by ID
const updateDepartment = async (req, res) => {
  try {
    const { departmentTypeName } = req.body
    if (!departmentTypeName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Please provide departmentTypeName' })
    }

    // Check if the department type name already exists (excluding current one)
    const departmentTypeExists = await DepartmentType.findOne({
      departmentTypeName,
      _id: { $ne: req.params.id }
    })
    if (departmentTypeExists) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'Department Type already exists' })
    }

    const departmentType = await DepartmentType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!departmentType) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Department Type not found' })
    }
    res.status(httpStatus.OK).json({
      data: departmentType,
      message: 'Department Type updated successfully'
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Soft Delete Department Type by ID
const deleteDepartmentType = async (req, res) => {
  try {
    const departmentType = await DepartmentType.findByIdAndUpdate(
      req.params.id,
      { delete: true },
      { new: true }
    )
    if (!departmentType) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Department Type not found' })
    }
    res.status(httpStatus.OK).json({
      data: departmentType,
      message: 'Department Type deleted successfully'
    })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const bulkImport = async (req, res) => {
  try {
    const { processedData } = req.body

    if (!Array.isArray(processedData) || processedData.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: 'Invalid data provided.' })
    }

    const departmentNames = processedData.map(
      department => department.departmentTypeName
    )

    const existingDepartments = await DepartmentType.find({
      departmentTypeName: { $in: departmentNames }
    })

    if (existingDepartments.length > 0) {
      const existingDepartmentNames = existingDepartments.map(
        dep => dep.departmentTypeName
      )
      return res.status(400).json({
        status: false,
        message: 'Some department names already exist.',
        existingDepartments: existingDepartmentNames
      })
    }

    const result = await DepartmentType.insertMany(processedData)

    res.status(200).json({
      status: true,
      message: 'Data inserted successfully',
      data: result
    })
  } catch (error) {
    console.error(error)
    // Return error response
    res
      .status(500)
      .json({ status : false, message: 'Error inserting data', error: error.message })
  }
}

module.exports = {
  createDepartmentType,
  getDepartmentTypes,
  updateDepartment,
  deleteDepartmentType,
  bulkImport
}
