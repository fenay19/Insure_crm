const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  address: { type: String  },
  pincode: { type: String  },
  country: { type: String  },
  state: { type: String  },
  city: { type: String },
});

const locationSchemaExp = new mongoose.Schema({
  address: { type: String  },
  pincode: { type: String  },
  country: { type: String },
  state: { type: String  },
  city: { type: String },
  gstNo: { type: String   }
});

const companySettingsSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  alternateMobileNumber: { type: String },
  websiteLink: { type: String },
  gstNo: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  companyLogo: { type: String  },

  locations: {
    exportCenter: [locationSchemaExp],
    factories: [locationSchema],
    warehouse: [locationSchema],
    branches: [locationSchema]
  }
}, { timestamps: true });

const companySettingsModel = mongoose.model('companySettings', companySettingsSchema);


module.exports = companySettingsModel;