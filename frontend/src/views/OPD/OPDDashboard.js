import { Box, Button, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import "../css/Dashboard.css";
import PatientList from "./PatientList/PatientList";
import axios from "axios";
import REACT_APP_BASE_URL from "API/api";
import tokenHandler from "token/tokenHandler";
import WidgetsLoader from "@components/WidgetsLoader";
import PatientClinicalScreen from "./PatientClinicalScreen/PatientClinicalScreen";
import leftImg from "@assets/left.png";

const OPDDashboard = () => {
  const token = tokenHandler();
  const [patient, setPatient] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState({});

  const getPatient = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}opd/live`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(async (response) => {
        let p = [];
        await response.data.data.forEach((v) => {
          if (localStorage.getItem("loginRole") === "doctor") {
            if (
              !v.patientIn &&
              v.consultantId ===
                JSON.parse(localStorage.getItem("loginData"))._id &&
              v.departmentId ===
                JSON.parse(localStorage.getItem("loginData")).basicDetails
                  .departmentId
            ) {
              p.push(v);
            }
          } else if (localStorage.getItem("loginRole") !== "doctor") {
            if (v.patientIn === false) {
              p.push(v);
            }
          }
        });

        setPatient(p);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPatient();
  });

  useEffect(() => {
    if (localStorage.getItem("loginRole") !== "doctor") {
      document.querySelector(".app").style = "padding:40px 0 0 0 ";
    }
    return () => {
      if (localStorage.getItem("loginRole") !== "doctor") {
        document.querySelector(".app").style = "padding:40px 10px 20px 10px";
      }
    };
    // eslint-disable-next-line
  }, []);

  const patientHandlerOut = async () => {
    await axios
      .put(
        `${REACT_APP_BASE_URL}opd/${
          JSON.parse(localStorage.getItem("patientConsult"))._id
        }`,
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        getPatient();
        setSelectedPatient({});
        localStorage.removeItem("patientConsult");
      })
      .catch(() => {});
  };

  return (
    <div className="opdDash">
      {loader ? (
        <WidgetsLoader />
      ) : (
        <Grid spacing={2} container>
          <Grid item xs={3} sm={3} md={2.5} lg={2}>
            <Box className="patientList">
              <h1 className="activeDrSection"> OPD Queue </h1>
              <Box className="patientListPT">
                <PatientList
                  patient={patient}
                  selectedPatient={selectedPatient}
                  setSelectedPatient={setSelectedPatient}
                />
                {Object.entries(selectedPatient).length > 0 && (
                  <Button
                    variant="contained"
                    onClick={patientHandlerOut}
                    className="patientOutConfirm"
                    color="warning"
                  >
                    Patient Out
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={9} sm={9} md={9.5} lg={10}>
            {Object.entries(selectedPatient).length > 0 ? (
              <PatientClinicalScreen selectedPatient={selectedPatient} />
            ) : (
              <Box className="menuParent">
                <img alt="" src={leftImg} style={{ width: "40px" }} />
                <h3 className="noFound">Select the patient for check</h3>
              </Box>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default OPDDashboard;
