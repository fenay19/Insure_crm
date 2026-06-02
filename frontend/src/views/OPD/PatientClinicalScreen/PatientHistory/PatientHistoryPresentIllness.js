import { Box, Checkbox } from "@mui/material";
import React from "react";

const PatientHistoryPresentIllness = ({ presentIllness }) => {
  return (
    <Box className="PatientHistoryDataSectionMargin">
      <div className="PatientHistoryHead">
        <h5>History of Present Illness: </h5>
      </div>
      <div className="PatientHistoryContent">
        {presentIllness !== undefined && presentIllness.length > 0 && (
          <Box
          style={{
            marginLeft:".9rem",
            }}
            className={
              presentIllness !== undefined && presentIllness.length > 0
                ? "subSectionPatientHistoryColumn"
                : "subSectionPatientHistory"
            }
          >
            <div
              className="examData"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "5px",
              }}
            >
              {presentIllness !== undefined &&
                presentIllness.map((v, ind) => {
                  return (
                    <div className="selectHistoryData" key={ind}>
                      {/* <Checkbox label="Yes" checked={true} /> */}
                      <b style={{ marginRight: "5px" }}>{v.problem}: </b>
                      <span>
                        {v.value !== "" ? (
                          v.answerType === "Calender" ? (
                            <>
                              {v.value.split("-")[2]}-{v.value.split("-")[1]}-
                              {v.value.split("-")[0]}
                            </>
                          ) : (
                            v.value
                          )
                        ) : (
                          v.objective.map((vv, indx) => {
                            return (
                              <span key={indx}>
                                {vv.data}{" "}
                                {v.objective.length - 1 > indx && (
                                  <span style={{ marginRight: "5px" }}>, </span>
                                )}
                              </span>
                            );
                          })
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default PatientHistoryPresentIllness;
