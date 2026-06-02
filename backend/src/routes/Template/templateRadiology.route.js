const express=require("express");
const TemplateRadiology=express.Router();
const { CreateTemplateRadiologyController,GetTemplateRadiologyController,updateTemplateRadiologyController,deleteTemplateRadiologyController}=require("../../controllers/Template/templateRadiology.controller");


TemplateRadiology.post('/files',CreateTemplateRadiologyController);
  TemplateRadiology.get('/files',GetTemplateRadiologyController);
TemplateRadiology.put('/:id',updateTemplateRadiologyController);
TemplateRadiology.delete('/:id',deleteTemplateRadiologyController)

module.exports=TemplateRadiology