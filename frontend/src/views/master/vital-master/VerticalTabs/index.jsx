import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Paper, Box, Typography, Divider, useTheme, useMediaQuery } from '@mui/material';
import { get, post, put, remove } from 'api/api';
import SelectableChips from '../Temperature/ReusableVitalChips';
import { calculateBMI, pulseRate, respiratoryRate } from '../data';
import HeightWeightDropdown from '../HeightAndWeightDropDown/HeightAndWeight';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import BmiScale from '../BMIScale/BMIScale';
import BloodPressure from '../BloodPressure';
import BloodOxygenSaturation from '../BloodOxygenSaturation';
import Temperature from '../Temperature/Temperature';
import PatientVitalDisplay from '../PatientVitalDisplay/PatientVitalDisplay';
// Import icons
import FavoriteIcon from '@mui/icons-material/Favorite'; // For heart rate
import HeightIcon from '@mui/icons-material/Height'; // For height
import ScaleIcon from '@mui/icons-material/Scale'; // For weight
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'; // For BMI
import BloodtypeIcon from '@mui/icons-material/Bloodtype'; // For blood pressure
import AirIcon from '@mui/icons-material/Air'; // For respiratory rate
import ThermostatIcon from '@mui/icons-material/Thermostat'; // For temperature
import WaterDropIcon from '@mui/icons-material/WaterDrop'; // For oxygen saturation
import { MonitorHeart } from '@mui/icons-material';
const VitalTabs = ({ departmentId }) => {
  const [value, setValue] = useState(0);
  const [allVitals, setAllVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVital, setSelectedVital] = useState('respiratory rate (rr)');
  const [d, setD] = useState([]);
  const patient = useSelector((state) => state.patient.selectedPatient);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [patientVitalData, setPatientVitalData] = useState({
    respiratoryRate: [],
    pulseRate: [],
    height: [],
    weight: [],
    bodyMassIndex: [],
    bloodPressure: [],
    temperature: [],
    bloodOxygenSaturation: []
  });

  const [patientSetedData, setPatientSetedData] = useState({
    respiratoryRate: [],
    pulseRate: [],
    height: [],
    weight: [],
    bodyMassIndex: [],
    bloodPressure: [],
    temperature: [],
    bloodOxygenSaturation: []
  });
  const [allReadyId, setAllReadyId] = useState('');

  // Function to get the appropriate icon based on the vital type
  const getVitalIcon = (vital) => {
    const vitalName = vital?.toLowerCase()?.trim();
    switch (vitalName) {
      case 'respiratory rate (rr)':
        return <AirIcon sx={{ mr: 1, fontSize: 20 }} />;
      case 'pulse (radial)/heart rate':
        return <MonitorHeart sx={{ mr: 1, fontSize: 20 }} />;
      case 'height':
        return <HeightIcon sx={{ mr: 1, fontSize: 20 }} />;
      case 'weight':
        return <ScaleIcon sx={{ mr: 1, fontSize: 20 }} />;
      case 'body mass index (bmi)':
        return <MonitorWeightIcon sx={{ mr: 1, fontSize: 20 }} />;
      case 'blood pressure (bp)':
        return <BloodtypeIcon sx={{ mr: 1, fontSize: 20 }} />;
      case 'blood oxygen saturation (spo2)':
        return <WaterDropIcon sx={{ mr: 1, fontSize: 20 }} />;
      case 'temperature':
        return <ThermostatIcon sx={{ mr: 1, fontSize: 20 }} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await get('vital-master/');
        if (response?.data) {
          const uniqueVitals = Array.from(new Map(response.data.map((item) => [item.vital, item])).values());
          setAllVitals(uniqueVitals);
        }
      } catch (err) {
        setError('Failed to load vitals');
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, []);

  const fetchData = async () => {
    const res = await get(`form-setup/vital-master/get/${patient?.patientId?._id}`);
    setD(res?.data);
  };
  useEffect(() => {
    fetchData();
  }, [patient]);

  useEffect(() => {
    setAllReadyId(d?.patientId);
  }, [d]);

  useEffect(() => {
    if (d) {
      setPatientVitalData((prev) => ({
        respiratoryRate: d?.respiratoryRate || prev.respiratoryRate,
        pulseRate: d?.pulseRate || prev.pulseRate,
        height: d?.height || prev.height,
        weight: d?.weight || prev.weight,
        bodyMassIndex: d?.bodyMassIndex || prev.bodyMassIndex,
        bloodPressure: d?.bloodPressure || prev.bloodPressure,
        temperature: d?.temperature || prev.temperature
      }));
    }
  }, [d]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedVital(allVitals[newValue]?.vital || '');
  };

  const height = d?.height?.[0]?.height;
  const weight = d?.weight?.[0]?.weight;
  const bmiValue = height && weight ? calculateBMI(weight, height) : 0;
  const renderVitals = () => {
    const vital = selectedVital?.toLowerCase()?.trim();
    switch (vital) {
      case 'respiratory rate (rr)':
        return (
          <SelectableChips data={respiratoryRate} setPatientVitalData={setPatientVitalData} setPatientSetedData={setPatientSetedData} />
        );
      case 'pulse (radial)/heart rate':
        return <SelectableChips data={pulseRate} setPatientVitalData={setPatientVitalData} setPatientSetedData={setPatientSetedData} />;
      case 'height':
        return (
          <HeightWeightDropdown label={'Height'} setPatientVitalData={setPatientVitalData} setPatientSetedData={setPatientSetedData} />
        );
      case 'weight':
        return (
          <HeightWeightDropdown
            label={'Weight'}
            setPatientVitalData={setPatientVitalData}
            setPatientSetedData={setPatientSetedData}
            bmi={bmiValue}
          />
        );
      case 'body mass index (bmi)':
        return <BmiScale setPatientVitalData={setPatientVitalData} bmi={bmiValue} setPatientSetedData={setPatientSetedData} />;
      case 'blood pressure (bp)':
        return <BloodPressure setPatientVitalData={setPatientVitalData} setPatientSetedData={setPatientSetedData} />;
      case 'blood oxygen saturation (spo2)':
        return <BloodOxygenSaturation setPatientVitalData={setPatientVitalData} setPatientSetedData={setPatientSetedData} />;
      case 'temperature':
        return <Temperature setPatientVitalData={setPatientVitalData} setPatientSetedData={setPatientSetedData} />;
      default:
        return <h1>NOTHING TO DISPLAY HERE FOR {selectedVital}</h1>;
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await remove(`form-setup/vital-master/delete/${patient?.patientId?._id}/${id}`);
      if (response.status) {
        toast.success('Vital deleted successfully!');
        fetchData();
      } else {
        toast.warn('Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Failed to delete. Please try again.');
    }
  };

  useEffect(() => {
    // Avoid posting empty/default data
    if (Object.values(patientSetedData).some((arr) => arr.length > 0)) {
      (async () => {
        if (allReadyId) {
          try {
            const res = await put(`form-setup/vital-master/update/${patient?.patientId?._id}`, {
              ...patientVitalData,
              departmentId,
              patientId: patient?.patientId?._id,
              consultantId: patient?.consultantId
            });
            toast.success(res?.message || 'Updated successfully');
            fetchData();
          } catch (error) {
            console.error('Error posting data:', error);
          }
        } else {
          try {
            const res = await post('form-setup/vital-master', {
              ...patientVitalData,
              departmentId,
              patientId: patient?.patientId?._id,
              consultantId: patient?.consultantId
            });
            setAllReadyId(res?.data?.patientId || '');
            toast.success(res?.message || 'Created successfully');
            fetchData();
          } catch (error) {
            console.error('Error posting data:', error);
          }
        }
      })();
    }
  }, [patientSetedData]);

  useEffect(() => {
    setPatientVitalData({
      respiratoryRate: [],
      pulseRate: [],
      height: [],
      weight: [],
      bodyMassIndex: [],
      bloodPressure: [],
      temperature: [],
      bloodOxygenSaturation: []
    });
    setPatientSetedData({
      respiratoryRate: [],
      pulseRate: [],
      height: [],
      weight: [],
      bodyMassIndex: [],
      bloodPressure: [],
      temperature: [],
      bloodOxygenSaturation: []
    });
  }, [patient]);
  return (
    <>
      <PatientVitalDisplay patientVitalData={d} handleDelete={handleDelete} getData={fetchData} />
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 2,
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
          mx: 'auto',
          alignItems: 'stretch',
          maxWidth: '100%',
          minHeight: 600,
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)'
        }}
      >
        {/* Tabs Section with Icons */}
        <Box
          sx={{
            width: '100%',
            mb: 3,
            bgcolor: 'white',
            borderRadius: 2,
            p: 1,
            boxShadow: 2,
            overflow: 'auto'
          }}
        >
          <Tabs
            orientation="horizontal"
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              minHeight: 'auto'
            }}
          >
            {allVitals.map((vital, index) => (
              <Tab
                key={index}
                icon={getVitalIcon(vital.vital)}
                iconPosition="start"
                label={vital.vital}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  fontSize: '1rem',
                  px: 2,
                  py: 1.5,
                  minHeight: '48px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            minHeight: 500,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* Header with icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              gap: 2
            }}
          >
            {getVitalIcon(selectedVital)}
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#333', textAlign: 'center' }}>
              {selectedVital?.toUpperCase()}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ flexGrow: 1 }}>{renderVitals()}</Box>
        </Box>
      </Paper>
      <ToastContainer />
    </>
  );
};

export default VitalTabs;