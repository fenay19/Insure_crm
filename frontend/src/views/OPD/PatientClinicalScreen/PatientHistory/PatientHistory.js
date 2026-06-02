import React from "react";
import "./PatientHistory.css";
import { Box } from "@mui/material";
import PatientHistoryChiefComplaint from "./PatientHistoryChiefComplaint";
import PatientHistoryHistory from "./PatientHistoryHistory";
import PatientHistoryExamination from "./PatientHistoryExamination";
import PatientHistoryProvisionalDiagnosis from "./PatientHistoryProvisionalDiagnosis";
import PatientHistoryMedicalPrescription from "./PatientHistoryMedicalPrescription";
import PatientHistoryVitals from "./PatientHistoryVitals";
import { useState, useEffect } from "react";
import leftImg from "@assets/left.png";
import tokenHandler from "token/tokenHandler";
import axios from "axios";
import REACT_APP_BASE_URL from "API/api";
import WidgetsLoader from "@components/WidgetsLoader";
import PatientHistoryFinalDiagnosis from "./PatientHistoryFinalDiagnosis";
import PatientHistoryOrders from "./PatientHistoryOrders";
import PatientHistoryPresentIllness from "./PatientHistoryPresentIllness";
import PatientHistoryFollowUp from "./PatientHistoryFollowUp";
import PatientHistoryGlassPrescription from "./PatientHistoryGlassPrescription";

