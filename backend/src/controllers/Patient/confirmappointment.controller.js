const { ConfirmAppointmentModel } = require('../../models');
const { patientDetailsModel } = require('../../models');
const { PatientModel } = require('../../models');
const { BookApointmentModel } = require('../../models');

const httpStatus = require('http-status');

// Handler function for confirming appointments and file uploads
let lastGeneratedSerial = 0;
const generateUHID = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(currentDate.getDate()).padStart(2, '0');

    lastGeneratedSerial++;
    const serialNumber = String(lastGeneratedSerial).padStart(7, '0'); 

    return `${year}${month}${date}${serialNumber}`;
};


const createConfirmAppointment = async (req, res) => {
  console.log('working')
  // try {
  //     const userId = req.user.adminId;
  //     let { uhid, provisionalId, bookAppointmentId } = req.body;
  //     req.body.user = userId;
  //     let aadharCardFile = null;
  //     let abhaCardFile = null;
  
  //     if (req.files && req.files['aadhar_card'] && req.files['aadhar_card'][0]) {
  //       aadharCardFile = req.files['aadhar_card'][0].filename;
  //     }
  
  //     if (req.files && req.files['abha_card'] && req.files['abha_card'][0]) {
  //       abhaCardFile = req.files['abha_card'][0].filename;
  //     }
  
  //     if (!uhid) {
  //       const generatedUHID = generateUHID(); 
  //       console.log(generatedUHID);
  //       uhid = generatedUHID;
  //       const newPatient = new patientDetailsModel({
  //         ...req.body,
  //         uhid: uhid,
  //         aadhar_card: aadharCardFile,
  //         abha_card: abhaCardFile,
  //       });

  //     const savedDetails = await newPatient.save();
  //     const parmanantId = await BookApointmentModel.findByIdAndUpdate({_id:bookAppointmentId}, { $set: {refId: savedDetails._id}, new:true});
  //     }else{
  //         const newUser = await patientDetailsModel.findByIdAndUpdate(
  //           {_id: provisionalId},
  //           {$set:{...req.body, is_provisional:false}}, 
  //           {new:true}
  //         );
  //       await newUser.save();
  //       }

  //     const newAppointment = new ConfirmAppointmentModel({
  //       ...req.body,
  //       uhid: uhid,
  //       aadhar_card: aadharCardFile,
  //       abha_card: abhaCardFile,
  //     });

  //   const deleteBookAppointment = await BookApointmentModel.findByIdAndUpdate({_id:bookAppointmentId}, { delete: true, deletedAt: Date.now() });
    
  //   const patientId = req.body.provisionalId;
  //   const newPatient = await PatientModel.findByIdAndUpdate({ _id: patientId }, { delete: true, deletedAt: Date.now() });

    

  //   const savedAppointment = await newAppointment.save();
  //   res.status(httpStatus.OK).json({ msg: 'Appointment confirmed successfully', data: savedAppointment });
  // } catch (error) {
  //   console.error(error);
  //   res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  // }
};
   
const getAllConfirmedAppointments = async (req, res) => {
  try {
    const userId = req.user.adminId;
    const allConfirmedAppointments = await ConfirmAppointmentModel.find({delete: false, user:userId});
    const appointmentDetails = [];
    for (const appointment of allConfirmedAppointments) {
        const appointmentId = appointment.bookAppointmentId.toString();
        const bookappointment = await BookApointmentModel.findById(appointmentId);
        // console.log(bookappointment);
        if (bookappointment) {
            const appointmentInfo = {
                patientDetails: appointment,
                appointment: bookappointment
            };
            appointmentDetails.push(appointmentInfo);
        }
    }
    res.status(httpStatus.OK).json({ data: appointmentDetails });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
      const ConfirmAppointment = await ConfirmAppointmentModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now() });
      if (!ConfirmAppointment) {
          return res.status(httpStatus.NOT_FOUND).json({ error: 'Patient not found' });
      }
      res.status(httpStatus.OK).json({ msg: "Patient Details Deleted!!", data: ConfirmAppointment });
  } catch (error) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const getPatientDetails = async (req, res) => {
  try{
    const patientDetails = await patientDetailsModel.find({delete:false});
    res.status(httpStatus.OK).json({ data: patientDetails });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const createPatientDetails = async (req, res) => {
  try{
    let aadharCardFile = null;
    let abhaCardFile = null;

    if (req.files && req.files['aadhar_card'] && req.files['aadhar_card'][0]) {
      aadharCardFile = req.files['aadhar_card'][0].filename;
    }

    if (req.files && req.files['abha_card'] && req.files['abha_card'][0]) {
      abhaCardFile = req.files['abha_card'][0].filename;
    }

    const generatedUHID = generateUHID(); 
    console.log(generatedUHID);
    uhid = generatedUHID;
    const newPatient = new patientDetailsModel({
      ...req.body,
      uhid: uhid,
      aadhar_card: aadharCardFile,
      abha_card: abhaCardFile,
    });

    const savedDetails = await newPatient.save();
    res.status(httpStatus.OK).json({ msg: 'Patient-Details saved successfully', data: savedDetails });
  }catch(err){
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: 'Internal server error' });
  }
}

module.exports = {
    createConfirmAppointment,
    getAllConfirmedAppointments,
    getPatientDetails,
    deletePatient,
    createPatientDetails
}