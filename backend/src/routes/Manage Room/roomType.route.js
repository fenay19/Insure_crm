const express = require('express');
const roomTypeRouter = express.Router();
const { roomTypeController } = require('../../controllers');
// const { validateRoomType } = require('../../validations/Manage Room/roomType.validation');
const {handleToken} = require('../../utils/handleToken'); 

roomTypeRouter.post('/', handleToken, roomTypeController.createRoomType);

roomTypeRouter.get('/', handleToken, roomTypeController.getAllRoomTypes);

roomTypeRouter.get('/:id', handleToken, roomTypeController.getRoomTypeById);

roomTypeRouter.put('/:id', handleToken, roomTypeController.updateRoomTypeById);

roomTypeRouter.post("/import", handleToken, roomTypeController.bulkImport);

roomTypeRouter.put('/delete/:id', handleToken, roomTypeController.deleteRoomTypeById);

module.exports = roomTypeRouter;
