const express = require("express");
const customerGroupRouter = express.Router();
const { customerGroupControllers } = require("../../controllers/index");
// const { handleToken } = require('../../utils/handleToken');

customerGroupRouter.get("/", customerGroupControllers.getCustomerGroup);
customerGroupRouter.post("/", customerGroupControllers.postCustomerGroup);
customerGroupRouter.get("/:id", customerGroupControllers.getCustomerGroupById);
customerGroupRouter.put("/:id", customerGroupControllers.updateCustomerGroup);
customerGroupRouter.delete(
  "/:id",
  customerGroupControllers.deleteCustomerGroup,
);

module.exports = customerGroupRouter;
