const mongoose = require('mongoose');

const insCompanySchema = new mongoose.Schema(
  {
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
              ref: "Admin",
              required: true,
            },
            insCompany: {
              type: String,
              required: true,
            },
          },
          {
            timestamps: true,
          }
        );


const insCompanyModel = mongoose.model("insCompany", insCompanySchema);
module.exports = insCompanyModel;
