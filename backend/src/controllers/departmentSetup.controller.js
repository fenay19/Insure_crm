const { DepartmentSetupModel } = require('../models')
const departmentSetupValidations = require('../validations/departmentSetup.validation')
const httpStatus = require('http-status')
const DepartmentType = require('../models/departmentType.modal')

const createDepartment = async (req, res) => {
  try {
    const deletes = false
    const { departmentName } = req.body
    const existingDept = await DepartmentSetupModel.findOne({
      departmentName: departmentName,
      delete: deletes
    })
    if (existingDept) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: `${departmentName} Department already exists!!` })
    }
    const department = new DepartmentSetupModel(req.body)
    await department.save()
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Department Created', data: department })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentSetupModel.find({ delete: false })
    res.status(httpStatus.OK).json({ data: departments })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const getDepartmentById = async (req, res) => {
  const { id } = req.params
  try {
    const department = await DepartmentSetupModel.findById(id)
    if (!department || department.delete === true) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Department not found' })
    }
    res.status(httpStatus.OK).json({ data: department })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updateDepartment = async (req, res) => {
  const { id } = req.params
  try {
    const { departmentName } = req.body
    const deletes = false

    const existingDept = await DepartmentSetupModel.findOne({
      departmentName,
      delete: deletes
    })

    if (existingDept && existingDept._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'Department already exists!!' })
    }

    const department = await DepartmentSetupModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true
      }
    )

    if (!department) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Department not found!!' })
    }
    res
      .status(httpStatus.OK)
      .json({ msg: 'Department Updated!!', data: department })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const deleteDepartment = async (req, res) => {
  const { id } = req.params
  try {
    const department = await DepartmentSetupModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now() }
    )
    if (!department) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Department not found' })
    }
    res
      .status(httpStatus.OK)
      .json({ msg: 'Department Deleted!!', data: department })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const generateDepartmentCode = async (req, res) => {
  try {
    const latestRecord = await DepartmentSetupModel.findOne()
      .sort({ _id: -1 }) 
      .exec()

    let newDepartmentCode


    if (latestRecord && latestRecord.departmentCode) {
      const incrementedCode = parseInt(latestRecord.departmentCode, 10)

      newDepartmentCode = incrementedCode.toString().padStart(6, '0')
    } else {
      newDepartmentCode = '000001'
    }

    res.status(200).json({ newDepartmentCode })
  } catch (error) {
    res.status(500).json({ message: 'Error generating department code', error })
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

    const result = await DepartmentSetupModel.insertMany(processedData)

    res.status(200).json({
      status: true,
      message: 'Data inserted successfully',
      data: result
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: false,
      message: 'Error inserting data',
      error: error.message
    })
  }
}

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  generateDepartmentCode,
  bulkImport
}
