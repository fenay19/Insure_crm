const { BookApointmentModel, AdminModel,ConsultantModel,EmployeeModel  } = require('../../models');
const { patientDetailsModel } = require('../../models');
const { PatientModel } = require('../../models');
const httpStatus = require('http-status');

const createAppointment = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const admin = await AdminModel.findById(userId);
        if(admin.role == 'admin'){
            const tokenNumber = generateToken(); 
            const { refId } = req.body;
            req.body.user = req.user.branchId;
            req.body.whoBookId = admin.refId;
            req.body.whoBookName = admin.name;
            const newAppointment = new BookApointmentModel({
                ...req.body,
                tokenNumber: tokenNumber 
            });
            await newAppointment.save();

            const patient = await patientDetailsModel.findById(refId);
            if(patient) {
                const patientDetails = await patientDetailsModel.findByIdAndUpdate(
                    {_id: refId},
                    {$set: {is_provisional:true}},
                    {new:true});
                await patientDetails.save();
            }
            res.status(httpStatus.CREATED).json({ msg: "Appointment Registered", data: newAppointment });
        }else if(admin.role == 'doctor'){
            const existsingdoctor = await ConsultantModel.findOne({ _id: req.user.branchId});
            const tokenNumber = generateToken(); 
            const { refId } = req.body;
            req.body.user = existsingdoctor.basicDetails.user;
            req.body.whoBookId = admin.refId;
            req.body.whoBookName = admin.name;
            const newAppointment = new BookApointmentModel({
                ...req.body,
                tokenNumber: tokenNumber 
            });
            await newAppointment.save();

            const patient = await patientDetailsModel.findById(refId);
            if(patient) {
                const patientDetails = await patientDetailsModel.findByIdAndUpdate(
                    {_id: refId},
                    {$set: {is_provisional:true}},
                    {new:true});
                await patientDetails.save();
            }
            res.status(httpStatus.CREATED).json({ msg: "Appointment Registered", data: newAppointment });
        }else if(admin.role !== 'admin' && admin.role!== 'doctor'){
            const existingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const tokenNumber = generateToken(); 
            const { refId } = req.body;
            req.body.user = existingEmployee.basicDetails.user;
            req.body.whoBookId = admin.refId;
            req.body.whoBookName = admin.name;
            const newAppointment = new BookApointmentModel({
                ...req.body,
                tokenNumber: tokenNumber 
            });
            await newAppointment.save();

            const patient = await patientDetailsModel.findById(refId);
            if(patient) {
                const patientDetails = await patientDetailsModel.findByIdAndUpdate(
                    {_id: refId},
                    {$set: {is_provisional:true}},
                    {new:true});
                await patientDetails.save();
            }
            res.status(httpStatus.CREATED).json({ msg: "Appointment Registered", data: newAppointment });
        }
        
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

let serialCounter = 1; 

const generateToken = () => {
  const serialNumber = serialCounter.toString(36).padStart(4, '0');
  serialCounter++; 
  return serialNumber;
};

const getAppointment = async (req, res) => {
    try {
        const userId  = req.user.adminId;
        const user = await AdminModel.findById(userId);
        if(user.role == 'admin'){
            const allAppointments = await BookApointmentModel.find({ delete:false, user:req.user.branchId });
            const appointmentDetails = [];
            for (const appointment of allAppointments) {
                const patientId = appointment.refId.toString();
                const patientDetails = await PatientModel.find({delete:false, _id:patientId});
                if (patientDetails.length > 0) {
                    const appointmentInfo = {
                        appointment: appointment,
                        patientDetails: patientDetails[0]
                    };
                    appointmentDetails.push(appointmentInfo);
                }else{
                    const newDetails = await patientDetailsModel.find({ delete:false, _id:patientId});
                    if(newDetails.length > 0){
                        const appointmentInfo = {
                            appointment: appointment,
                            patientDetails: newDetails[0]
                        };
                        appointmentDetails.push(appointmentInfo);
                    }
                }
            }
            res.status(httpStatus.OK).json({ appointments: appointmentDetails });
        }else if(user.role == 'doctor'){
            const existingDoctor = await ConsultantModel.findOne({ _id: req.user.branchId});
            const allAppointments = await BookApointmentModel.find({ delete:false, user:existingDoctor.basicDetails.user });
            const appointmentDetails = [];
            for (const appointment of allAppointments) {
                const patientId = appointment.refId.toString();
                const patientDetails = await PatientModel.find({delete:false, _id:patientId});
                if (patientDetails.length > 0) {
                    const appointmentInfo = {
                        appointment: appointment,
                        patientDetails: patientDetails[0]
                    };
                    appointmentDetails.push(appointmentInfo);
                }else{
                    const newDetails = await patientDetailsModel.find({ delete:false, _id:patientId});
                    if(newDetails.length > 0){
                        const appointmentInfo = {
                            appointment: appointment,
                            patientDetails: newDetails[0]
                        };
                        appointmentDetails.push(appointmentInfo);
                    }
                }
            }
            res.status(httpStatus.OK).json({ appointments: appointmentDetails });
        } else if(user.role!== 'admin' && user.role!== 'doctor'){
            const existingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const allAppointments = await BookApointmentModel.find({ delete:false, user:existingEmployee.basicDetails.user });
            const appointmentDetails = [];
            for (const appointment of allAppointments) {
                const patientId = appointment.refId.toString();
               
                const patientDetails = await PatientModel.find({delete:false, _id:patientId});
                console.log(patientDetails);
                if (patientDetails.length > 0) {
                    const appointmentInfo = {
                        appointment: appointment,
                        patientDetails: patientDetails[0]
                    };
                    appointmentDetails.push(appointmentInfo);
                }else{
                    const newDetails = await patientDetailsModel.find({ delete:false, _id:patientId});
                    if(newDetails.length > 0){
                        const appointmentInfo = {
                            appointment: appointment,
                            patientDetails: newDetails[0]
                        };
                        appointmentDetails.push(appointmentInfo);
                    }
                }
            }
            res.status(httpStatus.OK).json({ appointments: appointmentDetails });
        }
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getAppointmentAll = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const user = await AdminModel.findById(userId);
        if(user.role == 'admin'){
            const allAppointments = await BookApointmentModel.find({user:req.user.branchId});
            res.status(httpStatus.OK).json({ appointments: allAppointments });
        }else if (user.role == 'doctor'){
            const existingDoctor = await ConsultantModel.findOne({ _id: req.user.branchId});
            const allAppointments = await BookApointmentModel.find({user:existingDoctor.basicDetails.user});
            res.status(httpStatus.OK).json({ appointments: allAppointments });
        }else if (user.role!== 'admin' && user.role!== 'doctor'){
            const existingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const allAppointments = await BookApointmentModel.find({user:existingEmployee.basicDetails.user});
            res.status(httpStatus.OK).json({ appointments: allAppointments });
        }
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const appointmentId = req.params.id;
        const appointment = await BookApointmentModel.findByIdAndUpdate(
            {_id: appointmentId, user:userId},
            {$set: {delete:true}},
            {new:true});
        await appointment.save();
        res.status(httpStatus.OK).json({ msg: "Appointment Deleted", data: appointment });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};


module.exports = { 
    createAppointment,
    getAppointment,
    deleteAppointment,
    getAppointmentAll
}