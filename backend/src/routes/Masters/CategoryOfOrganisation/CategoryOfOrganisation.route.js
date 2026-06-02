const express = require('express')
const CategoryOfOrganisationRouter = express.Router()
const { categoryOfOrganisationController } = require('../../../controllers/index')
const { handleToken } = require('../../../utils/handleToken')

CategoryOfOrganisationRouter.get('/', handleToken, categoryOfOrganisationController.getCategoryOfOrganisationController)
CategoryOfOrganisationRouter.post('/', handleToken, categoryOfOrganisationController.postCategoryOfOrganisationController)
CategoryOfOrganisationRouter.put('/:id', handleToken, categoryOfOrganisationController.putCategoryOfOrganisationController)
CategoryOfOrganisationRouter.delete('/:id', handleToken, categoryOfOrganisationController.deleteCategoryOfOrganisationController)


module.exports = CategoryOfOrganisationRouter