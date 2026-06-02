const { EmployeeRoleModel } = require("../../models");
const httpStatus = require("http-status");

const createEmployeeRole = async (req, res) => {
    try {
        const employeeRole = await EmployeeRoleModel.create(req.body);
        return res.status(httpStatus.CREATED).json({msg: "Employee Role Added Successfully", employeeRole});
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "Employee Role Not Found", error});
    }
};

const getEmployeeRole = async (req, res) => {
    try {
        const employeeRole = await EmployeeRoleModel.find({delete: false});
        return res.status(httpStatus.OK).json({msg: "Employee Role Found", employeeRole});
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "Employee Role Not Found", error});
    }
};

const getEmployeeRoleById = async (req, res) => {
    try {
        const employeeRole = await EmployeeRoleModel.findById(req.params.id);
        return res.status(httpStatus.OK).json({msg: "Employee Role Found", employeeRole});
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "Employee Role Not Found", error});
    }
};

const updateEmployeeRole = async (req, res) => {
    try {
        const employeeRole = await EmployeeRoleModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.status(httpStatus.OK).json({msg: "Employee Role Updated Successfully", employeeRole});
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "Employee Role Not Found", error});
    }
};

const bulkImport = async (req, res) => {
    try {  
        const data = req.body;
        const result = await EmployeeRoleModel.insertMany(data);
        res.status(httpStatus.CREATED).json({ msg: "employee role", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

const deleteEmployeeRole = async (req, res) => {
    try {
        const employeeRole = await EmployeeRoleModel.findByIdAndDelete(req.params.id);
        return res.status(httpStatus.OK).json({msg: "Employee Role Deleted Successfully", employeeRole});
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "Employee Role Not Found", error});
    }
};

module.exports = {
    createEmployeeRole,
    getEmployeeRole,
    getEmployeeRoleById,
    updateEmployeeRole,
    deleteEmployeeRole,
    bulkImport
};
