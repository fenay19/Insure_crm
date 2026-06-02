const mongoose = require('mongoose')

const serviceRateListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    category: {
      type: String
    },
    parentPayee: {
      type: [String]
    },
    payee: {
      type: [String]
    },
    pathology: [
      {
        serviceIdOfRelatedMaster: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'InvestigationPathologyMaster',
          default: null
        },
        rate: {
          type: Number,
          default: 0
        },
        code: {
          type: String,
          default: ''
        },
        isValid: {
          type: Boolean,
          default: true
        },
        rateCreatedAt: {
          type: Date,
          default: Date.now
        },
        rateUpdatedAt: {
          type: Date,
          default: Date.now
        },

        codeCreatedAt: {
          type: Date,
          default: Date.now
        },
        codeUpdatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    radiology: [
      {
        serviceIdOfRelatedMaster: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'InvestigationRadiologyMaster',
          default: null
        },
        rate: {
          type: Number,
          default: 0
        },
        code: {
          type: String,
          default: ''
        },
        isValid: {
          type: Boolean,
          default: true
        },
        rateCreatedAt: {
          type: Date,
          default: Date.now
        },
        rateUpdatedAt: {
          type: Date,
          default: Date.now
        },

        codeCreatedAt: {
          type: Date,
          default: Date.now
        },
        codeUpdatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    opdPackage: [
      {
        serviceIdOfRelatedMaster: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'OPD_Packages_Master',
          default: null
        },
        rate: {
          type: Number,
          default: 0
        },
        code: {
          type: String,
          default: ''
        },
        isValid: {
          type: Boolean,
          default: true
        },
        rateCreatedAt: {
          type: Date,
          default: Date.now
        },
        rateUpdatedAt: {
          type: Date,
          default: Date.now
        },

        codeCreatedAt: {
          type: Date,
          default: Date.now
        },
        codeUpdatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    otherServices: [
      {
        serviceIdOfRelatedMaster: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ServiceDetailsMaster',
          default: null
        },
        rate: {
          type: Number,
          default: 0
        },
        code: {
          type: String,
          default: ''
        },
        isValid: {
          type: Boolean,
          default: true
        },
        rateCreatedAt: {
          type: Date,
          default: Date.now
        },
        rateUpdatedAt: {
          type: Date,
          default: Date.now
        },

        codeCreatedAt: {
          type: Date,
          default: Date.now
        },
        codeUpdatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    opdConsultant: [
      {
        serviceIdOfRelatedMaster: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'opdConsultantService',
          default: null
        },
        rate: {
          type: Number,
          default: 0
        },
        code: {
          type: String,
          default: ''
        },
        isValid: {
          type: Boolean,
          default: true
        },
        rateCreatedAt: {
          type: Date,
          default: Date.now
        },
        rateUpdatedAt: {
          type: Date,
          default: Date.now
        },

        codeCreatedAt: {
          type: Date,
          default: Date.now
        },
        codeUpdatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    otherDiagnostics: [
      {
        serviceIdOfRelatedMaster: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'OtherDiagnosticsMaster',
          default: null
        },
        rate: {
          type: Number,
          default: 0
        },
        code: {
          type: String,
          default: ''
        },
        isValid: {
          type: Boolean,
          default: true
        },
        rateCreatedAt: {
          type: Date,
          default: Date.now
        },
        rateUpdatedAt: {
          type: Date,
          default: Date.now
        },

        codeCreatedAt: {
          type: Date,
          default: Date.now
        },
        codeUpdatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    pathologyProfiles: [
      {
        serviceIdOfRelatedMaster: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ProfileMasterModel',
          default: null
        },
        rate: {
          type: Number,
          default: 0
        },
        code: {
          type: String,
          default: ''
        },
        isValid: {
          type: Boolean,
          default: true
        },
        rateCreatedAt: {
          type: Date,
          default: Date.now
        },
        rateUpdatedAt: {
          type: Date,
          default: Date.now
        },

        codeCreatedAt: {
          type: Date,
          default: Date.now
        },
        codeUpdatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    delete: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true // Global `createdAt` and `updatedAt` for the document
  }
)

const serviceRateSchema = new mongoose.Schema(
  {
    billGroupName: {
      type: String,
      trim: true
    },
    serviceName: {
      type: String
    },
    department: {
      type: [String]
    },
    code: {
      type: [String]
    },
    rate: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

const ServiceRateList = mongoose.model(
  'service-modal-list',
  serviceRateListSchema
)
const ServiceModel = mongoose.model('service-modal-rate', serviceRateSchema)
module.exports = { ServiceRateList, ServiceModel }
