const {
  OPDReceiptModel,
  OPDReceiptNoModel,
  OPDTokenNoModel,
  AdminModel
} = require('../../models')
const OpdPatientModel = require('../../models/appointment-confirm/opdPatient.model')
const PatientAppointment = require('../../models/Masters/patientAppointment.model')
const { AppointmentSchedulingModel } = require('../../models')
const { emitPatientStatusUpdate } = require('../../utils/socket')

const incrementOPDReceiptNo = async () => {
  try {
    let latestReceipt = await OPDReceiptNoModel.findOne()

    if (!latestReceipt) {
      console.error('No receipt found to increment')
      return
    }

    // Extract the numeric part, increment it, and format it back
    const currentNumber = parseInt(
      latestReceipt.receiptNo.replace('REC', ''),
      10
    )
    const nextNumber = currentNumber + 1
    const newReceiptNo = `REC${nextNumber.toString().padStart(4, '0')}`

    // Update the existing record with the new receipt number
    latestReceipt.receiptNo = newReceiptNo
    await latestReceipt.save()
  } catch (error) {
    console.error('Error incrementing OPD receipt number:', error)
  }
}

const getLatestTokenNumberAndAssignToPatient = async (
  consultantId,
  opdPatientId
) => {
  const today = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD

  // Check if the consultant's record exists
  let tokenDoc = await OPDTokenNoModel.findOne({ consultantId })

  if (tokenDoc) {
    // If the record exists, check if it's for today
    if (tokenDoc.date === today) {
      // If today's record exists, increment the token number
      tokenDoc.currentTokenNumber += 1
    } else {
      // If the date is different, reset the token number and update the date
      tokenDoc.date = today
      tokenDoc.currentTokenNumber = 1
    }
  } else {
    // If no record exists, create a new one
    tokenDoc = new OPDTokenNoModel({
      consultantId,
      date: today,
      currentTokenNumber: 1
    })
  }

  // Save the updated or new token document
  const savedToken = await tokenDoc.save()

  // Assign the generated token number to the patient
  await OpdPatientModel.findByIdAndUpdate(
    opdPatientId,
    { tokenNo: savedToken.currentTokenNumber },
    { new: true }
  )
}

const createOPDReceipt = async (req, res) => {
  try {
    const { opdId, patientId } = req.body

    // Validate OPD and Patient existence
    const opd = await OpdPatientModel.findById(opdId)
    if (!opd) return res.status(404).json({ error: 'OPD not found' })

    const patient = await PatientAppointment.findById(patientId)
    if (!patient)
      return res.status(404).json({ error: 'Patient Appointment not found' })

    // Fetch or initialize receipt number
    let latestReceipt = await OPDReceiptNoModel.findOne()
    if (!latestReceipt)
      latestReceipt = await OPDReceiptNoModel.create({ receiptNo: 'REC0001' })

    // Assign receipt number
    req.body.receiptNo = latestReceipt.receiptNo

    const loggedInUserId = req.user.adminId
    const loggedInUserData = await AdminModel.findOne({ _id: loggedInUserId })
console.log(loggedInUserData)
    if (Object.keys(loggedInUserData).length > 0) {
      ;(req.body.personWhoCreatedThisBillName = loggedInUserData.name || ''),
        (req.body.personWhoCreatedThisBillId = loggedInUserData.refId || null),
        (req.body.personWhoCreatedThisBillRefType =
          loggedInUserData.refType || '')
    }

    // Create and save new receipt
    const newReceipt = new OPDReceiptModel(req.body)
    await newReceipt.save()

    // Increment the receipt number
    await incrementOPDReceiptNo()

    // Update OPD and Patient models
    const opdPatientDetails = await OpdPatientModel.findByIdAndUpdate(opdId, {
      isPatientPaidTheBill: true,
      billingStatus: 'Paid'
    })

    await PatientAppointment.findByIdAndUpdate(patientId, { isConfirm: true })

    if (!opd.isPatientPaidTheBill && !opd.tokenNo) {
      await getLatestTokenNumberAndAssignToPatient(opd.consultantId, opdId)
    }

    //mark slot book and paid

    // Find the doctor's schedule
    const ScheduleOfDoctor = await AppointmentSchedulingModel.findOne({
      doctorId: opdPatientDetails.consultantId
    })

    if (!ScheduleOfDoctor) {
      return res
        .status(404)
        .json({ success: false, message: 'Doctor schedule not found' })
    }

    // Find the specific day's schedule
    const getPerticularDaySchedule = ScheduleOfDoctor.schedule.find(
      item => item.date === opdPatientDetails.date
    )

    if (!getPerticularDaySchedule) {
      return res
        .status(404)
        .json({ success: false, message: 'Day schedule not found' })
    }

    // Function to update the time slot status
    const updateTimeSlotStatus = (slot, time) => {
      const timeSlot = slot.timeSlotsIntervalWise.find(ts => ts.time === time)

      if (timeSlot) {
        timeSlot.booked = true
        timeSlot.status = 'BOOKED AND PAID'
      }
    }

    const appointmentTime = opdPatientDetails.time // Assuming this is in the format "HH:MM AM/PM"
    updateTimeSlotStatus(getPerticularDaySchedule.slotA, appointmentTime)
    updateTimeSlotStatus(getPerticularDaySchedule.slotB, appointmentTime)

    // Mark the schedule as modified
    ScheduleOfDoctor.markModified('schedule')

    // Save the updated schedule back to the database
    await ScheduleOfDoctor.save()
    console.log('Schedule updated successfully',newReceipt)
    if(newReceipt?.paymentMode?.toLowerCase()?.trim() === 'cash' || "charity"){
    emitPatientStatusUpdate(newReceipt)
    }
    return res.status(200).json({
      success: true,
      message: 'Receipt Generated Successfully',
      receipt: newReceipt
    })
  } catch (error) {
    console.error('Error creating OPD receipt:', error)
    res.status(500).json({ msg: 'Internal server error', error })
  }
}

