const mongoose = require('mongoose');

const DepartHistorySchema = new mongoose.Schema({
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    medicalProblems:{
        type:Array,
        required:false,
        default:null
    },
    drugHistory:{
        type:Array,
        required:false,
        default:null
    },
    allergies:{
        having:{
            type:String,
        },
        which:{
            food:{
                type:Array,
                default:null
            },
            general:{
                type:Array,
                default:null
            },
            drug:{
                type:Array,
                default:null
            },
            other:{
                type:String,
                required:false
            }
        }
    },
    familyHistory:{
        type:Array,
        default:null
    },
    lifeStyle:{
        type:Array,
        default:null
    },
    gynac:{
        type:Array,
        default:null
    },
    obstetric:{
        type:Array,
        default:null
    },
    nutritional:{
        type:Array,
        default:null
    },
    pediatric:{
        type:Array,
        default:null
    },
    procedure:{
        having:{
            type:String,
            required:false
        },
        which:{
            type:Array,
            default:null
        }
    },
    other:String,
}, {
    versionKey: false,
    timestamps: true,
});

const DepartHistroyModel = mongoose.model('dep_medical_history',DepartHistorySchema);

module.exports = DepartHistroyModel;