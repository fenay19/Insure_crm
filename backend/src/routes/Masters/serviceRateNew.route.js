const express = require('express')
const {
  createNewService,
  getAllServiceRates,
  updateServiceRates,
  fetchServiceCodeAndRatesAccordingToServiceListItemAndFilter,
  updateRecordIsValid,
  fetchIsValidStatusOfRecords,
  deleteServiceRateListItem,
  fetchValidServicesOfRatelist,
  editService,
  getCreatedAndUpdatedHistoryOfServiceRate,
  getApplicableServiceRateListForPatient
} = require('../../controllers/Masters/serviceRateNew.controller')
const { handleToken } = require('../../utils/handleToken')

const serviceRateRouterNew = express.Router()

serviceRateRouterNew.post('/', handleToken, createNewService)
serviceRateRouterNew.put('/:id', handleToken, editService)
serviceRateRouterNew.get('/', handleToken, getAllServiceRates)
serviceRateRouterNew.put('/', handleToken, updateServiceRates)
serviceRateRouterNew.get(
  '/getServiceCodesAndRates/:selectedRateListItemId/:selectedFilter',
  fetchServiceCodeAndRatesAccordingToServiceListItemAndFilter
)
serviceRateRouterNew.put(
  '/valid/updateRecordIsValid',
  handleToken,
  updateRecordIsValid
)
serviceRateRouterNew.get(
  '/getIsValidStatusOfRecords/:selectedRateListItemId/:selectedFilter',
  handleToken,
  fetchIsValidStatusOfRecords
)
serviceRateRouterNew.put(
  '/deleteServiceRateListItem/:selectedRateListItemId',
  handleToken,
  deleteServiceRateListItem
)
serviceRateRouterNew.get(
  '/getValidServices/:selectedRateListItemId/:selectedFilter',
  handleToken,
  fetchValidServicesOfRatelist
)
serviceRateRouterNew.get(
  '/getCreatedAndUpdatedHistoryOfServiceRate/:selectedRateListItemId/:selectedFilter/:serviceIdOfRelatedMaster',
  handleToken,
  getCreatedAndUpdatedHistoryOfServiceRate
)

serviceRateRouterNew.get('/getApplicableServiceListForPatient/:payeeCategory/:patientPayee/:tpa', getApplicableServiceRateListForPatient )

module.exports = serviceRateRouterNew
