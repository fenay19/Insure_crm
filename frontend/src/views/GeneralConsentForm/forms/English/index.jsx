import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, Box, TextField, Grid, Button, List, ListItem } from '@mui/material';

const GeneralConsentFormEnglish = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    relativeName: '',
    consultantDoctor: '',
    language: '',
    explainedBy: '',
    admissionSignature: '',
    admissionPlace: '',
    admissionDate: '',
    patientSignature: '',
    patientPlace: '',
    patientDate: ''
  });

  const [hospitalName] = useState('VIMS - Vidarbha Institute of Medical Sciences');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add your form submission logic here, such as sending the data to an API
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Card elevation={3} sx={{ padding: 4 }}>
        <CardContent>
          <Box textAlign="center" sx={{ mb: 7 }}>
            <Typography
              variant="h4"
              sx={{
                textTransform: 'uppercase',
                fontWeight: 'bold',
                display: 'inline-block',
                position: 'relative'
              }}
            >
              General Consent
            </Typography>
            <Box
              sx={{
                height: '2px',
                width: '40%',
                backgroundColor: 'black',
                margin: '8px auto 0'
              }}
            />
          </Box>

          <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
              I,{' '}
              <TextField
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '50%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />{' '}
              (Patient's Name), Aged{' '}
              <TextField
                name="age"
                value={formData.age}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '10%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />
              , S/o, W/o, D/o{' '}
              <TextField
                name="relativeName"
                value={formData.relativeName}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '78%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />
              , hereby declare that I am willingly getting admitted in {hospitalName} for my treatment as advised by my consultant Dr.{' '}
              <TextField
                name="consultantDoctor"
                value={formData.consultantDoctor}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '30%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />
              under the following conditions:
            </Typography>

            <Box sx={{ mt: 3, pl: 2 }}>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                Please read the following conditions:
              </Typography>
              <List sx={{ fontSize: '1.2rem', listStyleType: 'decimal', pl: 4 }} component="ol">
                <ListItem sx={{ display: 'list-item' }}>
                  I will make all others related to me/patient agree & abide by the rules and regulations of the hospital, including
                  visiting hours, which are conveyed to us by hospital staff.
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  I will take full responsibility to clear all dues to the hospital and promise to deposit sufficient advance amount to meet
                  emergency treatment, also as and when payment slips are issued according to the experience.
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  I have been explained regarding drug allergies / benefits, risks, and alternatives for admission.
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  If in case required, the disclosure of privacy regarding any evidences related to my disease for treatment purpose. Then I
                  don't have any objection about that as I know that is beneficial for me & my treatment.
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  I have been explained the rights and responsibilities of mine in the hospital.
                </ListItem>
              </List>
            </Box>

            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
              The above points have been explained to me in the language,{' '}
              <TextField
                name="language"
                value={formData.language}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '30%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />
              , which I understand by Mr./Ms./Dr.{' '}
              <TextField
                name="explainedBy"
                value={formData.explainedBy}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '40%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />{' '}
              of {hospitalName}.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
              This consent is given by me in my full senses and on my own free will.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.2rem' }}>
                  Admission Executive / CMO
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" style={{ fontSize: '1rem', marginRight: '10px' }}>
                    Signature:{' '}
                  </Typography>
                  <TextField
                    name="admissionSignature"
                    value={formData.admissionSignature}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" style={{ fontSize: '1rem', marginRight: '10px' }}>
                    Place:
                  </Typography>
                  <TextField
                    name="admissionPlace"
                    value={formData.admissionPlace}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" style={{ fontSize: '1rem', marginRight: '10px' }}>
                    Date:
                  </Typography>
                  <TextField
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.2rem' }}>
                  Patient / Patient Representative
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" style={{ fontSize: '1rem', marginRight: '10px' }}>
                    Signature:
                  </Typography>
                  <TextField
                    name="patientSignature"
                    value={formData.patientSignature}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" style={{ fontSize: '1rem', marginRight: '10px' }}>
                    Place:
                  </Typography>
                  <TextField
                    name="patientPlace"
                    value={formData.patientPlace}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" style={{ fontSize: '1rem', marginRight: '10px' }}>
                    Date:
                  </Typography>
                  <TextField
                    name="patientDate"
                    value={formData.patientDate}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 4, fontSize: '1.1rem', padding: '10px 0' }}>
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GeneralConsentFormEnglish;
