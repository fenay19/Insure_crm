import React from "react";
import { useState } from "react";
import { Box } from "@mui/material";

const PatientDetails = () => {
  // eslint-disable-next-line
  const [patient, setPatient] = useState(
    JSON.parse(localStorage.getItem("patientConsult"))
  );
  return (
    <Box className="patientDetailAllMenuMainData">
      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Patient Name:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientname === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.patientname
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">DOB:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.dob === "" ||
            patient.patientDetails.dob === "null" ||
            patient.patientDetails.dob === null ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              `${
                patient.patientDetails.dob.replaceAll("/", "-").split("-")[2]
              }-${
                patient.patientDetails.dob.replaceAll("/", "-").split("-")[1]
              }-${
                patient.patientDetails.dob.replaceAll("/", "-").split("-")[0]
              }`
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Age:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {(patient.patientDetails.dob === "" ||
              patient.patientDetails.dob === null ||
              patient.patientDetails.dob === "null") &&
            patient.patientDetails.age === "" ? (
              <>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</>
            ) : patient.patientDetails.dob !== null &&
              patient.patientDetails.dob !== "null" &&
              patient.patientDetails.dob !== "" ? (
              <>
                {Math.abs(
                  new Date(
                    Date.now() -
                      new Date(
                        `${patient.patientDetails.dob.split("/")[2]}-${
                          patient.patientDetails.dob.split("/")[1]
                        }-${patient.patientDetails.dob.split("/")[0]}`
                      ).getTime()
                  ).getUTCFullYear() - 1970
                )}
                Yr
              </>
            ) : (
              patient.patientDetails.age !== "" && (
                <>{patient.patientDetails.age}Yr</>
              )
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Birth Time:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.birth_time === "" ||
            patient.patientDetails.birth_time === undefined ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp;
              </>
            ) : (
              patient.patientDetails.birth_time
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Gender:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.gender === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.patientDetails.gender[0].toUpperCase() +
              patient.patientDetails.gender.slice(1)
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Mobile Number:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.mobile_no === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.patientDetails.mobile_no
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Marital Status:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.maritalStatus === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.patientDetails.maritalStatus
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">
          {localStorage.getItem("useAsMRN/UHID")}:
        </p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.uhid === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.patientDetails.uhid
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">OPD Number:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.opdNumber === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.opdNumber
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Address:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.address === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              <>
                {patient.patientDetails.address}, {patient.patientDetails.city}{" "}
                - {patient.patientDetails.pincode}
              </>
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Aadhar Number:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.aadhar_no === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.patientDetails.aadhar_no
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">ABHA Number:</p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientDetails.abha_no === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.patientDetails.abha_no
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">OPD Registration Type: </p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.opdRegType === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.opdRegType
            )}
          </div>
        </div>
      </Box>
      
      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Patient Payee: </p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.patientPayee === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.patientPayee
            )}
          </div>
        </div>
      </Box>
  

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Package Type: </p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.pkgType === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.pkgType
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Package Validity: </p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.pkgValidity === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.pkgValidity
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Referred By: </p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.referBy === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              <>
                {patient.referBy},{" "}
                {patient.refferName !== "" && (
                  <>
                    <b>Name:</b> {patient.refferName}
                  </>
                )}{" "}
                <b>Mobile No:</b> {patient.refferMobile}
              </>
            )}
          </div>
        </div>
      </Box>

      <Box className="patientDetailAllMenuData">
        <p className="patientDetailAllMenuHead">Marketing Community : </p>
        <div className="patientDetailAllMenuContent">
          <div>
            {patient.marketingCommunity === "" ? (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </>
            ) : (
              patient.marketingCommunity
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default PatientDetails;
