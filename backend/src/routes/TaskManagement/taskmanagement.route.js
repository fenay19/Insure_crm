const express = require('express');
const taskmanagementrouter = express.Router();
const {taskManagementController} = require('../../controllers/index');

const { handleToken } = require('../../utils/handleToken')

taskmanagementrouter.post('/', handleToken, taskManagementController.createTask);
taskmanagementrouter.get('/', handleToken, taskManagementController.getAllTasks);
taskmanagementrouter.get('/:id',handleToken, taskManagementController.getTaskById);
taskmanagementrouter.put('/status/:id', handleToken, taskManagementController.UpdateTaskStatus);
taskmanagementrouter.put('/update/:id', handleToken, taskManagementController.updateTask);
taskmanagementrouter.delete('/:id', handleToken, taskManagementController.deleteTask);

module.exports = taskmanagementrouter;