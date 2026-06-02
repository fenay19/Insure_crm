import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, Box, TextField, Grid, Button, List, ListItem } from '@mui/material';

const GeneralConsentFormHindi = () => {
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
              सामान्य सहमति
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
              मैं,{' '}
              <TextField
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '50%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />{' '}
              (मरीज का नाम), आयु{' '}
              <TextField
                name="age"
                value={formData.age}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '10%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />
              पिता/पति/पत्नी/पुत्री{' '}
              <TextField
                name="relativeName"
                value={formData.relativeName}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '78%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />
              मैं  घोषणा करता हूँ कि मैं अपनी सलाहकार डॉ.{' '}
              <TextField
                name="consultantDoctor"
                value={formData.consultantDoctor}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '30%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />{' '}
              द्वारा सलाहित उपचार के लिए {hospitalName} में स्वेच्छा से भर्ती हो रहा हूँ। निम्नलिखित शर्तों के तहत:
            </Typography>

            <Box sx={{ mt: 3, pl: 2 }}>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                कृपया निम्नलिखित शर्तों को पढ़ें:
              </Typography>
              <List sx={{ fontSize: '1.2rem', listStyleType: 'decimal', pl: 4 }} component="ol">
                <ListItem sx={{ display: 'list-item' }}>
                  मैं यह सुनिश्चित करूंगा कि मुझसे/मरीज से संबंधित सभी व्यक्ति अस्पताल के नियमों और विनियमों का पालन करें, जिसमें अस्पताल के
                  कर्मचारियों द्वारा बताई गई मुलाकात के समय भी शामिल हैं।
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  मैं अस्पताल के सभी बकाया राशि को चुकाने की पूरी जिम्मेदारी लूंगा और आपातकालीन इलाज के लिए पर्याप्त अग्रिम राशि जमा करने का
                  वादा करता हूं, साथ ही जब-जब भुगतान रसीदें अनुभव के अनुसार जारी की जाएंगी।
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  मुझे दवाओं से एलर्जी/लाभ, जोखिम और भर्ती के विकल्पों के बारे में समझाया गया है।
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  यदि आवश्यकता पड़े, तो मेरे इलाज के उद्देश्य से मेरी बीमारी से संबंधित किसी भी प्रमाण के बारे में गोपनीयता के खुलासे की
                  आवश्यकता हो सकती है। इसके लिए मुझे कोई आपत्ति नहीं है क्योंकि मैं जानता हूं कि यह मेरे और मेरे इलाज के लिए लाभकारी है।
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  मुझे अस्पताल में मेरे अधिकारों और जिम्मेदारियों के बारे में समझाया गया है।
                </ListItem>
              </List>
            </Box>

            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
              उपरोक्त बिंदुओं को मुझे उस भाषा में समझाया गया है,,{' '}
              <TextField
                name="language"
                value={formData.language}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '30%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />
              जिसे मैं समझता हूं, श्री/श्रीमती/डॉ. द्वारा{' '}
              <TextField
                name="explainedBy"
                value={formData.explainedBy}
                onChange={handleChange}
                variant="standard"
                sx={{ width: '40%' }}
                InputProps={{ style: { fontSize: '1.2rem' } }}
              />{' '}
              जो {hospitalName}.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
              मैं यह सहमति अपने पूर्ण होशो-हवास में और अपनी स्वतंत्र इच्छा से दे रहा हूँ।
            </Typography>

            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.2rem' }}>
                  प्रवेश कार्यकारी / मुख्य चिकित्सा अधिकारी
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" style={{ fontSize: '1rem', marginRight: '10px' }}>
                    हस्ताक्षर:{' '}
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
                    स्थान:
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
                    तारीख़:
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
                  रोगी / रोगी प्रतिनिधि
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" style={{ fontSize: '1rem', marginRight: '10px' }}>
                    हस्ताक्षर:
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
                    स्थान:
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
                    तारीख़:
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
              सबमिट करें
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GeneralConsentFormHindi;
