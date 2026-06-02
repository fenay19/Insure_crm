const express = require('express');
const storeRouter = express.Router();
const { validateStore } = require('../../validations/Masters/store.validation');
const { storeController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

storeRouter.post('/', handleToken, validateStore, storeController.createStore);

storeRouter.post('/import', handleToken, storeController.bulkImport);

storeRouter.get('/', handleToken, storeController.getAllStores);

storeRouter.get('/:id', handleToken, storeController.getStoreById);

storeRouter.put('/:id', handleToken, storeController.updateStoreById);

storeRouter.put('/delete/:id', handleToken, storeController.deleteStoreById);

module.exports = storeRouter;
