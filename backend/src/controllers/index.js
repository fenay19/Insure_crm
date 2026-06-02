module.exports.adminController = require("./admin.controller");
module.exports.companyController = require("./companySetup.controller");
module.exports.departmentController = require("./departmentSetup.controller");
module.exports.pincodeController = require("./pincode.controller");
//todo superAdmin
module.exports.superAdminController = require("./superAdmin.controller");
// Chat
module.exports.chatController = require("./Chat/chat.controller");

//Manage Room
module.exports.roomTypeController = require("./Manage Room/roomType.controller");
module.exports.bedMasterController = require("./Manage Room/bedMaster.controller");
module.exports.rateMasterController = require("./Manage Room/rateMaster.controller");

//todo: New Masters
module.exports.bankingDetailsController = require("./Masters/Banking-Details/bankingDetails.controller");
module.exports.productOrServiceCategoryController = require("./Masters/productOrServiceCategory/productOrServiceCategory.controller");
module.exports.subProductCategoryController = require("./Masters/SubProductCategory/SubProductCategory.controller");
module.exports.leaveTypeController = require("./Masters/LeaveType/leaveType.controller");
module.exports.leadReferenceController = require("./Masters/LeadReference/LeadReference.controller");
module.exports.leadStatusController = require("./Masters/LeadStatus/leadStatus.controller");
module.exports.leadStageController = require("./Masters/LeadStage/leadStage.controller");
module.exports.leadTypeController = require("./Masters/LeadType/leadType.controller");
module.exports.categoryOfOrganisationController = require("./Masters/CategoryOfOrganisation/CategoryOfOrganisation.controller");
module.exports.professionController = require("./Masters/Profession/Profession.controller");
module.exports.positionController = require("./Masters/Position/position.controller");
module.exports.departmentControllers = require("./Masters/Department/Department.controller");
module.exports.insDepartmentControllers = require("./Masters/InsDepartment/InsDepartment.controller.js");
module.exports.insCompanyControllers = require("./Masters/InsCompany/InsCompany.controller.js");
module.exports.brokerBranchControllers = require("./Masters/BrokerBranch/BrokerBranch.controller.js");
module.exports.brokerageRateControllers = require("./Masters/BrokerageRate/BrokerageRate.controller.js");
module.exports.fuelTypeControllers = require("./Masters/FuelType/FuelType.controller.js");
module.exports.vehicleTypeControllers = require("./Masters/VehicleType/VehicleType.controller.js");
module.exports.licenseValidityControllers = require("./Masters/LicenseValidity/LicenseValidity.controller.js");
module.exports.marineClauseControllers = require("./Masters/MarineClause/MarineClause.controller.js");
module.exports.endorsementControllers = require("./Masters/Endorsement/Endorsement.controller.js");
module.exports.otherAddonControllers = require("./Masters/OtherAddon/OtherAddon.controller.js");
module.exports.riskCodeControllers = require("./Masters/RiskCode/RiskCode.controller.js");
module.exports.financialYearControllers = require("./Masters/FinancialYear/FinancialYear.controller.js");
module.exports.brokerNameControllers = require("./Masters/BrokerName/BrokerName.controller.js");
module.exports.branchBrokerControllers = require("./Masters/BranchBroker/BranchBroker.controller.js");
module.exports.incotermsControllers = require("./Masters/Incoterms/Incoterms.controller.js");
module.exports.subCustomerGroupControllers = require("./Masters/SubCustomerGroup/SubCustomerGroup.controller.js");
module.exports.networkController = require("./Masters/Network/network.controller");
module.exports.statusController = require("./Masters/Status/status.controller");
module.exports.ticketStatusController = require("./Masters/TicketStatus/ticketStatus.controller.js");
module.exports.taskStatusController = require("./Masters/TaskStatus/taskStatus.controller");

//todo: Prefix
module.exports.prefixController = require("./Masters/Prefix/prefix.controller");

//todo: Client
module.exports.clientRegistrationController = require("./Client/clientRegistration.controller");
module.exports.contactPersonController = require("./Client/contactPerson.controller");

