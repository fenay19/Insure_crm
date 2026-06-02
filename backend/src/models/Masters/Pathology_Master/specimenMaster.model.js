const mongoose = require("mongoose")

const specimenSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true,
        // unique: true,
    },
    delete:{
        type:Boolean,
        default:false,
    },
    deletedAt:{
        type:Date
    }
},{
   versionKey:false,
   timestamps:true, 
})


const SpecimenModel = mongoose.model("SpecimenMaster", specimenSchema)

module.exports = SpecimenModel
