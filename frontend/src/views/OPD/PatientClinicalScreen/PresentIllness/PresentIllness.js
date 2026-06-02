import { useToast } from "@chakra-ui/react";
import WidgetsLoader from "@components/WidgetsLoader";
import { Add, AddBox, Cancel, Close, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import REACT_APP_BASE_URL from "API/api";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import tokenHandler from "token/tokenHandler";

const PresentIllness = ({ selectedMenu }) => {
  const [inputVal, setInputVal] = React.useState([]);
  const [err, setErr] = React.useState([]);
  const [patientPresentIllness, setPatientPresentIllness] = useState([]);
  const [allPresentIllness, setAllPresentIllness] = useState([]);
  const [inputValOp, setInputValOp] = React.useState([]);
  const [errOp, setErrOp] = React.useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [mostusedPresentIllness, setmostusedPresentIllness] = useState([]);
  const [presentIllness, setPresentIllness] = useState([]);
  const [alreadyExistId, setAlreadyExistId] = useState("");
  const [openPresentIllness, setOpenPresentIllness] = useState(false);
  const [addOptions, setAddOptions] = useState(false);
  const [openData, setOpenData] = useState({});
  const [error, setError] = useState({ problem: "" });
  const [openAddPresentIllness, setOpenAddPresentIllness] = useState(false);

  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);

  const [loader, setLoader] = useState(true);
  const toast = useToast();
  const token = tokenHandler();

  const getPatientPresentIllness = async () => {
    await axios
      .get(
        `${REACT_APP_BASE_URL}patient-present-illness/${JSON.parse(localStorage.getItem("patientConsult"))._id
        }`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (
            v.departmentId ===
            JSON.parse(localStorage.getItem("patientConsult")).departmentId &&
            v.consultantId ===
            JSON.parse(localStorage.getItem("patientConsult")).consultantId
          ) {
            res.push(v);
          }
        });
        if (res.length > 0) {
          setPatientPresentIllness(res[res.length - 1].presentIllness);
          setAlreadyExistId(res[res.length - 1]._id);
        }
      })
      .catch((error) => { });
  };

  const getPresentIllnessProblem = async () => {
    setLoader(true);

    await getPatientPresentIllness();

    await axios
      .get(`${REACT_APP_BASE_URL}opd/present-illness`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (
            v.departmentId ===
            JSON.parse(localStorage.getItem("patientConsult")).departmentId
          ) {
            res.push(v);
          }
        });
        setAllPresentIllness(res);
      })
      .catch((error) => { });

    await axios
      .get(
        `${REACT_APP_BASE_URL}opd/present-illness/most-used/${JSON.parse(localStorage.getItem("patientConsult")).departmentId
        }`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (
            v.departmentId ===
            JSON.parse(localStorage.getItem("patientConsult")).departmentId
          ) {
            res.push(v);
          }
        });
        setmostusedPresentIllness(res);
        setPresentIllness(res);
        setLoader(false);
      })
      .catch((error) => { });
  };

  useEffect(() => {
    getPresentIllnessProblem();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === "") {
      let medP = mostusedPresentIllness.slice(); // Copying mostusedPresentIllness to medP to avoid modifying it directly

      patientPresentIllness.forEach((vv) => {
        // Check if the problem in patientPresentIllness is not present in mostusedPresentIllness
        if (!medP.some((v) => v.problem === vv.problem)) {
          medP.unshift(vv); // Add the problem from patientPresentIllness to medP
        }
      });
      // if()
      setPresentIllness(medP);
    } else {
      let med = [];
      allPresentIllness.forEach((v) => {
        if (v.problem.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setPresentIllness(med);
    }
  };

  const closeForm = () => {
    setOpenPresentIllness(false);
    setError({ problem: "" });
    setOpenAddPresentIllness(false);
    setOpenEditDataDetail(false)
    setOpenEditHandler(false)
    setOpenDeleteHandler(false)
    setOpenData({});
  };

  const handleSubmitOptions = async () => {
    const er = [...errOp];
    let already = true;
    inputValOp.forEach((val, ind) => {
      if (val.data === "") {
        er[ind].data = "Please Enter Option or remove it...";
      } else {
        inputVal.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = "This Option is already exist...";
          }
        });
      }
    });
    setErrOp(er);

    let result = true;
    for (let i = 0; i < inputValOp.length; i++) {
      let data = inputValOp[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/present-illness/objective/${openData._id}`,
          {
            objective: inputValOp,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(async (response) => {
          await getPresentIllnessProblem();
          toast({
            title: `Options Created Successfully!!`,
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
          setInputVal([...inputVal, ...inputValOp]);
          // setOpenData((prev) => {
          //   return {
          //     ...prev,
          //     objective: [...prev.objective, ...inputValOp],
          //   };
          // });

          setInputValOp([]);
          setErrOp([]);
          setAddOptions(false);
          setOpenPresentIllness(true);
        })
        .catch((error) => {
          toast({
            title: "Something went wrong, Please try later!!",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  };

  const handleSubmitAddPresentIllness = async () => {
    if (openData.problem === "") {
      setError((prev) => {
        return { ...prev, problem: "Enter the History of Present Illness" };
      });
    }

    const er = [...err];
    inputVal.forEach((val, ind) => {
      if (val.data === "") {
        er[ind].data = "Please Enter Option or remove it...";
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < inputVal.length; i++) {
      let data = inputVal[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (openData.problem !== "" && result) {
      //call api to store History of Present Illness
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/present-illness`,
          {
            problem: openData.problem,
            answerType: openData.answerType,
            objective: inputVal,
            departmentId: JSON.parse(localStorage.getItem("patientConsult"))
              .departmentId,
            consultantId: JSON.parse(localStorage.getItem("patientConsult"))
              .consultantId,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(async (response) => {
          await getPresentIllnessProblem();

          closeForm();
          setInputVal([]);
          setErr([]);
          toast({
            title: " History of Present Illness Created Successfully!!",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {
          toast({
            title: "Something went wrong, Please try later!!",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  };

  const handleSubmitUpdatePresentIllness = async () => {
    if (openData.problem === "") {
      setError((prev) => {
        return { ...prev, problem: "Enter the History of Present Illness" };
      });
    }

    const er = [...err];
    inputVal.forEach((val, ind) => {
      if (val.data === "") {
        er[ind].data = "Please Enter Option or remove it...";
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < inputVal.length; i++) {
      let data = inputVal[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (openData.problem !== "" && result) {
      //call api to store History of Present Illness
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/present-illness/${openData._id}`,
          {
            problem: openData.problem,
            answerType: openData.answerType,
            objective: inputVal,
            departmentId: JSON.parse(localStorage.getItem("patientConsult"))
              .departmentId,
            consultantId: JSON.parse(localStorage.getItem("patientConsult"))
              .consultantId,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(async (response) => {
          await getPresentIllnessProblem();

          closeForm();
          setOpenData({})
          setInputVal([]);
          setErr([]);
          toast({
            title: " History of Present Illness Updated Successfully!!",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {
          toast({
            title: "Something went wrong, Please try later!!",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  };

  //add the new test input field
  const addInputVal = () => {
    setInputVal([
      ...inputVal,
      {
        data: "",
      },
    ]);
    setErr((prev) => {
      return [
        ...prev,
        {
          data: "",
        },
      ];
    });
  };

  //remove the one test data
  const removeInputVal = (index) => {
    const rows = [...inputVal];
    rows.splice(index, 1);
    setInputVal(rows);
    const ee = [...err];
    ee.splice(index, 1);
    setErr(ee);
  };

  //add the new test input field
  const addInputValOp = () => {
    setInputValOp([
      ...inputValOp,
      {
        data: "",
      },
    ]);
    setErrOp((prev) => {
      return [
        ...prev,
        {
          data: "",
        },
      ];
    });
  };

  //remove the one test data
  const removeInputValOp = (index) => {
    const rows = [...inputValOp];
    rows.splice(index, 1);
    setInputValOp(rows);
    const ee = [...errOp];
    ee.splice(index, 1);
    setErrOp(ee);
  };

  const handleData = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputVal];
    list[index][name] = value;
    setInputVal(list);
    const er = err;
    er[index][name] = "";
    setErr(er);
  };

  const handleDataOp = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputValOp];
    list[index][name] = value;
    setInputValOp(list);
    const er = errOp;
    er[index][name] = "";
    setErrOp(er);
  };

  const handleSavePresentIllness = (val) => {
    if (patientPresentIllness.length === 0) {
      handleSubmitPresentIllness(val);
    } else {
      handleSubmitEditPresentIllness(val);
    }
  };

  const handleSubmitPresentIllness = (sM) => {
    axios
      .post(
        `${REACT_APP_BASE_URL}patient-present-illness`,
        {
          patientId: JSON.parse(localStorage.getItem("patientConsult"))._id,
          departmentId: JSON.parse(localStorage.getItem("patientConsult"))
            .departmentId,
          consultantId: JSON.parse(localStorage.getItem("patientConsult"))
            .consultantId,
          presentIllness: sM,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        getPatientPresentIllness();
        toast({
          title: `History of Present Illness Successfully Submitted!!`,
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      })
      .catch((error) => {
        toast({
          title: "Something went wrong, Please try later!!",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      });
  };

  const handleSubmitEditPresentIllness = (sM) => {
    axios
      .put(
        `${REACT_APP_BASE_URL}patient-present-illness/${alreadyExistId}`,
        {
          patientId: JSON.parse(localStorage.getItem("patientConsult"))._id,
          departmentId: JSON.parse(localStorage.getItem("patientConsult"))
            .departmentId,
          consultantId: JSON.parse(localStorage.getItem("patientConsult"))
            .consultantId,
          presentIllness: sM,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        getPatientPresentIllness();
        toast({
          title: `History of Present Illness Successfully Updated!!`,
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      })
      .catch((error) => {
        toast({
          title: "Something went wrong, Please try later!!",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      });
  };

  const handleSaveDeletePresentIllness = () => {
    let data = {
      ids: deleteIds,
    };
    let headers = { Authorization: "Bearer " + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/present-illness`, { headers, data })
      .then((response) => {
        getPresentIllnessProblem();
        setDeletedIds([]);
        setOpenDeleteHandler(false);
        toast({
          title: "History of Present Illness Deleted Successfully!!",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      })
      .catch((error) => {
        toast({
          title: "Something went wrong, Please try later!!",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      });
  };

  return (
    <Box className="paticularSection">
      {loader ? (
        <WidgetsLoader />
      ) : (
        <Grid container spacing={2} height="inherit">
          <Grid container item spacing={2} xs={8} px={2} height="inherit">
            <Grid item xs={6} height="inherit">
            {selectedMenu !== "All" && (
                <h2 className="popupHead" style={{ marginBottom: "10px" }}>
                  History of Present Illness
                </h2>
              )}
              {/* <h2 className="heading">History of Present Illness</h2> */}
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


              <IconButton
                style={{ marginLeft: "2px" }}
                title="Add History of Present Illness"
                onClick={() => {
                  setOpenPresentIllness(false);
                  setOpenData({ problem: "", answerType: "Subjective" });
                  setInputVal([]);
                  setOpenAddPresentIllness(true);
                  setOpenEditDataDetail(false)
                  setOpenEditHandler(false)
                  setOpenDeleteHandler(false)
                }}
              >
                <Add fontSize="small" style={{ color: "#089bab" }} />
              </IconButton>

              {allPresentIllness.length > 0 && (
                <IconButton
                  style={{ marginLeft: "2px" }}
                  title="Edit History of Present Illness"
                  onClick={() => {
                    setOpenPresentIllness(false);
                    setOpenData({ problem: "", answerType: "Subjective" });
                    setInputVal([]);
                    setOpenAddPresentIllness(false);
                    setOpenEditDataDetail(false)
                    setOpenEditHandler(true)
                    setOpenDeleteHandler(false)
                  }}
                >
                  <Edit fontSize="small" style={{ color: "blue" }} />
                </IconButton>
              )}

              {allPresentIllness.length > 0 && (
                <IconButton
                  style={{ marginLeft: "2px" }}
                  title="Delete History of Present Illness"
                  onClick={() => {
                    setOpenPresentIllness(false);
                    setOpenData({ problem: "", answerType: "Subjective" });
                    setInputVal([]);
                    setOpenAddPresentIllness(false);
                    setOpenEditDataDetail(false)
                    setOpenEditHandler(false)
                    setOpenDeleteHandler(true)
                  }}
                >
                  <Delete fontSize="small" style={{ color: "red" }} />
                </IconButton>
              )}

              {allPresentIllness.length === 0 ? (
                <h4 className="noFoundOPd">
                  History of Present Illness Not Available, Please Add...
                </h4>
              ) : (
                <>
                  {presentIllness.length > 0 ? (
                    <Box className="selectedCategory">
                      {presentIllness.map((val, ind) => {
                        let pre = false;
                        patientPresentIllness !== undefined &&
                          patientPresentIllness.forEach((v) => {
                            if (
                              v.problem === val.problem &&
                              v._id === val._id
                            ) {
                              pre = true;
                            }
                          });
                        return (
                          <Chip
                            key={ind}
                            className={`${val.problem === openData.problem
                              ? "selectProblem_selected"
                              : pre
                                ? "selectProblemActive"
                                : "selectProblem"
                              }`}
                            label={val.problem}
                            onClick={() => {
                              setError({ problem: "", ans: "" });
                              let med = {
                                problem: val.problem,
                                answerType: val.answerType,
                                value: "",
                                objective: [],
                                _id: val._id,
                              };
                              setInputVal(val.objective);
                              patientPresentIllness !== undefined &&
                                patientPresentIllness.forEach((v) => {
                                  if (
                                    v.problem === val.problem &&
                                    v._id === val._id
                                  ) {
                                    med = v;
                                  }
                                });
                              setOpenAddPresentIllness(false);
                              setOpenEditDataDetail(false)
                              setOpenEditHandler(false)
                              setOpenDeleteHandler(false)
                              setOpenPresentIllness(true);
                              setOpenData(med);
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
            {openAddPresentIllness && (
              <Grid
                item
                xs={6}
                className="ptData"
                style={{ height: selectedMenu !== "All" && "100%" }}
              >
                <Box className="selectedPtCategory">
                  <h4>Add History of Present Illness</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="problem"
                    label="History of Present Illness"
                    value={openData.problem}
                    onChange={(e) => {
                      setOpenData((prev) => {
                        return { ...prev, problem: e.target.value };
                      });
                      setError((prev) => {
                        return { ...prev, problem: "" };
                      });
                    }}
                    error={error.problem !== "" ? true : false}
                    helperText={error.problem}
                    style={{ margin: "10px 0" }}
                  />

                  <FormControl style={{ margin: "5px", width: "100%" }}>
                    <FormLabel>Answer Type:</FormLabel>
                    <RadioGroup
                      row
                      name="answerType"
                      value={openData.answerType}
                      onChange={(e) => {
                        setOpenData((prev) => {
                          return { ...prev, answerType: e.target.value };
                        });

                        if (e.target.value === "Objective") {
                          setInputVal([{ data: "" }]);
                          setErr([{ data: "" }]);
                        } else {
                          setInputVal([]);
                          setErr([]);
                        }
                      }}
                    >
                      <FormControlLabel
                        value="Subjective"
                        control={<Radio size="small" />}
                        label="Subjective"
                      />
                      <FormControlLabel
                        value="Objective"
                        control={<Radio size="small" />}
                        label="Objective"
                      />
                      <FormControlLabel
                        value="Calender"
                        control={<Radio size="small" />}
                        label="Calender"
                      />
                    </RadioGroup>
                  </FormControl>

                  {openData.answerType === "Objective" && (
                    <div style={{ marginBottom: "10px" }}>
                      {inputVal.map((data, index) => {
                        return (
                          <Grid item xs={12} key={index} className="withChiefC">
                            <Grid item xs={10}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="data"
                                value={data.data}
                                margin="dense"
                                onChange={(evnt) => handleData(index, evnt)}
                                error={err[index].data !== "" ? true : false}
                                helperText={err[index].data}
                              />
                            </Grid>
                            {inputVal.length !== 1 && (
                              <Grid item xs={1}>
                                <IconButton
                                  title="Remove Option"
                                  onClick={() => {
                                    removeInputVal(index);
                                  }}
                                  className="btnDelete"
                                >
                                  <Cancel className="btnDelete" />
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        );
                      })}
                      <IconButton
                        variant="contained"
                        onClick={addInputVal}
                        title="Add Option"
                        className="addBox"
                      >
                        <AddBox />
                      </IconButton>
                    </div>
                  )}

                  <Button
                    className="addBtn"
                    onClick={handleSubmitAddPresentIllness}
                    style={{ margin: "8px 0" }}
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            )}


            {openEditHandler && (
              <Grid
                item
                xs={6}
                className="ptData"
                style={{ height: selectedMenu !== "All" && "100%" }}
              >
                <Box className="selectedPtCategory">
                  <h4>Edit History of Present Illness</h4>
                  <Box className="selectedCategory">
                    {allPresentIllness.map((val, ind) => {
                      return (
                        (
                          <Chip
                            key={ind}
                            className="selectProblem"
                            label={val.problem}
                            onClick={() => {
                              setOpenEditHandler(false);
                              setOpenEditDataDetail(true);
                              setOpenPresentIllness(false);
                              setOpenData(val);
                              setInputVal(val.objective)
                              let e = []
                              val.objective.forEach((vv) => {
                                e.push({ data: "" })
                              })
                              setErr(e)
                              setOpenAddPresentIllness(false);
                              setOpenDeleteHandler(false);
                            }}
                          />
                        )
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            )}

            {openEditDataDetail && (
              <Grid
                item
                xs={6}
                className="ptData"
                style={{ height: selectedMenu !== "All" && "100%" }}
              >
                <Box className="selectedPtCategory">
                  <h4>Update History of Present Illness</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="problem"
                    label="History of Present Illness"
                    value={openData.problem}
                    onChange={(e) => {
                      setOpenData((prev) => {
                        return { ...prev, problem: e.target.value };
                      });
                      setError((prev) => {
                        return { ...prev, problem: "" };
                      });
                    }}
                    error={error.problem !== "" ? true : false}
                    helperText={error.problem}
                    style={{ margin: "10px 0" }}
                  />

                  <FormControl style={{ margin: "5px", width: "100%" }}>
                    <FormLabel>Answer Type:</FormLabel>
                    <RadioGroup
                      row
                      name="answerType"
                      value={openData.answerType}
                      onChange={(e) => {
                        setOpenData((prev) => {
                          return { ...prev, answerType: e.target.value };
                        });

                        if (e.target.value === "Objective") {
                          setInputVal([{ data: "" }]);
                          setErr([{ data: "" }]);
                        } else {
                          setInputVal([]);
                          setErr([]);
                        }
                      }}
                    >
                      <FormControlLabel
                        value="Subjective"
                        control={<Radio size="small" />}
                        label="Subjective"
                      />
                      <FormControlLabel
                        value="Objective"
                        control={<Radio size="small" />}
                        label="Objective"
                      />
                      <FormControlLabel
                        value="Calender"
                        control={<Radio size="small" />}
                        label="Calender"
                      />
                    </RadioGroup>
                  </FormControl>

                  {openData.answerType === "Objective" && (
                    <div style={{ marginBottom: "10px" }}>
                      {inputVal.map((data, index) => {
                        return (
                          <Grid item xs={12} key={index} className="withChiefC">
                            <Grid item xs={10}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="data"
                                value={data.data}
                                margin="dense"
                                onChange={(evnt) => handleData(index, evnt)}
                                error={err[index].data !== "" ? true : false}
                                helperText={err[index].data}
                              />
                            </Grid>
                            {inputVal.length !== 1 && (
                              <Grid item xs={1}>
                                <IconButton
                                  title="Remove Option"
                                  onClick={() => {
                                    removeInputVal(index);
                                  }}
                                  className="btnDelete"
                                >
                                  <Cancel className="btnDelete" />
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        );
                      })}
                      <IconButton
                        variant="contained"
                        onClick={addInputVal}
                        title="Add Option"
                        className="addBox"
                      >
                        <AddBox />
                      </IconButton>
                    </div>
                  )}

                  <Button
                    className="addBtn"
                    onClick={handleSubmitUpdatePresentIllness}
                    style={{ margin: "8px 0" }}
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            )}

            {openDeleteHandler && (
              <Grid
                item
                xs={6}
                className="ptData"
                style={{ height: selectedMenu !== "All" && "100%" }}
              >
                <Box className="selectedPtCategory">
                  <h4>Delete History of Present Illness</h4>
                  <Box className="selectedCategory">
                    {allPresentIllness.map((val, ind) => {
                      let exist = false;
                      deleteIds.forEach((v) => {
                        if (val._id === v) {
                          exist = true;
                        }
                      });
                      return (
                        (
                          <Chip
                            key={ind}
                            className={
                              exist ? "selectProblemDelete" : "selectProblem"
                            }
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
                            deleteIcon={
                              exist ? (
                                <Close style={{ color: "white" }} />
                              ) : undefined
                            }
                          />
                        )
                      );
                    })}
                  </Box>

                  <Button
                    variant="contained"
                    className="addBtn"
                    style={{ marginTop: "10px" }}
                    onClick={handleSaveDeletePresentIllness}
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            )}

            {addOptions && (
              <Grid item xs={6} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Add Option for {openData.problem}</h4>
                  <Box className="withChiefC">
                    {inputValOp.map((data, index) => {
                      return (
                        <Grid item xs={12} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataOp(index, evnt)}
                              error={errOp[index].data !== "" ? true : false}
                              helperText={errOp[index].data}
                            />
                          </Grid>
                          {inputValOp.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Options"
                                onClick={() => {
                                  removeInputValOp(index);
                                }}
                                className="btnDelete"
                              >
                                <Cancel className="btnDelete" />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      );
                    })}
                  </Box>
                  <IconButton
                    variant="contained"
                    onClick={addInputValOp}
                    title="Add Options"
                    className="addBox"
                  >
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleSubmitOptions}>
                      Save
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}

            {openPresentIllness && (
              <Grid
                item
                xs={6}
                className="ptData"
                style={{ height: selectedMenu !== "All" && "100%" }}
              >
                <Box className="selectedPtCategory">
                  <h4>{openData.problem}</h4>

                  {inputVal.length > 0 && (
                    <Box className="sinceFormat" style={{ marginTop: "5px" }}>
                      {inputVal.map((v, inx) => {
                        let exist = false;
                        openData.objective.forEach((op) => {
                          if (op.data === v.data) {
                            exist = true;
                          }
                        });
                        return (
                          <Chip
                            key={inx}
                            className={`${exist
                              ? "selectProblemWithActive"
                              : "selectProblemWith"
                              }`}
                            label={v.data}
                            onClick={() => {
                              setOpenData((prev) => {
                                return {
                                  ...prev,
                                  objective: [...prev.objective, v],
                                };
                              });
                            }}
                            onDelete={
                              exist
                                ? () => {
                                  let medPro = [];
                                  openData.objective.forEach((vM) => {
                                    if (vM.data !== v.data) {
                                      medPro.push(vM);
                                    }
                                  });
                                  setOpenData((prev) => {
                                    return { ...prev, objective: medPro };
                                  });
                                }
                                : undefined
                            }
                            deleteIcon={
                              exist ? (
                                <Close style={{ color: "white" }} />
                              ) : undefined
                            }
                          />
                        );
                      })}
                      <Chip
                        className={"selectProblemWith"}
                        label="+ Add"
                        onClick={() => {
                          setAddOptions(true);
                          setOpenPresentIllness(false);
                          setInputValOp([{ data: "" }]);
                          setErrOp([{ data: "" }]);
                        }}
                      />
                    </Box>
                  )}

                  {inputVal.length === 0 && (
                    <Box className="sinceFormat" style={{ marginTop: "5px" }}>
                      <TextField
                        variant="outlined"
                        name="value"
                        value={openData.value}
                        fullWidth={
                          openData.answerType === "Calender" ? false : true
                        }
                        type={
                          openData.answerType === "Calender" ? "date" : "text"
                        }
                        multiline={
                          openData.answerType === "Calender" ? false : true
                        }
                        rows={5}
                        onChange={(e) => {
                          setOpenData((prev) => {
                            return {
                              ...prev,
                              value: e.target.value,
                            };
                          });
                        }}
                      />
                    </Box>
                  )}

                  <Button
                    className="addBtn"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      if (
                        openData.value !== "" ||
                        openData.objective.length > 0
                      ) {
                        let sM =
                          patientPresentIllness !== undefined
                            ? [...patientPresentIllness, openData]
                            : [openData];

                        sM = [
                          ...new Map(
                            sM.map((item) => [item["problem"], item])
                          ).values(),
                        ];
                        handleSavePresentIllness(sM);
                      }
                      setInputVal([]);
                      setOpenData({});
                      setOpenPresentIllness(false);
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
          {patientPresentIllness.length > 0 && (
            <Grid
              item
              xs={4}
              className="ptData"
              style={{ height: selectedMenu !== "All" && "100%" }}
            >
              <Box className="selectedPtCategory">
                {patientPresentIllness.map((val, ind) => {
                  return (
                    <Chip
                      key={ind}
                      className="selectProblemActive"
                      label={val.problem}
                      onClick={() => {
                        let aa = [];
                        allPresentIllness.forEach((av) => {
                          if (av._id === val._id) {
                            aa.push(av);
                          }
                        });
                        setInputVal(aa[0].objective);
                        setOpenAddPresentIllness(false);
                        setOpenPresentIllness(true);
                        setOpenData(val);
                      }}
                      onDelete={() => {
                        setOpenAddPresentIllness(false);
                        let medPro = [];
                        patientPresentIllness.forEach((vM) => {
                          if (vM.problem !== val.problem) {
                            medPro.push(vM);
                          }
                        });
                        handleSubmitEditPresentIllness(medPro);
                        setOpenPresentIllness(false);
                        setOpenAddPresentIllness(false);
                        setOpenDeleteHandler(false)
                        setOpenEditDataDetail(false)
                        setOpenEditHandler(false)
                        setAddOptions(false);
                      }}
                    />
                  );
                })}
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default PresentIllness;
