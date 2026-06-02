const httpStatus = require("http-status");
const { SurgeryPackageModel } = require("../../models");
const DepartmentSetupModel = require("../../models/departmentSetup.model")

const getAllSurgeryPackages = async (req, res) => {
    try {
        const surgeryPackage = await SurgeryPackageModel.find({ delete: false });
        if (!surgeryPackage) {
            return res.status(500).json({ err: "Error in finding Surgery Package Details" })
        }
        return res.status(httpStatus.OK).json({ msg: "All Surgery Packages found successfully", surgeryPackage })
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
}


const addSurgeryPackage = async (req, res) => {
    try {
        const surgery = req.body;
        if (!surgery) {
            return res.status(400).json({ msg: "Please fill all fields" });
        }

        const Surgery = new SurgeryPackageModel(req.body);
        await Surgery.save();
        return res.status(httpStatus.CREATED).json({ msg: "New Surgery Package added successfully", Surgery });

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Server Error", error });
    }
}


const editSurgeryPackage = async (req, res) => {
    try {
        const { id } = req.params
        const surgery = await SurgeryPackageModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });

        if (!surgery) {
            return res.status(400).json({ msg: "Surgery Package not found" });
        }
        await surgery.save();
        return res.status(httpStatus.OK).json({ msg: "Surgery Package updated successfully", surgery })
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
}

const deleteSurgeryPackage = async (req, res) => {
    try {
        const { id } = req.params
        const surgery = await SurgeryPackageModel.findByIdAndUpdate({ _id: id }, { delete: true, deletedAt: Date.now() }, { new: true });
        if (!surgery) {
            return res.status(400).json({ msg: "Surgery Package not found" });
        }
        await surgery.save();
        return res.status(httpStatus.OK).json({ msg: "Surgery Package deleted successfully" });
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }
}

// const bulkImport = async (req, res) => {
//     try {  
//         const surgeryPackage = req.body;
//         const result = await SurgeryPackageModel.insertMany(surgeryPackage);
//         res.status(httpStatus.CREATED).json({ msg: "New Surgery Package added successfully", data: result });
//     } catch (error) {
//         console.error(error);
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
//     }
// }

const bulkImport = async (req, res) => {
    try {
      const surgeries = req.body; 
  
      const surgeryPackage = [];
  
      for (const surgery of surgeries) {
        const department = await DepartmentSetupModel.findOne({ departmentName: surgery.department });
  
        if (!department) {
          return res.status(400).json({
            error: `'${surgery.department}' is not found`
          });
        }
  
        surgery.departmentId = department._id;
  
        surgeryPackage.push({
          SurgeryName: surgery.SurgeryName,
          surgeryCode: surgery.surgeryCode,
          surgeryType: surgery.surgeryType,
          surgeryMode: surgery.surgeryMode,
          department: surgery.department,
          departmentId: surgery.departmentId,
          status: surgery.status
        });
      }
  
      const result = await SurgeryPackageModel.insertMany(surgeryPackage);
  
      res.status(httpStatus.CREATED).json({
        msg: "New Surgery Package added successfully",
        data: result
      });
    } catch (error) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error'
      });
    }
  };
  

const getAllSurgeryPackagesByDeptId =  async (req, res) => {
    try{
        const  {id}  = req.params;
        const surgeryPackage = await SurgeryPackageModel.find({departmentId:id});
        if (!surgeryPackage) {
            return res.status(500).json({ err: "Error in finding Surgery Package Details" })
        }
        return res.status(httpStatus.OK).json({ msg: " Surgery Packages found successfully", surgeryPackage })
    } catch (error) {
        res.status(500).json({ err: "Server Error", error });
    }

} 

module.exports = {
    getAllSurgeryPackages,
    addSurgeryPackage, 
    editSurgeryPackage,
    deleteSurgeryPackage,
    bulkImport,
    getAllSurgeryPackagesByDeptId
}