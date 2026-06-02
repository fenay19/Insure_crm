const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
    memberRelation:{
        type:String,
        required:false
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    versionKey: false,
    timestamps: true,
});

const FamilyMemberModel = mongoose.model('Family_Member', familyMemberSchema);

module.exports = FamilyMemberModel;
