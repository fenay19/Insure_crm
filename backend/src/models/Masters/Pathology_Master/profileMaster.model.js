// const mongoose = require('mongoose')

// const ProfileSchema = new mongoose.Schema(
//   {
//     profileName: {
//       type: String,
//       required: false
//     },
//     selectedTests: [
//       {
//         testId: {
//           type: mongoose.Types.ObjectId,
//           ref: 'InvestigationPathologyMaster'
//         }
//       }
//     ],

//     billGroup: {
//       type: String,
//       required: false
//     },
//     billGroupId: {
//       type: mongoose.Types.ObjectId,
//       ref: 'BillGroup'
//     },

//     department: {
//       type: String,
//       required: false
//     },
//     departmentId: {
//       type: mongoose.Types.ObjectId,
//       ref: 'DepartmentSetupModel'
//     },

//     delete: {
//       type: Boolean,
//       default: false
//     }
//   },
//   {
//     timestamps: false
//   }
// )

// const ProfileMasterModel = mongoose.model('ProfileMasterModel', ProfileSchema)
// module.exports = ProfileMasterModel
const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    profileName: {
      type: String,
      required: false,
    },

    billGroup: {
      type: String,
      required: false,
    },
    billGroupId: {
      type: mongoose.Types.ObjectId,
      ref: "BillGroup",
    },

    department: {
      type: String,
      required: false,
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSetupModel",
    },

    mainTests: [
      {
        testId: {
          type: mongoose.Types.ObjectId,
          ref: "InvestigationPathologyMaster",
        },
      },
    ],

    sections: [
      {
        subheading: {
          type: String,
        },
        tests: [
          {
            testId: {
              type: mongoose.Types.ObjectId,
              ref: "InvestigationPathologyMaster",
            },
          },
        ],
      },
    ],

    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProfileMasterModel = mongoose.model("ProfileMasterModel", ProfileSchema);
module.exports = ProfileMasterModel;
