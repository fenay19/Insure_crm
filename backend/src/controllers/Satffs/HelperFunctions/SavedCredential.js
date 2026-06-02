const bcrypt = require('bcrypt');
const { AdminModel } = require('../../../models');

const SaveCredentials = async (savedUserData, referenceType, role) => {
    try {
        const { basicDetails } = savedUserData;

        const hashedPassword = await bcrypt.hash(basicDetails.contactNumber, 10);

        const newUser = {
            name: basicDetails.firstName + " " + basicDetails.lastName,
            email: basicDetails.email,
            password: hashedPassword,
            refId: savedUserData._id,
            refType: referenceType,
            role: role,
        };

        const createUserCredentials = new AdminModel(newUser);
        await createUserCredentials.save();

        return true;
    } catch (error) {
        console.error("Error saving user credentials:", error.message);
        return false;
    }
};

module.exports = { SaveCredentials };
