const mongoose = require('mongoose')

const PostGraduationSchema = new mongoose.Schema(
  {
    postGraduation: {
      type: String,
      required: true
    },

    delete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const PostGraduationMasterModel = mongoose.model(
  'PostGraduationMaster',
  PostGraduationSchema
)
module.exports = PostGraduationMasterModel
