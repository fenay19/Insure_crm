import { Box } from "@mui/material";
import React from "react";

const PatientHistoryFinalDiagnosis = ({ finalDiagnosis }) => {
  return (
    <Box style={{marginTop:".9rem"}}>
      <div className="PatientHistoryHead">
        <h5>Final Diagnosis: </h5>
      </div>
      <div className="PatientHistoryContent">
        {finalDiagnosis !== undefined &&
          finalDiagnosis.map((v, inx) => {
            return (
              <li key={inx}style={{
                    // listStyleType: "none",
                    marginLeft: "1.5rem",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}>
                {v.diagnosis} {v.code !== "" && <>({v.code})</>}
                
              </li>
            );
          })}
      </div>
    </Box>
  );
};

export default PatientHistoryFinalDiagnosis;
