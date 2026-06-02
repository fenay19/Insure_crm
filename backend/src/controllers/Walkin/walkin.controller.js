const WalkinModel = require('../../models/Walkin/walkin.model.js')
const { AdminModel, InvoiceNoModel } = require('../../models')
const { ConsultantModel, EmployeeModel, ServiceDetailsModel } = require('../../models')



const generateWalkinNumber = async () => {
    const year = new Date().getFullYear();

    const latestWalkIn = await WalkinModel.findOne({})
        .sort({ createdAt: -1 })
        .select("walkInNumber");

    let newSerialNumber;

    if (latestWalkIn && latestWalkIn.walkInNumber) {
        const lastSerial = latestWalkIn.walkInNumber.split("-")[2];
        newSerialNumber = (parseInt(lastSerial) + 1).toString().padStart(5, "0");
    } else {
        newSerialNumber = "00001";
    }

    return `WI-${year}-${newSerialNumber}`;
};

const generateInvoiceNumber = async () => {

    let invoiceNumber = await InvoiceNoModel.findOne()

    if (!invoiceNumber) {
        invoiceNumber = new InvoiceNoModel({ invoiceNo: "1" });
    } else {
        const incrementedInvoiceNo = (parseInt(invoiceNumber.invoiceNo) + 1).toString();
        invoiceNumber.invoiceNo = incrementedInvoiceNo;
    }

    await invoiceNumber.save();
    return invoiceNumber.invoiceNo;
}

const createWalkin = async (req, res) => {


    try {
        const userId = req.user.adminId;
        // const user = await AdminModel.findOne({ _id: "66ebd2edd646123be2f8bdf1" });
        const user = await AdminModel.findOne({ _id: userId });

        let { paidAmount, finalAmount, services } = req.body;

        const walkInNumber = await generateWalkinNumber();
        const invoiceNumber = await generateInvoiceNumber();
        let newWalkin;

        if (user.role === "admin") {
            req.body.user = user.refId;
            newWalkin = {
                ...req.body,
                whoBookId: user.refId,
                whoBookName: user.name,
                invoiceNo: invoiceNumber,
                walkInNumber,
            };
        }

        else if (user.role === "doctor") {
            const doctor = await ConsultantModel.findOne({ _id: user.refId });

            if (!doctor) {
                return res.status(404).json({ error: "Doctor not found." });
            }

            req.body.user = doctor.basicDetails.user;
            newWalkin = {
                ...req.body,
                whoBookId: user.refId,
                whoBookName: user.name,
                invoiceNo: invoiceNumber,
                walkInNumber,
            };
        }


        else if (user.role !== "admin" && user.role !== "doctor") {
            const employee = await EmployeeModel.findOne({ _id: user.refId });

            if (!employee) {
                return res.status(404).json({ error: "Employee not found." });
            }

            req.body.user = employee.basicDetails.user;
            newWalkin = {
                ...req.body,
                whoBookId: user.refId,
                whoBookName: user.name,
                invoiceNo: invoiceNumber,
                walkInNumber,
            };
        } else {
            return res.status(400).json({ error: "Invalid user role." });
        }


        //set billing status
        if (paidAmount >= finalAmount) {
            newWalkin.billingStatus = "Paid";
        } else if (paidAmount > 0) {
            newWalkin.billingStatus = "Partially_Paid";
        } else {
            newWalkin.billingStatus = "Non_Paid";
        }

        // Increase count of services
        for (const service of services) {
            const serviceData = await ServiceDetailsModel.findOne({ _id: service.refId });

            if (serviceData) {
                serviceData.count += 1;
                await serviceData.save();
            } else {
                return res.status(404).json({ error: `Service with ID ${service.refId} not found.` });
            }
        }

        const savedWalkin = await WalkinModel.create(newWalkin);

        res.status(201).json({ message: "Walk-in created successfully.", walkin: savedWalkin });
    } catch (error) {
        console.error("Error - creating walkin:", error);
        res.status(500).json({ "message": "An internal server error occurred. Please try again later.", error: error.message });
    }
};

const getWalking = async (req, res) => {
    try {

        const walkinData = await WalkinModel.find({ delete: false })
            .populate({
                path: 'patientId',
                model: 'patientDetails',
            })


        if (!walkinData || walkinData.length === 0) {
            return res.status(200).json({ message: 'No walk-ins found' , data : []});
        }

        res.status(200).json({
            success: true,
            data: walkinData
        });
    } catch (error) {
        console.error('Error fetching walk-ins:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching walk-ins',
            error: error.message
        });
    }
};

const getSingleWalkin = async (req, res) => {
    const id = req.params.id;

    try {
        const singleWalkin = await WalkinModel
            .findOne({ _id: id, delete: false })
            .populate({ path: 'patientId', model: 'patientDetails' })
            .populate({ path: 'services.refId', model: 'ServiceDetailsMaster' })


        if (!singleWalkin) {
            return res.status(404).json({
                message: "Walk-in record not found"
            });
        }

        res.status(200).json({
            message: "Walk-in record found successfully",
            singleWalkin
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching the walk-in record",
            error: error.message
        });
    }
};

const updateWalkin = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedWalkin = await WalkinModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({
            message: "Walk-in record updated successfully",
            updatedWalkin
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating walk-in record",
            error: error.message
        });
    }
};


const deleteWalkin = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedWalkin = await WalkinModel.findByIdAndUpdate(
            id,
            { $set: { delete: true } },
            { new: true }
        );

        if (!deletedWalkin) {
            return res.status(404).json({ message: "Walk-in record not found" });
        }

        res.status(200).json({
            message: "Walk-in record deleted successfully",
            deletedWalkin
        });
    } catch (error) {
        res.status(500).json({
            message: "Error : Unable to delete Walk-in",
            error: error.message
        });
    }
};


module.exports = {
    createWalkin,
    getWalking,
    updateWalkin,
    deleteWalkin,
    getSingleWalkin
}






