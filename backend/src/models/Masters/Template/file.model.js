const mongoose=require("mongoose");

const fileSchema = new mongoose.Schema({
    fileName: String,
    sectionContents: {
        type: Map,       // Map allows dynamic keys (e.g., observation, impression)
        of: String    
      }
  });
  
  const File = mongoose.model('File', fileSchema);
  module.exports=File;