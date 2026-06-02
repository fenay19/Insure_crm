import { Box, Select, MenuItem, FormControl, InputLabel, useMediaQuery, TextField, Button, Autocomplete, ListSubheader } from '@mui/material';
import { chainPropTypes } from '@mui/utils';
import { get } from 'api/api';
import { useState } from 'react';
import { useEffect, useMemo } from 'react';

const MedicineDose = ({ selectedMed, handleSubmitPrescription, setSelectedMed }) => {
  console.log("selectedMed", selectedMed)
  const matches = useMediaQuery('(max-width:1140px)');
  const [searchTerm, setSearchTerm] = useState('');
  const [createDose, setCreateDose] = useState({
    morning: 0,
    evening: 0,
    night: 0
  });
  const [doseInput, setDoseInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [time, setTime] = useState('');
  const [timingInput, setTimingInput] = useState('');
  const [doseData, setDoseData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  useEffect(() => {
    if (
      selectedMed.type === "Tab" &&
      routeData.length > 0 &&
      (!selectedMed.route || selectedMed.route.trim() === "")
    ) {
      const oralRoute = routeData.find(
        (item) => item.routeName?.toLowerCase() === "oral"
      );
      if (oralRoute) {
        setSelectedMed((prev) => ({
          ...prev,
          route: oralRoute.routeName,
        }));
      }
    }
  }, [selectedMed.type, routeData, selectedMed.route]);

  useEffect(() => {
    let s = selectedMed;
    if (selectedMed.time === undefined) {
      s = { ...s, intake: '', time: '', when: '', duration: '', notes: '' };
      setDoseInput('');
      if (selectedMed?.type?.toLowerCase()?.trim() === 'tab') {
        document.getElementById('dose').style.background = 'transparent';
      }
    } else {
      if (
        s.intake !== '1/3' &&
        s.intake !== '1/2' &&
        s.intake !== '3/4' &&
        s.intake !== '1' &&
        s.intake !== '1½' &&
        s.intake !== '2' &&
        s.intake !== '2½' &&
        s.intake !== '3'
      ) {
        setDoseInput(s.intake);
        if (s.intake !== '') {
          document.getElementById('dose').style.background = 'linear-gradient(rgb(247, 247, 247), rgb(207, 207, 207))';
          if (selectedMed?.type?.toLowerCase()?.trim() === 'tab') {
            document.getElementById('dose').style.width = '40px';
          }
        }
      } else {
        setDoseInput('');
        document.getElementById('dose').style.background = 'transparent';
      }
    }
    setCreateDose(s);
  }, [selectedMed]);

  //save doses
  const handleInputChange = (e) => {
    setCreateDose((prev) => {
      return { ...prev, intake: e.target.value };
    });
    setDoseInput(e.target.value);
  };
  const handleDurationChange = (e) => {
    setDurationInput((prev) => {
      return { ...prev, duration: e.target.value };
    });
    setDurationInput(e.target.value);
  };

  const handleSaveDose = (val) => {
    setCreateDose((prev) => {
      return { ...prev, intake: val };
    });
    setDoseInput('');
    document.getElementById('dose').style.background = 'transparent';
  };

  const onBlurDoseHandler = (e) => {
    if (doseInput !== '') {
      document.getElementById('dose').style.background = 'linear-gradient(rgb(247, 247, 247), rgb(207, 207, 207))';
      document.getElementById('dose').style.width = '40px';
    } else {
      document.getElementById('dose').style.background = 'transparent';
    }
  };

  const handleSaveTime = (val) => {
    setCreateDose((prev) => {
      return { ...prev, time: val };
    });
  };
  const handleTimeChange = (e) => {
    setCreateDose((prev) => {
      return { ...prev, time: e.target.value };
    });
    setTime(e.target.value);
  };

  //when take medicine
  const handleWhenMedTime = (val) => {
    setCreateDose((prev) => {
      return { ...prev, when: val };
    });
  };

  const handleSaveDuration = (val) => {
    setCreateDose((prev) => {
      return { ...prev, duration: val };
    });
  };

  const fetchDoseAndRoute = async () => {
    try {
      const [dose, route] = await Promise.all([get('dose-master'), get('route-master')]);

      setDoseData(dose?.data ?? []);
      setRouteData(route?.data ?? []);
    } catch (error) {
      console.error('Error fetching dose and route data:', error);
    }
  };

  const handleSaveMorning = () => {
    setCreateDose((prev) => ({
      ...prev,
      morning: createDose.morning === 1 ? 0 : 1
    }));
  };

  // Handle saving evening selection (toggle between 0 and 1)
  const handleSaveEvening = () => {
    setCreateDose((prev) => ({ ...prev, evening: createDose.evening === 1 ? 0 : 1 }));
  };

  // Handle saving night selection (toggle between 0 and 1)
  const handleSaveNight = () => {
    setCreateDose((prev) => ({ ...prev, night: createDose.night === 1 ? 0 : 1 }));
  };

  console.log('CREATE DOSE', createDose);


  const handleTimingChanging = (e) => {
    setTimingInput((prev) => {
      return { ...prev, when: e.target.value };
    });
    setTimingInput(e.target.value);
  };


  useEffect(() => {
    fetchDoseAndRoute();
  }, []);
  // 1 st check -----------
  // const filteredDoseData = useMemo(() => {
  //   const term = searchTerm.trim().toLowerCase();
  //   return doseData.filter((item) =>
  //     item.dose?.toLowerCase().includes(term)
  //   );
  // }, [doseData, searchTerm]);
  // 2 nd check -----------
  const filteredDoseData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      return doseData;
    }

    // Show only items that START with the search term (case-insensitive)
    return doseData.filter((item) =>
      item.dose.toLowerCase().startsWith(term)
    );
  }, [searchTerm, doseData]);


  console.log("doseData", doseData)
  return (
    <div className="medicineDose">
      <Box>
        <h4 style={{ color: 'blue', marginBottom: '5px' }}>
          <div>
            <strong style={{ color: 'black', marginRight: '3px' }}>Brand Name: </strong>
            {selectedMed.type.toString().substring(0, 3).toUpperCase()} {selectedMed.brandName} ({selectedMed.dose})
          </div>
          <div>
            <strong style={{ color: 'black', marginRight: '3px' }}>Generic Name: </strong>
            {selectedMed.genericName}
          </div>
        </h4>



        {/* {selectedMed.brandName} ({selectedMed.dose}) */}




        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="dose-select-label">Dff  ose</InputLabel>
            <Select
              labelId="dose-select-label"
              value={selectedMed.dose}
              onChange={(e) => {
                setSelectedMed((prev) => ({ ...prev, dose: e.target.value }));
              }}
              label="Dose"
            >
              {doseData.map((doseOption) => (
                <MenuItem key={doseOption._id} value={doseOption.dose}>
                  {doseOption.dose}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}


          {/* <Autocomplete
              fullWidth
              options={doseData}
              getOptionLabel={(option) => option.dose}
              value={doseData.find((option) => option.dose === selectedMed.dose) || null}
              onChange={(event, newValue) => {
                setSelectedMed((prev) => ({ ...prev, dose: newValue?.dose || '' }));
              }}
              renderInput={(params) => (
              <TextField {...params} label="Dose" sx={{ mt: 2 }} />
            )}
         /> */}
          {
            (selectedMed.type !== 'Tab' &&
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="dose-select-label">Dose</InputLabel>
                <Select
                  labelId="dose-select-label"
                  value={selectedMed.dose}
                  label="Dose"
                  onChange={(e) => {
                    setSelectedMed((prev) => ({ ...prev, dose: e.target.value }));
                    setSearchTerm(""); // Clear search after selecting
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 },
                    },
                  }}
                  renderValue={(selected) => selected || "Select Dose"}
                >
                  {/* Search bar inside dropdown */}
                  <ListSubheader>
                    <TextField
                      autoFocus
                      size="small"
                      placeholder="Search dose..."
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        // Prevent dropdown from closing on key press
                        e.stopPropagation();
                      }}
                      inputProps={{
                        autoComplete: "off",
                      }}
                    />
                  </ListSubheader>

                  {/* Render filtered options */}
                  {filteredDoseData.length > 0 ? (
                    filteredDoseData.map((item) => (
                      <MenuItem key={item._id} value={item.dose}>
                        {item.dose}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No matching data</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="route-select-label">Route</InputLabel>
            <Select
              labelId="route-select-label"
              value={selectedMed.route || ""}
              onChange={(e) =>
                setSelectedMed((prev) => ({ ...prev, route: e.target.value }))
              }
              label="Route"
            >
              {routeData
                .filter((routeOption) => {
                  if (selectedMed.type === "Tab") {
                    return routeOption.routeName?.toLowerCase() === "oral";
                  }
                  return true;
                })
                .map((routeOption) => (
                  <MenuItem key={routeOption._id} value={routeOption.routeName}>
                    {routeOption.routeName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>


        </Box>
      </Box>
      {selectedMed && selectedMed?.type?.toLowerCase()?.trim() === 'tab' && (
        <Box className="Tablet">
          <h4>Tablet</h4>
          <div className="TabDose">
            <Box className="fixedDose">
              <div className={createDose.intake === '1/3' ? 'tabActive' : 'tab'} onClick={() => handleSaveDose('1/3')}>
                1/3
              </div>
              <div className={createDose.intake === '1/2' ? 'tabActive' : 'tab'} onClick={() => handleSaveDose('1/2')}>
                1/2
              </div>
              <div className={createDose.intake === '3/4' ? 'tabActive' : 'tab'} onClick={() => handleSaveDose('3/4')}>
                3/4
              </div>
              <div className={createDose.intake === '1' ? 'tabActive' : 'tab'} onClick={() => handleSaveDose('1')}>
                1
              </div>
              <div className={createDose.intake === '1½' ? 'tabActive' : 'tab'} onClick={() => handleSaveDose('1½')}>
                1&frac12;
              </div>
              <div className={createDose.intake === '2' ? 'tabActive' : 'tab'} onClick={() => handleSaveDose('2')}>
                2
              </div>
              <div className={createDose.intake === '2½' ? 'tabActive' : 'tab'} onClick={() => handleSaveDose('2½')}>
                2&frac12;
              </div>
              <div className={createDose.intake === '3' ? 'tabActive' : 'tab'} onClick={() => handleSaveDose('3')}>
                3
              </div>
            </Box>
            <Box className="inputDose">
              <TextField id="dose" onChange={handleInputChange} variant="outlined" onBlur={onBlurDoseHandler} value={doseInput} />
            </Box>
          </div>
        </Box>
      )}

      <Box className="Timing">
        <h4>Timing</h4>
        <div className="MedTiming">
          <div className={createDose.time === 'Once' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('Once')}>
            Once
          </div>
          <div className={createDose.time === 'Twice' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('Twice')}>
            Twice
          </div>
          <div className={createDose.time === 'Thrice' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('Thrice')}>
            Thrice
          </div>
          <div className={createDose.time === '4 Hour' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('4 Hour')}>
            4h
          </div>
          <div className={createDose.time === '6 Hour' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('6 Hour')}>
            6h
          </div>
          <div className={createDose.time === '8 Hour' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('8 Hour')}>
            8h
          </div>
          <div className={createDose.time === '12 Hour' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('12 Hour')}>
            12h
          </div>
          <div className={createDose.time === '24 Hour' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('24 Hour')}>
            24h
          </div>
          <div className={createDose.time === '48 Hour' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveTime('48 Hour')}>
            48h
          </div>
          <div>
            <TextField id="timing" onChange={handleTimeChange} variant="outlined" value={time} sx={{ width: '50px' }} />
          </div>
        </div>
        {/* Morning, Evening, and Night Timing */}
        <div className="MedTiming" style={{ marginTop: "5px", marginBottom: "10px" }}>
          <div className={createDose.morning === 1 ? 'MedTimeActive' : 'MedTime'} onClick={handleSaveMorning}>
            Morning
          </div>
          <div className={createDose.evening === 1 ? 'MedTimeActive' : 'MedTime'} onClick={handleSaveEvening}>
            Evening
          </div>
          <div className={createDose.night === 1 ? 'MedTimeActive' : 'MedTime'} onClick={handleSaveNight}>
            Night
          </div>
        </div>


        {/* Add the TextField before the Morning, Evening, Night buttons
        <Box className="" sx={{ width: '70px', my: 1 }}>
          <TextField id="when" onChange={handleTimingChanging} variant="outlined" value={timingInput} fullWidth />
        </Box> */}


      </Box>

      <Box className="Timing">
        <h4>Duration</h4>
        <div
          className="MedTiming"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridGap: '10px', marginBottom: '20px', marginTop: '10px' }}
        >
          <div className={createDose.duration === '1 Day' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('1 Day')}>
            1d
          </div>
          <div className={createDose.duration === '2 Day' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('2 Day')}>
            2d
          </div>
          <div className={createDose.duration === '3 Day' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('3 Day')}>
            3d
          </div>
          <div className={createDose.duration === '4 Day' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('4 Day')}>
            4d
          </div>
          <div className={createDose.duration === '5 Day' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('5 Day')}>
            5d
          </div>
          <div className={createDose.duration === '1 Week' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('1 Week')}>
            1w
          </div>
          <div className={createDose.duration === '2 Week' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('2 Week')}>
            2w
          </div>
          <div className={createDose.duration === '3 Week' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('3 Week')}>
            3w
          </div>
          <div className={createDose.duration === '4 Week' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('4 Week')}>
            4w
          </div>
          <div className={createDose.duration === '1 Month' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('1 Month')}>
            1m
          </div>
          <div className={createDose.duration === '2 Month' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('2 Month')}>
            2m
          </div>
          <div className={createDose.duration === '3 Month' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('3 Month')}>
            3m
          </div>
          <div className={createDose.duration === '6 Month' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('6 Month')}>
            6m
          </div>
          <div className={createDose.duration === '1 Year' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleSaveDuration('1 Year')}>
            1y
          </div>

          {/* Textfield for Custom Duration */}
          <Box className="inputDose">
            <TextField id="duration" onChange={handleDurationChange} variant="outlined" value={durationInput} fullWidth />
          </Box>
        </div>
      </Box>

      <Box className="Timing">
        <h4>Instruction</h4>

        <div className="MedTiming" style={{ marginTop: "5px" ,marginBottom: "10px"}}>
          <div
            className={createDose.when === 'Empty Stomach' ? 'MedTimeActive' : 'MedTime'}
            onClick={() => handleWhenMedTime('Empty Stomach')}
          >
            Empty {matches && <br />} Stomach
          </div>
          <div className={createDose.when === 'Before Food' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleWhenMedTime('Before Food')}>
            Before {matches && <br />} Food
          </div>
          <div className={createDose.when === 'After Food' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleWhenMedTime('After Food')}>
            After {matches && <br />} Food
          </div>
          <div className={createDose.when === 'With Food' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleWhenMedTime('With Food')}>
            With {matches && <br />} Food
          </div>
          <div className={createDose.when === 'Bed Time' ? 'MedTimeActive' : 'MedTime'} onClick={() => handleWhenMedTime('Bed Time')}>
            Bed {matches && <br />} Time
          </div>
        </div>

        <TextField
          fullWidth
          label="Instruction"
          variant="outlined"
          multiline
          rows={2}
          onChange={(e) => {
            setCreateDose((prev) => {
              return { ...prev, notes: e.target.value };
            });
          }}
          style={{ background: 'white' }}
          value={createDose.notes}
        />
      </Box>
      <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={() => handleSubmitPrescription(createDose)}>
        Save
      </Button>
    </div>
  );
};

export default MedicineDose;