//todo: Customer
module.exports.customerRegistrationController = require("./Customer/customerRegistration.controller");

//todo Customer Group
module.exports.customerGroupControllers = require("./CustomerGroup/CustomerGroup.controller.js");

//todo Policy Management
module.exports.policyDetailControllers = require("./PolicyManagement/PolicyManagement.controller.js");

//todo: type of client
module.exports.typeOfClientController = require("./Client/TypeOfClient.controller");

// todo: Admin-Client
module.exports.AdminClientRegistration = require("./Admin-Client/adminClientRegistration.controller");
module.exports.AdminContactPersonController = require("./Admin-Client/adminContactPerson.controller");
module.exports.AdminTypeOfClientController = require("./Admin-Client/adminTypeOfClient.controller");

//todo: contacts
module.exports.contactsController = require("./Contacts/contact.controller");

//todo: prospect
module.exports.prospectController = require("./Prospect/prospect.controller");

// todo: lead controller
module.exports.leadController = require("./Lead-Management/lead.controller");

//todo: leave manager
// module.exports.LeaveManagerController = require('../controllers/Masters/hr-setup/leaveManager.controller')

//todo: GST Percentage
module.exports.gstPercentageController = require("./Masters/GstPercentage/gstPercentage.controller");

// Old Masters
module.exports.appointmentSchedulingController = require("./Masters/appointment.controller");
module.exports.billGroupController = require("./Masters/billGroup.controller");
module.exports.designationController = require("./Masters/designation.controller");
module.exports.outsourceDiagnosticontroller = require("./Masters/outsourceDiagnostic.controller");
module.exports.partyMasterController = require("./Masters/partyMaster.controller");
module.exports.productMasterController = require("./Masters/productMaster.controller");
module.exports.storeController = require("./Masters/store.controller");
module.exports.serviceDetailsController = require("./Masters/serviceDetailsMaster.controller");
module.exports.OPDPackagesController = require("./Masters/opd_package.controller");
module.exports.surgeryPackageController = require("./Masters/surgeryPackageMaster.controller");
module.exports.OtMasterController = require("./Masters/otMaster.controller");
module.exports.UHID_MRN_NAME_Controller = require("./Masters/uhid_mrn_name.controller");
module.exports.PaymentModeController = require("./Masters/payment_mode.controller");
module.exports.EmployeeRoleController = require("./Masters/employee_role.controller");
module.exports.VitalsMasterController = require("./Masters/vitals.controller");
module.exports.MedicinesMasterController = require("./Masters/medicines.controller");
module.exports.LegderMasterController = require("./Masters/ledger.controller");
module.exports.InsuranceCompanyController = require("./Masters/insurance_company.controller");
module.exports.TemplateSectionController = require("./Template/templateSection.controller");

//hr setup controller
module.exports.diplomaController = require("./Masters/hr-setup/diploma.controller");
module.exports.graduationController = require("./Masters/hr-setup/graduation.controller");
module.exports.postGraduationController = require("./Masters/hr-setup/postGraduation.controller");
module.exports.superSpecializationController = require("./Masters/hr-setup/superSpecialization.controller");
module.exports.listOfCouncilsController = require("./Masters/hr-setup/listOfCouncil.controller");
module.exports.typeOfLeaveController = require("./Masters/hr-setup/typeOfLeave.controller");
//todo: leave manager
module.exports.leaveManagerController = require("./Masters/hr-setup/leaveManager.controller");
module.exports.dearnessAllowanceController = require("./Masters/hr-setup/dearnessAllowance.controller");
module.exports.hraAllowanceController = require("./Masters/hr-setup/hraAllowance.controller");
module.exports.otherAllowanceController = require("./Masters/hr-setup/otherAllowances.controller");
module.exports.entryController = require("./Masters/hr-setup/entry.controller");
module.exports.charityController = require("./Masters/charity.controller");

