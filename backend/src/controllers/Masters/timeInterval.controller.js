const TimeIntervalModel = require('../../models/Masters/timeInterval.model');
const httpStatus = require('http-status')

const addTimeInterval = async (req, res) => {
  try {
    const { timeInterval } = req.body

    const exsistingInterval = await TimeIntervalModel.findOne({
        timeInterval,
      delete: false
    })
    if (exsistingInterval) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: 'The time is already exists!!' })
    }
    const data = new TimeIntervalModel(req.body)
    await data.save()
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Time created successfully', data: data })
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in creating a time', error })
  }
}

const getTimeInterval = async (req, res) => {
  try {
    const allInterval = await TimeIntervalModel.find({ delete: false })
    if (!allInterval) {
      res.status(httpStatus.NOT_FOUND).json({ msg: 'No Time found' })
    }
    res
      .status(httpStatus.OK)
      .json({ msg: 'Time found successfully', allInterval })
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error in fetching all the Time' }, err)
  }
}

const TimeInterval = async (req, res) => {
    try {
      const { id } = req.params; 
      const { timeInterval } = req.body; 

      const existingInterval = await TimeIntervalModel.findOne({
        timeInterval,
        _id: { $ne: id },
        delete: false
      });
  
      if (existingInterval) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ msg: 'The time interval already exists!' });
      }
  
      const updatedInterval = await TimeIntervalModel.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );
  
      if (!updatedInterval) {
        return res.status(httpStatus.NOT_FOUND).json({ msg: 'Time interval not found!' });
      }
  
      res
        .status(httpStatus.OK)
        .json({ msg: 'Time interval updated successfully', data: updatedInterval });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error in updating the time interval', error });
    }
  };

  const deleteTimeInterval = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const deletedInterval = await TimeIntervalModel.findByIdAndUpdate(
        id,
        { delete: true }, 
        { new: true } 
      );
  
      if (!deletedInterval) {
        return res.status(httpStatus.NOT_FOUND).json({ msg: 'Time interval not found!' });
      }
  
      res
        .status(httpStatus.OK)
        .json({ msg: 'Time interval deleted successfully', data: deletedInterval });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error in deleting the time interval', error });
    }
  };

  module.exports = {
    addTimeInterval,
    getTimeInterval,
    TimeInterval,
    deleteTimeInterval,
  };