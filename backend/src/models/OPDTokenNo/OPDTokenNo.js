const mongoose = require('mongoose')

const opdTokenNoSchema = new mongoose.Schema({
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true,
    unique: true
  },
  date: {
    type: String, 
    required: true
  },
  currentTokenNumber: {
    type: Number,
    default: 0 // Starts from 0 and increments
  },
 
})


const OPDTokenNoModel = mongoose.model('OPDTokenNo', opdTokenNoSchema)
module.exports = OPDTokenNoModel