//Pathology
module.exports.InvestigationPathologyMasterController = require("./Masters/Pathology_Master/investigationRadiologyMaster.controller");
module.exports.machineController = require("./Masters/Pathology_Master/machineMaster.controller");
module.exports.specimenController = require("./Masters/Pathology_Master/specimen.controller");
module.exports.unitController = require("./Masters/Pathology_Master/unitMaster.controller");
module.exports.TemplateSheetController = require("./ipd-form-setup/treatmentSheet.controller");

//Radiology
module.exports.InvestigationRadiologyMasterController = require("./Masters/Radiology_Master/investigationRadiologyMaster.controller");
module.exports.machineRadiologyMasterController = require("./Masters/Radiology_Master/machineRadiologyMaster.controller");
module.exports.specimenRadiologyMasterController = require("./Masters/Radiology_Master/specimenRadiologyMaster.controller");
module.exports.unitRadiologyController = require("./Masters/Radiology_Master/unitRadiologyMaster.controller");

//Staffs
module.exports.consultantController = require("./Satffs/consultants/consultants.controller"); //old consultant controller
module.exports.employeeController = require("./Satffs/employee/employeee.controller");

//newStaffApis

module.exports.AdministrativeController = require("./Satffs/administrative/administrative.controller");
module.exports.SupportController = require("./Satffs/support/support.controller");
module.exports.NursingAndParamedicalController = require("./Satffs/nursingAndParamedical/nursinigAndParamedical.controller");
module.exports.MedicalOfficerController = require("./Satffs/medicalOfficer/medicalOfficer.controller");
module.exports.ConsultantsController = require("./Satffs/consultant/consultant.controller"); //new consultant controller

//Patient
module.exports.patientController = require("./Patient/patient.controller");
module.exports.bookappointmentController = require("./Patient/bookappointment.controller");
module.exports.confirmappointmentController = require("./Patient/confirmappointment.controller");

// OPD
module.exports.opdController = require("./OPD/opd.controller");

// OPD/Patient
module.exports.PatientHistoryController = require("./OPD/Patient/patient_history.controller");
module.exports.PatientChiefComplaintController = require("./OPD/Patient/patient_chief_complaint.controller");
module.exports.PatientPresentIllnessController = require("./OPD/Patient/patient_present_illness.controller");
module.exports.PatientProvisionalDiagnosisController = require("./OPD/Patient/patient_provisional_diagnosis.controller");
module.exports.PatientFinalDiagnosisController = require("./OPD/Patient/patient_final_diagnosis.controller");
module.exports.PatientProcedureController = require("./OPD/Patient/patient_procedure.controller");
module.exports.PatientGlassPrescriptionController = require("./OPD/Patient/patient_glass_prescription.controller");
module.exports.PatientMedicalPrescriptionController = require("./OPD/Patient/patient_medical_prescription.controller");
module.exports.PatientFollowUpController = require("./OPD/Patient/patient_followup.controller");
module.exports.PatientLabRadiologyController = require("./OPD/Patient/patient_lab_radiology.controller");
module.exports.PatientInstructionController = require("./OPD/Patient/patient_instruction.controller");
module.exports.PatientVitalsController = require("./OPD/Patient/patient_vitals.controller");
module.exports.PatientExaminationController = require("./OPD/Patient/patient_examination.controller");

module.exports.OPDReciptController = require("./OPDBillReceipts/OPDBillReceipt.controller");

//Emergency/Patient
module.exports.EmergencyPatientVitalsController = require("./Emergency/Patient/emergency_patient_vitals.controller");
module.exports.EmergencyPatientChiefComplaintController = require("./Emergency/Patient/emergency_chief_complaint.controller");

// Prefix
module.exports.refferByController = require("./Masters/refferByMaster.controller");

//Category
module.exports.categoryController = require("./Masters/category.controller");

// company settings
module.exports.CompanySettingsController = require("./CompanySettings/CompanySettings.controller");

//invoice

module.exports.InvoiceRegistrationController = require("./Invoice/InvoiceRegistration.controller");

//priority
module.exports.priorityController = require("./Masters/Priority/priority.controller");
// Task Management
module.exports.taskManagementController = require("./TaskManagement/taskmanagement.controller");

//ticket management

module.exports.ticketManagementController = require("./TicketManagement/ticketManagement.controller");
