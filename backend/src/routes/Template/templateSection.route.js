const express=require("express");
const TemplateSection=express.Router();
const { CreateTemplateSectionController,GetTemplateSectionController,updateTemplateSectionController,deleteTemplateSectionController}=require("../../controllers/Template/templateSection.controller");


TemplateSection.post('/',CreateTemplateSectionController);
TemplateSection.get('/',GetTemplateSectionController);
TemplateSection.put('/:id',updateTemplateSectionController);
TemplateSection.delete('/:id',deleteTemplateSectionController)

module.exports=TemplateSection