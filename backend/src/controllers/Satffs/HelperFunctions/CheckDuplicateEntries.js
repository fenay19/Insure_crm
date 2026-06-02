const checkDuplicateFields = async (model, data) => {
  try {
    const { contactNumber, email, adharNumber } = data

    // Build the query dynamically
    const query = {
      $or: []
    }

    if (contactNumber) {
      query.$or.push({ 'basicDetails.contactNumber': contactNumber })
    }
    if (email) {
      query.$or.push({ 'basicDetails.email': email })
    }
    if (adharNumber) {
      query.$or.push({ 'basicDetails.adharNumber': adharNumber })
    }

    // If no fields are provided, return null
    if (query.$or.length === 0) {
      return null
    }

    // Check for existing record
    const existingRecord = await model.findOne(query)

    if (existingRecord) {
      let errorMessage = 'Duplicate entry found:'
      if (
        contactNumber &&
        existingRecord.basicDetails.contactNumber === contactNumber
      ) {
        errorMessage += ' Contact Number already exists.'
      }
      if (email && existingRecord.basicDetails.email === email) {
        errorMessage += ' Email already exists.'
      }
      if (
        adharNumber &&
        existingRecord.basicDetails.adharNumber === adharNumber
      ) {
        errorMessage += ' Aadhar Number already exists.'
      }

      return errorMessage
    }

    return null
  } catch (error) {
    throw new Error('Error while checking duplicate fields: ' + error.message)
  }
}

module.exports = checkDuplicateFields
