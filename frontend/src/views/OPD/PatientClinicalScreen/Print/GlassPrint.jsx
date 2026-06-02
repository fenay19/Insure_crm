import React from "react";
import "../../../css/Print.css";
import { Box, Button } from "@mui/material";
import REACT_APP_BASE_URL from "API/api";

import { useEffect } from "react";
import { useState } from "react";
import { LocalPrintshop } from "@mui/icons-material";
import axios from "axios";
import tokenHandler from "token/tokenHandler";
import WidgetsLoader from "@components/WidgetsLoader";

const GlassPrint = () => {
  const token = tokenHandler();
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(true);
  // eslint-disable-next-line
  const [loginRole, setLoginRole] = useState(localStorage.getItem("loginRole"));
  // eslint-disable-next-line
  const [doctorDetail, setDoctorDetail] = useState(
    JSON.parse(localStorage.getItem("loginData"))
  );

  const [hospitalDetail, setHospitalDetail] = useState(
    JSON.parse(localStorage.getItem("hospiData"))
  );
  // eslint-disable-next-line

  const [patient, setPatient] = useState(
    JSON.parse(localStorage.getItem("patientConsult")) || {}
  );

  const [glassPrescription, setGlassPrescription] = useState({});

  const [consultPrintOption, setConsultPrintOption] = useState(
    JSON.parse(localStorage.getItem("drConsultPrint"))
  );

  useEffect(() => {
    setError(false);
    axios
      .get(
        `${REACT_APP_BASE_URL}opd/all-patient-details-to-print/${patient._id}/${patient.consultantId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        setGlassPrescription(
          response.data.patientData[response.data.patientData.length - 1]
            .glassPrescription.length > 0
            ? response.data.patientData[response.data.patientData.length - 1]
                .glassPrescription[0]
            : {
                left: {
                  sphere: "",
                  cylinder: "",
                  axis: "",
                  add: "",
                  pd: "",
                },
                right: {
                  sphere: "",
                  cylinder: "",
                  axis: "",
                  add: "",
                  pd: "",
                },
                notes: "",
              }
        );
        setLoader(false);
      })
      .catch((error) => {
        setError(true);
        setLoader(false);
      });
    document.getElementById("bodyId").style.zoom = "1";
    // eslint-disable-next-line
  }, []); // empty dependency array ensures this effect runs only once

  const baseUrl = REACT_APP_BASE_URL.replace("/api/", "");

  return (
    <>
      {loader ? (
        <WidgetsLoader />
      ) : (
        <div className=" notranslate">
          <div className="languagePrint" style={{ float: "right" }}>
            {/* <div id="google_translate_element"></div> */}
            <div id="getOPDPrint" className="notranslate">
              <Button onClick={() => window.print()} variant="contained">
                <LocalPrintshop />
                Print
              </Button>
            </div>
          </div>

          {consultPrintOption.includes("With Header") &&
            JSON.parse(localStorage.getItem("hospiData")).headerImage !==
              undefined &&
            JSON.parse(localStorage.getItem("hospiData")).headerImage.data !==
              undefined && (
              <Box sx={{ padding: "0 !important", margin: "0 !important" }}>
                <img
                  src={`${REACT_APP_BASE_URL.replace("/api/", "")}/images/${
                    JSON.parse(localStorage.getItem("hospiData")).headerImage
                      .data
                  }`}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "-4px",
                  }}
                  alt="headerImage"
                />
                <hr />
              </Box>
            )}

          <div className="opdPrint">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              style={{
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <Box mb={4}>
                <h3 style={{ fontSize: "14px" }}>Glass Prescription</h3>
              </Box>

              <Box width="100%">
                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)">
                  <Box>
                    <p>
                      <b>Patient Name:</b> {patient.patientDetails?.prefix}{" "}
                      {patient.patientDetails?.patientname}
                    </p>
                  </Box>

                  <Box>
                    <p>
                      <b>DOB:</b>{" "}
                      {patient.patientDetails?.dob
                        ? patient.patientDetails.dob
                            .split("-")
                            .reverse()
                            .join("-")
                        : ""}
                    </p>
                  </Box>

                  <Box>
                    <p>
                      <b>Age:</b>{" "}
                      {patient.patientDetails?.dob
                        ? `${Math.abs(
                            new Date(
                              Date.now() -
                                new Date(
                                  patient.patientDetails.dob
                                    .split("/")
                                    .reverse()
                                    .join("-")
                                ).getTime()
                            ).getUTCFullYear() - 1970
                          )} Yr`
                        : patient.patientDetails?.age}
                    </p>
                  </Box>

                  <Box>
                    <p>
                      <b>Gender:</b>{" "}
                      {patient.patientDetails?.gender
                        ? patient.patientDetails.gender[0].toUpperCase() +
                          patient.patientDetails.gender.slice(1)
                        : ""}
                    </p>
                  </Box>
                  <Box>
                    <p>
                      <b>UHID:</b> {patient.patientDetails?.uhid}
                    </p>
                  </Box>

                  <Box>
                    <p>
                      <b>OPD Number:</b> {patient.opdNumber}
                    </p>
                  </Box>

                  <Box>
                    <p>
                      <b>Rx Date - </b>{" "}
                      {`${new Date(patient.createdAt)
                        .toISOString()
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}`}
                    </p>
                  </Box>

                  <Box>
                    <p>
                      <b>Address:</b>{" "}
                      {patient.patientDetails?.address
                        ? `${patient.patientDetails.address}, ${patient.patientDetails.district} - ${patient.patientDetails.pincode}`
                        : ""}
                    </p>
                  </Box>
                </Box>

                <Box style={{ marginTop: "20px" }}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    style={{ border: "1px solid #000000", borderRadius: "4px" }}
                  >
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(6, 1fr)"
                      style={{ borderBottom: "1px solid #000000" }}
                    >
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        <b>RX</b>
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        <b>Sph</b>
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        <b>Cyl</b>
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        <b>Axis</b>
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        <b>Add</b>
                      </Box>
                      <Box style={{ padding: "12px", textAlign: "center" }}>
                        <b>PD</b>
                      </Box>
                    </Box>

                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(6, 1fr)"
                      style={{ borderBottom: "1px solid #000000" }}
                    >
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        OD
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        {glassPrescription.left?.sphere}
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        {glassPrescription.left?.cylinder}
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        {glassPrescription.left?.axis}
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        {glassPrescription.left?.add}
                      </Box>
                      <Box style={{ padding: "12px", textAlign: "center" }}>
                        {glassPrescription.left?.pd}
                      </Box>
                    </Box>

                    <Box display="grid" gridTemplateColumns="repeat(6, 1fr)">
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        OS
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        {glassPrescription.right?.sphere}
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        {glassPrescription.right?.cylinder}
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        {glassPrescription.right?.axis}
                      </Box>
                      <Box
                        style={{
                          borderRight: "1px solid #000000",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        {glassPrescription.right?.add}
                      </Box>
                      <Box style={{ padding: "12px", textAlign: "center" }}>
                        {glassPrescription.right?.pd}
                      </Box>
                    </Box>
                  </Box>

                  <Box style={{ marginTop: "20px" }}>
                    <p>
                      <b>Notes:</b> {glassPrescription.notes}
                    </p>
                  </Box>

                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: "5px",
                    }}
                  >
                    <div>
                      {doctorDetail.documents !== undefined &&
                        doctorDetail.documents.sign !== undefined && (
                          <img
                            src={`${baseUrl}/images/${doctorDetail.documents.sign}`}
                            alt="sign"
                            style={{ width: "100px" }}
                          />
                        )}
                      <p>
                        {doctorDetail.basicDetails.prefix}.{" "}
                        {doctorDetail.basicDetails.firstName}{" "}
                        {doctorDetail.basicDetails.lastName}
                      </p>
                      <p>{doctorDetail.basicDetails.designation}</p>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default GlassPrint;
