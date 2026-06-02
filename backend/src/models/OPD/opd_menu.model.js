const mongoose = require('mongoose');

const OPDMenuSchema = new mongoose.Schema({
    menu:{
        type:Array,
        required: false,
        default: null
    },
    printMenu:{
        type:Array,
        required: false,
        default: null
    },

    emergencyMenu : {
        type:Array,
        required : false,
        default: null
    },

    emergencyPrintMenu : {
        type : Array,
        required : false,
        default : null
    },

    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'StaffConsultant'
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
const OPDMenuModel = mongoose.model('Opd_menu', OPDMenuSchema);

module.exports = OPDMenuModel;
