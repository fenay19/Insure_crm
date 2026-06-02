const mongoose = require('mongoose');

const bookAppointmentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:'Admin'
    },
    appointmentMode:{
        type: String,
        default:null
    },
    thirdPartyName:{
        type: String,
        default:null
    },
    whoBookId:{
        type: String,
        default:null
    },
    whoBookName:{
        type: String,
        default:null
    },
    departmentName:{
        type:String,
    },
    refId: {
        type: mongoose.Types.ObjectId,
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref:'DepartmentSetup'
    },
    consultantName:{
        type:String,
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref:'StaffConsultant'
    },
    time:{
        type: String,
        default:null
    },
    date: {
        type: String,
        default:null
    },
    consultationType: {
        type: String,
        default:null
    },
    tokenNumber:String,
    delete: {
        type: Boolean,
        default: false,
      },
    deletedAt: {
        type: Date,
    },
    }, {
      timestamps: true,
      versionKey: false,
    });
    
const BookApointmentModel = mongoose.model('Book_Appointment', bookAppointmentSchema);
module.exports = BookApointmentModel;