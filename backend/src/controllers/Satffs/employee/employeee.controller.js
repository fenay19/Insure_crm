const { EmployeeModel, ConsultantModel } = require('../../../models');
const { AdminModel } = require('../../../models');
const { RoleModel } = require('../../../models');
const employeeValidation = require('../../../validations/Staffs/employee/employee.validations');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createAdminInSteps = async (req, res) => {
    try {
        const userId = req.user.adminId;
        const admin = await AdminModel.findOne({ _id:userId});
        const { step, data } = req.body;
        if (step === 'basicDetails') {
            const { error, value } = employeeValidation.validate(data, { abortEarly: false });
            if (error) {
                return res.status(httpStatus.BAD_REQUEST).json({ errors: error.details });
            }
            value.basicDetails.user = admin.refId;
            const existingEmail = await EmployeeModel.findOne({ 'basicDetails.email': data.basicDetails.email, delete:false });
            const existingMobile = await EmployeeModel.findOne({ 'basicDetails.mobile': data.basicDetails.mobile, delete:false});
            const existingAadhar = await EmployeeModel.findOne({ 'basicDetails.aadhar': data.basicDetails.aadhar, delete:false });

            if (existingEmail) {
                return res.status(httpStatus.CONFLICT).json({ msg: 'Email already exists!' });
            }

            if (existingMobile) {
                return res.status(httpStatus.CONFLICT).json({ msg: 'Mobile number already exists!' });
            }

            if (existingAadhar) {
                return res.status(httpStatus.CONFLICT).json({ msg: 'Aadhar number already exists!' });
            }

            const adminWithEmail = await AdminModel.findOne({ email: data.basicDetails.email });
            if (adminWithEmail) {
                return res.status(httpStatus.CONFLICT).json({ msg: 'Email already exists in admin records!' });
            }

            const name = data.basicDetails.prefix+'.'+' '+ data.basicDetails.firstName + ' ' + data.basicDetails.lastName;
            const email = data.basicDetails.email;
            const username = name.substring(0, 2); 
            const middleChars = data.basicDetails.mobile.substring(4); 
            const specialChar = '@'; 
            const generatedPassword = `${username}${specialChar}${middleChars}`;
            console.log("generatedPassword", generatedPassword);
            const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);
            
            
            const newAdmin = new EmployeeModel(value);
            const savedAdmin = await newAdmin.save();
            const newUser = new AdminModel({
                name,
                email,
                password: hashedPassword,
                refId: savedAdmin._id,
                role: savedAdmin.basicDetails.empRole,
                roleId: savedAdmin.basicDetails.empRoleId,
              });
          
            await newUser.save();

            return res.status(httpStatus.CREATED).json({ msg: 'Employee record created successfully!!', empId: savedAdmin._id });
        } else if (step === "documents") {
            const { empId , sign} = req.body;
            console.log("empId", empId)
            const documentFields = [
                'aadharCard',
                'panCard',
                'passbook',
                'photo',
                'joining',
                'revealing',
                'SSC',
                'HSC',
                'graduation',
                'postGraduation',
                'other',
            ];

            const existingAdmin = await EmployeeModel.findById({ _id: empId });
            if (!existingAdmin) {
                return res.status(httpStatus.NOT_FOUND).json({ msg: 'Employee not found!!' });
            }

            const uploadedFiles = {};

            for (const key of documentFields) {
                const files = req.files[key];
                if (files && files.length > 0) {
                    uploadedFiles[key] = files.map(file => file.filename).join(', ');
                }
            }

            try {
                existingAdmin.documents = {...uploadedFiles, sign: sign};
                await existingAdmin.save();
                return res.status(httpStatus.CREATED).json({ msg: 'Documents uploaded and links saved successfully!!' });
            } catch (error) {
                console.error(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error!!' });
            }
        }
         else {
            const { empId } = req.body;
            const existingAdmin = await EmployeeModel.findById({ _id: empId });
            if (!existingAdmin) {
                return res.status(httpStatus.NOT_FOUND).json({ msg: 'Employee not found!!' });
            }

            switch (step) {
                case 'addressDetails':
                    existingAdmin.addressDetails = data.addressDetails;
                    break;
                case 'educationalDetails':
                    existingAdmin.educationalDetails = data.educationalDetails;
                    break;
                case 'bankingDetails':
                    const existingPAN = await EmployeeModel.findOne({ 'bankingDetails.panNumber': data.bankingDetails.panNumber, delete:false });
                    if (existingPAN) {
                        return res.status(httpStatus.BAD_REQUEST).json({ msg: 'PAN number already exists in bank details!' });
                    }
                    existingAdmin.bankingDetails = data.bankingDetails;
                    break;
                default:
                    return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Invalid step!!' });
            }

            await existingAdmin.save();
            return res.status(httpStatus.OK).json({ msg: `${step} updated successfully!!`, empId });
        }
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error!!' });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const user = await AdminModel.findOne({ _id: req.user.adminId });
        if (user.role === 'admin') {
            const admins = await EmployeeModel.find({ delete: false,  'basicDetails.user':req.user.branchId });
            res.status(httpStatus.OK).json({ data: admins });
        } else if (user.role ==='doctor') {
            const existingDoctor = await ConsultantModel.findOne({ _id: req.user.branchId });
            console.log("existingDoctor", existingDoctor);
            const admins = await EmployeeModel.find({ delete: false, 'basicDetails.user':existingDoctor.basicDetails.user });
            res.status(httpStatus.OK).json({ data: admins });
        }else if (user.role !=='admin' && user.role!== 'doctor') {
            const existingEmployee = await EmployeeModel.findOne({ _id: req.user.branchId });
            const admins = await EmployeeModel.find({ delete: false, 'basicDetails.user':existingEmployee.basicDetails.user });
            res.status(httpStatus.OK).json({ data: admins });
        }
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error!!' });
    }
};

const updateAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data } = req.body;
        const { step } = req.body; 
        const deletes = false;

        let updatedAdmin;
        switch (step) {
            case 'basicDetails':
                const existingCons = await EmployeeModel.findOne({ 'basicDetails.email': data.basicDetails.email, delete: deletes });
                const existingMobile = await EmployeeModel.findOne({ 'basicDetails.mobile': data.basicDetails.mobile, delete: deletes });
                const existingAadhar = await EmployeeModel.findOne({ 'basicDetails.aadhar': data.basicDetails.aadhar, delete: deletes });
                const adminWithEmail = await AdminModel.findOne({ refId: id  });
                if (existingCons && existingCons._id.toString() !== id) {
                    return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Email already exists!!' });
                }
                if (existingMobile && existingMobile._id.toString() !== id) {
                    return res.status(httpStatus.CONFLICT).json({ msg: 'Mobile number already exists!' });
                }

                if (existingAadhar && existingAadhar._id.toString() !== id) {
                    return res.status(httpStatus.CONFLICT).json({ msg: 'Aadhar number already exists!' });
                }

                if (adminWithEmail && adminWithEmail.refId.toString() !== id) {
                    return res.status(httpStatus.CONFLICT).json({ msg: 'Email already exists in admin records!' });
                }
                const name = data.basicDetails.prefix+'.'+' '+ data.basicDetails.firstName + ' ' + data.basicDetails.lastName;

                updatedAdmin = await AdminModel.findByIdAndUpdate(
                    { _id: adminWithEmail._id },
                    { $set: {email:data.basicDetails.email, name:name} },
                    { new: true }
                );

                updatedAdmin = await EmployeeModel.findByIdAndUpdate(
                    { _id: id },
                    { $set: data },
                    { new: true }
                );
                break;
            case 'addressDetails':
                updatedAdmin = await EmployeeModel.findByIdAndUpdate(
                    { _id: id },
                    { $set: data },
                    { new: true }
                );
                break;
            case 'educationalDetails':
                updatedAdmin = await EmployeeModel.findByIdAndUpdate(
                    { _id: id },
                    { $set: data },
                    { new: true }
                );
                break;
            case 'bankingDetails':
                const existingPAN = await EmployeeModel.findOne({ 'bankingDetails.panNumber': data.bankingDetails.panNumber, delete: deletes });
                if (existingPAN && existingPAN._id.toString() !== id) {
                    return res.status(httpStatus.BAD_REQUEST).json({ msg: 'PAN number already exists in bank details!' });
                }
                updatedAdmin = await EmployeeModel.findByIdAndUpdate(
                    { _id: id },
                    { $set: data },
                    { new: true }
                );
                break;
            default:
                return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Invalid step!!' });
        }

        if (!updatedAdmin) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Administrator not found!!' });
        }

        res.status(httpStatus.OK).json({ msg: 'Admin details updated successfully!!', data: updatedAdmin });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error!!' });
    }
};

