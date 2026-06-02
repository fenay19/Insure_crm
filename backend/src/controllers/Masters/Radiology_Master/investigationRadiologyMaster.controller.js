const httpStatus = require('http-status')
const { InvestigationRadiologyMasterModel } = require('../../../models')

const getAllInvestigation = async (req, res) => {
  try {
    const inevestigation = await InvestigationRadiologyMasterModel.find({
      delete: false
    })
    if (!inevestigation) {
      return res.status(500).json({ err: 'Error in finding inevestigation' })
    }
    const data = []
    inevestigation.forEach(element => {
      // console.log(element._doc.description);
      data.push({
        ...element._doc,
        description:
          element._doc.description.length === 0
            ? null
            : element._doc.description[0]
      })
    })
    return res.status(httpStatus.OK).json({
      msg: 'All inevestigation found successfully',
      investigation: data
    })
  } catch (error) {
    // console.log(error);
    res.status(500).json({ err: 'Server Error', error })
  }
}

const addInvestigation = async (req, res) => {
  try {
    const investigation = req.body
    if (!investigation) {
      return res.status(400).json({ msg: 'Please fill all fields' })
    }

    const newInvestigation = new InvestigationRadiologyMasterModel(req.body)
    await newInvestigation.save()
    return res
      .status(httpStatus.CREATED)
      .json({ msg: 'New Inevestigation added successfully', newInvestigation })
  } catch (error) {
    console.log(error)
    res.status(500).json({ err: 'Server Error', error })
  }
}

const editInvestigation = async (req, res) => {
  try {
    const { id } = req.params
    const investigation =
      await InvestigationRadiologyMasterModel.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
      )

    if (!investigation) {
      return res.status(400).json({ msg: 'Investigation not found' })
    }
    await investigation.save()
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Investigation updated successfully', investigation })
  } catch (error) {
    res.status(500).json({ err: 'Server Error', error })
  }
}

const updateInvestigationRateAndCode = async (req, res) => {
  try {
    const { id } = req.params
    const { rate, newCode } = req.body
    if (rate === undefined && newCode === undefined) {
      return res.status(400).json({
        msg: "Please provide at least one field to update: 'rate' or 'newCode'."
      })
    }

    // Prepare the update object dynamically
    const updateData = {}
    if (rate !== undefined) updateData.rate = rate
    if (newCode !== undefined) updateData.newCode = newCode

    // Update the investigation with the specific fields
    const investigation =
      await InvestigationRadiologyMasterModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true } // Return the updated document
      )

    if (!investigation) {
      return res.status(404).json({
        msg: 'Investigation not found.'
      })
    }

    return res.status(200).json({
      msg: 'Investigation updated successfully.',
      investigation
    })
  } catch (error) {
    console.error('Error updating investigation:', error)
    res.status(500).json({
      err: 'Server Error',
      error: error.message
    })
  }
}

const deleteInvestigation = async (req, res) => {
  try {
    const { id } = req.params
    const investigation =
      await InvestigationRadiologyMasterModel.findByIdAndUpdate(
        { _id: id },
        { delete: true, deletedAt: Date.now() },
        { new: true }
      )
    if (!investigation) {
      return res.status(400).json({ msg: 'Investigation not found' })
    }
    await investigation.save()
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Investigation deleted successfully' })
  } catch (error) {
    res.status(500).json({ err: 'Server Error', error })
  }
}

const bulkImport = async (req, res) => {
  try {
    const investigation = req.body

    newInvestigationData = investigation.map(singleInvestigation => {
      if (!singleInvestigation.testRange) {
        singleInvestigation.testRange = null
      }
      return singleInvestigation
    })

    const result = await InvestigationRadiologyMasterModel.insertMany(
      newInvestigationData
    )
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'investigation Created', data: result })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

module.exports = {
  addInvestigation,
  getAllInvestigation,
  editInvestigation,
  deleteInvestigation,
  bulkImport,
  updateInvestigationRateAndCode
}
