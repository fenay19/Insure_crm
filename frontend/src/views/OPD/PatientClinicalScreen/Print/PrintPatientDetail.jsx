import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const PrintPatientDetail = () => {
  const patientDetails = useSelector((state) => state.patient.selectedPatient);

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }

    return `${years} Y, ${months} M, ${days} D`;
  }

  function formatDate(dob) {
    const date = new Date(dob);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <Box sx={{ width: '100%', padding: '8px 0', borderBottom: '1px solid #000' }} className="notranslate">
      <Typography
        align="center"
        variant="h3"
        sx={{
          fontWeight: 600,
          mb: 4,
          textDecoration: 'underline'
        }}
      >
        Outpatient Doctor Assessment Form
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '12px' }}>
        {/* Left Column */}
        <Box sx={{ flex: '1 1 30%', mb: 1 }}>
          <p>
            <strong>Patient Name:</strong> {patientDetails?.prefix}. {patientDetails?.patientFirstName} {patientDetails?.patientMiddleName}{' '}
            {patientDetails?.patientLastName}
          </p>
          <p>
            <strong>DOB:</strong> {patientDetails?.dob ? formatDate(patientDetails.dob) : 'N/A'}
          </p>
          <p>
            <strong>Address:</strong> {patientDetails?.address ? `${patientDetails.address} - ${patientDetails.pincode}` : 'N/A'}
          </p>
          <p>
            <strong>Department:</strong> {patientDetails?.departmentName || 'N/A'}
          </p>
        </Box>

        {/* Middle Column */}
        <Box sx={{ flex: '1 1 30%', mb: 1 }}>
          <p>
            <strong>Mobile No.:</strong> {patientDetails?.mobile_no || 'N/A'}
          </p>
          <p>
            <strong>OPD Reg. Date:</strong> {patientDetails?.registrationDate || 'N/A'}
          </p>
          <p>
            <strong>OPD No.:</strong> {patientDetails?.opd_regNo || 'N/A'}
          </p>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: '1 1 30%', mb: 1 }}>
          <p>
            <strong>Gender/Age:</strong> {patientDetails?.gender || 'N/A'} /{' '}
            {patientDetails?.dob ? calculateAge(patientDetails.dob) : 'N/A'}
          </p>
          <p>
            <strong>UHID:</strong> {patientDetails?.uhid || 'N/A'}
          </p>
          <p>
            <strong>Doctor:</strong> {patientDetails?.consultantName || 'N/A'}
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default PrintPatientDetail;
