import { Box, Button, Chip, Grid, IconButton, Input, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Add, Close, Delete, Edit, Search } from '@mui/icons-material';
import { useState } from 'react';
import REACT_APP_BASE_URL, { retrieveToken } from 'api/api';
import axios from 'axios';
import { useEffect } from 'react';
import Loader from 'component/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const Instruction = ({ selectedMenu, editData }) => {
  const token = retrieveToken();
  const departmentId = editData.departmentId._id;
  const [mostUsedInstruction, setMostUsedInstruction] = useState([]);
  const [allInstruction, setAllInstruction] = useState([]);
  const [showInstruction, setShowInstruction] = useState([]);
  const [error, setError] = useState('');
  const [patientInstruction, setPatientInstruction] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const [openAddInstructionDetail, setOpenAddInstructionDetail] = useState(false);

  const [heading, setHeading] = useState('');
  const [editId, setEditId] = useState('');
  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);


  const [alreadyInstructionExistId, setAlreadyInstructionExistId] = useState('');
  
  const patient = useSelector((state) => state.patient.selectedPatient);

  const getPatientInstructionData = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}patient-instruction/${patient?.patientId?._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (
            v.departmentId === departmentId
            // &&
            // v.consultantId ===
            //   JSON.parse(localStorage.getItem("patientConsult")).consultantId
          ) {
            res.push(v);
          }
        });
        if (res.length > 0) {
          setPatientInstruction(res[res.length - 1].instruction);
          setAlreadyInstructionExistId(res[res.length - 1]._id);
        }
      })
      .catch((error) => {});
  };

  const getInstruction = async () => {
    setLoader(true);
    await getPatientInstructionData();

    await axios
      .get(`${REACT_APP_BASE_URL}opd/instruction`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = response.data.data;
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push();
          }
        });
        setAllInstruction(res);
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/instruction/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = response.data.data;
        setMostUsedInstruction(res);
        setShowInstruction(res);
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getInstruction();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedInstruction.slice();

      patientInstruction.forEach((vv) => {
        if (!medP.some((v) => v.heading === vv.heading)) {
          medP.unshift(vv);
        }
      });
      setShowInstruction(medP);
    } else {
      let serchM = [];
      allInstruction.forEach((v) => {
        if (v.heading.toLowerCase().includes(e.target.value.toLowerCase())) {
          serchM.push(v);
        }
      });
      setShowInstruction(serchM);
    }
  };

  const addInstructionHandler = () => {
    setHeading('');
    setOpenAddInstructionDetail(true);
    setOpenEditHandler(false);
    setOpenEditDataDetail(false);
    setOpenDeleteHandler(false);
  };

  const editInstructionHandler = () => {
    setOpenEditHandler(true);
    setOpenEditDataDetail(false);
    setOpenDeleteHandler(false);
    setHeading('');
    setOpenAddInstructionDetail(false);
  };

  const deleteInstructionHandler = () => {
    setOpenDeleteHandler(true);
    setOpenEditHandler(false);
    setOpenEditDataDetail(false);
    setHeading('');
    setOpenAddInstructionDetail(false);
  };

  const handleChangeInstruction = (e) => {
    let { value } = e.target;
    setHeading(value);
    setError('');
  };

  const handleSaveAddInstruction = async () => {
    if (heading.length === 0) {
      setError('Please enter instruction');
    } else {
      //call api to submit data in Instruction table and update list
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/instruction`,
          {
            heading: heading,
            patientId: patient?.patientId?._id,
          departmentId: departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getInstruction();
          let sM = [response.data.data, ...showInstruction];
          sM = [...new Map(sM.map((item) => [item['heading'], item])).values()];
          setShowInstruction(sM);
          setOpenAddInstructionDetail(false);

          toast.success(`Instruction Created Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSaveUpdateInstruction = async () => {
    if (heading.length === 0) {
      setError('Please enter instruction');
    } else {
      //call api to submit data in Instruction table and update list
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/instruction/${editId}`,
          {
            heading: heading,
            departmentId,
            patientId: patient?.patientId?._id,
        
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getInstruction();
          setOpenEditDataDetail(false);
          setEditId('');
          toast(`Instruction Updated Successfully!!`);
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

 

  const handleSubmitInstruction = (sM) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-instruction`,
        {
          patientId: patient?.patientId?._id,
          departmentId: departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          instruction: sM
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientInstructionData();
        setHeading('');
        toast.success(
          `Instruction Successfully Submitted!!`,
          
      );
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };

  const handleSubmitEditInstruction = (sM) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-instruction/${alreadyInstructionExistId}`,
        {
          patientId: patient?.patientId?._id,
          departmentId: departmentId,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          instruction: sM
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then((response) => {
        getPatientInstructionData();
        setHeading('');
        toast( `Instruction Successfully Updated!!`);
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };
  const handleSaveInstruction = (val) => {
    let sM = [...patientInstruction, { _id: val._id, heading: val.heading }];
    sM = [...new Map(sM.map((item) => [item['heading'] + item['_id'], item])).values()];
    if (patientInstruction.length === 0) {
      handleSubmitInstruction(sM);
    } else {
      handleSubmitEditInstruction(sM);
    }
  };
  const handleSaveDeleteInstruction = () => {
    let data = {
      ids: deleteIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/instruction`, { headers, data })
      .then((response) => {
        getInstruction();
        setDeletedIds([]);
        setOpenDeleteHandler(false);
        toast('Instruction Deleted Successfully!!');
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };

  return (
    <Box className="paticularSection" sx={{mt:4}}>
      {loader ? (
        <Loader />
      ) : (
        <Grid container spacing={2} height="inherit">
          <Grid container item spacing={2} xs={9} sm={9} md={8} px={2} height="inherit">
            <Grid item xs={8} height="inherit">
              {selectedMenu !== 'All' && (
                <h2 className="popupHead" style={{ marginBottom: '10px' }}>
                  Instruction
                </h2>
              )}

              <Input
                className="search_patient_data"
                type="search"
                placeholder="Search..."
                endAdornment={
                  <InputAdornment position="end">
                    <Search className="search_patient_data_icon" />
                  </InputAdornment>
                }
                onChange={handleSearch}
                value={searchValue}
              />

              <IconButton style={{ marginLeft: '2px' }} title="Add Instruction" onClick={addInstructionHandler}>
                <Add fontSize="small" style={{ color: '#089bab' }} />
              </IconButton>

              {allInstruction.length > 0 && (
                <IconButton style={{ marginLeft: '2px' }} title="Edit Instruction" onClick={editInstructionHandler}>
                  <Edit fontSize="small" style={{ color: 'blue' }} />
                </IconButton>
              )}

              {allInstruction.length > 0 && (
                <IconButton style={{ marginLeft: '2px' }} title="Delete Instruction" onClick={deleteInstructionHandler}>
                  <Delete fontSize="small" style={{ color: 'red' }} />
                </IconButton>
              )}

              {allInstruction.length === 0 ? (
                <h4 className="noFoundOPd">Instruction Not Available, Please Add...</h4>
              ) : (
                <>
                  {showInstruction.length > 0 ? (
                    <Box className="selectedCategory">
                      {showInstruction.map((val, ind) => {
                        let pre = false;
                        patientInstruction.forEach((v) => {
                          if (v.heading === val.heading && v._id === val._id) {
                            pre = true;
                          }
                        });

                  

                        return (
                          <Chip
                            key={ind}
                            sx={{ margin: '10px', backgroundColor: pre ? '#3f51b5' : '#126078', color: '#fff' }}
                            className={pre ? 'selectProblemActive' : 'selectProblem'}
                            label={val.heading}
                            onClick={() => {
                              setOpenAddInstructionDetail(false);
                              handleSaveInstruction(val);
                            }}
                          />
                        );
                      })}
                    </Box>
                  ) : (
                    <h4 className="noFoundOPd">Not Found</h4>
                  )}
                </>
              )}
            </Grid>

            {openAddInstructionDetail && (
              <Grid item xs={4} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Instruction</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="heading"
                    label="Instruction"
                    value={heading}
                    onChange={handleChangeInstruction}
                    error={error !== '' ? true : false}
                    helperText={error}
                    style={{ marginTop: '10px' }}
                  />

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveAddInstruction}>
                    Save
                  </Button>
                </Box>
              </Grid>
            )}

            {openEditHandler && (
              <Grid item xs={4} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Edit Instruction</h4>
                  <Box className="selectedCategory">
                    {mostUsedInstruction.map((val, ind) => {
                      return (
                        <Chip
                          key={ind}
                          className="selectProblem"
                          label={val.heading}
                          onClick={() => {
                            setOpenEditHandler(false);
                            setOpenEditDataDetail(true);
                            setOpenAddInstructionDetail(false);
                            setHeading(val.heading);
                            setEditId(val._id);
                            setOpenDeleteHandler(false);
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            )}

            {openEditDataDetail && (
              <Grid item xs={4} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Update Instruction</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="heading"
                    label="Instruction"
                    value={heading}
                    onChange={handleChangeInstruction}
                    error={error !== '' ? true : false}
                    helperText={error}
                    style={{ marginTop: '10px' }}
                  />

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveUpdateInstruction}>
                    Save
                  </Button>
                </Box>
              </Grid>
            )}

            {openDeleteHandler && (
              <Grid item xs={4} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Delete Instruction</h4>
                  <Box className="selectedCategory">
                    {mostUsedInstruction?.map((val, ind) => {
                      let exist = false;
                      deleteIds.forEach((v) => {
                        if (val._id === v) {
                          exist = true;
                        }
                      });
                      return (
                        <Chip
                          key={ind}
                          className={exist ? 'selectProblemDelete' : 'selectProblem'}
                          label={val.heading}
                          onClick={() => {
                            let a = deleteIds;
                            if (val._id !== undefined) {
                              a.push(val._id);
                            }

                            let unique = [];
                            a.forEach((element) => {
                              if (!unique.includes(element)) {
                                unique.push(element);
                              }
                            });

                            setDeletedIds(unique);
                          }}
                          onDelete={
                            exist
                              ? () => {
                                  let aa = [];
                                  deleteIds.forEach((vM) => {
                                    if (vM !== val._id) {
                                      aa.push(vM);
                                    }
                                  });
                                  setDeletedIds(aa);
                                }
                              : undefined
                          }
                          deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                        />
                      );
                    })}
                  </Box>

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteInstruction}>
                    Save
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>

          <Grid item xs={3} sm={3} md={4} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
        
            {patientInstruction.length > 0 && (
              <Box sx={{ marginBottom: '2rem',boxShadow:3,p:3 }}>
                <h4 style={{ margin: '5px 0' }}>Instruction</h4>
                <Box className="selectedPtCategory">
                  {patientInstruction.map((val, ind) => {
                    return (
                      <Chip
                        key={ind}
                        className="selectProblemActive"
                        label={val.heading}
                        onDelete={() => {
                          setOpenAddInstructionDetail(false);
                          let medPro = [];
                          patientInstruction.forEach((vM) => {
                            if (vM.heading !== val.heading) {
                              medPro.push(vM);
                            }
                          });
                          handleSubmitEditInstruction(medPro);
                        }}

                        sx={{
              margin: '5px',
              backgroundColor: '#3f51b5',
              color: '#fff',
              borderRadius: '20px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: '#303f9f'
              }
            }}
                      />
                    );
                  })}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      )}
      <ToastContainer />
    </Box>
  );
};

export default Instruction;
