const express = require("express");
const subCustomerGroupRouter = express.Router();
const { subCustomerGroupControllers } = require("../../../controllers/index");
// const { handleToken } = require('../../utils/handleToken');

subCustomerGroupRouter.get(
  "/",
  subCustomerGroupControllers.getSubCustomerGroup,
);
subCustomerGroupRouter.get(
  "/:id",
  subCustomerGroupControllers.getSubCustomerGroupByCustomer,
);
subCustomerGroupRouter.post(
  "/",
  subCustomerGroupControllers.postSubCustomerGroup,
);
subCustomerGroupRouter.put(
  "/:id",
  subCustomerGroupControllers.updateSubCustomerGroup,
);
subCustomerGroupRouter.delete(
  "/:id",
  subCustomerGroupControllers.deleteSubCustomerGroup,
);

module.exports = subCustomerGroupRouter;
