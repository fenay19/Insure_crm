const express = require('express')
const RouteRouter = express.Router()
const routeController = require('../../../controllers/Masters/medicine/routeController')
const { handleToken } = require('../../../utils/handleToken')

// Create a new Route
RouteRouter.post('/', handleToken, routeController.createRoute)
RouteRouter.post('/import', handleToken, routeController.bulkImport)

// Get all Routes (excluding deleted ones)
RouteRouter.get('/', handleToken, routeController.getAllRoutes)

// Update a Route by ID
RouteRouter.put('/:id', handleToken, routeController.updateRoute)

// Soft Delete a Route by ID
RouteRouter.put('/delete/:id', handleToken, routeController.deleteRoute)

module.exports = RouteRouter
