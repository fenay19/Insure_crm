const express = require('express')
const IncomeController=require("../../../controllers/Masters/hr-setup/income.controller")

const IncomeRouter = express.Router(); 

IncomeRouter.get("/",IncomeController.getIncome);
IncomeRouter.post("/",IncomeController.createIncome);
IncomeRouter.put('/:id', IncomeController.updateIncome)
IncomeRouter.delete('/:id', IncomeController.deleteIncome)

module.exports=IncomeRouter;