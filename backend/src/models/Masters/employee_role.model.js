const mongoose = require("mongoose");

const EmployeeRoleSchema = new mongoose.Schema({
    employeeRole: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    delete:{
        type: Boolean,
        default: false
    },
    deletedAt:{
        type: Date,
    },
},
{
    timestamps: true,
    versionKey: false
});

const EmployeeRoleModel = mongoose.model("EmployeeRole", EmployeeRoleSchema);

module.exports = EmployeeRoleModel;