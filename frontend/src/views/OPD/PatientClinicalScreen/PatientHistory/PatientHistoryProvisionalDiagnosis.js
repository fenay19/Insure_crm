import { Box } from "@mui/material";
import React from "react";

const PatientHistoryProvisionalDiagnosis = ({ provisionalDiagnosis }) => {
  return (
    <Box style={{marginTop:".9rem"}}>
      <div className="PatientHistoryHead">
        <h5>Provisional Diagnosis: </h5>
      </div>
      <div className="PatientHistoryContent">
        {provisionalDiagnosis !== undefined &&
          provisionalDiagnosis.map((v, inx) => {
            return (
              <li key={inx} style={{
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

export default PatientHistoryProvisionalDiagnosis;
