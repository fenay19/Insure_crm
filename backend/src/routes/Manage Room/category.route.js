const express = require('express');
const {createCategoryMaster,
    getAllCategoryMaster,
    updateCategoryMaster,
    deleteCategoryMaster,
    bulkImport} = require('../../controllers/Manage Room/category.controller')
    const {handleToken} = require('../../utils/handleToken'); 
    const CategoryMaster = express.Router();

    CategoryMaster.post('/', handleToken, createCategoryMaster);
    CategoryMaster.post('/import', handleToken, bulkImport);
    CategoryMaster.get('/', handleToken, getAllCategoryMaster);
    CategoryMaster.put('/:id', handleToken, updateCategoryMaster);
    CategoryMaster.put('/delete/:id', handleToken, deleteCategoryMaster);

    module.exports = CategoryMaster;
