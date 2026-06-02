const httpStatus = require('http-status')
const {
  PatientExaminationModel,
  LocalExaminationModel,
  GeneralExaminationModel,
  SystematicExaminationModel,
  OtherExaminationModel
} = require('../../../models')
const mongoose = require('mongoose')

const createPatientExamination = async (req, res) => {
  try {
    const PatientExamination = new PatientExaminationModel({ ...req.body })
    const localexamIds = PatientExamination.local.map(l => l._id)
    const generalexamIds = PatientExamination.general.map(p => p._id)
    const systematicexamIds = PatientExamination.systematic.map(s => s._id)
    const otherexamIds = PatientExamination.other.map(o => o._id)
    // console.log(generalexamIds);
    const localExamination = await LocalExaminationModel.find({
      _id: { $in: localexamIds }
    })
    const generalExamination = await GeneralExaminationModel.find({
      _id: { $in: generalexamIds }
    })
    const systematicExamination = await SystematicExaminationModel.find({
      _id: { $in: systematicexamIds }
    })
    const otherExamination = await OtherExaminationModel.find({
      _id: { $in: otherexamIds }
    })
    // console.log(generalExamination);

    PatientExamination.local.forEach(local => {
      local.subDisorder.forEach(subDisorder => {
        localExamination.forEach(l => {
          if (l._id.toString() === local._id.toString()) {
            const foundLocal = localExamination.find(
              l => l._id.toString() === local._id.toString()
            )
            if (foundLocal) {
              const foundSubDisorder = foundLocal.exam.subDisorder.find(
                name => name.name === subDisorder.name
              )
              if (foundSubDisorder) {
                foundSubDisorder.count = (foundSubDisorder.count || 0) + 1
              }
            }
          }
        })
      })
    })

    PatientExamination.general.forEach(general => {
      general.subDisorder.forEach(subDisorder => {
        generalExamination.forEach(g => {
          if (g._id.toString() === general._id.toString()) {
            const foundGeneral = generalExamination.find(
              g => g._id.toString() === general._id.toString()
            )
            if (foundGeneral) {
              const foundSubDisorder = foundGeneral.exam.subDisorder.find(
                name => name.name === subDisorder.name
              )
              if (foundSubDisorder) {
                foundSubDisorder.count = (foundSubDisorder.count || 0) + 1
              }
            }
          }
        })
      })
    })

    PatientExamination.systematic.forEach(systematic => {
      systematic.subDisorder?.forEach(subDisorder => {
        systematicExamination.forEach(s => {
          if (s._id.toString() === systematic._id.toString()) {
            const foundSystematic = systematicExamination.find(
              s => s._id.toString() === systematic._id.toString()
            )
            if (foundSystematic) {
              const foundSubDisorder = foundSystematic.exam.subDisorder.find(
                name => name.name === subDisorder.name
              )
              if (foundSubDisorder) {
                foundSubDisorder.count = (foundSubDisorder.count || 0) + 1
              }
            }
          }
        })
      })
    })

    otherExamination.forEach(other => {
      const otherExamination = PatientExamination.other.find(
        p => p._id === other._id.toString()
      )
      if (otherExamination) {
        other.count = (other.count || 0) + 1
      }
    })

    await Promise.all([
      localExamination.map(local => local.save()),
      generalExamination.map(general => general.save()),
      systematicExamination.map(systematic => systematic.save()),
      otherExamination.map(other => other.save())
    ])
    const savedPatientExamination = await PatientExamination.save()
    res.status(httpStatus.OK).json({
      msg: 'Patient Examination Created Successfuly',
      data: savedPatientExamination
    })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

const updatePatientExamination = async (req, res) => {
  try {
    const { id } = req.params
    const PatientExamination = await PatientExaminationModel.findById(id)
    if (!PatientExamination) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: 'Patient Examination not found' })
    }
    const localexamIds = PatientExamination.local.map(l => l._id)
    const generalexamIds = PatientExamination.general.map(p => p._id)
    const systematicexamIds = PatientExamination.systematic.map(s => s._id)
    const otherexamIds = PatientExamination.other.map(o => o._id)

    const localExamination = await LocalExaminationModel.find({
      _id: { $in: localexamIds }
    })
    const generalExamination = await GeneralExaminationModel.find({
      _id: { $in: generalexamIds }
    })
    const systematicExamination = await SystematicExaminationModel.find({
      _id: { $in: systematicexamIds }
    })
    const otherExamination = await OtherExaminationModel.find({
      _id: { $in: otherexamIds }
    })

    PatientExamination.local.forEach(local => {
      local.subDisorder.forEach(subDisorder => {
        localExamination.forEach(l => {
          if (l._id.toString() === local._id.toString()) {
            const foundLocal = localExamination.find(
              l => l._id.toString() === local._id.toString()
            )
            if (foundLocal) {
              const foundSubDisorder = foundLocal.exam.subDisorder.find(
                name => name.name === subDisorder.name
              )
              if (foundSubDisorder) {
                foundSubDisorder.count = (foundSubDisorder.count || 0) + 1
              }
            }
          }
        })
      })
    })

    PatientExamination.general.forEach(general => {
      general.subDisorder.forEach(subDisorder => {
        generalExamination.forEach(g => {
          if (g._id.toString() === general._id.toString()) {
            const foundGeneral = generalExamination.find(
              g => g._id.toString() === general._id.toString()
            )
            if (foundGeneral) {
              const foundSubDisorder = foundGeneral.exam.subDisorder.find(
                name => name.name === subDisorder.name
              )
              if (foundSubDisorder) {
                foundSubDisorder.count = (foundSubDisorder.count || 0) + 1
              }
            }
          }
        })
      })
    })

    PatientExamination.systematic.forEach(systematic => {
      systematic.subDisorder.forEach(subDisorder => {
        systematicExamination.forEach(s => {
          if (s._id.toString() === systematic._id.toString()) {
            const foundSystematic = systematicExamination.find(
              s => s._id.toString() === systematic._id.toString()
            )
            if (foundSystematic) {
              const foundSubDisorder = foundSystematic.exam.subDisorder.find(
                name => name.name === subDisorder.name
              )
              if (foundSubDisorder) {
                foundSubDisorder.count = (foundSubDisorder.count || 0) + 1
              }
            }
          }
        })
      })
    })

    otherExamination.forEach(other => {
      const otherExamination = PatientExamination.other.find(
        p => p._id === other._id.toString()
      )
      if (otherExamination) {
        other.count = (other.count || 0) + 1
      }
    })

    await Promise.all([
      localExamination.map(local => local.save()),
      generalExamination.map(general => general.save()),
      systematicExamination.map(systematic => systematic.save()),
      otherExamination.map(other => other.save())
    ])

    const updatedPatientExamination =
      await PatientExaminationModel.findByIdAndUpdate(id, req.body, {
        new: true
      })
    res.status(httpStatus.OK).json({
      msg: 'Patient Examination updated',
      data: updatedPatientExamination
    })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

const getAllPatientExamination = async (req, res) => {
  try {
    const { id } = req.params
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const patientexamination = await PatientExaminationModel.find({
      patientId: id,
      createdAt: { $gte: currentDate }
    })
    res
      .status(httpStatus.OK)
      .json({ msg: 'Patient details found', data: patientexamination })
  } catch (error) {
    console.log(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

const getPatientExaminationByConsultantAndPatient = async (req, res) => {
  const { consultantId, opdPatientId } = req.params

  try {
    const patientExamination = await PatientExaminationModel.findOne({
      consultantId: consultantId,
      opdPatientId: opdPatientId
    })

    if (!patientExamination) {
      return res
        .status(404)
        .json({ success: false, message: 'Patient examination not found' })
    }

    return res
      .status(200)
      .json({ success: true, patientExaminationData: patientExamination })
  } catch (error) {
    console.error('Error fetching patient examination:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' })
  }
}

module.exports = {
  createPatientExamination,
  updatePatientExamination,
  getAllPatientExamination,
  getPatientExaminationByConsultantAndPatient
}
