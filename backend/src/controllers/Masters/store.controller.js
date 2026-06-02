const { validationResult } = require('express-validator')
const { ConsultantModel, EmployeeModel, AdminModel } = require('../../models')
const { StoreModel } = require('../../models')
const mongoose = require('mongoose')
const httpStatus = require('http-status')

const createStore = async (req, res) => {
  try {
    const userId = req.user.adminId
    const user = await AdminModel.findById({ _id: userId })
    if (user.role == 'admin') {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() })
      }
      req.body.user = req.user.branchId
      const session = await mongoose.startSession()
      await session.withTransaction(async () => {
        const store = new StoreModel(req.body)
        await store.save()
        res.json({ msg: 'Store Created', data: store })
      })
      session.endSession()
    } else if (user.role == 'doctor') {
      const existingdoctor = await ConsultantModel.findOne({
        _id: req.user.branchId
      })
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() })
      }
      req.body.user = existingdoctor.basicDetails.user
      const session = await mongoose.startSession()
      await session.withTransaction(async () => {
        const store = new StoreModel(req.body)
        await store.save()
        res.json({ msg: 'Store Created', data: store })
      })
      session.endSession()
    } else if (user.role !== 'admin' && user.role !== 'doctor') {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId
      })
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() })
      }
      req.body.user = existingEmployee.basicDetails.user
      const session = await mongoose.startSession()
      await session.withTransaction(async () => {
        const store = new StoreModel(req.body)
        await store.save()
        res.json({ msg: 'Store Created', data: store })
      })
      session.endSession()
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message })
  }
}

const getAllStores = async (req, res) => {
  try {
    const userId = req.user.adminId
    const user = await AdminModel.findById({ _id: userId })
    if (user.role == 'admin') {
      console.log(req.user.branchId)
      let stores = await StoreModel.find({ delete: false })
      // Filter stores based on conditions
      const data = []
      stores = stores.forEach(store => {
        if (store.forAll == true) {
          data.push(store)
        } else if (
          store.forAll == false &&
          store.user.toString() === req.user.branchId
        ) {
          data.push(store)
        }
      })
      res.status(httpStatus.OK).json({ data: data })
    } else if (user.role == 'doctor') {
      const existingdoctor = await ConsultantModel.findOne({
        _id: req.user.branchId
      })
      let stores = await StoreModel.find({ delete: false })

      // Filter stores based on conditions
      const data = []
      stores = stores.forEach(store => {
        if (store.forAll == true) {
          data.push(store)
        } else if (
          store.forAll == false &&
          store.user.toString() === existingdoctor.basicDetails.user.toString()
        ) {
          data.push(store)
        }
      })
      res.status(httpStatus.OK).json({ data: data })
    } else if (user.role !== 'admin' && user.role !== 'doctor') {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId
      })
      let stores = await StoreModel.find({ delete: false })
      console.log()
      // Filter stores based on conditions
      const data = []
      stores = stores.forEach(store => {
        if (store.forAll == true) {
          data.push(store)
        } else if (
          store.forAll == false &&
          store.user.toString() ===
            existingEmployee.basicDetails.user.toString()
        ) {
          data.push(store)
        }
      })
      res.status(httpStatus.OK).json({ data: data })
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message })
  }
}

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.adminId
    const store = await StoreModel.findById({ _id: id })

    if (!store || store.delete === true)
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Store not found' })
    if (!store.forAll && store.user.toString() === userId) {
      res.json({ data: store })
    } else if (store.forAll == true) {
      res.json({ data: store })
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message })
  }
}

const updateStoreById = async (req, res) => {
  try {
    const { id } = req.params

    const session = await mongoose.startSession()
    await session.withTransaction(async () => {
      const store = await StoreModel.findByIdAndUpdate({ _id: id }, req.body, {
        new: true
      })
      if (!store)
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ error: 'Store not found' })
      res.json({ msg: 'Store Updated', data: store })
    })
    session.endSession()
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message })
  }
}

const deleteStoreById = async (req, res) => {
  try {
    const { id } = req.params
    const store = await StoreModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    )
    if (!store)
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Store not found' })
    res.json({ msg: 'Store deleted successfully', data: store })
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message })
  }
}

const bulkImport = async (req, res) => {
  const userId = req.user.adminId
  try {
    const user = await AdminModel.findById({ _id: userId })

    let userFieldValue
    if (user.role === 'admin') {
      userFieldValue = req.user.branchId
    } else if (user.role === 'doctor') {
      const existingDoctor = await ConsultantModel.findOne({
        _id: req.user.branchId
      })
      userFieldValue = existingDoctor.basicDetails.user
    } else {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId
      })
      userFieldValue = existingEmployee.basicDetails.user
    }

    const stores = req.body.map(store => ({
      ...store,
      user: userFieldValue,
      forAll: true
    }))

    const result = await StoreModel.insertMany(stores)
    res.status(httpStatus.CREATED).json({ msg: 'Stores Created', data: result })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  updateStoreById,
  deleteStoreById,
  bulkImport
}
