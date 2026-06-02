const mongoose = require("mongoose");

const OtherExaminationSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref: 'patientDetails'
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
    },
    exam:{
        type:String,
    },
    count:{
        type:Number,
        default:0
    },
    delete:{
        type:Boolean,
        default:false
    }
}, {
    versionKey: false,
    timestamps: true,
});

const OtherExaminationModel = mongoose.model('Other_Examination' , OtherExaminationSchema);

module.exports = OtherExaminationModel;