const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.adminId;
        const employee = await EmployeeModel.findById({ _id: id, 'basicDetails.user': userId  });
        if (!employee) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Employee not found!!' });
        }

        res.status(httpStatus.OK).json({ data: employee });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error!!' });
    }
};

const markAdminAsDeleted = async (req, res) => {
    try {
        const { id } = req.params;
        const administrator = await EmployeeModel.findByIdAndUpdate({ _id: id }, { ...req.body, delete: true, deletedAt: Date.now() });
        if (!administrator) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Employee not found!!' });
        }
        const email = administrator.basicDetails.email;
        const admin = await AdminModel.findOneAndDelete({ email });
        
        res.status(httpStatus.OK).json({ msg: 'Admin marked as deleted!!' });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error!!' });
    }
};

const updateUploadedDocuments = async (req, res) => {
    try {
        const { empId, sign } = req.body;
        const documentFields = [
            'aadharCard',
            'panCard',
            'passbook',
            'photo',
            'joining',
            'revealing',
            'SSC',
            'HSC',
            'graduation',
            'postGraduation',
            'other',
        ];

        const existingAdmin= await EmployeeModel.findById(empId);
        if (!existingAdmin) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Employee not found!!' });
        }

        const uploadedFiles = {};

        for (const key of documentFields) {
            const files = req.files[key];
            if (files && files.length > 0) {
                uploadedFiles[key] = files.map(file => file.filename).join(', ');
            } else {
                uploadedFiles[key] = existingAdmin.documents[key] || '';
            }
        }

        existingAdmin.documents = { ...existingAdmin.documents, ...uploadedFiles, sign:sign };
        await existingAdmin.save();

        return res.status(httpStatus.CREATED).json({ msg: 'Documents updated successfully!!' });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error!!' });
    }
};

const bulkImport = async (req, res) => {
    try {  
        const savedAdmin = req.body;
        const basicDetailsArray = savedAdmin.map(doctor => ({
            basicDetails: {
                prefix: doctor.prefix,
                prefixId: doctor.prefixId,
                firstName: doctor.firstName,
                middleName: doctor.middleName,
                lastName: doctor.lastName,
                gender: doctor.gender,
                fatherName: doctor.fatherName,
                mobile: doctor.mobile,
                alternateMobile: doctor.alternateMobile,
                email: doctor.email,
                alternateEmail: doctor.alternateEmail,
                aadhar: doctor.aadhar,
                department: doctor.department,
                departmentId: doctor.departmentId,
                designation: doctor.designation,
                designationId: doctor.designationId,
                dateOfJoining: doctor.dateOfJoining
            }
        }));
        const result = await EmployeeModel.insertMany(basicDetailsArray);
        res.status(httpStatus.CREATED).json({ msg: "Employee record created successfully!!", data: result });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createAdminInSteps,
    getAllAdmins,
    updateAdminById,
    getAdminById,
    markAdminAsDeleted,
    updateUploadedDocuments,
    bulkImport
};