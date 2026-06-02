import { Add, Close, Delete, Edit, Search } from '@mui/icons-material';
import { Box, Button, Chip, Dialog, DialogContent, Grid, IconButton, Input, InputAdornment, TextField } from '@mui/material';
import REACT_APP_BASE_URL, { post, remove, retrieveToken } from 'api/api';
import axios from 'axios';
import Loader from 'component/Loader/Loader';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonGroup } from 'react-bootstrap';
const FamilyHistory = ({
  departmentId,
  medicalCategory,
  activeStep,
  patientHistory,
  setPatientHistory,

  since,
  sinceFunction,
  getAllMasterData,
  isFemale,
  isPed,
  allFamilyProblems
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [mostusedmedicalProblems, setmostusedMedicalProblems] = useState([]);
  const [medicalProblems, setMedicalProblems] = useState([]);
  const [familyMember, setFamilyMember] = useState([]);
  const [openFamHistoryPro, setOpenFamHistoryPro] = useState(false);
  const [openData, setOpenData] = useState({});
  const [error, setError] = useState('');
  const [openAddFamHistoryPro, setOpenAddFamHistoryPro] = useState(false);
  const [openAddFamilyMember, setOpenAddFamilyMember] = useState(false);
  const [memberRelation, setMemberRelation] = useState('');
  const [memberRelationErr, setMemberRelationErr] = useState('');
  const [openDuration, setOpenDuration] = useState(false);
  const [familyNDuration, setFamilyNDuration] = useState({});
  const [loader, setLoader] = useState(true);

  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);
  const [sinceOpen, setSinceOpen] = useState(false);
  const [sinceValue, setSinceValue] = useState('');

  const token = retrieveToken();

  const handleSince = () => {
    setSinceOpen(true);
    setOpenDuration(false);
  };

  const handleSinceClose = () => {
    setSinceOpen(false);
    setOpenDuration(true);
  };

  const handleSinceSubmit = async () => {
    if (sinceValue === '') {
      return alert('Enter the Since');
    }

    await post('since-master', { since: sinceValue }).then((response) => {
      if (response) {
        sinceFunction();
        setSinceOpen(false);
        // setOpenMedicalPro(true);
        setSinceValue('');
      }
    });
  };

  const deleteSince = async (id) => {
    await remove(`since-master/delete/${id}`).then((response) => {
      if (response) {
        sinceFunction();
      }
    });
  };

  const deleteMembers = async (id) => {
    try {
      const res = await remove(`opd/family-member/${id}`);
      if (res?.msg) {
        toast.success(res?.msg || 'Deleted Successfully');
        getMedicalProblem();
      } else {
        toast.error('Some thing went wrong');
      }
    } catch (err) {}
  };
  const getMedicalProblem = async () => {
    setLoader(true);

    await axios
      .get(`${REACT_APP_BASE_URL}opd/family-problem/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setMedicalProblems(response.data.data);
        setmostusedMedicalProblems(response.data.data);
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/family-member`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setFamilyMember(response.data.data);
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getMedicalProblem();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostusedmedicalProblems.slice(); // Copying mostusedmedicalProblems to medP to avoid modifying it directly

      patientHistory.familyHistory.forEach((vv) => {
        // Check if the problem in patientHistory.familyHistory is not present in mostusedmedicalProblems
        if (!medP.some((v) => v.problem === vv.problem)) {
          medP.unshift(vv); // Add the problem from patientHistory.familyHistory to medP
        }
      });
      // if()
      setMedicalProblems(medP);
    } else {
      let med = [];
      allFamilyProblems?.forEach((v) => {
        if (v.problem.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setMedicalProblems(med);
    }
  };

  const closeForm = () => {
    setOpenFamHistoryPro(false);
    setError('');
    setOpenAddFamHistoryPro(false);
    setOpenData({});
    setFamilyNDuration({ memberRelation: '', duration: '' });
    setOpenDuration(false);
    setOpenAddFamilyMember(false);
    setOpenDeleteHandler(false);
    setOpenEditDataDetail(false);
    setOpenEditHandler(false);
  };

  const handleSubmitFamHistoryProblem = async () => {
    if (openData.problem === '') {
      setError('Enter the Family History');
    } else {
      //call api to store FamHistory problem
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/family-problem`,
          {
            problem: openData.problem,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getMedicalProblem();
          let sM = [response.data.data, ...medicalProblems];
          sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
          setMedicalProblems(sM);
          closeForm();
          toast({
            title: 'Family History Created Successfully!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
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

  const handleUpdateSubmitMedicalProblem = async () => {
    if (openData.problem === '') {
      setError('Enter the Family History');
    } else {
      //call api to store Family History
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/family-problem/${openData._id}`,
          {
            problem: openData.problem,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getMedicalProblem();

          closeForm();
          toast({
            title: 'Family History Updated Successfully!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
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

  const handleSaveDeleteFamilyHistory = () => {
    let data = {
      ids: deleteIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/family-problem`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getMedicalProblem();
        setDeletedIds([]);
        setOpenDeleteHandler(false);
        toast({
          title: 'Family History Deleted Successfully!!',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
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
  };

  const handleSubmitFamRelation = async () => {
    if (memberRelation === '') {
      setMemberRelationErr('Enter the Family Member');
    } else {
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/family-member`,
          {
            memberRelation: memberRelation,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getMedicalProblem();
          let sM = [...familyMember, response.data.data];
          sM = [...new Map(sM.map((item) => [item['memberRelation'], item])).values()];
          setFamilyMember(sM);
          setMemberRelation('');
          setMemberRelationErr('');
          setOpenAddFamilyMember(false);
          setOpenFamHistoryPro(true);
          toast.success('Family Member Created Successfully!!');
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

  const [openSelectSince, setOpenSelectSince] = useState(false);
  const [having, setHaving] = useState('');
  const handleButtonClick = (btn) => {
    setHaving(btn);
    setOpenSelectSince(false);

    if (btn === 'No') {
      let sM =
        patientHistory.familyHistory !== undefined
          ? [...patientHistory.familyHistory, { ...openData, option: btn }]
          : [{ ...openData, option: btn }];

      sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
      setPatientHistory((prev) => {
        return {
          ...prev,
          familyHistory: sM
        };
      });
      setOpenFamHistoryPro(false);
      setOpenData({});
    } else {
      setOpenSelectSince(true);
    }
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <Grid container spacing={2} height="100%">
          <Grid item xs={8} height="inherit">
            <h2 className="heading">
              {activeStep + 1}. {medicalCategory[activeStep].category}
            </h2>
            {/* <Input
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
            /> */}

            <Button
              style={{ marginLeft: '2px', display: 'inline-block' }}
              className="button-87"
              onClick={() => {
                setOpenFamHistoryPro(false);
                setError('');
                setFamilyNDuration({ memberRelation: '', duration: '' });
                setOpenDuration(false);
                setOpenData({ problem: '' });
                setOpenAddFamHistoryPro(true);
                setOpenEditDataDetail(false);
                setOpenEditHandler(false);
                setOpenDeleteHandler(false);
              }}
            >
              Add
            </Button>

            {allFamilyProblems?.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Edit Family History"
                onClick={() => {
                  setOpenFamHistoryPro(false);
                  setError('');
                  setFamilyNDuration({ memberRelation: '', duration: '' });
                  setOpenDuration(false);
                  setOpenData({ problem: '' });
                  setOpenAddFamHistoryPro(false);
                  setOpenEditDataDetail(false);
                  setOpenEditHandler(true);
                  setOpenDeleteHandler(false);
                }}
              >
                <Edit fontSize="small" style={{ color: 'blue' }} />
              </IconButton>
            )}

            {allFamilyProblems?.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Delete Family History"
                onClick={() => {
                  setOpenFamHistoryPro(false);
                  setError('');
                  setFamilyNDuration({ memberRelation: '', duration: '' });
                  setOpenDuration(false);
                  setOpenData({ problem: '' });
                  setOpenAddFamHistoryPro(false);
                  setOpenEditDataDetail(false);
                  setOpenEditHandler(false);
                  setOpenDeleteHandler(true);
                }}
              >
                <Delete fontSize="small" style={{ color: 'red' }} />
              </IconButton>
            )}

            {allFamilyProblems?.length === 0 ? (
              <h4 className="noFoundOPd">Family History Not Available, Please Add...</h4>
            ) : (
              <>
                <p className="catQue">What are the illnesses that run in patient family?</p>
                {medicalProblems.length > 0 ? (
                  <Box className="selectedHistoryCategory" sx={{ my: 2 }}>
                    {medicalProblems.map((val, ind) => {
                      let pre = false;

                      const ids = new Set(patientHistory?.familyHistory?.map((d) => d._id));
                      if (ids?.has(val?._id) || openData?._id === val?._id) {
                        pre = true;
                      }

                      let isSelected = val.problem === openData.problem;

                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2,
                            borderColor: pre ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          color={pre ? 'primary' : 'default'}
                          variant={pre ? 'default' : 'outlined'}
                          label={val.problem}
                          onClick={() => {
                            let med = {
                              problem: val.problem,
                              familyMember: [],
                              _id: val._id,
                              option: 'No'
                            };
                            patientHistory.familyHistory !== undefined &&
                              patientHistory.familyHistory.forEach((v) => {
                                if (v.problem === val.problem && v._id === val._id) {
                                  med = v;
                                }
                              });
                            setError('');
                            setOpenAddFamHistoryPro(false);
                            setFamilyNDuration({
                              memberRelation: '',
                              duration: ''
                            });
                            setOpenFamHistoryPro(true);
                            setOpenData(med);
                            setOpenDuration(false);
                            setOpenEditDataDetail(false);
                            setOpenEditHandler(false);
                            setOpenDeleteHandler(false);
                          }}
                          onDelete={
                            pre
                              ? () => {
                                  let medPro = [];
                                  patientHistory.familyHistory.forEach((vM) => {
                                    if (vM._id === val._id) {
                                      medPro.push({
                                        ...vM,
                                        option: 'No',
                                        familyMember: []
                                      });
                                    } else {
                                      medPro.push(vM);
                                    }
                                  });
                                  setPatientHistory((prev) => {
                                    return { ...prev, familyHistory: medPro };
                                  });
                                  setOpenEditDataDetail(false);
                                  setOpenEditHandler(false);
                                  setOpenDeleteHandler(false);
                                }
                              : undefined
                          }
                          deleteIcon={pre ? <Close sx={{ color: pre ? '#fff !important' : '#333' }} /> : undefined}
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

          <Dialog
            open={openAddFamHistoryPro}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            <DialogContent>
              {/* add family history */}
              {openAddFamHistoryPro && (
                <Grid item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>Add Family History</h4>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="problem"
                      value={openData.problem}
                      onChange={(e) => {
                        setOpenData((prev) => {
                          return {
                            ...prev,
                            problem: e.target.value,
                            familyMember: []
                          };
                        });
                        setError('');
                      }}
                      error={error !== '' ? true : false}
                      helperText={error}
                      style={{ marginBottom: '10px' }}
                    />
                    <Button className="addBtn" onClick={handleSubmitFamHistoryProblem} variant="contained">
                      Save
                    </Button>
                    <Button className="addBtn" onClick={() => setOpenAddFamHistoryPro(false)} sx={{ ml: 1 }} variant="contained">
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEditHandler}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            <DialogContent>
              {/* edit family history  */}
              {openEditHandler && (
                <Grid item xs={4} className="ptData">
                  <Box
                    // style={{ width: '400px', padding: '1rem' }}
                    sx={{ width: '400px' }}
                    className="selectedPtCategory"
                  >
                    <h4>Edit Family History</h4>
                    <Box className="selectedCategory">
                      {allFamilyProblems?.map((val, ind) => {
                        return (
                          <Chip
                            // style={{ margin: '5px' }}
                            color="secondary"
                            variant="outlined"
                            sx={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'primary.main', mr: 1, mt: 1 }}
                            key={ind}
                            className="selectProblem"
                            label={val.problem}
                            onClick={() => {
                              setOpenEditHandler(false);
                              setOpenEditDataDetail(true);
                              setOpenData(val);
                              setOpenDeleteHandler(false);
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                  <Button className="addBtn" onClick={() => setOpenEditHandler(false)} sx={{ m: 1 }} variant="contained">
                    Cancel
                  </Button>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEditDataDetail}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            <DialogContent>
              {/* update family history  */}
              {openEditDataDetail && (
                <Grid item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>Update Family History</h4>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="problem"
                      value={openData.problem}
                      onChange={(e) => {
                        setOpenData((prev) => {
                          return { ...prev, problem: e.target.value };
                        });
                        setError('');
                      }}
                      error={error !== '' ? true : false}
                      helperText={error}
                      style={{ marginBottom: '10px' }}
                    />
                    <Button className="addBtn" onClick={handleUpdateSubmitMedicalProblem} variant="contained">
                      Save
                    </Button>
                    <Button className="addBtn" onClick={() => setOpenEditDataDetail(false)} variant="contained" sx={{ ml: 1 }}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDeleteHandler}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* Delete family history */}
            <DialogContent>
              {openDeleteHandler && (
                <Grid item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>Delete Family History</h4>
                    <Box className="selectedCategory">
                      {allFamilyProblems?.map((val, ind) => {
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
                            sx={{
                              borderWidth: 2,
                              borderColor: exist ? 'primary.main' : 'secondary.main',
                              borderStyle: 'solid',
                              mr: 1,
                              my: 1
                            }}
                            color={exist ? 'primary' : 'default'}
                            variant={exist ? 'default' : 'outlined'}
                            label={val.problem}
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

                    <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteFamilyHistory}>
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      className="addBtn"
                      style={{ marginTop: '10px' }}
                      onClick={() => setOpenDeleteHandler(false)}
                      sx={{ ml: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openFamHistoryPro}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* after clicking on familt history */}
            <DialogContent>
              {openFamHistoryPro && (
                <Grid item xs={4} className="ptData">
                  <Box sx={{ width: '400px' }} className="selectedPtCategory">
                    <ButtonGroup variant="outlined" aria-label="Basic button group" style={{ margin: '10px 0', display: 'block' }}>
                      <Button
                        variant="outlined"
                        sx={{
                          backgroundColor: having === 'Yes' ? '#126078' : 'transparent',
                          color: having === 'Yes' ? 'white' : 'black',
                          '&:hover': { backgroundColor: '#0f4d5c', color: 'white' }
                        }}
                        onClick={() => handleButtonClick('Yes')}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          backgroundColor: patientHistory?.medicalProblem?.having === 'No' ? '#126078' : 'transparent',
                          color: patientHistory?.medicalProblem?.having === 'No' ? 'white' : 'black',
                          '&:hover': { backgroundColor: '#0f4d5c', color: 'white' }
                        }}
                        onClick={() => handleButtonClick('No')}
                      >
                        No
                      </Button>
                    </ButtonGroup>
                    {openSelectSince && (
                      <>
                        <h4>Which family members has {openData.problem}?</h4>
                        {familyMember.length > 0 && (
                          <Box className="sinceFormat" my={2}>
                            {familyMember.length > 0 && (
                              <Box className="sinceFormat">
                                {familyMember.map((val, ind) => {
                                  let f = {
                                    memberRelation: val.memberRelation,
                                    duration: '',
                                    _id: val._id
                                  };

                                  openData.familyMember?.forEach((v) => {
                                    if (val.memberRelation === v.memberRelation && v.duration !== '') {
                                      f = v;
                                    }
                                  });

                                  const isSelected = openData.familyMember?.some((v) => v.memberRelation === val.memberRelation);

                                  return (
                                    <Chip
                                      key={ind}
                                      sx={{
                                        borderWidth: 2,
                                        borderColor: isSelected ? 'primary.main' : 'secondary.main',
                                        borderStyle: 'solid',
                                        mr: 1,
                                        my: 1
                                      }}
                                      color={isSelected ? 'primary' : 'default'}
                                      variant={isSelected ? 'default' : 'outlined'}
                                      className={`${isSelected ? 'selectProblem_selected' : 'selectProblem'}`}
                                      label={val.memberRelation}
                                      onClick={() => {
                                        setOpenAddFamilyMember(false);
                                        setOpenAddFamHistoryPro(false);
                                        setOpenFamHistoryPro(false);
                                        setOpenDuration(true);
                                        setFamilyNDuration(f);
                                        setError('');
                                      }}
                                      onDelete={() => deleteMembers(val?._id)}
                                      deleteIcon={
                                        <Close
                                          style={{
                                            color: isSelected ? 'white' : 'inherit',
                                            fontSize: '14px'
                                          }}
                                        />
                                      }
                                    />
                                  );
                                })}
                                <Button
                                  className="button-87"
                                  onClick={() => {
                                    setOpenDuration(false);
                                    setOpenFamHistoryPro(false);
                                    setOpenAddFamilyMember(true);
                                    setMemberRelation('');
                                  }}
                                >
                                  Add
                                </Button>
                                <span className="err">{error}</span>
                              </Box>
                            )}

                            <span className="err">{error}</span>
                          </Box>
                        )}
                      </>
                    )}

                    {familyMember.length === 0 && (
                      <>
                        <Chip
                          className="selectProblem"
                          label="+ Add"
                          onClick={() => {
                            setOpenDuration(false);
                            setOpenFamHistoryPro(false);
                            setOpenAddFamilyMember(true);
                            setMemberRelation('');
                          }}
                        />
                      </>
                    )}
                    <br />
                    <Button
                      className="addBtn"
                      style={{ marginTop: '5px', ml: 2 }}
                      onClick={() => {
                        if (openData.familyMember?.length > 0 && openData.option === 'Yes') {
                          let updatedHistory = [];

                          // Merge existing history with the new entry
                          if (patientHistory.familyHistory) {
                            updatedHistory = [...patientHistory.familyHistory, openData];
                          } else {
                            updatedHistory = [openData];
                          }

                          // Remove duplicates based on 'problem'
                          const uniqueHistory = [...new Map(updatedHistory.map((item) => [item.problem, item])).values()];

                          setPatientHistory((prev) => ({
                            ...prev,
                            familyHistory: uniqueHistory
                          }));
                        }

                        // Clear form state
                        setOpenData({});
                        setOpenFamHistoryPro(false);
                      }}
                      variant="contained"
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ marginTop: '5px', ml: 2 }}
                      onClick={() => {
                        setOpenFamHistoryPro(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDuration}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* since when patient has problem  */}\
            <DialogContent>
              {openDuration && (
                <Grid item xs={4} className="ptData">
                  <Box sx={{ width: '400px' }} className="selectedPtCategory">
                    <h4>
                      Since when has patient {familyNDuration.memberRelation} had {openData.problem} ?
                    </h4>

                    <Box className="sinceFormat" sx={{ my: 2 }}>
                      {since.map((v, inx) => {
                        let sinceData = v.since;
                        if (v.since.includes('Month')) {
                          sinceData = sinceData.replace(' Month', 'M');
                        }
                        if (v.since.includes('Year')) {
                          sinceData = sinceData.replace(' Year', 'Y');
                        }
                        if (v.since.includes('Week')) {
                          sinceData = sinceData.replace(' Week', 'W');
                        }

                        let isSelected = v === familyNDuration.duration; // Check if selected

                        return (
                          <Chip
                            sx={{
                              borderWidth: 2,
                              borderColor: isSelected ? 'primary.main' : 'secondary.main',
                              borderStyle: 'solid',
                              mr: 1,
                              my: 1
                            }}
                            color={isSelected ? 'primary' : 'default'}
                            variant={isSelected ? 'default' : 'outlined'}
                            key={inx}
                            className={`${isSelected ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                            label={sinceData}
                            onDelete={() => deleteSince(v._id)}
                            onClick={() => {
                              setFamilyNDuration((prev) => {
                                return { ...prev, duration: v };
                              });
                            }}
                            deleteIcon={<Close style={{ color: isSelected ? 'white' : 'inherit', fontSize: '14px' }} />}
                          />
                        );
                      })}
                      <Button className="button-87" onClick={handleSince}>
                        Add
                      </Button>
                    </Box>

                    <Button
                      className="addBtn"
                      style={{ marginTop: '10px' }}
                      onClick={() => {
                        // Guard clause: Do nothing if duration is empty
                        if (!familyNDuration.duration) return;
                      
                        // Step 1: Update openData.familyMember
                        const updatedFamilyMembers = [
                          ...openData.familyMember,
                          {
                            memberRelation: familyNDuration.memberRelation,
                            _id: familyNDuration._id,
                            duration: familyNDuration.duration
                          }
                        ];
                      
                        const uniqueFamilyMembers = [
                          ...new Map(updatedFamilyMembers.map((item) => [item.memberRelation, item])).values()
                        ];
                      
                        const updatedOpenData = {
                          ...openData,
                          familyMember: uniqueFamilyMembers,
                          option: 'Yes'
                        };
                      
                        setOpenData(updatedOpenData);
                      
                        // Step 2: Add openData to patientHistory.familyHistory
                        if (updatedOpenData.familyMember.length > 0 && updatedOpenData.option === 'Yes') {
                          let mergedHistory = patientHistory.familyHistory
                            ? [...patientHistory.familyHistory, updatedOpenData]
                            : [updatedOpenData];
                      
                          // Remove duplicates based on 'problem'
                          const uniqueHistory = [
                            ...new Map(mergedHistory.map((item) => [item.problem, item])).values()
                          ];
                      
                          setPatientHistory((prev) => ({
                            ...prev,
                            familyHistory: uniqueHistory
                          }));
                        }
                      
                        // Step 3: Close duration modal and open family history problem modal
                        setOpenDuration(false);
                        setOpenFamHistoryPro(false);
                        setOpenSelectSince(false)
                                                
                      }}
                      
                      variant="contained"
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ marginTop: '10px', ml: 2 }}
                      onClick={() => {
                        setOpenFamHistoryPro(true);
                        setOpenDuration(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={sinceOpen}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* add since*/}
            <DialogContent>
              {sinceOpen && (
                <Grid item xs={4} className="ptData">
                  <Box sx={{ width: 400 }}>
                    <h3>Add Since</h3>
                    <TextField
                      fullWidth
                      label="Since"
                      variant="outlined"
                      name="since"
                      value={sinceValue}
                      onChange={(e) => {
                        setSinceValue(e.target.value);
                      }}
                      sx={{ my: 2 }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Button variant="contained" className="addBtn" sx={{ marginTop: '10px' }} onClick={handleSinceSubmit}>
                        Save
                      </Button>
                      <Button variant="contained" className="addBtn" sx={{ marginTop: '10px', ml: 2 }} onClick={handleSinceClose}>
                        Cancel
                      </Button>
                    </div>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          {openAddFamilyMember && (
            <Grid item xs={4} className="ptData">
              <Box className="selectedPtCategory" sx={{ boxShadow: 3, p: 4, width: 400 }}>
                <h4>Add Family Member</h4>

                <TextField
                  variant="outlined"
                  name="memberRelation"
                  fullWidth
                  value={memberRelation}
                  onChange={(e) => {
                    setMemberRelation(e.target.value);
                    setMemberRelationErr('');
                  }}
                  error={memberRelationErr !== '' ? true : false}
                  helperText={memberRelationErr}
                  sx={{ my: 2 }}
                />
                <Button className="addBtn" onClick={handleSubmitFamRelation} variant="contained">
                  Save
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  className="addBtn"
                  onClick={() => {
                    setOpenAddFamilyMember(false);
                  }}
                  variant="contained"
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
      <ToastContainer />
    </>
  );
};

export default FamilyHistory;
