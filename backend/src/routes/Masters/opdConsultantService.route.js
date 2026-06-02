const express = require("express");
const opdConsultantServiceRouter = express.Router();
const serviceController = require("../../controllers/opdConultantService.controller");

// Add service
opdConsultantServiceRouter.post("/add", serviceController.addService);
opdConsultantServiceRouter.post("/import", serviceController.bulkImport);

// Get all services
opdConsultantServiceRouter.get("/all", serviceController.getAllServices);

// Get service by ID
// opdConsultantServiceRouter.get("/:id", serviceController.getServiceById);

// Update service
opdConsultantServiceRouter.put("/:id", serviceController.updateService);
opdConsultantServiceRouter.put(
  "/update-rate/:id",
  serviceController.updateService
);

// Delete service
opdConsultantServiceRouter.put("/delete/:id", serviceController.deleteService);

module.exports = opdConsultantServiceRouter;
