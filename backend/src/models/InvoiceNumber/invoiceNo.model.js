const mongoose = require("mongoose");

const InvoiceNoSchema = mongoose.Schema({
    invoiceNo : {
        type : String, 
    }
}, {
     timestamps: true 

})

const InvoiceNoModel = mongoose.model('InvoiceNoModel', InvoiceNoSchema);


module.exports = InvoiceNoModel;