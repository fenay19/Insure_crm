const DepartmentSubType = require('../models/departmentSubType.model')
const httpStatus = require('http-status')

const createDepartmentSubType = async (req, res) => {
  try {
    const { departmentSubTypeName } = req.body
    if (!departmentSubTypeName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: 'Please provide department sub-type name' })
    }

    const departmentSubTypeExists = await DepartmentSubType.findOne({
      name: departmentSubTypeName
    })
    if (departmentSubTypeExists) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: 'Department sub-type already exists' })
    }

    const departmentSubType = new DepartmentSubType(req.body)
    await departmentSubType.save()
    res.status(httpStatus.CREATED).json({ data: departmentSubType })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

const getDepartmentSubTypes = async (req, res) => {
  try {
    const departmentSubTypes = await DepartmentSubType.find({
      delete: false
    }).populate('departmentTypeId')
    res.status(httpStatus.OK).json({ data: departmentSubTypes })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

// Update Department Sub-Type by ID
const updateDepartmentSubTypeById = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: 'Please provide data to update' })
    }

    const departmentSubTypeExists = await DepartmentSubType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!departmentSubTypeExists) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Department sub-type not found' })
    }

    res.status(httpStatus.OK).json({ data: departmentSubTypeExists })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

// Delete (Soft Delete) Department Sub-Type by ID
const deleteDepartmentSubTypeById = async (req, res) => {
  try {
    const departmentSubType = await DepartmentSubType.findByIdAndUpdate(
      req.params.id,
      { delete: true },
      { new: true }
    )
    if (!departmentSubType) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Department sub-type not found' })
    }

    res.status(httpStatus.OK).json({
      message: 'Department sub-type deleted successfully',
      data: departmentSubType
    })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
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
      department => department.departmentSubTypeName
    )

    const existingDepartments = await DepartmentSubType.find({
      departmentSubTypeName: { $in: departmentNames }
    })

    if (existingDepartments.length > 0) {
      const existingDepartmentNames = existingDepartments.map(
        dep => dep.departmentSubTypeName
      )
      return res.status(400).json({
        status: false,
        message: 'Some department names already exist.',
        existingDepartments: existingDepartmentNames
      })
    }

    const result = await DepartmentSubType.insertMany(processedData)

    res.status(200).json({
      status: true,
      message: 'Data inserted successfully',
      data: result
    })
  } catch (error) {
    console.error(error)
    // Return error response
    res.status(500).json({
      status: false,
      message: 'Error inserting data',
      error: error.message
    })
  }
}

module.exports = {
  createDepartmentSubType,
  getDepartmentSubTypes,
  updateDepartmentSubTypeById,
  deleteDepartmentSubTypeById,
  bulkImport
}
