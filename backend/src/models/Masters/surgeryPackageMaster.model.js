const mongoose = require("mongoose");

const surgeryPackageMasterSchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    SurgeryName: {
        type: String,
        require: true
    },
    surgeryCode: {
        type: String,
        require: true
    },
    surgeryType: {
        type: String,
        require: true
    },
    surgeryMode : {
        type: String,
        require: true
    },
    department:{
        type:String,
    },
    departmentId:{
        type:mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
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

const SurgeryPackageMasterModel =  mongoose.model('SurgeryPackageMaster', surgeryPackageMasterSchema);

module.exports = SurgeryPackageMasterModel;