const mongoose = require('mongoose')

const ProvidentFundSchema = new mongoose.Schema(

    {
        employee : {
            type : Number,
            trim : true,
        },

        employer : {
            type : Number,
            trim : true,
        },

        delete : {
            type : Boolean,
            default : false
        }, 
    }, {
        timestamps : true
    }

)

const ProvidentFundMasterModel = mongoose.model('ProvidentFund', ProvidentFundSchema)

