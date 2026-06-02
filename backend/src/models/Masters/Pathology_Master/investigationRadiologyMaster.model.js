// const mongoose = require('mongoose')

// const ThirdParameterSchema = new mongoose.Schema({
//   testName: {
//     type: String,
//     required: true
//   },
//   testCode: {
//     type: String,
//     required: true
//   },
//   machine: {
//     type: String,
//     required: false
//   },
//   machineId: {
//     type: String,
//     required: false
//   },
//   unit: {
//     type: String,
//     required: true
//   },
//   unitId: {
//     type: String,
//     required: true
//   },
//   testDetail: [
//     {
//       minTestRange: String,
//       maxTestRange: String,
//       gender: String,
//       ageRange: String
//     }
//   ],
//   formula: {
//     type: String,
//     required: false
//   }
// })

// const ParameterSchema = new mongoose.Schema({
//   testName: {
//     type: String,
//     required: true
//   },
//   testCode: {
//     type: String,
//     required: true
//   },
//   machine: {
//     type: String,
//     required: false
//   },
//   machineId: {
//     type: String,
//     required: false
//   },
//   unit: {
//     type: String,
//     required: true
//   },
//   unitId: {
//     type: String,
//     required: true
//   },
//   testDetail: [
//     {
//       minTestRange: String,
//       maxTestRange: String,
//       gender: String,
//       ageRange: String
//     }
//   ],
//   formula: {
//     type: String,
//     required: false
//   },
//   thirdparameters: [ThirdParameterSchema]
// })

// const InvestigationPathologySchema = new mongoose.Schema(
//   {
//     count: {
//       type: Number,
//       default: 0
//     },
//     testName: {
//       type: String,
//       required: true
//     },
//     testCode: {
//       type: String,
//       required: true
//     },
//     billGroup: {
//       type: String,
//       required: true
//     },
//     billGroupId: {
//       type: mongoose.Types.ObjectId,
//       ref: 'BillGroup'
//     },
//     department: {
//       type: String,
//       required: true
//     },
//     departmentId: {
//       type: mongoose.Types.ObjectId,
//       ref: 'DepartmentSetupModel'
//     },

//     subDepartment: {
//       type: String,
//     },
    
//     machineName: {
//       type: String,
//       required: false
//     },
//     machineId: {
//       type: mongoose.Types.ObjectId,
//       ref: 'MachineMaster'
//     },
//     unit: {
//       type: String,
//       required: true
//     },
//     unitId: {
//       type: mongoose.Types.ObjectId,
//       ref: 'UnitMaster'
//     },
//     specimen: {
//       type: String
//     },
//     specimenId: {
//       type: mongoose.Types.ObjectId,
//       ref: 'SpecimenMaster'
//     },
//     formula: {
//       type: String
//     },
//     testType: {
//       type: String,
//       required: false
//     },
//     testDetail: [
//       {
//         minTestRange: String,
//         maxTestRange: String,
//         gender: String,
//         minAge : String,
//         maxAge : String,
//         duration : String,
//         note : String,
//       }
//     ],

//     description: {
//       type: String
//     },

//     parameters: [ParameterSchema],

//     cash: {
//       type: Number,
//       min: 0
//     },
//     CGHSnabh: {
//       type: Number,
//       min: 0
//     },
//     CGHSnonNabh: {
//       type: Number,
//       min: 0
//     },
//     tpaName: {
//       type: String,
//       default: ''
//     },
//     tpa: {
//       type: Number,
//       min: 0
//     },
//     gipsaaName: {
//       type: String,
//       default: ''
//     },
//     gipsaa: {
//       type: Number,
//       min: 0
//     },
//     charity: {
//       type: Number,
//       default: 0,
//       min: 0
//     },
//     rate: {
//       type: String
//     },
//     newCode: {
//       type: String
//     },
//     category: {
//       type: String
//     },
//     delete: {
//       type: Boolean,
//       default: false
//     },
//     deletedAt: {
//       type: Date
//     }
//   },
//   {
//     versionKey: false,
//     timestamps: true
//   }
// )

// const InvestigationPathologyMasterModel = mongoose.model(
//   'InvestigationPathologyMaster',
//   InvestigationPathologySchema
// )
// module.exports = InvestigationPathologyMasterModel

const mongoose = require('mongoose')

const ThirdParameterSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: false
  },
  testCode: {
    type: String,
    required: false
  },
  machine: {
    type: String,
    required: false
  },
  machineId: {
    type: String,
    required: false
  },
  unit: {
    type: String,
    required: false
  },
  unitId: {
    type: String,
    required: false
  },
  testDetail: [
    {
      minTestRange: String,
      maxTestRange: String,
      gender: String,
      ageRange: String
    }
  ],
  formula: {
    type: String,
    required: false
  }
})

const ParameterSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: false
  },
  testCode: {
    type: String,
    required: false
  },
  machine: {
    type: String,
    required: false
  },
  machineId: {
    type: String,
    required: false
  },
  unit: {
    type: String,
    required: false
  },
  unitId: {
    type: String,
    required: false
  },
  testDetail: [
    {
      minTestRange: String,
      maxTestRange: String,
      gender: String,
      ageRange: String
    }
  ],
  formula: {
    type: String,
    required: false
  },
  thirdparameters: [ThirdParameterSchema]
})

const InvestigationPathologySchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0
    },
    testName: {
      type: String,
      required: false
    },
    testCode: {
      type: String,
      required: false
    },
    billGroup: {
      type: String,
      required: false
    },
    billGroupId: {
      type: mongoose.Types.ObjectId,
      ref: 'BillGroup'
    },
    department: {
      type: String,
      required: false
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: 'DepartmentSetupModel'
    },
    subDepartment: {
      type: String,
    },
    machineName: {
      type: String,
      required: false
    },
    machineId: {
      type: mongoose.Types.ObjectId,
      ref: 'MachineMaster'
    },
    unit: {
      type: String,
      required: false
    },
    unitId: {
      type: mongoose.Types.ObjectId,
      ref: 'UnitMaster'
    },
    specimen: {
      type: String
    },
    specimenId: {
      type: mongoose.Types.ObjectId,
      ref: 'SpecimenMaster'
    },
    formula: {
      type: String
    },
    testType: {
      type: String,
      required: false
    },
    testDetail: [
      {
        minTestRange: String,
        maxTestRange: String,
        gender: String,
        minAge: String,
        maxAge: String,
        duration: String,
        note: String,
      }
    ],
    description: {
      type: String
    },
    parameters: [ParameterSchema],
    cash: {
      type: Number,
      min: 0
    },
    CGHSnabh: {
      type: Number,
      min: 0
    },
    CGHSnonNabh: {
      type: Number,
      min: 0
    },
    tpaName: {
      type: String,
      default: ''
    },
    tpa: {
      type: Number,
      min: 0
    },
    gipsaaName: {
      type: String,
      default: ''
    },
    gipsaa: {
      type: Number,
      min: 0
    },
    charity: {
      type: Number,
      default: 0,
      min: 0
    },
    rate: {
      type: String
    },
    newCode: {
      type: String
    },
    category: {
      type: String
    },
    delete: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const InvestigationPathologyMasterModel = mongoose.model(
  'InvestigationPathologyMaster',
  InvestigationPathologySchema
)
module.exports = InvestigationPathologyMasterModel
