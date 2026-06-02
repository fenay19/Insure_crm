const express = require("express");
const networkRouter = express.Router();
const { networkController } = require('../../../controllers/index')

const { handleToken } = require('../../../utils/handleToken')

networkRouter.get('/', handleToken, networkController.getNetworkController)
networkRouter.post('/', handleToken, networkController.createNetworkController)
networkRouter.put('/:id', handleToken, networkController.updateNetworkController)
networkRouter.delete('/:id', handleToken, networkController.deleteNetworkController)


module.exports=networkRouter