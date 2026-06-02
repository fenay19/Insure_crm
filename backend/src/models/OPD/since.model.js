const mongoose = require('mongoose')

const sinceSchema= new mongoose.Schema({
    since:{
        type:String,
    }
},{
    timestamps:true,
    versionKey:false
})

const SinceMasterModel = mongoose.model("since_master",sinceSchema)

module.exports= SinceMasterModel