const express = require('express')
const EntryController=require("../../../controllers/Masters/hr-setup/entry.controller")

const EntryRouter = express.Router(); 

EntryRouter.get("/",EntryController.getEntry);
EntryRouter.post("/",EntryController.createEntry);
EntryRouter.put('/:id', EntryController.updateEntry)
EntryRouter.delete('/:id', EntryController.deleteEntry)

module.exports=EntryRouter;