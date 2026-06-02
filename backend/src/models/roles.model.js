const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    delete: {
        type: Boolean,
        default: false,
      },
      deletedAt: {
        type: Date,
      },
    }, {
      timestamps: true,
      versionKey: false,
    });

    
const RoleModel = mongoose.model('Roles', RoleSchema);
module.exports = RoleModel;