const PatientHistory = () => {
  const [patientData, setPatientData] = useState([]);

  const token = tokenHandler();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(true);
    axios
      .get(
        `${REACT_APP_BASE_URL}opd/allpatientdetails/${
          JSON.parse(localStorage.getItem("patientConsult")).patientId
        }`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        let pData = [];
        response.data.patientData.forEach((v) => {
          let getcc =
            v.chiefComplaint.length > 0
              ? v.chiefComplaint[v.chiefComplaint.length - 1].chiefComplaint
                  .length > 0
                ? v.chiefComplaint[v.chiefComplaint.length - 1].chiefComplaint
                : []
              : [];

          let presentIllness =
            v.presentIllness.length > 0
              ? v.presentIllness[v.presentIllness.length - 1].presentIllness
                  .length > 0
                ? v.presentIllness[v.presentIllness.length - 1].presentIllness
                : []
              : [];
          let getexamination =
            v.examination.length > 0
              ? v.examination[v.examination.length - 1]
              : { };
          let gethistory =
            v.history.length > 0 ? v.history[v.history.length - 1] : {};
          let getinstruction =
            v.instruction.length > 0
              ? v.instruction[v.instruction.length - 1].instruction.length > 0
                ? v.instruction[v.instruction.length - 1].instruction
                : []
              : [];
          let getlabRadiology =
            v.labRadiology.length > 0
              ? v.labRadiology[v.labRadiology.length - 1].labRadiology.length >
                0
                ? v.labRadiology[v.labRadiology.length - 1].labRadiology
                : []
              : [];
          let getmedicalPres =
            v.medicalPrescription.length > 0
              ? v.medicalPrescription[v.medicalPrescription.length - 1].prescription
              : [];
              let getfollowUp =
            v.followUp.length > 0
              ? v.followUp[v.followUp.length - 1]
              : [];
              let getGlassPres =
            v.glassPrescription.length > 0
              ? v.glassPrescription
              : [];
          let getProcedure =
            v.procedure.length > 0
              ? v.procedure[v.procedure.length - 1]
              : { procedure: [], notes: "" };
          let getprovisional =
            v.provisionalDiagnosis.length > 0
              ? v.provisionalDiagnosis[v.provisionalDiagnosis.length - 1]
                  .diagnosis.length > 0
                ? v.provisionalDiagnosis[v.provisionalDiagnosis.length - 1]
                    .diagnosis
                : []
              : [];
          let getfinal =
            v.finalDiagnosis.length > 0
              ? v.finalDiagnosis[v.finalDiagnosis.length - 1].diagnosis.length >
                0
                ? v.finalDiagnosis[v.finalDiagnosis.length - 1].diagnosis
                : []
              : [];
          let vitals =
            v.vitals.length > 0 ? v.vitals[v.vitals.length - 1].vitals : [];
          pData.push({
            chiefComplaint: getcc,
            examination: getexamination,
            history: gethistory,
            instruction: getinstruction,
            labRadiology: getlabRadiology,
            medicalPrescription: getmedicalPres,
            procedure: getProcedure,
            provisionalDiagnosis: getprovisional,
            finalDiagnosis: getfinal,
            glassPrescription: getGlassPres,
            followUp: getfollowUp,
            vitals: vitals,
            presentIllness: presentIllness,
            createdAt: `${v.createdAt.split("-")[2]}-${
              v.createdAt.split("-")[1]
            }-${v.createdAt.split("-")[0]}`,
            consultant: v.consultant,
            consultantId: v.consultantId,
          });
        });
        setPatientData(pData.reverse());
        setLoader(false);
      })
      .catch((error) => {});
      // eslint-disable-next-line
  }, []);

  return (
    <div className="paticularSection">
      {loader ? (
        <WidgetsLoader />
      ) : (
        <>
          {patientData.length > 0 ? (
            <>
              {patientData.map((patient, inx) => {
                return (
                  <Box key={inx} className="patientHistorySection">
                    <h5 className="historyDate">
                      <img alt="" src={leftImg} />
                      <span className="historyDateD">{patient.createdAt}</span>
                      <span>({patient.consultant})</span>
                    </h5>

                    {JSON.parse(localStorage.getItem("drConsult")).map(
                      (con, ind) => {
                        return (
                          <div key={ind}>
                            {con === "Chief Complaint" ? (
                              <PatientHistoryChiefComplaint
                                chiefComplaint={patient.chiefComplaint}
                              />
                            ) : con === "Medical History" ? (
                              <PatientHistoryHistory
                                history={patient.history}
                              />
                            ) : con === "Examination" ? (
                              <PatientHistoryExamination
                                examination={patient.examination}
                              />
                            ) : con === "Provisional Diagnosis" ? (
                              <PatientHistoryProvisionalDiagnosis
                                provisionalDiagnosis={
                                  patient.provisionalDiagnosis
                                }
                              />
                            ) : con === "Final Diagnosis" ? (
                              <PatientHistoryFinalDiagnosis
                                finalDiagnosis={patient.finalDiagnosis}
                              />
                            ) : con === "Medical Prescription" ? (
                              <PatientHistoryMedicalPrescription
                                medicalPrescription={
                                  patient.medicalPrescription
                                }
                              />
                            ) : con === "Follow Up" ? (
                              <PatientHistoryFollowUp
                                followUp={
                                  patient.followUp
                                }
                              />
                            ) : con === "Orders" ? (
                              <PatientHistoryOrders
                                labRadiology={patient.labRadiology}
                                procedure={patient.procedure}
                                instruction={patient.instruction}
                              />
                            ) : con === "History of Present Illness" ? (
                              <PatientHistoryPresentIllness
                                presentIllness={patient.presentIllness}
                              />
                            ) : (
                              con === "Vitals" && (
                                <PatientHistoryVitals vitals={patient.vitals} />
                              )
                            )}
                          </div>
                        );
                      }
                    )}

                    {patient.glassPrescription.length > 0 && 
                      <PatientHistoryGlassPrescription glassPrescription={patient.glassPrescription} />
                    }
                    {inx !== patientData.length - 1 && (
                      <hr className="historyHR" />
                    )}
                  </Box>
                );
              })}
            </>
          ) : (
            <>
              <h2 className="noFound" style={{ marginTop: "10px" }}>
                Patient Data Not Available
              </h2>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PatientHistory;
