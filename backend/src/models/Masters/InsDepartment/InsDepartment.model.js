const mongoose = require('mongoose');

const insDepartmentSchema = new mongoose.Schema(
  {
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
              ref: "Admin",
              required: true,
            },
            insDepartment: {
              type: String,
              required: true,
            },
          },
          {
            timestamps: true,
          }
        );


const insDepartmentModel = mongoose.model("insDepartment", insDepartmentSchema);
module.exports = insDepartmentModel;