const getLatestOPDReceiptNo = async (req, res) => {
  try {
    let latestReceipt = await OPDReceiptNoModel.findOne()

    if (!latestReceipt) {
      // If no receipt exists, create the first one
      latestReceipt = await OPDReceiptNoModel.create({ receiptNo: 'REC0001' })
    }

    return res.status(200).json({
      success: true,
      message: 'OPD Receipt No fetched successfully',
      receiptNo: latestReceipt.receiptNo
    })
  } catch (error) {
    console.error('Error fetching OPD receipt number:', error)
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

const getAllGeneratedReceiptsAgainstOPDPatient = async (req, res) => {
  const { id } = req.params
  const receipts = await OPDReceiptModel.find({ opdId: id }).lean()
  return res.status(200).json({
    success: true,
    message: 'Receipts found successfully',
    receipts: receipts
  })
}

const getAllOpdReceiptsCurrentDate = async (req, res) => {
  try {
    // Get today's start and end time
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // Fetch receipts created today
    const receipts = await OPDReceiptModel.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay } // ✅ FIXED: Added createdAt
    }).lean()

    // Categorize receipts by payment mode
    const filtered = receipts?.reduce(
      (acc, data) => {
        if (data?.paymentMode?.toLowerCase()?.trim() === 'cash') {
          acc.cash.push(data)
        } else {
          acc.credit.push(data)
        }
        return acc
      },
      { cash: [], credit: [] }
    )

    // Calculate total revenue separately
    const totalRevenue = receipts?.reduce(
      (sum, data) => sum + (Number(data?.paidAmount) || 0),
      0
    )

    return res.status(200).json({
      success: true,
      message: 'Receipts found successfully',
      receipts,
      data: filtered,
      totalRevenue
    })
  } catch (err) {
    console.error('Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
}

const getAllReceipts = async (req, res) => {
  const receipts = await OPDReceiptModel.find()
  return res.status(200).json({
    success: true,
    message: 'Receipts found successfully',
    receipts: receipts
  })
}

module.exports = {
  getAllReceipts,
  createOPDReceipt,
  getLatestOPDReceiptNo,
  incrementOPDReceiptNo,
  getAllGeneratedReceiptsAgainstOPDPatient,
  getAllOpdReceiptsCurrentDate
}
