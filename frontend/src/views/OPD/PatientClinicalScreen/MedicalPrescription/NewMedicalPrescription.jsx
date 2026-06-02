import { Avatar, Box, Button, Chip, CircularProgress, Input, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useState } from 'react';
import axios from 'axios';
import REACT_APP_BASE_URL from 'api/api';
import { retrieveToken } from 'api/api';
import { useEffect } from 'react';

const NewMedicalPrescripiton = ({
  selectedMedicineHandler,
  prescriptions,
  selectedMed,
  setSelectedMed,
  setGlassPrescripition,
  getPatientMedicalPrescription,
  glassPrescription
}) => {
  const [searchMedicine, setSearchMedicine] = useState('');
  const [medicine, setMedicine] = useState([]);
  const [mostUsedMedicine, setMostUsedMedicine] = useState([]);
  const [showMedicine, setShowMedicine] = useState([]);
  const [loader, setLoader] = useState(true);
  const token = retrieveToken();

  const getMedicines = async () => {
    setLoader(true);
    await getPatientMedicalPrescription();

    await axios
      .get(`${REACT_APP_BASE_URL}medicines`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setMedicine(response.data.allMedicines);
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}medicines/most-used`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setMostUsedMedicine(response.data.data);
        setShowMedicine(response.data.data);
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getMedicines();
    // eslint-disable-next-line
  }, []);

  const handleSearchMedicine = (e) => {
    setSearchMedicine(e.target.value);

    if (e.target.value === '') {
      let medP = mostUsedMedicine.slice();

      prescriptions.forEach((vv) => {
        if (!medP.some((v) => v.brandName === vv.brandName && v.dose === vv.dose)) {
          medP.unshift(vv);
        }
      });
      setShowMedicine(medP);
    } else {
      let serchM = [];
      medicine.forEach((v) => {
        if (v.brandName.toLowerCase().includes(e.target.value.toLowerCase())) {
          serchM.push(v);
        }
      });
      setShowMedicine(serchM);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      let serchM = [];
      medicine.forEach((v) => {
        if (v.brandName.toLowerCase().includes(searchMedicine.toLowerCase())) {
          serchM.push(v);
        }
      });
      setShowMedicine(serchM);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 ,width:'40vw'}}>
      {/* Search Bar & Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
        <Input
          sx={{
            flexGrow: 1,
            border: '1px solid #ccc',
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            height: 40
          }}
          type="search"
          placeholder="Search..."
          endAdornment={
            <InputAdornment position="end">
              <Search sx={{ color: 'gray' }} />
            </InputAdornment>
          }
          onChange={handleSearchMedicine}
          value={searchMedicine}
          onKeyPress={handleKeyPress}
        />

        {/* Glass Prescription Button
        <Button
          variant="contained"
          color="primary"
          sx={{
            minWidth: 180,
            height: 40,
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: 1.5
          }}
          onClick={() => {
            setGlassPrescripition(!glassPrescription);
            setSelectedMed({});
          }}
        >
          Glass Prescription
        </Button> */}
      </Box>

      {/* Medicine List */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {loader ? (
          <CircularProgress />
        ) : (
          showMedicine.map((val, ind) => {
            let isSelected = selectedMed.brandName === val.brandName && selectedMed.dose === val.dose;
            let pre = prescriptions.some((v) => v.brandName === val.brandName && v.dose === val.dose);

            return (
              <Chip
                key={ind}
                variant="filled"
                color="primary"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  fontSize: 14,
                  fontWeight: val.flag ? 'bold' : 'normal',
                  bgcolor: isSelected
                    ? 'green' // **Selected Chip Color**
                    : pre
                      ? '#FFD700' // **Previously Selected Color**
                      : 'primary.main',
                  color: isSelected ? 'white' : 'white',
                  border: isSelected ? '2px solid black' : 'none',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: isSelected ? 'darkgreen' : 'primary.dark'
                  }
                }}
                avatar={<Avatar>{val.type.toString().substring(0, 3)}</Avatar>}
                label={`${val.flag ? '*' : ''} ${val.brandName} (${val.dose})`}
                title={`Available: ${val.availableQuantity}`}
                onClick={() => selectedMedicineHandler(val)}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default NewMedicalPrescripiton;
