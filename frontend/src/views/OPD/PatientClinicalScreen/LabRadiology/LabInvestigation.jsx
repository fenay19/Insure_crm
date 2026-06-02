import { Box, Input, InputAdornment, Chip } from "@mui/material";
import { Search } from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import REACT_APP_BASE_URL, { retrieveToken } from "api/api";
import Loader from "component/Loader/Loader";

const LabInvestigation = ({
  selectedLabMenu,
  handleSubmitTestName,
  submittedInvestigation,
  departmentId
}) => {
  const [investigation, setInvestigation] = useState([]);
  const [showInvestigation, setShowInvestigation] = useState([]);
  const [recentInvestigation, setRecentInvestigation] = useState([]);
  const [searchInvestigation, setSearchInvestigation] = useState("");
  // const [openAddInvestigation, setOpenAddInvestigation] = useState(false);
  const [loader, setLoader] = useState(true);

  const token = retrieveToken();

  const getAllInvestigation = async () => {
    setLoader(true);
    if (selectedLabMenu.name === "Radiology") {
      await axios
        .get(`${REACT_APP_BASE_URL}investigation-radiology-master`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          let inv = [];
          response.data.investigation.forEach((v) => {
            if (departmentId === v.departmentId
            ) {
              inv.push(v);
            }
          });
          setInvestigation(inv);
        })
        .catch(() => {});

      await axios
        .get(`${REACT_APP_BASE_URL}opd/lab-radiology/most-used/${JSON.parse(localStorage.getItem("patientConsult")).departmentId}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          let inv = [];
          response.data.data.forEach((v) => {
            if (
              JSON.parse(localStorage.getItem("patientConsult"))
                .departmentId === v.departmentId
            ) {
              inv.push(v);
            }
          });
          setRecentInvestigation(inv);
          setShowInvestigation(inv);
          setLoader(false);
        })
        .catch(() => {});
    } else {
      await axios
        .get(`${REACT_APP_BASE_URL}investigation-pathology-master`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          let inv = [];
          response.data.investigation.forEach((v) => {
            if (
              selectedLabMenu._id === v.specimenId &&
              JSON.parse(localStorage.getItem("patientConsult"))
                .departmentId === v.departmentId
            ) {
              inv.push(v);
            }
          });
          setInvestigation(inv);
        })
        .catch(() => {});

      await axios
        .get(`${REACT_APP_BASE_URL}opd/lab-pathology/most-used/${JSON.parse(localStorage.getItem("patientConsult")).departmentId}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          let inv = [];
          response.data.data.forEach((v) => {
            if (
              selectedLabMenu._id === v.specimenId &&
              JSON.parse(localStorage.getItem("patientConsult"))
                .departmentId === v.departmentId
            ) {
              inv.push(v);
            }
          });
          setRecentInvestigation(inv);
          setShowInvestigation(inv);
          setLoader(false);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    setSearchInvestigation("");

    getAllInvestigation();
    // eslint-disable-next-line
  }, [selectedLabMenu]);

  const handleSearchInvestigation = (e) => {
    setSearchInvestigation(e.target.value);
    if (e.target.value === "") {
      setShowInvestigation(recentInvestigation);
    } else {
      let serchM = [];
      investigation.forEach((v) => {
        if (v.testName.toLowerCase().includes(e.target.value.toLowerCase())) {
          serchM.push(v);
        }
      });
      setShowInvestigation(serchM);
    }
  };

  return (
    <>
      <h2 className="specimenName">{selectedLabMenu.name}</h2>
      {loader ? (
        <Loader />
      ) : (
        <>
          <Input
            className="search_patient_data"
            type="search"
            placeholder="Search..."
            endAdornment={
              <InputAdornment position="end">
                <Search className="search_patient_data_icon" />
              </InputAdornment>
            }
            onChange={handleSearchInvestigation}
            value={searchInvestigation}
          />

          {investigation.length === 0 ? (
            <>
              <h2 className="noFoundOPd">Investigation not available</h2>
            </>
          ) : (
            <>
              {showInvestigation.length > 0 ? (
                <Box className="selectedCategory">
                  {showInvestigation.map((val, ind) => {
                    let matchId = false;
                    submittedInvestigation.forEach((s) => {
                      if (s.investigationId === val._id) {
                        matchId = true;
                      }
                    });
                    return (
                      <Chip
                        key={ind}
                        className={
                          matchId ? "selectProblemActive" : "selectProblem"
                        }
                        label={`${val.testName}`}
                        onClick={() => {
                          handleSubmitTestName({
                            investigationId: val._id,
                            testName: val.testName,
                          });
                        }}
                      />
                    );
                  })}
                </Box>
              ) : (
                <>
                  <h2 className="noFoundOPd">Investigation not found</h2>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default LabInvestigation;
