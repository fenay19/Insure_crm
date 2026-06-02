const OPDBillingModel = require("../../models/OPD/opd_billing.model");
const OPDCreditBillModel = require("../../models/OPDBilling/OPDBilling.modal");
const {
  OPDReceiptModel,
  OPDReceiptNoModel,
  OPDTokenNoModel,
  AdminModel,
} = require("../../models");
const OpdPatientModel = require("../../models/appointment-confirm/opdPatient.model");
const PatientAppointment = require("../../models/Masters/patientAppointment.model");
const { AppointmentSchedulingModel } = require("../../models");
// Generic function to create billing
const createBilling = async (Model, req, res) => {
  try {
    const billingData = req.body;
    const newBilling = new Model(billingData);
    await newBilling.save();

    res.status(201).json({
      success: true,
      message: "Billing record created successfully",
      data: newBilling,
    });
  } catch (error) {
    console.error("Error creating billing:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Generic function to get all billings
const getAllBillings = async (Model, req, res) => {
  try {
    const billings = await Model.find().populate("opdId patientId receipts");
    res.status(200).json({ success: true, data: billings });
  } catch (error) {
    console.error("Error fetching billings:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Generic function to get billing by patient ID
const getBillingById = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const billing = await Model.findOne({ patientId: id }).populate({
      path: "opdId patientId receipts",
      strictPopulate: false,
    });

    if (!billing) {
      return res
        .status(404)
        .json({ success: false, error: "Billing not found" });
    }

    res.status(200).json({ success: true, data: billing });
  } catch (error) {
    console.error("Error fetching billing by ID:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Generic function to update billing
const updateBilling = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const updatedBilling = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBilling) {
      return res
        .status(404)
        .json({ success: false, error: "Billing not found" });
    }

    res.status(200).json({
      success: true,
      message: "Billing record updated successfully",
      data: updatedBilling,
    });
  } catch (error) {
    console.error("Error updating billing:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// OPD Billing Controllers
const createOpdBilling = (req, res) => createBilling(OPDBillingModel, req, res);
const getAllOpdBillings = (req, res) =>
  getAllBillings(OPDBillingModel, req, res);
const getOpdBillingById = (req, res) =>
  getBillingById(OPDBillingModel, req, res);
const updateOpdBilling = (req, res) => updateBilling(OPDBillingModel, req, res);

// OPD Credit Billing Controllers
const createOpdCreditBilling = (req, res) =>
  createBilling(OPDCreditBillModel, req, res);
const getAllOpdCreditBillings = (req, res) =>
  getAllBillings(OPDCreditBillModel, req, res);
const getOpdCreditBillingById = (req, res) =>
  getBillingById(OPDCreditBillModel, req, res);
const updateOpdCreditBilling = (req, res) =>
  updateBilling(OPDCreditBillModel, req, res);

const getLatestTokenNumberAndAssignToPatient = async (
  consultantId,
  opdPatientId
) => {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Check if the consultant's record exists
  let tokenDoc = await OPDTokenNoModel.findOne({ consultantId });

  if (tokenDoc) {
    // If the record exists, check if it's for today
    if (tokenDoc.date === today) {
      // If today's record exists, increment the token number
      tokenDoc.currentTokenNumber += 1;
    } else {
      // If the date is different, reset the token number and update the date
      tokenDoc.date = today;
      tokenDoc.currentTokenNumber = 1;
    }
  } else {
    // If no record exists, create a new one
    tokenDoc = new OPDTokenNoModel({
      consultantId,
      date: today,
      currentTokenNumber: 1,
    });
  }

  // Save the updated or new token document
  const savedToken = await tokenDoc.save();

  // Assign the generated token number to the patient
  await OpdPatientModel.findByIdAndUpdate(
    opdPatientId,
    { tokenNo: savedToken.currentTokenNumber },
    { new: true }
  );
  return savedToken.currentTokenNumber;
};

const saveCreditPatient = async (req, res) => {
  try {
    const { opdId, patientId } = req.body;
    // Validate OPD and Patient existence
    const opd = await OpdPatientModel.findById(opdId);
    if (!opd) return res.status(404).json({ error: "OPD not found" });

    const patient = await PatientAppointment.findById(patientId);
    if (!patient)
      return res.status(404).json({ error: "Patient Appointment not found" });

    // Fetch or initialize receipt number
    // let latestReceipt = await OPDReceiptNoModel.findOne()
    // if (!latestReceipt)
    //   latestReceipt = await OPDReceiptNoModel.create({ receiptNo: 'REC0001' })

    // // Assign receipt number
    // req.body.receiptNo = latestReceipt.receiptNo

    const loggedInUserId = req.user.adminId;
    const loggedInUserData = await AdminModel.findOne({ _id: loggedInUserId });
    console.log(loggedInUserData);
    if (Object.keys(loggedInUserData).length > 0) {
      (req.body.personWhoCreatedThisBillName = loggedInUserData.name || ""),
        (req.body.personWhoCreatedThisBillId = loggedInUserData.refId || null),
        (req.body.personWhoCreatedThisBillRefType =
          loggedInUserData.refType || "");
    }

    // Update OPD and Patient models
    const opdPatientDetails = await OpdPatientModel.findByIdAndUpdate(opdId, {
      isPatientPaidTheBill: false,
      billingStatus: "Not_Paid",
    });

    await PatientAppointment.findByIdAndUpdate(patientId, { isConfirm: true });

    if (!opd.tokenNo) {
      await getLatestTokenNumberAndAssignToPatient(opd.consultantId, opdId);
    }
    const opdCreditBill = new OPDCreditBillModel(req.body);
    await opdCreditBill.save();
    //mark slot book and paid

    // Find the doctor's schedule
    const ScheduleOfDoctor = await AppointmentSchedulingModel.findOne({
      doctorId: opdPatientDetails.consultantId,
    });

    if (!ScheduleOfDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor schedule not found" });
    }

    // Find the specific day's schedule
    const getPerticularDaySchedule = ScheduleOfDoctor.schedule.find(
      (item) => item.date === opdPatientDetails.date
    );

    if (!getPerticularDaySchedule) {
      return res
        .status(404)
        .json({ success: false, message: "Day schedule not found" });
    }

    // Function to update the time slot status
    const updateTimeSlotStatus = (slot, time) => {
      const timeSlot = slot.timeSlotsIntervalWise.find(
        (ts) => ts.time === time
      );

      if (timeSlot) {
        timeSlot.booked = true;
        timeSlot.status = "BOOKED AND PAID";
      }
    };

    const appointmentTime = opdPatientDetails.time; // Assuming this is in the format "HH:MM AM/PM"
    updateTimeSlotStatus(getPerticularDaySchedule.slotA, appointmentTime);
    updateTimeSlotStatus(getPerticularDaySchedule.slotB, appointmentTime);

    // Mark the schedule as modified
    ScheduleOfDoctor.markModified("schedule");

    // Save the updated schedule back to the database
    await ScheduleOfDoctor.save();

    return res.status(200).json({
      success: true,
      message: "Credit Saved",
      // receipt: newReceipt,
    });
  } catch (error) {
    console.error("Error creating OPD receipt:", error);
    res.status(500).json({ msg: "Internal server error", error });
  }
};

const updateCreditBilling = async (req, res) => {
  try {
    const { id } = req.params;
    const newServices = req.body.services; // should be an array of service objects

    const existingBilling = await OPDCreditBillModel.findById(id);

    if (!existingBilling) {
      return res.status(404).json({
        success: false,
        error: "Billing not found",
      });
    }

    // Push new services to existing services array
    existingBilling.services.push(...newServices);

    // Calculate total new service amount
    const addedAmount = newServices.reduce((acc, service) => {
      return acc + Number(service.servicesTotalAmount || 0);
    }, 0);

    // Update totals
    existingBilling.servicesAmount += addedAmount;
    existingBilling.totalAmount += addedAmount;
    existingBilling.pendingAmount += addedAmount;

    // Save the updated document
    const updatedBilling = await existingBilling.save();

    res.status(200).json({
      success: true,
      message: "Services added and billing updated successfully",
      data: updatedBilling,
    });
  } catch (error) {
    console.error("Error updating billing:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


module.exports = {
  createOpdBilling,
  getAllOpdBillings,
  getOpdBillingById,
  updateOpdBilling,

  createOpdCreditBilling,
  getAllOpdCreditBillings,
  getOpdCreditBillingById,
  updateOpdCreditBilling,
  saveCreditPatient,
  updateCreditBilling,
};
