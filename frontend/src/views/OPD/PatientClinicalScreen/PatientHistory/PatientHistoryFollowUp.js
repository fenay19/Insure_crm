import { Box } from "@mui/material";
import React from "react";

const PatientHistoryFollowUp = ({ followUp }) => {
  return (
    <Box className="PatientHistoryDataSectionMargin">
      <Box className={"subSectionPatientHistory"}>
        <div className="PatientHistoryHead notranslate">
          <h5>Follow Up: </h5>
        </div>

        <div className="PatientHistoryContent" style={{ marginLeft: "1.5rem" }}>
          {followUp !== undefined &&
            followUp.followUp !== undefined &&
            followUp.followUp.length > 0 && (
              <div>
                <div className="notranslate">
                  <b>Date: </b>
                  {followUp.followUp.split("-")[2]}-
                  {followUp.followUp.split("-")[1]}-
                  {followUp.followUp.split("-")[0]}
                </div>
                {followUp.advice !== "" && (
                  <span>
                    <b className="notranslate">Advice: </b>
                    {followUp.advice}
                  </span>
                )}
              </div>
            )}
        </div>
      </Box>
    </Box>
  );
};

export default PatientHistoryFollowUp;
