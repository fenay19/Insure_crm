const { LedgerModel, SubLedgerModel } = require('../../models')
const httpStatus = require('http-status')

const addLedger = async (req, res) => {
  try {
    const { ledger } = req.body

    const exsistingLedger = await LedgerModel.findOne({
      ledger,
      delete: false
    })
    if (exsistingLedger) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'The Ledger is already exists!!' })
    }
    const newLedger = new LedgerModel(req.body)
    await newLedger.save()
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Ledger created successfully', data: newLedger })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in creating a Ledger', error })
  }
}

const getLedger = async (req, res) => {
  try {
    const allLedger = await LedgerModel.find({ delete: false })
    if (!allLedger) {
      res.status(httpStatus.NOT_FOUND).json({ msg: 'No Ledger found' })
    }
    res
      .status(httpStatus.OK)
      .json({ msg: 'Ledger found successfully', allLedger })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in fetching all the Ledger' }, err)
  }
}

const updateLedger = async (req, res) => {
  try {
    const { id } = req.params
    const { ledger } = req.body
    const deletes = false
    const existingLedger = await LedgerModel.findOne({
      ledger: ledger,
      delete: deletes
    })

    if (existingLedger && existingLedger._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'The Ledger is already exists!!' })
    }

    const newLedger = await LedgerModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    )
    res
      .status(httpStatus.OK)
      .json({ message: 'Ledger updated successfully', Ledger: newLedger })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in updating the Ledger', error })
  }
}

const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params
    const Ledger = await LedgerModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    )

    if (!Ledger) {
      res.status(httpStatus.NOT_FOUND).json({ message: 'No Ledger found!!' })
    }
    res.status(httpStatus.OK).json({ message: 'Ledger deleted successfully!!' })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 'Error in deleting Ledger!!' })
  }
}

const bulkLedgerImport = async (req, res) => {
  try {
    const ledgerData = req.body
    const result = await LedgerModel.insertMany(ledgerData)
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Ledger Imported', data: result })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// Sub Leadger
const addSubLedger = async (req, res) => {
  try {
    const { subLedger } = req.body

    const exsistingSubLedger = await SubLedgerModel.findOne({
      subLedger,
      delete: false
    })

    if (exsistingSubLedger) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'The Sub Ledger is already exists!!' })
    }
    const newSubLedger = new SubLedgerModel(req.body)
    await newSubLedger.save()
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Sub Ledger created successfully', data: newSubLedger })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in creating a Sub Ledger', error })
  }
}

const getSubLedger = async (req, res) => {
  try {
    const allSubLedger = await SubLedgerModel.find({ delete: false })
    if (!allSubLedger) {
      res.status(httpStatus.NOT_FOUND).json({ msg: 'No Sub Ledger found' })
    }
    res
      .status(httpStatus.OK)
      .json({ msg: 'Sub Ledger found successfully', allSubLedger })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in fetching all the Sub Ledger' }, err)
  }
}

const updateSubLedger = async (req, res) => {
  try {
    const { id } = req.params
    const { subLedger } = req.body
    const existingSubLedger = await SubLedgerModel.findOne({
      SubLedger: subLedger,
      delete: false
    })

    if (existingSubLedger && existingSubLedger._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'The Sub Ledger is already exists!!' })
    }

    const newSubLedger = await SubLedgerModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    )
    res
      .status(httpStatus.OK)
      .json({ message: 'Sub Ledger updated successfully', data: newSubLedger })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in updating the Sub Ledger', error })
  }
}

const deleteSubLedger = async (req, res) => {
  try {
    const { id } = req.params
    const SubLedger = await SubLedgerModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    )

    if (!SubLedger) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'No Sub Ledger found!!' })
    }
    res
      .status(httpStatus.OK)
      .json({ message: 'Sub Ledger deleted successfully!!' })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 'Error in deleting Sub Ledger!!' })
  }
}

const bulkSubLedgerImport = async (req, res) => {
  try {
    const SubLedgerData = req.body;

    const updatedSubLedgerData = await Promise.all(
      SubLedgerData.map(async (subLedger) => {
        const ledger = await LedgerModel.findOne({ ledger: subLedger.ledger.trim() });

        if (ledger) {
          return { ...subLedger, ledgerId: ledger._id };
        } else {
          throw new Error(`Ledger not found for name: ${subLedger.ledger}`);
        }
      })
    );

    const result = await SubLedgerModel.insertMany(updatedSubLedgerData);

    res.status(httpStatus.CREATED).json({ msg: 'Sub LedgerData Imported', data: result });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addLedger,
  getLedger,
  updateLedger,
  deleteLedger,
  bulkLedgerImport,

  addSubLedger,
  getSubLedger,
  updateSubLedger,
  deleteSubLedger,
  bulkSubLedgerImport
}
