const mongoose=require("mongoose");


const fileSchema = new mongoose.Schema({
    fileName: String,
    sectionContents: {
        type: Map,       // Map allows dynamic keys (e.g., observation, impression)
        of: String    
      }
  });
  
  const Form = mongoose.model('ipdFormSetup', fileSchema);
  module.exports=Form;