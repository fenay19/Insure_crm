import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeIcon from '@mui/icons-material/Home';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { get } from 'api/api';
import dayjs from 'dayjs';

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const GetUserData = async () => {
    try {
      const response = await get(`administrative/${localStorage.getItem('empId')}/`);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetUserData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography variant="h6" color="text.secondary">
          No Data Found
        </Typography>
      </Box>
    );
  }

  const { basicDetails, employmentDetails, educationDetails, pastEmploymentDetails } = data;

  const InfoRow = ({ label, value, icon }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {icon && <Box sx={{ color: 'primary.main', mt: 0.5 }}>{icon}</Box>}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
            {value || '—'}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );

  const SectionHeader = ({ title, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={3}>
            <Avatar
              src={basicDetails?.profilePhoto || ''}
              alt={basicDetails?.firstName}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid rgba(255,255,255,0.3)',
                fontSize: 48,
                fontWeight: 600,
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            >
              {basicDetails?.firstName?.[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                {basicDetails?.firstName} {basicDetails?.middleName} {basicDetails?.lastName}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                <Chip
                  label={`Emp Code: ${basicDetails?.empCode}`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
                <Chip
                  label={employmentDetails?.typeOfEmployee || 'Employee'}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {basicDetails?.email && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">{basicDetails.email}</Typography>
                  </Box>
                )}
                {basicDetails?.contactNumber && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">{basicDetails.contactNumber}</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Basic Details */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <SectionHeader title="Basic Details" icon={<PersonIcon />} />
              <Grid container spacing={3}>
                <InfoRow label="Gender" value={basicDetails?.gender} />
                <InfoRow
                  label="Date of Birth"
                  value={basicDetails?.dateOfBirth ? dayjs(basicDetails.dateOfBirth).format('DD MMM YYYY') : '—'}
                />
                <InfoRow label="Aadhar Number" value={basicDetails?.adharNumber} />
                <InfoRow label="Marital Status" value={basicDetails?.isMarried ? 'Married' : 'Single'} />
                {basicDetails?.isMarried && (
                  <>
                    <InfoRow label="Spouse Name" value={basicDetails?.spouseName} />
                    <InfoRow
                      label="Anniversary"
                      value={basicDetails?.dateOfAnniversary ? dayjs(basicDetails.dateOfAnniversary).format('DD MMM YYYY') : '—'}
                    />
                  </>
                )}
                <InfoRow label="Contact Number" value={basicDetails?.contactNumber} />
                <InfoRow label="Alternate Contact" value={basicDetails?.alternateContactNumber} />
                <InfoRow label="Email Address" value={basicDetails?.email} />
                <InfoRow label="Alternate Email" value={basicDetails?.alternateEmail} />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <SectionHeader title="Residential Address" icon={<HomeIcon />} />
              <Grid container spacing={3}>
                <InfoRow label="Address" value={basicDetails?.residentialAddress} />
                <InfoRow label="City" value={basicDetails?.residentialCity} />
                <InfoRow label="District" value={basicDetails?.residentialDistrict} />
                <InfoRow label="State" value={basicDetails?.residentialState} />
                <InfoRow label="Pincode" value={basicDetails?.residentialPincode} />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <SectionHeader title="Permanent Address" icon={<HomeIcon />} />
              <Grid container spacing={3}>
                <InfoRow label="Address" value={basicDetails?.permanentAddress} />
                <InfoRow label="City" value={basicDetails?.permanentCity} />
                <InfoRow label="District" value={basicDetails?.permanentDistrict} />
                <InfoRow label="State" value={basicDetails?.permanentState} />
                <InfoRow label="Pincode" value={basicDetails?.permanentPincode} />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contacts */}
        {basicDetails?.emergencyContacts && basicDetails.emergencyContacts.length > 0 && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <SectionHeader title="Emergency Contacts" icon={<ContactEmergencyIcon />} />
                <Grid container spacing={2}>
                  {basicDetails.emergencyContacts.map((contact, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Paper
                        elevation={0}
                        sx={{ p: 2.5, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}
                      >
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                          {contact.emergencyContactPersonName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          📱 {contact.emergencyContactPersonMobileNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📍 {contact.emergencyAddress}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Bank Details */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <SectionHeader title="Bank Details" icon={<AccountBalanceIcon />} />
              <Grid container spacing={3}>
                <InfoRow label="Account Holder" value={basicDetails?.nameOnBankAccount} />
                <InfoRow label="Bank Name" value={basicDetails?.bankName} />
                <InfoRow label="Branch" value={basicDetails?.branchName} />
                <InfoRow label="Account Number" value={basicDetails?.bankAccountNumber} />
                <InfoRow label="IFSC Code" value={basicDetails?.ifscCode} />
                <InfoRow label="PAN Number" value={basicDetails?.panCardNo} />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Employment Details */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <SectionHeader title="Employment Details" icon={<WorkIcon />} />
              <Grid container spacing={3}>
                <InfoRow label="Department" value={employmentDetails?.department?.department} />
                <InfoRow label="Position" value={employmentDetails?.position?.position} />
                <InfoRow
                  label="Joining Date"
                  value={employmentDetails?.joiningDate ? dayjs(employmentDetails.joiningDate).format('DD MMM YYYY') : '—'}
                />
                <InfoRow label="Employee Type" value={employmentDetails?.typeOfEmployee} />
                <InfoRow label="Location" value={employmentDetails?.location} />
                <InfoRow label="Description" value={employmentDetails?.description} />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Education & Past Employment Accordions */}
        <Grid item xs={12}>
          <Accordion sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 4, py: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <SchoolIcon color="primary" />
                <Typography fontWeight={600} variant="h6">
                  Education Details
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 4, pb: 4 }}>
              {educationDetails && educationDetails.length > 0 ? (
                <Grid container spacing={2}>
                  {educationDetails.map((edu, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Paper
                        elevation={0}
                        sx={{ p: 2.5, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}
                      >
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                          {edu.qualification}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🎓 {edu.universityOrBoard}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📅 {edu.yearOfPassing}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">No education details available</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>

        {pastEmploymentDetails && pastEmploymentDetails.length > 0 && (
          <Grid item xs={12}>
            <Accordion sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 4, py: 2 }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <WorkIcon color="primary" />
                  <Typography fontWeight={600} variant="h6">
                    Past Employment
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 4, pb: 4 }}>
                <Grid container spacing={2}>
                  {pastEmploymentDetails.map((job, i) => (
                    <Grid item xs={12} md={6} key={i}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
                          {job.organisationName}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Designation
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {job.designation}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Emp Code
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {job.empCode}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Joining
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {job.joiningDate ? dayjs(job.joiningDate).format('DD MMM YYYY') : '—'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Relieving
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {job.relievingDate ? dayjs(job.relievingDate).format('DD MMM YYYY') : '—'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Salary
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              ₹{job.inHandSalary}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Experience
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {job.yearsOfExperience} years
                            </Typography>
                          </Grid>
                          {job.note && (
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">
                                Note
                              </Typography>
                              <Typography variant="body2">{job.note}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Profile;
