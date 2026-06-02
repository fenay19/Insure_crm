const mongoose = require('mongoose');

const TimeIntervalMasterSchema = new mongoose.Schema({
    timeInterval: {
        type: String,
        required: false
    },
    delete:{
        type: Boolean,
        default: false
    },
    deletedAt:{
        type: Date,
    },
},
{
    timestamps: true,
    versionKey: false
});

const TimeIntervalModel = mongoose.model("time_interval", TimeIntervalMasterSchema);

module.exports = TimeIntervalModel;